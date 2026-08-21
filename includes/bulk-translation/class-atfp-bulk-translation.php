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
            add_filter('post_row_actions', array($this, 'add_row_translate_action'), 10, 2);
            add_filter('page_row_actions', array($this, 'add_row_translate_action'), 10, 2);

            add_action('admin_footer', array($this, 'bulk_translate_container'));
        }

        public function atfp_bulk_translate_button($views)
        {
            echo '<button class="button button-primary atfp-bulk-translate-btn" style="display:none;">' . esc_html__( 'AI Translate', 'automatic-translations-for-polylang' ) . '</button>';

            return $views;
        }

        /**
         * Add a Translate row action next to Edit | Quick Edit | Trash | View.
         *
         * @param array    $actions Existing row actions.
         * @param WP_Post  $post    Current post.
         * @return array
         */
        public function add_row_translate_action( $actions, $post ) {
            if ( ! $post instanceof WP_Post || ! current_user_can( 'edit_post', $post->ID ) ) {
                return $actions;
            }

            $translate_link = sprintf(
                '<a href="#" class="atfp-bulk-translate-row-btn" data-post-id="%d" aria-label="%s">%s</a>',
                absint( $post->ID ),
                esc_attr(
                    sprintf(
                        /* translators: %s: post title */
                        __( 'Translate &#8220;%s&#8221;', 'automatic-translations-for-polylang' ),
                        $post->post_title
                    )
                ),
                esc_html__( 'Translate', 'automatic-translations-for-polylang' )
            );

            $new_actions = array();
            foreach ( $actions as $key => $action ) {
                $new_actions[ $key ] = $action;
                if ( 'view' === $key ) {
                    $new_actions['atfp_translate'] = $translate_link;
                }
            }

            if ( ! isset( $new_actions['atfp_translate'] ) ) {
                $new_actions['atfp_translate'] = $translate_link;
            }

            return $new_actions;
        }

        public function bulk_translate_container()
        {
            echo "<div id='atfp-bulk-translate-wrapper'></div>";
        }
    }
endif;
