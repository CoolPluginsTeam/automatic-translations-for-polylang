<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}



if ( ! class_exists( 'ATFP_Register_Route' ) ) :
	/**
	 * ATFP_Register_Route
	 * 
	 * @package ATFP_Register_Route
	 */
	class ATFP_Register_Route {
		/**
		 * The base name of the route.
		 *
		 * @var string
		 */
		private $base_name;

		/**
		 * Constructor
		 *
		 * @param string $base_name The base name of the route.
		 */
		public function __construct( $base_name ) {
			$this->base_name = $base_name;
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		/**
		 * Register the routes
		 */
		public function register_routes() {

			register_rest_route(
				$this->base_name,
				'/(?P<slug>[\w-]+)/pending-posts-ids',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'get_pending_posts_ids' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'privateKey' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_pending_posts_ids_request' ),
						),
						'ids' => array(
							'type'     => 'string',
							'required' => true,
						),
						'lang' => array(
							'type'     => 'string',
							'required' => true,
						),
					),
				)
			);

			register_rest_route(
				$this->base_name,
				'/(?P<slug>[\w-]+)/bulk-translate-entries',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'bulk_translate_entries' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'ids'        => array(
							'type'     => 'string',
							'required' => true,
						),
						'lang'       => array(
							'type'     => 'string',
							'required' => true,
						),
						'privateKey' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_atfp_bulk_nonce' ),
						),
					),
				)
			);


			register_rest_route(
				$this->base_name,
				'/(?P<post_id>[\w-]+)/create-translate-post',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_translate_post' ),
					'permission_callback' => array( $this, 'permission_only_admins' ),
					'args'                => array(
						'privateKey'      => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => array( $this, 'validate_atfp_create_post_nonce' ),
						),
						'post_id'         => array(
							'type'              => 'integer',
							'required'          => true,
							'sanitize_callback' => 'absint',
						),
						'target_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'editor_type'     => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'source_language' => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'post_title'      => array(
							'type'              => 'string',
							'required'          => false,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'post_content'    => array(
							'type'     => 'string',
							'required' => false,
						),
					),
				)
			);

		}

		public function permission_only_admins( $request ) {
			$nonce = $request->get_header( 'X-WP-Nonce' );

			if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
				return new WP_Error( 'rest_forbidden', __( 'Invalid nonce.', 'automatic-translations-for-polylang' ), array( 'status' => 403 ) );
			}

			if ( ! is_user_logged_in() ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ), array( 'status' => 401 ) );
			}
			if ( ! current_user_can( 'edit_posts' ) ) {
				return new \WP_Error( 'rest_forbidden', __( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ), array( 'status' => 403 ) );
			}
			return true;
		}


		public function validate_atfp_bulk_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'atfp_bulk_translate_entries_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ), array( 'status' => 403 ) );
		}

		public function validate_atfp_create_post_nonce( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'atfp_create_translate_post_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ), array( 'status' => 403 ) );
		}

		public function validate_pending_posts_ids_request( $value, $request, $param ) {
			return wp_verify_nonce( $value, 'atfp_pending_posts_ids_nonce' ) ? true : new \WP_Error( 'rest_invalid_param', __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ), array( 'status' => 403 ) );
		}

		/**
		 * Same rule as automatic: include a language if it has no Polylang translation yet,
		 * or the existing translation was never auto-translated by AutoPoly.
		 *
		 * @param int    $source_post_id Source post ID.
		 * @param string $lang           Target language slug.
		 * @param object $polylang       Polylang instance.
		 * @return bool
		 */
		private function language_needs_first_translation( $source_post_id, $lang, $polylang ) {
			$translated_post_id = $polylang->model->post->get_translation( $source_post_id, $lang );

			if ( ! $translated_post_id ) {
				return true;
			}

			if ( absint( $translated_post_id ) === absint( $source_post_id ) ) {
				return false;
			}

			return class_exists( 'ATFPP_Re_Translation' ) && ATFPP_Re_Translation::is_pending_first_translation( (int) $translated_post_id );
		}

		public function get_pending_posts_ids( $params ) {
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}

			if ( ! wp_verify_nonce( $params['privateKey'], 'atfp_pending_posts_ids_nonce' ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}

			if ( ! isset( $params['lang'] ) || empty( $params['lang'] ) ) {
				wp_send_json_error( esc_html__( 'Empty target language. Select at least one language.', 'automatic-translations-for-polylang' ) );
			}
			
			if ( ! isset( $params['ids'] ) || empty( $params['ids'] ) ) {
				wp_send_json_error( esc_html__( 'Empty post IDs. Select at least one post to translate.', 'automatic-translations-for-polylang' ) );
			}

			$post_ids        = json_decode( $params['ids'] );
			$post_ids        = array_map( 'absint', $post_ids );
			// check language exists or not
			$translate_lang = json_decode( $params['lang'] );
			$translate_lang = array_map( 'sanitize_text_field', $translate_lang );
			$posts_translate    = array();
			$gutenberg_block    = false;
			global $polylang;
			
			$post_meta_sync = true;
			if ( ! isset( PLL()->options['sync'] ) || ( isset( PLL()->options['sync'] ) && ! in_array( 'post_meta', PLL()->options['sync'] ) ) ) {
				$post_meta_sync = false;
			}
			
			if(!$post_meta_sync){
				$allowed_meta_fields = ATFP_Helper::get_automatic_translate_meta_fields();
			}else{
				$allowed_meta_fields = array();
			}

			$pll_langs           = $polylang->model->get_languages_list();
			$pll_langs_slugs     = array_column( $pll_langs, 'slug' );

			
			$defalt_language = pll_default_language( 'slug' );

			foreach ( $post_ids as $post_id ) {
				$post_id = intval( $post_id );

				if ( ! current_user_can( 'edit_post', $post_id ) ) {
					continue;
				}

				$all_post_ids        = pll_get_post_translations( $post_id );
				$current_source_lang = $polylang->model->post->get_language( $post_id )->slug;

				$already_exist = false;

				$stored_post_ids = array_keys( $posts_translate );

				$intersect_values = array_intersect( $all_post_ids, $stored_post_ids );

				if ( count( $intersect_values ) > 0 ) {
					if ( $current_source_lang === $defalt_language ) {
						foreach ( $intersect_values as $intersect_value ) {
							unset( $posts_translate[ $intersect_value ] );
						}
					} else {
						$already_exist = true;
					}
				}

				if ( $already_exist ) {
					continue;
				}

				$editor_type = ATFP_Helper::get_post_editor_type( $post_id );

				if ( ! $editor_type ) {
					continue;
				}

				if ( 'block' === $editor_type ) {
					$gutenberg_block = true;
				}

				$posts_translate[ $post_id ] = array(
					'title'       => get_the_title( $post_id ),
					'editor_type' => $editor_type,
				);

				// Classic editor content is a Pro capability in the automatic flow, so bulk must not translate it either.
				if ( ! ATFP_Helper::is_supported_editor_type( $editor_type ) ) {
					$posts_translate[ $post_id ]['unsupported_editor'] = true;
					continue;
				}

				foreach ( $translate_lang as $lang ) {
					if ( in_array( $lang, $pll_langs_slugs, true ) && $this->language_needs_first_translation( $post_id, $lang, $polylang ) ) {
						$posts_translate[ $post_id ]['languages'][] = $lang;
					}
				}
			}

			$data=array('posts' => $posts_translate);

			if ( ! $post_meta_sync ) {
				$data['allowedMetaFields'] = json_encode( $allowed_meta_fields );
			}

			if ( $gutenberg_block ) {
				$block_parse_rules       = ATFP_Helper::get_instance()->get_block_parse_rules();
				$data['blockParseRules'] = json_encode( $block_parse_rules );
			}

			wp_send_json_success( $data );
		}

		public function bulk_translate_entries( $params ) {
			// Check if the user is logged in and has the necessary capabilities
			if ( ! is_user_logged_in() ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}
			if ( ! current_user_can( 'edit_posts' ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}

			// Verify the nonce
			if ( ! wp_verify_nonce( $params['privateKey'], 'atfp_bulk_translate_entries_nonce' ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}

			global $polylang;

			// check language exists or not
			$translate_lang = json_decode( $params['lang'] );
			$translate_lang = array_map( 'sanitize_text_field', $translate_lang );

			$post_ids           = json_decode( $params['ids'] );
			$posts_translate    = array();
			$gutenberg_block    = false;

			$post_meta_sync = true;
			if ( ! isset( PLL()->options['sync'] ) || ( isset( PLL()->options['sync'] ) && ! in_array( 'post_meta', PLL()->options['sync'] ) ) ) {
				$post_meta_sync = false;
			}

			$defalt_language = pll_default_language( 'slug' );

			if ( count( $translate_lang ) > 0 && ! ( count( $post_ids ) < 1 ) ) {
				$pll_langs           = $polylang->model->get_languages_list();
				$pll_langs_slugs     = array_column( $pll_langs, 'slug' );
				$allowed_meta_fields = array();

				foreach ( $post_ids as $postId ) {

					$post_id = intval( $postId );
					if ( ! current_user_can( 'edit_post', $postId ) ) {
						continue;
					}

					$all_post_ids        = pll_get_post_translations( $post_id );
					$current_source_lang = $polylang->model->post->get_language( $postId )->slug;

					$already_exist = false;

					$stored_post_ids = array_keys( $posts_translate );

					$intersect_values = array_intersect( $all_post_ids, $stored_post_ids );

					if ( count( $intersect_values ) > 0 ) {
						if ( $current_source_lang === $defalt_language ) {
							foreach ( $intersect_values as $intersect_value ) {
								unset( $posts_translate[ $intersect_value ] );
							}
						} else {
							$already_exist = true;
						}
					}

					if ( $already_exist ) {
						continue;
					}

					$posts_translate[ $postId ]['sourceLanguage'] = $current_source_lang;
					$this->fetch_translation_data( $post_id, $posts_translate, $translate_lang, $allowed_meta_fields, $post_meta_sync, $pll_langs_slugs, $gutenberg_block );


				}
			}

			$data = array(
				'posts'                    => $posts_translate,
				'CreateTranslatePostNonce' => wp_create_nonce( 'atfp_create_translate_post_nonce' ),
			);

			if ( ! $post_meta_sync ) {
				$data['allowedMetaFields'] = json_encode( $allowed_meta_fields );
			}

			if ( $gutenberg_block ) {
				$block_parse_rules       = ATFP_Helper::get_instance()->get_block_parse_rules();
				$data['blockParseRules'] = json_encode( $block_parse_rules );
			}

			if ( count( $posts_translate ) > 0 ) {
				wp_send_json_success( $data );
			} else {
				wp_send_json_error( esc_html__( 'No posts to translate', 'automatic-translations-for-polylang' ) );
			}
		}

		private function fetch_translation_data( $post_id, &$Object, $target_language, &$allowed_meta_fields, $post_meta_sync, $pll_langs_slugs, &$gutenberg_block = false ) {
			global $polylang;

			$postId    = intval( $post_id );
			$post_data = get_post( $postId );

			if ( ! $post_data ) {
				return;
			}

			$excerpt_fetch       = true;
			$content_fetch       = true;
			$custom_fields_fetch = true;

			$resolved_editor_type = ATFP_Helper::get_post_editor_type( $postId );

			if ( ! $Object[ $postId ]['sourceLanguage'] ) {
				$Object[ $postId ]['sourceLanguage'] = false;
				$Object[ $postId ]['title'] = $post_data->post_title;
				$Object[ $postId ]['editor_type'] = $resolved_editor_type;
				$Object[ $postId ]['post_link']   = html_entity_decode( get_edit_post_link( $postId ) );
				return;
			}

			// Classic editor content is a Pro capability in the automatic flow; never hand its content to bulk.
			if ( ! ATFP_Helper::is_supported_editor_type( $resolved_editor_type ) ) {
				$Object[ $postId ]['title']              = $post_data->post_title;
				$Object[ $postId ]['editor_type']        = $resolved_editor_type;
				$Object[ $postId ]['unsupported_editor'] = true;
				return;
			}

			$elementor_enabled = get_post_meta( $postId, '_elementor_edit_mode', true );

			$Object[ $postId ]['title'] = $post_data->post_title;

			if ( $content_fetch ) {
				$Object[ $postId ]['content'] = has_blocks( $post_data->post_content ) ? parse_blocks( $post_data->post_content ) : $post_data->post_content;
			}

			$Object[ $postId ]['editor_type'] = $resolved_editor_type;

			if ( isset( $post_data->post_excerpt ) && ! empty( $post_data->post_excerpt ) && $excerpt_fetch ) {
				$Object[ $postId ]['excerpt'] = $post_data->post_excerpt;
			}

			$Object[ $postId ]['sourceLanguage'] = ! isset( $Object[ $postId ]['sourceLanguage'] ) ? pll_default_language() : $Object[ $postId ]['sourceLanguage'];

			if ( ! $post_meta_sync && $custom_fields_fetch ) {
				$post_allowed_meta_fields = ATFP_Helper::get_automatic_translate_meta_fields( $postId );
				$allowed_meta_fields      = array_merge( $allowed_meta_fields, $post_allowed_meta_fields );
				$post_meta_fields         = get_post_meta( $postId );
				$existed_meta_fields      = array_intersect( array_keys( $post_meta_fields ), array_keys( $post_allowed_meta_fields ) );

				if ( ! isset( $Object[ $postId ]['metaFields'] ) || ! is_array( $Object[ $postId ]['metaFields'] ) ) {
					$Object[ $postId ]['metaFields'] = array();
				}

				foreach ( $existed_meta_fields as $key ) {
					if ( isset( $post_meta_fields[ $key ] ) && ! empty( $post_meta_fields[ $key ] ) && isset( $post_allowed_meta_fields[ $key ]['status'] ) && true === $post_allowed_meta_fields[ $key ]['status'] ) {
						$value = $post_allowed_meta_fields[ $key ]['type'] && is_array( $post_meta_fields[ $key ] ) ? maybe_unserialize( $post_meta_fields[ $key ][0] ) : maybe_unserialize( $post_meta_fields[ $key ] );
						if ( is_array( $value ) ) {
							$Object[ $postId ]['metaFields'][ $key ] = $value;
						} elseif ( is_string( $value ) && '' !== trim( $value ) ) {
							$Object[ $postId ]['metaFields'][ $key ] = $value;
						}
					}
				}
			}



			$Object[ $postId ]['post_link'] = get_the_permalink( $postId );

			if ( $elementor_enabled && 'builder' === $elementor_enabled && defined( 'ELEMENTOR_VERSION' ) ) {
				$Object[ $postId ]['editor_type'] = 'elementor';

				if ( $content_fetch ) {
					$elementor_data = array();

					if ( class_exists( '\Elementor\Plugin' ) && property_exists( '\Elementor\Plugin', 'instance' ) ) {
						$document = \Elementor\Plugin::$instance->documents->get( $postId );

						if ( $document ) {
							$elementor_data = $document->get_elements_data();
						}
					}

					$Object[ $postId ]['content'] = $elementor_data;
				}

				if ( $custom_fields_fetch ) {
					unset( $Object[ $postId ]['metaFields']['_elementor_data'] );
				}
			}

			if ( $Object[ $postId ]['editor_type'] === 'block' && ! $gutenberg_block ) {
				$gutenberg_block = true;
			}

			foreach ( $target_language as $lang ) {
				if ( in_array( $lang, $pll_langs_slugs, true ) && $this->language_needs_first_translation( $postId, $lang, $polylang ) ) {
					$Object[ $postId ]['languages'][] = $lang;
				}
			}
		}

		public function create_translate_post( $params ) {

			if ( ! isset( $params['source_language'] ) || empty( $params['source_language'] ) ) {
				wp_send_json_error( esc_html__( 'Invalid source language', 'automatic-translations-for-polylang' ) );
			}
			if ( ! isset( $params['post_id'] ) || ! isset( $params['target_language'] ) || ( ! isset( $params['post_title'] ) && ! isset( $params['post_content'] ) ) ) {
				wp_send_json_error( esc_html__( 'Invalid request', 'automatic-translations-for-polylang' ) );
			}
			if ( ! isset( $params['target_language'] ) && empty( $params['target_language'] ) ) {
				wp_send_json_error( esc_html__( 'Invalid target language', 'automatic-translations-for-polylang' ) );
			}
			if ( ! wp_verify_nonce( $params['privateKey'], 'atfp_create_translate_post_nonce' ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}
			if ( empty( $params['post_title'] ) && empty( $params['post_content'] ) ) {
				wp_send_json_error( esc_html__( 'Invalid request content and title empty', 'automatic-translations-for-polylang' ) );
			}

			$params = $params->get_params();

			$post_id         = intval( sanitize_text_field( $params['post_id'] ) );
			$target_language = sanitize_text_field( $params['target_language'] );
			$source_language = sanitize_text_field( $params['source_language'] );

			// Resolve the editor from the source post rather than trusting the request body.
			$editor_type = ATFP_Helper::get_post_editor_type( $post_id );

			if ( ! $editor_type ) {
				wp_send_json_error( esc_html__( 'Invalid post.', 'automatic-translations-for-polylang' ) );
			}

			if ( ! ATFP_Helper::is_supported_editor_type( $editor_type ) ) {
				wp_send_json_error( esc_html__( 'This editor type is not supported by the free version.', 'automatic-translations-for-polylang' ) );
			}

			$title = isset( $params['post_title'] ) ? sanitize_text_field( $params['post_title'] ) : false;

			$excerpt = isset( $params['post_excerpt'] ) ? wp_kses_post( $params['post_excerpt'] ) : false;

			$content = isset( $params['post_content'] ) ? $params['post_content'] : '';

			$meta_fields = isset( $params['post_meta_fields'] ) ? $params['post_meta_fields'] : '';

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				wp_send_json_error( esc_html__( 'You are not authorized to perform this action.', 'automatic-translations-for-polylang' ) );
			}

			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- ATFPP is our plugin prefix
			define( 'DOING_ATFPP_BULK_POST_TRANSLATION', true );

			$post_data = array(
				'post_content' => $content,
			);

			if ( $title && ! empty( $title ) ) {
				$post_data['post_title'] = sanitize_text_field( $title );
				$post_data['post_name']  = sanitize_title( $title );
			}

			if ( $excerpt && ! empty( $excerpt ) ) {
				$post_data['post_excerpt'] = sanitize_text_field( $excerpt );
			}

			if ( $meta_fields && ! empty( $meta_fields ) ) {
				$post_data['post_meta_fields'] = json_decode( $meta_fields, true );
			}

			if ( isset( $post_data['post_content'] ) && ! empty( $post_data['post_content'] ) ) {
				$source_post_content=get_post_field('post_content', $post_id);
				if ( $editor_type === 'elementor' ) {
					$post_data['meta_fields']['_elementor_data'] = $post_data['post_content'];
					unset( $post_data['post_content'] );
				} elseif ( $editor_type === 'block') {

					$blocks = json_decode( $post_data['post_content'], true );

					$atfp_sanitized_content = new ATFP_Sanitized_Content( $source_post_content );
					$post_data['post_content'] = $atfp_sanitized_content->get_sanitized_content(serialize_blocks( $blocks ));
					
				} elseif ( $editor_type === 'classic' ) {
					$class_editor_content = json_decode( $params['post_content'], true );

				 	$atfp_sanitized_content = new ATFP_Sanitized_Content( $source_post_content );
					$post_data['post_content'] = $atfp_sanitized_content->get_sanitized_content($class_editor_content);
				}else {
					$atfp_sanitized_content = new ATFP_Sanitized_Content( $source_post_content );
					$post_data['post_content'] = $atfp_sanitized_content->get_sanitized_content($post_data['post_content']);
				}
			}

			global $polylang;
			$post_clone = new ATFPP_Posts_Clone( $polylang );
			$post_id    = $post_clone->copy_post( $post_id, $source_language, $target_language, false, $post_data );

			if ( ! $post_id ) {
				wp_send_json_error(
					sprintf(
						/* translators: 1: parent post ID, 2: target language */
						esc_html__( 'Unable to create the translated post for parent post ID %1$s in %2$s.', 'automatic-translations-for-polylang' ),
						$post_id,
						$target_language
					)
				);
			} else {

				$post_link      = html_entity_decode( get_the_permalink( $post_id ) );
				$post_title     = html_entity_decode( get_the_title( $post_id ) );
				$post_edit_link = html_entity_decode( get_edit_post_link( $post_id ) );

				wp_send_json_success(
					array(
						'post_id'                     => $post_id,
						'target_language'             => $target_language,
						'post_link'                   => $post_link,
						'post_title'                  => $post_title,
						'post_edit_link'              => $post_edit_link,
						'update_translate_data_nonce' => wp_create_nonce( 'atfp_translate_nonce' ),
					)
				);
			}
		}
	}
endif;
