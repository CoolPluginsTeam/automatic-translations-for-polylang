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
 * Handle ATFP ajax requests
 */
if ( ! class_exists( 'ATFP_Ajax_Handler' ) ) {
	class ATFP_Ajax_Handler {
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
		private static $custom_block_data_array = array();

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

		/**
		 * Constructor.
		 *
		 * @param object $settings_obj Plugin settings.
		 */
		public function __construct() {
			if ( is_admin() ) {
				add_action( 'wp_ajax_fetch_post_content', array( $this, 'fetch_post_content' ) );
				add_action( 'wp_ajax_block_parsing_rules', array( $this, 'block_parsing_rules' ) );
				add_action( 'wp_ajax_get_custom_blocks_content', array( $this, 'get_custom_blocks_content' ) );
				add_action( 'wp_ajax_update_custom_blocks_content', array( $this, 'update_custom_blocks_content' ) );
			}
		}

		/**
		 * Block Parsing Rules
		 *
		 * Handles the block parsing rules AJAX request.
		 */
		public function block_parsing_rules() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$block_parse_rules = ATFP_Helper::get_instance()->get_block_parse_rules();

			$data = array(
				'blockRules' => json_encode( $block_parse_rules ),
			);

			return wp_send_json_success( $data );
			exit;
		}

		/**
		 * Fetches post content via AJAX request.
		 */
		public function fetch_post_content() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$post_id = isset( $_POST['postId'] ) ? (int) filter_var( $_POST['postId'], FILTER_SANITIZE_NUMBER_INT ) : false;

			if ( false !== $post_id ) {
				$post_data = get_post( esc_html( $post_id ) );

				$content = $post_data->post_content;
				$data    = array(
					'title'   => $post_data->post_title,
					'excerpt' => $post_data->post_excerpt,
					'content' => $content,
				);

				return wp_send_json_success( $data );
			} else {
				wp_send_json_error( __( 'Invalid Post ID.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
			}

			exit;
		}

		public function get_custom_blocks_content() {
			if ( ! check_ajax_referer( 'atfp_block_update_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$custom_content = get_option( 'atfp_custom_block_data', false ) ? get_option( 'atfp_custom_block_data', false ) : false;

			if ( $custom_content && is_string( $custom_content ) && ! empty( trim( $custom_content ) ) ) {
				return wp_send_json_success( array( 'block_data' => $custom_content ) );
			} else {
				return wp_send_json_success( array( 'message' => __( 'No custom blocks found.', 'automatic-translations-for-polylang' ) ) );
			}
			exit();
		}

		public function update_custom_blocks_content() {
			if ( ! check_ajax_referer( 'atfp_block_update_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}
			$updated_blocks_data = isset( $_POST['save_block_data'] ) ? json_decode( wp_unslash( $_POST['save_block_data'] ) ) : false;

			if ( $updated_blocks_data ) {
				$block_parse_rules = ATFP_Helper::get_instance()->get_block_parse_rules();

				if ( isset( $block_parse_rules['AtfpBlockParseRules'] ) ) {
					$previous_translate_data = get_option( 'atfp_custom_block_translation', false );
					if ( $previous_translate_data && ! empty( $previous_translate_data ) ) {
						$this->custom_block_data_array = $previous_translate_data;
					}

					foreach ( $updated_blocks_data as $key => $block_data ) {
						$this->verify_block_data( array( $key ), $block_data, $block_parse_rules['AtfpBlockParseRules'][ $key ] );
					}

					if ( count( $this->custom_block_data_array ) > 0 ) {
						update_option( 'atfp_custom_block_translation', $this->custom_block_data_array );
						delete_option( 'atfp_custom_block_data' );
						update_option( 'atfp_custom_block_status', 'false' );
					}
				}
			}

			return wp_send_json_success( array( 'message' => __( 'Automatic Translation for Polylang: Custom Blocks data updated successfully', 'automatic-translations-for-polylang' ) ) );
		}

		private function verify_block_data( $id_keys, $value, $block_rules ) {
			$block_rules = is_object( $block_rules ) ? json_decode( json_encode( $block_rules ) ) : $block_rules;

			if ( ! isset( $block_rules ) ) {
				return $this->create_nested_attribute( $id_keys, $value );
			}
			if ( is_object( $value ) && isset( $block_rules ) ) {
				foreach ( $value as $key => $item ) {
					if ( isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->verify_block_data( array_merge( $id_keys, array( $key ) ), $item, $block_rules[ $key ], false );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && true === $item ) {
						$this->create_nested_attribute( array_merge( $id_keys, array( $key ) ), true );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->create_nested_attribute( array_merge( $id_keys, array( $key ) ), $item );
						continue;
					}
				}
			}
		}

		private function create_nested_attribute( $id_keys = array(), $value ) {
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
	}
}
