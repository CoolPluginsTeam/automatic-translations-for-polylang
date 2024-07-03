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
 * Handle Cool Timeline ajax requests
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

			$response = wp_remote_get( ATFP_URL . 'includes/automatic-translate/translate-block-rules/block-rules.json' );

			if ( is_wp_error( $response ) ) {
				$block_rules = '';
			} else {
				$block_rules = wp_remote_retrieve_body( $response );
			}

			$data = array(
				'blockRules' => $block_rules,
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
				$post_data = get_post( $post_id );

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
	}
}
