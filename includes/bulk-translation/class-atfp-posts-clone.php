<?php
/**
 * @package AutoPoly - AI Translation For Polylang (Pro)
 */

if(!defined('ABSPATH')) exit;

/**
 * Model for synchronizing posts
 */
class ATFP_Posts_Clone {
	/**
	 * Stores the plugin options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * @var PLL_Model
	 */
	public $model;

	/**
	 * @var PLL_Sync
	 */
	public $sync;

	/**
	 * @var PLL_Sync_Content
	 */
	public $sync_content;

	/**
	 * Stores temporary a synchronization information.
	 *
	 * @var array
	 */
	protected $temp_synchronized;

	/**
	 * Constructor
	 *
	 * @param object $polylang Polylang object.
	 */
	public function __construct( &$polylang ) {
		$this->options      = &$polylang->options;
		$this->model        = &$polylang->model;
		$this->sync         = &$polylang->sync;
		$this->sync_content = new ATFP_Sync_Content( $polylang );

		add_filter( 'pll_copy_taxonomies', array( $this, 'copy_taxonomies' ), 99, 4 );
		add_filter( 'pll_copy_post_metas', array( $this, 'copy_post_metas' ), 99, 4 );
	}

	/**
	 * Copies all taxonomies.
	 *
	 * @param string[] $taxonomies List of taxonomy names.
	 * @param bool     $sync       True for a synchronization, false for a simple copy.
	 * @param int      $from       Source post id.
	 * @param int      $to         Target post id.
	 * @return string[]
	 */
	public function copy_taxonomies( $taxonomies, $sync, $from, $to ) {
		if ( ! empty( $from ) && ! empty( $to ) && $this->are_synchronized( $from, $to ) ) {
			$taxonomies = array_diff( get_post_taxonomies( $from ), get_taxonomies( array( '_pll' => true ) ) );
		}
		return $taxonomies;
	}

	/**
	 * Copies all custom fields.
	 *
	 * @param string[] $keys List of custom fields names.
	 * @param bool     $sync True if it is synchronization, false if it is a copy.
	 * @param int      $from Id of the post from which we copy the information.
	 * @param int      $to   Id of the post to which we paste the information.
	 * @return string[]
	 */
	public function copy_post_metas( $keys, $sync, $from, $to ) {
		if ( ! empty( $from ) && ! empty( $to ) && $this->are_synchronized( $from, $to ) ) {
			$from_keys = array_keys( get_post_custom( $from ) ); // *All* custom fields.
			$to_keys   = array_keys( get_post_custom( $to ) ); // Adding custom fields of the destination allow to synchronize deleted custom fields.
			$keys      = array_merge( $from_keys, $to_keys );
			$keys      = array_unique( $keys );
			$keys      = array_diff( $keys, array( '_edit_last', '_edit_lock' ) );
		}
		return $keys;
	}

	/**
	 * Duplicates the post to one language and optionally saves the synchronization group
	 *
	 * @param int    $post_id    Post id of the source post.
	 * @param string $source_language Source language slug.
	 * @param string $target_language Target language slug.
	 * @param bool   $save_group True to update the synchronization group, false otherwise.
	 * @return int Id of the target post, 0 on failure.
	 */
	public function copy_post( $post_id, $source_language, $target_language, $save_group = true, $post_data = array(), $re_translate = false ) {
		global $wpdb;
		$atfp_elementor_post_data=null;

		if(isset($post_data['meta_fields']['_elementor_data'])){
			$atfp_elementor_post_data=$post_data['meta_fields']['_elementor_data'];
			$atfp_elementor_post_data=ATFP_Helper::replace_links_with_translations($atfp_elementor_post_data, $target_language, $source_language);
			unset($post_data['meta_fields']['_elementor_data']);
		}

		$tr_id     = $this->model->post->get( $post_id, $this->model->get_language( $target_language ) );
		$tr_post   = get_post( $post_id );
		$languages = array_keys( $this->get( $post_id ) );

		if ( isset( $re_translate['status'] ) && true === $re_translate['status'] ) {
			if ( ! isset( $re_translate['postId'] ) ) {
				wp_send_json_error( __( 'Re-translate post id not found', 'automatic-translations-for-polylang' ) );
			}

			if ( $re_translate['postId'] !== $tr_id ) {
				wp_send_json_error( __( 'Re-translate post id not matched with target language saved post id', 'automatic-translations-for-polylang' ) );
			}

			if ( ! isset( $re_translate['fieldsType'] ) || empty( $re_translate['fieldsType'] ) ) {
				wp_send_json_error( __( 'Re-translate translation fields not exist in fields key', 'automatic-translations-for-polylang' ), 400 );
			}

			$tr_post = get_post( $tr_id );

			$post_data_keys = array_keys( $post_data );

			foreach ( $post_data_keys as $key ) {
				$valid_key = substr( $key, 5 );

				$valid_fields = ATFP_Re_Translation::re_translate_fields();

				if ( isset( $key[0] ) && substr( $key, 0, 5 ) === 'post_' && ! in_array( $valid_key, $re_translate['fieldsType'] ) && ! in_array( $valid_key, $valid_fields ) ) {
					unset( $post_data[ $key ] );
				}
			}
		}

		if ( ! $tr_post instanceof WP_Post ) {
			// Something went wrong!
			return 0;
		}

		foreach ( $tr_post as $key => $value ) {
			if ( isset( $post_data[ $key ] ) && $key !== 'post_meta_fields' ) {
				$tr_post->$key = $post_data[ $key ];
			}
		}

		if ( isset( $post_data['post_content'] ) ) {

			$filtered_post_content = ATFP_Helper::replace_links_with_translations( $tr_post->post_content, $target_language, $source_language );

			$default_allowed_tags = wp_kses_allowed_html( 'post' );

			$parent_post_content = get_post_field( 'post_content', $post_id );

			$existing_allowed_tags = $this->allowed_tags_in_string( $parent_post_content );

			$unwanted_tags = array(
				'script',
				'object',
				'embed',
				'textarea',
				'select',
				'option',
				'link',
				'meta',
				'noscript',
				'xmp',
				'noembed',
			);

			// Remove unwanted tags from the existing allowed list
			foreach ( $unwanted_tags as $tag ) {
				if ( isset( $existing_allowed_tags[ $tag ] ) ) {
					unset( $existing_allowed_tags[ $tag ] );
				}
			}

			// Apply the allowed tags
			$allowed_tags = apply_filters( 'atfp/bulk_translation/allowed_tags', array_merge( $default_allowed_tags, $existing_allowed_tags ) );

			// Add the filter to allow the flex styles
			add_filter( 'safe_style_css', array( $this, 'atfp_allow_flex_styles' ), 10, 1 );

			// Apply the allowed tags
			$filtered_post_content = wp_kses( $filtered_post_content, $allowed_tags );

			// Remove the filter to allow the flex styles
			remove_filter( 'safe_style_css', array( $this, 'atfp_allow_flex_styles' ), 10, 1 );

			$tr_post->post_content = $filtered_post_content;
		}

		// If it does not exist, create it.
		if ( ! $tr_id ) {
			$tr_post->ID          = 0;
			$tr_post->post_status = get_option( 'atfp_bulk_post_status', 'draft' );

			$tr_id = wp_insert_post( wp_slash( $tr_post->to_array() ) );
			$this->model->post->set_language( $tr_id, $target_language ); // Necessary to do it now to share slug.

			$translations                     = $this->model->post->get_translations( $post_id );
			$translations[ $target_language ] = $tr_id;
			$this->model->post->save_translations( $post_id, $translations ); // Saves translations in case we created a post.

			$languages[] = $target_language;

			// Temporarily sync group, even if false === $save_group as we need synchronized posts to copy *all* taxonomies and post metas.
			$this->temp_synchronized[ $post_id ][ $tr_id ] = true;

			// Maybe duplicates the featured image.
			if ( $this->options['media_support'] ) {
				add_filter( 'pll_translate_post_meta', array( $this->sync_content, 'duplicate_thumbnail' ), 10, 3 );
			}

			add_filter( 'pll_maybe_translate_term', array( $this->sync_content, 'duplicate_term' ), 10, 3 );

			$this->sync->taxonomies->copy( $post_id, $tr_id, $target_language );
			$this->sync->post_metas->copy( $post_id, $tr_id, $target_language );

			$_POST['post_tr_lang'][ $target_language ] = $tr_id; // Hack to avoid creating multiple posts if the original post is saved several times (ex WooCommerce 3.0+).

			/**
			 * Fires after a synchronized post has been created
			 *
			 * @param int    $post_id Id of the source post.
			 * @param int    $tr_id   Id of the newly created post.
			 * @param string $lang    Language of the newly created post.
			 */
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- pll is polylang plugin prefix.
			do_action( 'pll_created_sync_post', $post_id, $tr_id, $target_language );

			$post = get_post( $post_id );
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- pll is polylang plugin prefix.
			do_action( 'pll_save_post', $post_id, $post, $translations ); // Fire again as we just updated $translations.

			unset( $this->temp_synchronized[ $post_id ][ $tr_id ] );
		}

		if ( ! isset( $re_translate['status'] ) ) {

			if ( $save_group ) {
				$this->save_group( $post_id, $languages );
			}

			$tr_post->ID = $tr_id;
			$post        = get_post( $post_id );

			$tr_post->post_parent = (int) $this->model->post->get( $post->post_parent, $target_language ); // Translates post parent.

			$post     = clone $tr_post;
			$post->ID = $post_id;

			$tr_post = $this->sync_content->copy_content( $post, $tr_post, $target_language );
		}

		$atfp_inserted_post_type = $tr_post->post_type;

		// The columns to copy in DB.
		$columns = array(
			'post_author',
			'post_date',
			'post_date_gmt',
			'post_content',
			'post_title',
			'post_excerpt',
			'comment_status',
			'ping_status',
			'post_name',
			'post_modified',
			'post_modified_gmt',
			'post_parent',
			'menu_order',
			'post_mime_type',
			'post_status',
		);

		if ( isset( $re_translate['status'] ) && true === $re_translate['status'] ) {
			$columns = array_keys( $post_data );

			if ( in_array( 'post_meta_fields', $columns ) ) {
				$custom_field_index = array_search( 'post_meta_fields', $columns );
				unset( $columns[ $custom_field_index ] );
			}

			$columns = array_combine( $columns, $columns );
		}

		is_sticky( $post_id ) ? stick_post( $tr_id ) : unstick_post( $tr_id );

		/**
		 * Filters the post fields to synchronize when synchronizing posts
		 *
		 * @param array  $fields     WP_Post fields to synchronize.
		 * @param int    $post_id    Post id of the source post.
		 * @param string $lang       Target language slug.
		 * @param bool   $save_group True to update the synchronization group, false otherwise.
		 */
		if ( ! isset( $re_translate['status'] ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- pll is polylang plugin prefix.
			$columns = apply_filters( 'pll_sync_post_fields', array_combine( $columns, $columns ), $post_id, $target_language, $save_group );
		}

		$tr_post = array_intersect_key( (array) $tr_post, $columns );

		if(!empty($tr_post)){
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery -- Don't use wp_update_post to avoid conflict (reverse sync) and dynamic data sanitized according to the column type.
			$wpdb->update( $wpdb->posts, $tr_post, array( 'ID' => (int) $tr_id ) ); // Don't use wp_update_post to avoid conflict (reverse sync).
		}

		clean_post_cache( $tr_id );

		$post_meta_sync = true;

		if ( ! isset( $this->options['sync'] ) || ( isset( $this->options['sync'] ) && ! in_array( 'post_meta', $this->options['sync'] ) ) ) {
			$post_meta_sync = false;
		}

		/**
		 * Fires after a post has been synchronized.
		 *
		 * @param int    $post_id Id of the source post.
		 * @param int    $tr_id   Id of the target post.
		 * @param string $lang    Language of the target post.
		 * @param string $strategy `copy`.
		 */
		if ( ! isset( $re_translate['status'] ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- pll is polylang plugin prefix.
			do_action( 'pll_post_synchronized', $post_id, $tr_id, $target_language, 'copy' );
		}

		if ( ! $post_meta_sync ) {
			ATFP_Helper::sync_acf_structural_fields( (int) $post_id, (int) $tr_id );

			if ( isset( $post_data['post_meta_fields'] ) && count( $post_data['post_meta_fields'] ) > 0 ) {
				$this->update_post_custom_fields( $post_data['post_meta_fields'], $tr_id, $post_id );
			}
		}

		$re_translate_status = isset( $re_translate['status'] ) && true === $re_translate['status'];

		// Update Elementor Translations
		if ( ! $re_translate_status || ( $re_translate_status && isset( $re_translate['fieldsType'] ) && in_array( 'content', $re_translate['fieldsType'] ) ) ) {
			if(isset($atfp_elementor_post_data) && !empty($atfp_elementor_post_data)){
				$this->update_elementor_data( $tr_id, $atfp_elementor_post_data, $post_id, $re_translate_status );
			}
		}

		return $tr_id;
	}

	private function update_post_custom_fields( $fields, $post_id, $source_post_id = 0 ) {
		$post_meta_sync = true;

		if ( ! isset( $this->options['sync'] ) || ( isset( $this->options['sync'] ) && ! in_array( 'post_meta', $this->options['sync'] ) ) ) {
			$post_meta_sync = false;
		}

		if ( $post_meta_sync ) {
			return;
		}

			$allowed_meta_fields = ATFP_Helper::get_automatic_translate_meta_fields( $source_post_id ? $source_post_id : $post_id );

		if ( $fields && is_array( $fields ) && count( $fields ) > 0 ) {
			$valid_meta_fields = array_intersect( array_keys( $fields ), array_keys( $allowed_meta_fields ) );
			if ( count( $valid_meta_fields ) > 0 ) {
				foreach ( $valid_meta_fields as $key ) {
					if ( isset( $allowed_meta_fields[ $key ] ) && $allowed_meta_fields[ $key ]['status'] ) {
						$value = is_array( $fields[ $key ] ) ? $this->sanitize_array_value( $fields[ $key ], array() ) : wp_kses_post( $fields[ $key ] );

						update_post_meta( absint( $post_id ), sanitize_text_field( $key ), $value );
					}
				}
			}
		}
	}

	private function sanitize_array_value( $value, $arr ) {
		foreach ( $value as $key => $item ) {
			$arr[ sanitize_text_field( $key ) ] = is_array( $item ) ? $this->sanitize_array_value( $item, array() ) : wp_kses_post( $item );
		}

		return $arr;
	}

	/**
	 * Update Elementor data
	 *
	 * @param int    $tr_id The ID of the translated post.
	 * @param string $elementor_data The Elementor data to update.
	 * @return void
	 */
	private function update_elementor_data( $tr_id, $atfp_elementor_data, $parent_post_id = 0, $re_translate = false ) {
		$current_post_elementor_data = get_post_meta( $tr_id, '_elementor_data', true );

		if ( ! isset( $atfp_elementor_data ) || empty( $atfp_elementor_data ) ) {
			return;
		}

		$elementor_data = $atfp_elementor_data;

		// Check if the current post has Elementor data
		if ( '' !== $current_post_elementor_data ) {
			if ( class_exists( 'Elementor\Plugin' ) ) {
				$plugin   = \Elementor\Plugin::$instance;
				$document = $plugin->documents->get( $tr_id );

				$document->save(
					array(
						'elements' => json_decode( $elementor_data, true ),
					)
				);

				$plugin->files_manager->clear_cache();
			} elseif ( ! $re_translate ) {

				if ( $parent_post_id > 0 ) {
					$elementor_data = \Elementor\Plugin::$instance->documents->get( $parent_post_id )->get_elements_data();
					$elementor_data = wp_json_encode( $elementor_data );
					$elementor_data = preg_replace( '#(?<!\\\\)/#', '\\/', $elementor_data );
					update_post_meta( $tr_id, '_elementor_data', $elementor_data );
				}
			}
		}
	}

	/**
	 * Saves the synchronization group
	 * This is stored as an array beside the translations in the post_translations term description
	 *
	 * @param int   $post_id   ID of the post currently being saved.
	 * @param array $sync_post Array of languages to sync with this post.
	 * @return void
	 */
	public function save_group( $post_id, $sync_post ) {
		$term = $this->model->post->get_object_term( $post_id, 'post_translations' );

		if ( empty( $term ) ) {
			return;
		}

		$d    = maybe_unserialize( $term->description );
		$lang = $this->model->post->get_language( $post_id );

		if ( ! is_array( $d ) || empty( $lang ) ) {
			return;
		}

		$lang = $lang->slug;

		if ( empty( $sync_post ) ) {
			if ( isset( $d['sync'][ $lang ] ) ) {
				$d['sync'] = array_diff( $d['sync'], array( $d['sync'][ $lang ] ) );
			}
		} else {
			$sync_post[] = $lang;
			$d['sync']   = empty( $d['sync'] ) ? array_fill_keys( $sync_post, $lang ) : array_merge( array_diff( $d['sync'], array( $lang ) ), array_fill_keys( $sync_post, $lang ) );
		}

		wp_update_term( (int) $term->term_id, 'post_translations', array( 'description' => maybe_serialize( $d ) ) );
	}

	/**
	 * Get all posts synchronized with a given post
	 *
	 * @param int $post_id The id of the post.
	 * @return array An associative array of arrays with language code as key and post id as value.
	 */
	public function get( $post_id ) {
		$term = $this->model->post->get_object_term( $post_id, 'post_translations' );

		if ( ! empty( $term ) ) {
			$lang = $this->model->post->get_language( $post_id );
			$d    = maybe_unserialize( $term->description );

			if ( ! is_array( $d ) || empty( $lang ) ) {
				return array();
			}

			if ( ! empty( $d['sync'][ $lang->slug ] ) ) {
				$keys = array_keys( $d['sync'], $d['sync'][ $lang->slug ] );
				return array_intersect_key( $d, array_flip( $keys ) );
			}
		}

		return array();
	}

	/**
	 * Checks whether two posts are synchronized
	 *
	 * @param int $post_id  The id of a first post to compare.
	 * @param int $other_id The id of the other post to compare.
	 * @return bool
	 */
	public function are_synchronized( $post_id, $other_id ) {
		return isset( $this->temp_synchronized[ $post_id ][ $other_id ] ) || in_array( $other_id, $this->get( $post_id ) );
	}

	/**
	 * Check if the current user can synchronize a post in other language
	 *
	 * @param int    $post_id Post to synchronize.
	 * @param string $lang    Language code.
	 * @return bool
	 */
	public function current_user_can_synchronize( $post_id, $lang ) {
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return false;
		}

		$tr_id = $this->model->post->get( $post_id, $this->model->get_language( $lang ) );

		// If we don't have a translation yet, check if we have the right to create a new one?
		if ( empty( $tr_id ) ) {
			$post_type        = get_post_type( $post_id );
			$post_type_object = get_post_type_object( $post_type );
			return current_user_can( $post_type_object->cap->create_posts );
		}

		// Do we have the right to edit this translation?
		if ( ! current_user_can( 'edit_post', $tr_id ) ) {
			return false;
		}

		// Is this translation synchronized with a post that we can't edit?
		$ids = $this->get( $tr_id );

		foreach ( $ids as $id ) {
			if ( ! current_user_can( 'edit_post', $id ) ) {
				return false;
			}
		}

		return true;
	}

	private function allowed_tags_in_string( $string ) {
		$tags = array();

		// Match all opening tags with attributes (skip closing tags)
		preg_match_all( '/<([a-zA-Z0-9]+)([^>]*)>/i', $string, $matches, PREG_SET_ORDER );

		foreach ( $matches as $match ) {
			$tagName    = strtolower( $match[1] );
			$attrString = trim( $match[2] );

			// Ensure tag key exists
			if ( ! isset( $tags[ $tagName ] ) ) {
				$tags[ $tagName ] = array();
			}

			// Extract attributes inside this tag
			if ( preg_match_all( '/([a-zA-Z0-9\-:]+)(\s*=\s*(".*?"|\'.*?\'|[^\s>]+))?/', $attrString, $attrMatches, PREG_SET_ORDER ) ) {
				foreach ( $attrMatches as $attr ) {
					$attrName = strtolower( $attr[1] );

					// Only add if attribute does not already exist
					if ( ! array_key_exists( $attrName, $tags[ $tagName ] ) ) {
						$tags[ $tagName ][ $attrName ] = array();
					}
				}
			}
		}

		return $tags;
	}

	public function atfp_allow_flex_styles( $styles ) {
		return $this->atfp_allow_flex_styles_callback( $styles );
	}

	private function atfp_allow_flex_styles_callback( $styles ) {
		// Define the extra CSS properties you want to allow
		$extra_allowed = array(
			'display',
			'justify-content',
			'align-items',
			'flex-direction',
			'flex-wrap',
			'gap',
			'fill'
		);

		$allowed_styles = apply_filters( 'atfp/bulk_translation/allowed_flex_styles', array_unique( array_merge( $styles, $extra_allowed ) ) );

		return $allowed_styles;
	}
}
