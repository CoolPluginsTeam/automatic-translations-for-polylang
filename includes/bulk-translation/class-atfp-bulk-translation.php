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

            // nonce verification is not required here because we are not using the nonce here.
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $post_status=isset($_GET['post_status']) ? sanitize_text_field(wp_unslash($_GET['post_status'])) : '';

            if('trash' === $post_status){
                return;
            }
            
            if(!in_array($screen->post_type, $translated_post_types)){
                return;
            }

            add_filter( "views_{$screen->id}", array($this, 'atfp_bulk_translate_button') );
        }

        public function atfp_bulk_translate_button($views)
        {
            $atfp_utm_parameters='utm_source=atfp_plugin';
            $atfp_magic_wand_url=ATFP_URL . 'assets/images/magic-wand.svg';

			if(class_exists('ATFP_Helper')){
				$atfp_utm_parameters=ATFP_Helper::utm_source_text();
			}

            echo sprintf(wp_kses("<a class='button button-primary atfp-bulk-translate-btn' style='display:none; align-items: center;' title='Bulk Translate option is avialable in pro version only' href='https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?".sanitize_text_field($atfp_utm_parameters)."&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_translate' target='_blank'><img src='{$atfp_magic_wand_url}' style='width: 18px; height: 18px; margin-right: 5px; filter: %s' alt='Bulk Translate'>Bulk Translate</a>",
                array('a' => array('class' => array(), 'style' => array(), 'title' => array(), 'href' => array(), 'target' => array(), 'rel' => array(), 'align-items' => array()), 'img' => array('src' => array(), 'style' => array(
                    'width' => array(), 'height' => array(), 'margin-right' => array(), 'filter' => array(
                        'brightness(0) invert(1)'
                    )
                ), 'alt' => array()))
            ), sanitize_text_field('brightness(0) invert(1)'));

            return $views;
        }
    }
endif;