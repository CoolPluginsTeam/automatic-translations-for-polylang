<?php

class ATFP_Register_Backend_Assets {

    private static $instance;

    public static function get_instance() {
        if ( ! isset( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        add_action( 'admin_enqueue_scripts', array( $this, 'register_backend_assets' ) );
        add_action('enqueue_block_assets', array($this, 'register_block_translator_assets'));
    }

    public function register_block_translator_assets() {

        if ( defined( 'POLYLANG_VERSION' ) ) {
            if ( function_exists( 'pll_current_language' ) ) {
                $current_language = pll_current_language();
            } else {
                $current_language = '';
            }

            $editor_script_asset = include ATFP_DIR_PATH . 'assets/block-translator/index.asset.php';
    
            wp_register_script('atfp-block-translator-toolbar', ATFP_URL . 'assets/block-translator/index.js', $editor_script_asset['dependencies'], $editor_script_asset['version'], true);
            wp_enqueue_script('atfp-block-translator-toolbar');

            if($current_language && $current_language !== '') {
                wp_localize_script('atfp-block-translator-toolbar', 'atfpBlockTranslator', array(
                    'pageLanguage' => $current_language,
                ));
            }
        }
    }

    public function register_backend_assets() {
        $current_screen = get_current_screen();
        if ( isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
        wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
            if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
                $from_post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;
                
                global $post;
                
                if ( null === $post || 0 === $from_post_id ) {
                    return;
                }
                
                $editor = '';
                if ( 'builder' === get_post_meta( $from_post_id, '_elementor_edit_mode', true ) ) {
                    $editor = 'Elementor';
                }
                if ( 'on' === get_post_meta( $from_post_id, '_et_pb_use_builder', true ) ) {
                    $editor = 'Divi';
                }

                if ( in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
                    return;
                }

                $languages = PLL()->model->get_languages_list();

                $lang_object = array();
                foreach ( $languages as $lang ) {
                    $lang_object[ $lang->slug ] = $lang->name;
                }

                $post_translate = PLL()->model->is_translated_post_type( $post->post_type );
                $lang           = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';
                $post_type      = isset( $_GET['post_type'] ) ? sanitize_key( $_GET['post_type'] ) : '';

                if ( $post_translate && $lang && $post_type ) {
                    wp_register_style( 'atfp-automatic-translate-custom', ATFP_URL . 'assets/css/atfp-custom.min.css', array(), ATFP_V );

                    $editor_script_asset = include ATFP_DIR_PATH . 'assets/automatic-translate/index.asset.php';
                    wp_register_script( 'atfp-automatic-translate', ATFP_URL . 'assets/automatic-translate/index.js', $editor_script_asset['dependencies'], $editor_script_asset['version'], true );

                    wp_register_style( 'atfp-automatic-translate', ATFP_URL . 'assets/automatic-translate/index.css', array(), $editor_script_asset['version'] );

                    wp_enqueue_style( 'atfp-automatic-translate-custom' );
                    wp_enqueue_style( 'atfp-automatic-translate' );
                    wp_enqueue_script( 'atfp-automatic-translate' );

                    if ( function_exists( 'get_option' ) ) {
                        $update_blocks = get_option( 'atfp_custom_block_status', false ) && 'true' === get_option( 'atfp_custom_block_status', false ) ? true : false;
                        if ( $update_blocks ) {
                            // Custom Translation Block update script
                            wp_register_script( 'atfp-custom-blocks', ATFP_URL . 'assets/js/atfp-update-custom-blocks.min.js', array( 'wp-data', 'jquery' ), ATFP_V, true );
                            wp_enqueue_script( 'atfp-custom-blocks' );

                            wp_localize_script(
                                'atfp-custom-blocks',
                                'atfp_block_update_object',
                                array(
                                    'ajax_url'       => admin_url( 'admin-ajax.php' ),
                                    'ajax_nonce'     => wp_create_nonce( 'atfp_block_update_nonce' ),
                                    'atfp_url'       => esc_url( ATFP_URL ),
                                    'action_get_content' => 'atfp_get_custom_blocks_content',
                                    'action_update_content' => 'atfp_update_custom_blocks_content',
                                    'source_lang'    => pll_get_post_language( $from_post_id, 'slug' ),
                                    'languageObject' => $lang_object,
                                )
                            );
                        }
                    }

                    wp_localize_script(
                        'atfp-automatic-translate',
                        'atfp_ajax_object',
                        array(
                            'ajax_url'           => admin_url( 'admin-ajax.php' ),
                            'ajax_nonce'         => wp_create_nonce( 'atfp_translate_nonce' ),
                            'atfp_url'           => esc_url( ATFP_URL ),
                            'action_fetch'       => 'atfp_fetch_post_content',
                            'action_block_rules' => 'atfp_block_parsing_rules',
                            'source_lang'        => pll_get_post_language( $from_post_id, 'slug' ),
                            'languageObject'     => $lang_object,
                            'editor_type'        => 'gutenberg',
                        )
                    );
                }
            }
        }
    }
}
