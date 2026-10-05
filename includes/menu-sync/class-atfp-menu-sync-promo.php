<?php
/**
 * Marketing Menu Synchronization button on Appearance > Menus (Free).
 *
 * Mirrors AutoPoly Pro's button placement beside Save Menu, but only links
 * to the Pro product page — no sync UI or AJAX.
 *
 * @package AutomaticTranslationsForPolylang
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Menu_Sync_Promo' ) ) {

	/**
	 * Injects a Buy Pro "Menu Synchronization" control on nav-menus.php.
	 */
	class ATFP_Menu_Sync_Promo {

		/**
		 * Singleton.
		 *
		 * @var ATFP_Menu_Sync_Promo|null
		 */
		private static $instance = null;

		/**
		 * Get the singleton instance.
		 *
		 * @return ATFP_Menu_Sync_Promo
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor.
		 */
		private function __construct() {
			// Pro owns the real Menu Synchronization button — skip while Pro is active.
			if ( defined( 'ATFPP_V' ) ) {
				return;
			}

			add_action( 'load-nav-menus.php', array( $this, 'register_menu_page_hooks' ) );
		}

		/**
		 * Attach assets only on Appearance > Menus when a menu is selected.
		 *
		 * @return void
		 */
		public function register_menu_page_hooks() {
			if ( ! current_user_can( 'edit_theme_options' ) ) {
				return;
			}

			if ( ! function_exists( 'pll_languages_list' ) ) {
				return;
			}

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}

		/**
		 * Enqueue a tiny script that inserts the marketing button.
		 *
		 * @return void
		 */
		public function enqueue_assets() {
			global $nav_menu_selected_id;

			$menu_id = absint( $nav_menu_selected_id );
			if ( ! $menu_id ) {
				return;
			}

			$utm = 'utm_source=atfp_plugin';
			if ( class_exists( 'ATFP_Helper' ) && method_exists( 'ATFP_Helper', 'utm_source_text' ) ) {
				$utm = ATFP_Helper::utm_source_text();
			}

			$buy_url = 'https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'
				. sanitize_text_field( $utm )
				. '&utm_medium=inside&utm_campaign=get_pro&utm_content=menus_sync_button';

			$handle = 'atfp-menu-sync-promo';
			wp_register_script( $handle, false, array( 'jquery' ), ATFP_V, true );
			wp_enqueue_script( $handle );

			$label = wp_json_encode( __( 'Menu Sync (Pro)', 'automatic-translations-for-polylang' ) );
			$url   = wp_json_encode( esc_url_raw( $buy_url ) );

			$js = <<<JS
(function ($) {
	'use strict';
	$(function () {
		var \$save = $('#save_menu_header');
		if ( ! \$save.length || $('#atfp-menu-sync-promo-btn').length ) {
			return;
		}
		\$save.after(
			$('<a/>', {
				id: 'atfp-menu-sync-promo-btn',
				class: 'button button-primary',
				href: {$url},
				target: '_blank',
				rel: 'noopener noreferrer',
				text: {$label}
			}).css({ 'margin-left': '10px', 'vertical-align': 'middle' })
		);
	});
})(jQuery);
JS;

			wp_add_inline_script( $handle, $js );
		}
	}
}
