<?php

if(!defined('ABSPATH')) exit;

if(!class_exists('ATFP_Bulk_Translation')):
    class ATFP_Bulk_Translation
    {
        private static $instance;

        public static function get_instance()
        {
            if(!isset(self::$instance)) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function __construct()
        {
            add_action('current_screen', array($this, 'bulk_translate_btn'));
            add_action('admin_head', array($this, 'bulk_translate_btn_style'));
        }

        public function bulk_translate_btn($screen)
        {
            global $polylang;
        
            if(!$polylang || !property_exists($polylang, 'model')){
                return;
            }
            
            $translated_post_types = $polylang->model->get_translated_post_types();
            $translated_post_types = array_keys($translated_post_types);

            if(!isset($screen->id)){
                return;
            }
            
            if((isset($_GET['post_status']) && 'trash' === $_GET['post_status'])){
                return;
            }
            
            if(!in_array($screen->post_type, $translated_post_types)){
                return;
            }

            add_filter( "views_{$screen->id}", array($this, 'atfp_bulk_translate_button') );
        }

        public function atfp_bulk_translate_button($views)
        {
            echo "<a class='button atfp-bulk-translate-btn' style='display:none;' title='Bulk Translate option is avialable in pro version only' href='https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_translate' target='_blank'>Bulk Translate (Pro)</a>";

            return $views;
        }

        public function bulk_translate_btn_style()
        {
            echo "<style>
            .atfp-bulk-translate-btn{background:#f6f7f7!important;border-color:#c3c4c7!important;color:#50575e!important;transition:all .3s ease-in-out}.atfp-bulk-translate-btn:hover{background:#e1e1e1!important;border-color:#c9c9c9!important;}</style>";
        }
    }
endif;