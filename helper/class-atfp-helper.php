<?php
/**
 * ATFP Ajax Handler
 *
 * @package ATFP
 */

/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ATFP Helper
 */
if ( ! class_exists( 'ATFP_Helper' ) ) {
	class ATFP_Helper {
		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 * Stores custom block data for processing and retrieval.
		 *
		 * This static array holds the data related to custom blocks that are
		 * used within the plugin. It can be utilized to manage and manipulate
		 * the custom block information as needed during AJAX requests.
		 *
		 * @var array
		 */
		private $custom_block_data_array = array();

		/**
		 * Gets an instance of our plugin.
		 *
		 * @param object $settings_obj timeline settings.
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		public static function get_custom_block_post_id() {
			$first_post_id = null;

			$query = new WP_Query(
				array(
					'post_type'      => 'atfp_add_blocks',
					'posts_per_page' => 1,
					'orderby'        => 'date',
					'order'          => 'ASC',
				)
			);

			$existing_post = $query->posts ? $query->posts[0] : null;

			if ( ! $existing_post ) {
				$post_title    = esc_html__( 'Add More Gutenberg Blocks', 'automatic-translation-for-polylang' );
				$first_post_id = wp_insert_post(
					array(
						'post_title'   => $post_title,
						'post_content' => '',
						'post_status'  => 'publish',
						'post_type'    => 'atfp_add_blocks',
					)
				);
			} elseif ( $query->have_posts() ) {
				$query->the_post();
				$first_post_id = get_the_ID();
			}

			return $first_post_id;
		}

		public function get_block_parse_rules() {
			$response = wp_remote_get( ATFP_URL . 'includes/automatic-translate/translate-block-rules/block-rules.json' );

			if ( is_wp_error( $response ) ) {
				$block_rules = '';
			} else {
				$block_rules = wp_remote_retrieve_body( $response );
			}

			$block_translation_rules = json_decode( $block_rules, true );

			$this->custom_block_data_array = isset( $block_translation_rules['AtfpBlockParseRules'] ) ? $block_translation_rules['AtfpBlockParseRules'] : array();

			$custom_block_translation = get_option( 'atfp_custom_block_translation', false );

			if ( ! empty( $custom_block_translation ) && is_array( $custom_block_translation ) ) {
				foreach ( $custom_block_translation as $key => $block_data ) {
					$this->filter_custom_block_rules( array( $key ), $block_data, $block_translation_rules['AtfpBlockParseRules'][ $key ] );
				}
			}

			$block_translation_rules['AtfpBlockParseRules'] = $this->custom_block_data_array;

			return $block_translation_rules;
		}

		private function filter_custom_block_rules( array $id_keys, $value, $block_rules, $attr_key = false ) {
			$latest_data = array();
			$block_rules = is_object( $block_rules ) ? json_decode( json_encode( $block_rules ) ) : $block_rules;

			if ( ! isset( $block_rules ) ) {
				return $this->merge_nested_attribute( $id_keys, $value );
			}
			if ( is_object( $value ) && isset( $block_rules ) ) {
				foreach ( $value as $key => $item ) {
					if ( isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->filter_custom_block_rules( array_merge( $id_keys, array( $key ) ), $item, $block_rules[ $key ], false );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && true === $item ) {
						$this->merge_nested_attribute( array_merge( $id_keys, array( $key ) ), true );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->merge_nested_attribute( array_merge( $id_keys, array( $key ) ), $item );
						continue;
					}
				}
			}
		}

		private function merge_nested_attribute( array $id_keys, $value ) {
			$value = is_object( $value ) ? json_decode( json_encode( $value ), true ) : $value;

			$current_array = &$this->custom_block_data_array;

			foreach ( $id_keys as $index => $id ) {
				if ( ! isset( $current_array[ $id ] ) ) {
					$current_array[ $id ] = array();
				}
				$current_array = &$current_array[ $id ];
			}

			$current_array = $value;
		}

		/**
		 * Timeline Stories Default Pagination
		 *
		 * @param WP_Query $wp_query WP_Query object.
		 * @param int      $paged current page number.
		 */
		public static function atfp_pagination( $max_num_pages, $paged ) {
			$output   = '';
			$numpages = $max_num_pages;
			if ( ! $numpages ) {
				$numpages = 1;
			}
			$big      = 999999999;
			$of_lbl   = __( ' of ', 'cool-timeline' );
			$page_lbl = __( ' Page ', 'cool-timeline' );

			$pagination_args = array(
				'base'         => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
				'format'       => '?paged=%#%',
				'total'        => $numpages,
				'current'      => $paged,
				'show_all'     => false,
				'end_size'     => 1,
				'mid_size'     => 1,
				'prev_next'    => true,
				// 'prev_text'    => $prev_arrow,
				// 'next_text'    => $next_arrow,
				'type'         => 'plain',
				'add_args'     => false,
				'add_fragment' => '',
			);

			$paginate_links = paginate_links( $pagination_args );

			if ( $paginate_links ) {
				$output  = '<nav class="atfp-pagination" aria-label="Timeline Navigation">';
				$output .= '<span class="page-numbers atfp-page-num" role="status">' . $page_lbl . $paged . $of_lbl . $numpages . '</span> ';
				$output .= $paginate_links;
				$output .= '</nav>';
				return $output;
			}
			return '';
		}
	}
}
