<?php

if (!defined('ABSPATH')) exit;

if (!class_exists('ATFP_Bulk_Translation')):
    class ATFP_Bulk_Translation
    {
        private static $instance;

        public static function get_instance()
        {
            if (!isset(self::$instance)) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function __construct()
        {
            add_action('current_screen', array($this, 'bulk_translate_btn'));
        }

        public function bulk_translate_btn($screen)
        {
            if (!isset($screen) || !is_object($screen)) {
                return;
            }

            if (!class_exists('ATFP_Helper') || !ATFP_Helper::bulk_translation_render($screen)) {
                return;
            }

            // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verification is not required here
            $post_status = isset($_GET['post_status']) ? sanitize_text_field(wp_unslash($_GET['post_status'])) : '';
            
            if ('trash' === $post_status) {
                return;
            }

            add_filter("views_{$screen->id}", array($this, 'atfp_bulk_translate_button'));

            add_action('admin_footer', array($this, 'bulk_translate_container'));
        }

        public function atfp_bulk_translate_button($views)
        {
            echo '<button class="button button-primary atfp-bulk-translate-btn" style="display:none;">' . esc_html__( 'Ai Translate', 'autopoly-ai-translation-for-polylang' ) . '</button>';

            return $views;
        }

        public function bulk_translate_container()
        {
            echo "<div id='atfp-bulk-translate-wrapper'></div>";
        }
    }
endif;
