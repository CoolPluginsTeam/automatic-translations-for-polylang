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

		public function block_parsing_rules() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translation-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$block_rules = file_get_contents( ATFP_DIR_PATH . 'includes/automatic-translate/translate-block-rules/block-rules.json' );
			$data        = array(
				'blockRules' => $block_rules,
			);

			echo wp_send_json_success( $data );
			exit;
		}

		public function fetch_post_content() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translation-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$post_id   = $_POST['postId'];
			$post_data = get_post( $post_id );

			$content = $post_data->post_content;
			$data    = array(
				'title'   => $post_data->post_title,
				'excerpt' => $post_data->post_excerpt,
				'content' => $content,
			);

			echo wp_send_json_success( $data );
			exit;
		}
	}
}
