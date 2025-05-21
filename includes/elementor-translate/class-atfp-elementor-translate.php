<?php
/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! class_exists( 'ATFP_Elementor_Translate' ) ) {
    /**
	 * Class ATFP_Elementor_Translate
	 *
	 * This class handles the tran;ation for the Elementor Pages.
	 *
	 * @package ATFP
	 */
    class ATFP_Elementor_Translate{
        /**
		 * Singleton instance.
		 *
		 * @var ATFP_Elementor_Translate
		 */
        private static $instance;

        /**
		 * Get the singleton instance.
		 *
		 * @return ATFP_Elementor_Translate
		 */
        public static function get_instance() {
            if ( ! isset( self::$instance ) ) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
		 * Constructor.
		 */
        public function __construct() {
            add_action('add_meta_boxes', array($this, 'atfp_elementor_post_languages'));
        }

        /**
		 * Fetch the languages for translation of elementor pages.
		 */
		function atfp_elementor_post_languages() {
			if ( isset( $_GET['_wpnonce'] ) &&
				 wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
				if ( function_exists( 'PLL' ) ) {
					global $post;
					$current_post_id = $post->ID;
						
					$parent_post_id = isset( $_GET['from_post'] ) ? sanitize_key( $_GET['from_post'] ) : '';
					$parent_editor=get_post_meta($parent_post_id, '_elementor_edit_mode', true);
					$parent_elementor_data = get_post_meta( $parent_post_id, '_elementor_data', true );
	
					if($parent_editor === 'builder' || !empty($parent_elementor_data)){
						// Delete this old post meta data
						delete_post_meta( $parent_post_id, 'atfpp_elementor_translated' );
						delete_post_meta( $parent_post_id, 'atfp_parent_post_language_slug' );
						delete_post_meta( $current_post_id, 'atfpp_elementor_translated' );
						delete_post_meta( $current_post_id, 'atfp_parent_post_language_slug' );
						$parent_post_language_slug = pll_get_post_language( $parent_post_id, 'slug' );
						update_post_meta( $current_post_id, '_atfp_parent_post_language_slug', $parent_post_language_slug );
					}
				}
			}
		}
    }
}

