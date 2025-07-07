<?php

class ATFP_Register_Backend_Assets
{

    /**
     * Singleton instance of ATFP_Register_Backend_Assets.
     *
     * @var ATFP_Register_Backend_Assets
     */
    private static $instance;

    /**
     * Get the singleton instance of ATFP_Register_Backend_Assets.
     *
     * @return ATFP_Register_Backend_Assets
     */
    public static function get_instance()
    {
        if (! isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor for ATFP_Register_Backend_Assets.
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_gutenberg_translate_assets'));
        add_action('enqueue_block_assets', array($this, 'register_block_translator_assets'));
        add_action('elementor/editor/before_enqueue_scripts', array($this, 'enqueue_elementor_translate_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Register block translator assets.
     */
    public function register_block_translator_assets()
    {

        if (defined('POLYLANG_VERSION')) {
            if (function_exists('pll_current_language')) {
                $current_language = pll_current_language();
            } else {
                $current_language = '';
            }

            $editor_script_asset = include ATFP_DIR_PATH . 'assets/block-translator/index.asset.php';

            wp_register_script('atfp-block-translator-toolbar', ATFP_URL . 'assets/block-translator/index.js', $editor_script_asset['dependencies'], $editor_script_asset['version'], true);
            wp_enqueue_script('atfp-block-translator-toolbar');

            if ($current_language && $current_language !== '') {
                wp_localize_script('atfp-block-translator-toolbar', 'atfpBlockInlineTranslation', array(
                    'pageLanguage' => $current_language,
                ));
            }
        }
    }

    public function enqueue_admin_assets(){
        if(!is_admin()){
            return;
        }

        global $polylang;
        
		if(!$polylang || !property_exists($polylang, 'model') || !function_exists('get_current_screen')){
            return;
		}
        
		$current_screen = get_current_screen();
        
		$translated_post_types = $polylang->model->get_translated_post_types();
		$translated_post_types = array_keys($translated_post_types);
        
		if(!in_array($current_screen->post_type, $translated_post_types)){
            return;
		}
        
        wp_enqueue_script('atfp-views-link-admin', ATFP_URL . 'assets/js/atfp-admin-views-link.js', array('jquery'), ATFP_V, true);
    }

    /**
     * Register backend assets.
     */
    public function enqueue_gutenberg_translate_assets()
    {
        $current_screen = get_current_screen();
        if (
            isset($_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce']) &&
            wp_verify_nonce(sanitize_text_field(wp_unslash($_GET['_wpnonce'])), 'new-post-translation')
        ) {
            if (method_exists($current_screen, 'is_block_editor') && $current_screen->is_block_editor()) {
                $from_post_id = isset($_GET['from_post']) ? absint($_GET['from_post']) : 0;

                global $post;

                if (null === $post || 0 === $from_post_id) {
                    return;
                }

                $editor = '';
                if ('builder' === get_post_meta($from_post_id, '_elementor_edit_mode', true)) {
                    $editor = 'Elementor';
                }
                if ('on' === get_post_meta($from_post_id, '_et_pb_use_builder', true)) {
                    $editor = 'Divi';
                }

                if (in_array($editor, array('Elementor', 'Divi'), true)) {
                    return;
                }

                $languages = PLL()->model->get_languages_list();

                $lang_object = array();
                foreach ($languages as $lang) {
                    $lang_object[$lang->slug] = $lang->name;
                }

                $post_translate = PLL()->model->is_translated_post_type($post->post_type);
                $lang           = isset($_GET['new_lang']) ? sanitize_key($_GET['new_lang']) : '';
                $post_type      = isset($_GET['post_type']) ? sanitize_key($_GET['post_type']) : '';

                if ($post_translate && $lang && $post_type) {
                    if (function_exists('get_option')) {
                        $update_blocks = get_option('atfp_custom_block_status', false) && 'true' === get_option('atfp_custom_block_status', false) ? true : false;
                        if ($update_blocks) {
                            // Custom Translation Block update script
                            wp_register_script('atfp-custom-blocks', ATFP_URL . 'assets/js/atfp-update-custom-blocks.min.js', array('wp-data', 'jquery'), ATFP_V, true);
                            wp_enqueue_script('atfp-custom-blocks');

                            wp_localize_script(
                                'atfp-custom-blocks',
                                'atfp_block_update_object',
                                array(
                                    'ajax_url'       => admin_url('admin-ajax.php'),
                                    'ajax_nonce'     => wp_create_nonce('atfp_block_update_nonce'),
                                    'atfp_url'       => esc_url(ATFP_URL),
                                    'action_get_content' => 'atfp_get_custom_blocks_content',
                                    'action_update_content' => 'atfp_update_custom_blocks_content',
                                    'source_lang'    => pll_get_post_language($from_post_id, 'slug'),
                                    'languageObject' => $lang_object,
                                )
                            );
                        }
                    }

                    $data = array(
                        'action_fetch'       => 'atfp_fetch_post_content',
                        'action_block_rules' => 'atfp_block_parsing_rules',
                        'parent_post_id'     => $from_post_id,
                    );

                    $this->enqueue_automatic_translate_assets(pll_get_post_language($from_post_id, 'slug'), $lang, 'gutenberg', $data);
                }
            }
        }
    }

    public function enqueue_elementor_translate_assets()
    {

        $this->elementor_widget_translator_script();

        $page_translated = get_post_meta(get_the_ID(), '_atfp_elementor_translated', true);
        $parent_post_language_slug = get_post_meta(get_the_ID(), '_atfp_parent_post_language_slug', true);

        if ((!empty($page_translated) && $page_translated === 'true') || empty($parent_post_language_slug)) {
            return;
        }
        
        $post_language_slug = pll_get_post_language(get_the_ID(), 'slug');
        $current_post_id = get_the_ID(); // Get the current post ID
        $elementor_data = get_post_meta($current_post_id, '_elementor_data', true);
        $elementor_data = is_serialized($elementor_data) ? unserialize($elementor_data) : (is_string($elementor_data) ? json_decode($elementor_data) : $elementor_data);

        if($parent_post_language_slug === $post_language_slug){
            return;
        }

        $meta_fields=get_post_meta($current_post_id);

        $data = array(
            'update_elementor_data' => 'atfp_update_elementor_data',
            'elementorData' => $elementor_data,
            'metaFields' => $meta_fields,
        );

        wp_enqueue_style('atfp-elementor-translate', ATFP_URL . 'assets/css/atfp-elementor-translate.min.css', array(), ATFP_V);
        $this->enqueue_automatic_translate_assets($parent_post_language_slug, $post_language_slug, 'elementor', $data);
    }   

    public function enqueue_automatic_translate_assets($source_lang, $target_lang, $editor_type, $extra_data = array())
    {
        if(!ATFP_Helper::get_translation_data()){
            return;
        }

        $translation_data = ATFP_Helper::get_translation_data();

        wp_register_style('atfp-automatic-translate-custom', ATFP_URL . 'assets/css/atfp-custom.min.css', array(), ATFP_V);

        $editor_script_asset = include ATFP_DIR_PATH . 'assets/automatic-translate/index.asset.php';
        wp_register_script('atfp-automatic-translate', ATFP_URL . 'assets/automatic-translate/index.js', $editor_script_asset['dependencies'], $editor_script_asset['version'], true);
        wp_register_style('atfp-automatic-translate', ATFP_URL . 'assets/automatic-translate/index.css', array(), $editor_script_asset['version']);

        $post_type = get_post_type();


        $languages = PLL()->model->get_languages_list();
        $lang_object = array();
        foreach ($languages as $lang) {
            $lang_object[$lang->slug] = array('name' => $lang->name, 'flag' => $lang->flag_url, 'locale' => $lang->locale);
        }

        wp_enqueue_style('atfp-automatic-translate-custom');
        wp_enqueue_style('atfp-automatic-translate');
        wp_enqueue_script('atfp-automatic-translate');

        $post_id = get_the_ID();

        $data = array_merge(array(
            'ajax_url'           => admin_url('admin-ajax.php'),
            'ajax_nonce'         => wp_create_nonce('atfp_translate_nonce'),
            'atfp_url'           => esc_url(ATFP_URL),
            'admin_url'     => admin_url(),
            'update_translate_data' => 'atfp_update_translate_data',
            'source_lang'        => $source_lang,
            'target_lang'        => $target_lang,
            'languageObject'     => $lang_object,
            'post_type'          => $post_type,
            'editor_type'        => $editor_type,
            'current_post_id'    => $post_id,
            'translation_data'   => is_array($translation_data) ? (function() use (&$translation_data) { unset($translation_data['data']); return $translation_data; })() : array(),
            'pro_version_url'=>esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/'),
        ), $extra_data);

        if(!isset(PLL()->options['sync']) || (isset(PLL()->options['sync']) && !in_array('post_meta', PLL()->options['sync']))){
            $data['postMetaSync'] = 'false';
        }else{
            $data['postMetaSync'] = 'true';
        }

        wp_localize_script(
            'atfp-automatic-translate',
            'atfp_global_object',
            $data
        );
    }

    /**
     * Enqueue the elementor widget translator script.
     */
    public function elementor_widget_translator_script()
    {
        if (defined('POLYLANG_VERSION')) {
            if (function_exists('pll_current_language')) {
                $current_language = pll_current_language();
                $current_language_name = pll_current_language('name');
            } else {
                $current_language = '';
                $current_language_name = '';
            }

            $asset = require_once ATFP_DIR_PATH . 'assets/elementor-widget-translator/index.asset.php';
            wp_enqueue_script(
                'atfp-elementor-widget-translator',
                ATFP_URL . 'assets/elementor-widget-translator/index.js',
                array_merge(
                    $asset['dependencies'],
                    [
                        'backbone-marionette',
                        'elementor-common',
                        'elementor-web-cli',
                        'elementor-editor-modules',
                    ]
                ),
                $asset['version'],
                true
            );

            if ($current_language && $current_language !== '') {
                wp_localize_script(
                    'atfp-elementor-widget-translator',
                    'atfpElementorInlineTranslation',
                    array(
                        'pageLanguage' => $current_language,
                        'pageLanguageName' => $current_language_name,
                    )
                );
            }
        }
    }
}
