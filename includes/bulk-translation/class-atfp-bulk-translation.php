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

        /**
         * Render the AI Translate action above the posts table.
         *
         * The group starts hidden; atfp-admin-views-link.js moves it next to the
         * table filters and reveals it there.
         *
         * @param array $views Existing list table views.
         * @return array
         */
        public function atfp_bulk_translate_button($views)
        {
            printf(
                '<span class="atfp-bulk-translate-btn-group" style="display:none;">'
                    . '<button type="button" class="button button-primary atfp-bulk-translate-btn">'
                        . '<span class="dashicons dashicons-translation" aria-hidden="true"></span>%s'
                    . '</button>'
                . '</span>',
                esc_html__( 'AI Translate', 'automatic-translations-for-polylang' )
            );

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
                        __( 'AI Translate &#8220;%s&#8221;', 'automatic-translations-for-polylang' ),
                        $post->post_title
                    )
                ),
                esc_html__( 'AI Translate', 'automatic-translations-for-polylang' )
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

        /**
         * Render the modal mount point and the data it needs.
         *
         * Translation status for the listed rows is embedded here rather than
         * fetched over admin-ajax, so the modal can open immediately.
         *
         * @return void
         */
        public function bulk_translate_container()
        {
            echo "<div id='atfp-bulk-translate-wrapper'></div>";

            if ( ! class_exists( 'ATFP_Helper' ) ) {
                return;
            }

            $atfp_listed_posts = array();

            // admin_footer runs after the list table query, so the rows are known.
            if ( isset( $GLOBALS['wp_query']->posts ) && is_array( $GLOBALS['wp_query']->posts ) ) {
                foreach ( $GLOBALS['wp_query']->posts as $atfp_listed_post ) {
                    $atfp_listed_posts[] = is_object( $atfp_listed_post ) ? $atfp_listed_post->ID : $atfp_listed_post;
                }
            }

            if ( empty( $atfp_listed_posts ) ) {
                return;
            }

            printf(
                '<script type="application/json" id="atfp-bulk-posts-meta">%s</script>',
                wp_json_encode(
                    ATFP_Helper::get_posts_translation_meta( $atfp_listed_posts ),
                    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
                ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_json_encode with JSON_HEX_* escapes the payload.
            );
        }
    }
endif;
