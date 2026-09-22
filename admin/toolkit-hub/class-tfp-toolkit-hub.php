<?php
/**
 * Toolkit for Polylang — shared hub loaded once across all three sibling plugins
 * (AutoPoly, Translation Inspector / Duplicate Content, Language Switcher).
 *
 * Ships as an identical copy in each plugin. Whichever plugin's bootstrap
 * requires this file first wins: the `class_exists()` guard at the require
 * site (not in this file) stops every other copy from loading, so only one
 * menu item and one set of hooks ever get registered no matter how many of
 * the three plugins are active together.
 *
 * @package ToolkitForPolylang
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'TFP_Toolkit_Hub' ) ) {

	/**
	 * Registers and renders the shared "Toolkit for Polylang" hub page.
	 */
	final class TFP_Toolkit_Hub {

		/**
		 * Singleton instance.
		 *
		 * @var TFP_Toolkit_Hub|null
		 */
		private static $instance = null;

		/**
		 * Identity of whichever plugin's copy of this file actually loaded:
		 * its text domain, and its own "Get Support" / "Check Docs" URLs for
		 * the hub's header. This file ships identically in three plugins —
		 * whichever wins the class_exists() race is the one whose values are
		 * the only ones that can actually resolve (its text domain is the
		 * one with translations loaded; its support/docs links are real).
		 *
		 * @var array{text_domain: string, support_url: string, docs_url: string}
		 */
		private static $loader = array(
			'text_domain' => 'automatic-translations-for-polylang',
			'support_url' => 'https://wordpress.org/support/plugin/automatic-translations-for-polylang/',
			'docs_url'    => 'https://docs.coolplugins.net/plugin/ai-translation-for-polylang/',
		);

		/**
		 * Hub menu slug, under Polylang's "Languages" (mlang) menu.
		 */
		const PAGE = 'toolkit-for-polylang';

		/**
		 * Plugin basenames (folder/file.php), exactly as WordPress identifies
		 * them for is_plugin_active() — same shape as get_option('active_plugins').
		 */
		const PLUGIN_AUTOPOLY     = 'automatic-translations-for-polylang/automatic-translation-for-polylang.php';
		const PLUGIN_AUTOPOLY_PRO = 'autopoly-ai-translation-for-polylang-pro/autopoly-ai-translation-for-polylang-pro.php';
		const PLUGIN_INSPECTOR    = 'duplicate-content-addon-for-polylang/duplicate-content-addon-for-polylang.php';
		const PLUGIN_SWITCHER     = 'language-switcher-for-divi-polylang/language-switcher-for-divi-polylang.php';

		/**
		 * WordPress.org slugs, for the "Install" link (plugin-information popup).
		 */
		const SLUG_AUTOPOLY  = 'automatic-translations-for-polylang';
		const SLUG_INSPECTOR = 'duplicate-content-addon-for-polylang';
		const SLUG_SWITCHER  = 'language-switcher-for-divi-polylang';

		/**
		 * Get the singleton instance.
		 *
		 * @param array $loader { text_domain, support_url, docs_url } of the plugin loading this file.
		 * @return TFP_Toolkit_Hub
		 */
		public static function instance( $loader = array() ) {
			if ( null === self::$instance ) {
				self::$loader   = wp_parse_args( $loader, self::$loader );
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor.
		 */
		private function __construct() {
			add_action( 'admin_menu', array( $this, 'register_menu' ), 20 );
			add_action( 'admin_menu', array( $this, 'reorder_submenu' ), 9999 );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
			add_action( 'admin_head', array( $this, 'print_submenu_style' ) );
			add_action( 'activated_plugin', array( $this, 'redirect_to_tool_dashboard' ) );
			add_action( 'wp_ajax_tfp_toggle_duplicate_content', array( $this, 'ajax_toggle_duplicate_content' ) );
			add_action( 'wp_ajax_tfp_toggle_language_inspector', array( $this, 'ajax_toggle_language_inspector' ) );
			// Strip third-party admin notices on the hub page only.
			add_action( 'in_admin_header', array( $this, 'suppress_foreign_notices' ), 1000 );
		}

		/**
		 * Whether the current request is the Toolkit hub screen.
		 *
		 * @return bool
		 */
		private function is_hub_page() {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only screen check.
			$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
			return self::PAGE === $page;
		}

		/**
		 * On page=toolkit-for-polylang, remove every admin notice callback,
		 * then re-open two dedicated hooks so only notices registered there
		 * can render (e.g. add_action( 'tfp_toolkit_admin_notices', ... )).
		 */
		public function suppress_foreign_notices() {
			if ( ! $this->is_hub_page() ) {
				return;
			}

			remove_all_actions( 'admin_notices' );
			remove_all_actions( 'all_admin_notices' );
			remove_all_actions( 'user_admin_notices' );
			remove_all_actions( 'network_admin_notices' );

			add_action( 'admin_notices', array( $this, 'render_hub_admin_notices' ) );
			add_action( 'all_admin_notices', array( $this, 'render_hub_all_admin_notices' ) );
		}

		/**
		 * Allowed notices for the hub: hook with tfp_toolkit_admin_notices.
		 */
		public function render_hub_admin_notices() {
			do_action( 'tfp_toolkit_admin_notices' );
		}

		/**
		 * Allowed "all" notices for the hub: hook with tfp_toolkit_all_admin_notices.
		 */
		public function render_hub_all_admin_notices() {
			do_action( 'tfp_toolkit_all_admin_notices' );
		}

		/**
		 * Save the "Duplicate Content Check" toggle to Translation Inspector's
		 * own onboarding option — the same option its setup wizard writes to
		 * (DUPCAP_Onboarding::TOOLS_OPTION_KEY), synced the same way it does
		 * (DUPCAP_Optin::sync_onboarding_data()) so this never drifts from
		 * what that plugin itself considers the source of truth.
		 */
		public function ajax_toggle_duplicate_content() {
			check_ajax_referer( 'tfp_toggle_duplicate_content', 'nonce' );

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'You are not allowed to do this.', self::$loader['text_domain'] ) ), 403 ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
			}

			if ( ! class_exists( 'DUPCAP_Onboarding' ) || ! class_exists( 'DUPCAP_Optin' ) ) {
				wp_send_json_error( array( 'message' => __( 'Translation Inspector is not active.', self::$loader['text_domain'] ) ), 400 ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
			}

			$enabled = isset( $_POST['enabled'] ) && '1' === sanitize_text_field( wp_unslash( $_POST['enabled'] ) );

			$tools = get_option( DUPCAP_Onboarding::TOOLS_OPTION_KEY, null );
			// Unanswered wizard = both tools on. Seed that before mutating one flag
			// so enabling/disabling Duplicate Content does not silently clear Language Inspector.
			if ( ! is_array( $tools ) || array() === $tools ) {
				$tools = array( 'inspector', 'duplicate' );
			} else {
				$tools = array_map( 'sanitize_key', $tools );
			}

			if ( $enabled ) {
				if ( ! in_array( 'duplicate', $tools, true ) ) {
					$tools[] = 'duplicate';
				}
			} else {
				$tools = array_values( array_diff( $tools, array( 'duplicate' ) ) );
			}

			// Protection rule: both features cannot be disabled at the same time.
			if ( ! in_array( 'duplicate', $tools, true ) && ! in_array( 'inspector', $tools, true ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'Both features cannot be disabled at the same time.', self::$loader['text_domain'] ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
					),
					400
				);
			}

			update_option( DUPCAP_Onboarding::TOOLS_OPTION_KEY, $tools, false );
			DUPCAP_Optin::sync_onboarding_data();

			$data = get_option( DUPCAP_Optin::ONBOARDING_DATA_OPTION, array() );
			wp_send_json_success( array( 'enabled' => ! empty( $data['duplicate_content'] ) ) );
		}

		/**
		 * Save the "Language Inspector" toggle to Translation Inspector's own
		 * onboarding option — same source of truth as Duplicate Content Check
		 * (DUPCAP_Onboarding::TOOLS_OPTION_KEY + DUPCAP_Optin::sync_onboarding_data()).
		 */
		public function ajax_toggle_language_inspector() {
			check_ajax_referer( 'tfp_toggle_language_inspector', 'nonce' );

			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( array( 'message' => __( 'You are not allowed to do this.', self::$loader['text_domain'] ) ), 403 ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
			}

			if ( ! class_exists( 'DUPCAP_Onboarding' ) || ! class_exists( 'DUPCAP_Optin' ) ) {
				wp_send_json_error( array( 'message' => __( 'Translation Inspector is not active.', self::$loader['text_domain'] ) ), 400 ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
			}

			$enabled = isset( $_POST['enabled'] ) && '1' === sanitize_text_field( wp_unslash( $_POST['enabled'] ) );

			$tools = get_option( DUPCAP_Onboarding::TOOLS_OPTION_KEY, null );
			// Unanswered wizard = both tools on. Seed that before mutating one flag
			// so enabling/disabling Language Inspector does not silently clear Duplicate Content.
			if ( ! is_array( $tools ) || array() === $tools ) {
				$tools = array( 'inspector', 'duplicate' );
			} else {
				$tools = array_map( 'sanitize_key', $tools );
			}

			if ( $enabled ) {
				if ( ! in_array( 'inspector', $tools, true ) ) {
					$tools[] = 'inspector';
				}
			} else {
				$tools = array_values( array_diff( $tools, array( 'inspector' ) ) );
			}

			// Protection rule: both features cannot be disabled at the same time.
			if ( ! in_array( 'inspector', $tools, true ) && ! in_array( 'duplicate', $tools, true ) ) {
				wp_send_json_error(
					array(
						'message' => __( 'Both features cannot be disabled at the same time.', self::$loader['text_domain'] ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
					),
					400
				);
			}

			update_option( DUPCAP_Onboarding::TOOLS_OPTION_KEY, $tools, false );
			DUPCAP_Optin::sync_onboarding_data();

			$data = get_option( DUPCAP_Optin::ONBOARDING_DATA_OPTION, array() );
			wp_send_json_success( array( 'enabled' => ! empty( $data['translation_inspector'] ) ) );
		}

		/**
		 * Real install/activation state of one of the three tools.
		 *
		 * @param string $plugin_basename One of the PLUGIN_* constants above.
		 * @return string 'active' | 'inactive' | 'not_installed'
		 */
		public static function tool_status( $plugin_basename ) {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			// AutoPoly free + pro: either counts as installed/active for the card.
			if ( self::PLUGIN_AUTOPOLY === $plugin_basename ) {
				if ( is_plugin_active( self::PLUGIN_AUTOPOLY_PRO ) || is_plugin_active( self::PLUGIN_AUTOPOLY ) ) {
					return 'active';
				}
				if ( file_exists( WP_PLUGIN_DIR . '/' . self::PLUGIN_AUTOPOLY_PRO ) || file_exists( WP_PLUGIN_DIR . '/' . self::PLUGIN_AUTOPOLY ) ) {
					return 'inactive';
				}
				return 'not_installed';
			}

			if ( is_plugin_active( $plugin_basename ) ) {
				return 'active';
			}

			if ( file_exists( WP_PLUGIN_DIR . '/' . $plugin_basename ) ) {
				return 'inactive';
			}

			return 'not_installed';
		}

		/**
		 * Basename to activate for the AutoPoly card.
		 * Prefer Pro when both Free and Pro are available on disk.
		 *
		 * @return string
		 */
		public static function autopoly_activate_basename() {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$pro_path = WP_PLUGIN_DIR . '/' . self::PLUGIN_AUTOPOLY_PRO;
			if ( file_exists( $pro_path ) && ! is_plugin_active( self::PLUGIN_AUTOPOLY_PRO ) ) {
				return self::PLUGIN_AUTOPOLY_PRO;
			}

			return self::PLUGIN_AUTOPOLY;
		}

		/**
		 * After activating one of the three tools (whether via the hub's own
		 * "Activate"/"Install" links or the real Plugins screen), land on
		 * that tool's dashboard instead of WordPress's default "back to the
		 * Plugins list" behaviour. Same technique AutoPoly's own bootstrap
		 * already uses for itself (`activated_plugin` + wp_safe_redirect);
		 * this covers all three tools from the one shared place.
		 *
		 * @param string $plugin Basename of the plugin that was just activated.
		 */
		public function redirect_to_tool_dashboard( $plugin ) {
			// AJAX activate (hub Install/Activate) returns JSON — JS handles redirect.
			if ( function_exists( 'wp_doing_ajax' ) && wp_doing_ajax() ) {
				return;
			}

			$map = array(
				self::PLUGIN_AUTOPOLY     => 'autopoly',
				self::PLUGIN_AUTOPOLY_PRO => 'autopoly',
				self::PLUGIN_INSPECTOR    => 'inspector',
				self::PLUGIN_SWITCHER     => 'switcher',
			);

			if ( ! isset( $map[ $plugin ] ) ) {
				return;
			}

			$tool = $map[ $plugin ];

			// Language Inspector feature off: do not open Inspector dashboard.
			if ( 'inspector' === $tool && ! self::is_language_inspector_feature_enabled() ) {
				wp_safe_redirect(
					add_query_arg(
						array(
							'page'      => self::PAGE,
							'tfp_focus' => 'inspector',
						),
						admin_url( 'admin.php' )
					)
				);
				exit;
			}

			wp_safe_redirect( self::tool_url( $tool ) );
			exit;
		}

		/**
		 * Whether the Language Inspector feature is enabled in Translation Inspector
		 * onboarding data (same default as the hub toggle: missing key = enabled).
		 *
		 * @return bool
		 */
		public static function is_language_inspector_feature_enabled() {
			$data = get_option( 'dupcap_onboarding_data', array() );
			return ! isset( $data['translation_inspector'] ) || ! empty( $data['translation_inspector'] );
		}

		/**
		 * Register the hub page under Polylang's Languages menu.
		 */
		public function register_menu() {
			add_submenu_page(
				'mlang',
				__( 'Toolkit for Polylang', self::$loader['text_domain'] ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain -- see $loader docblock above.
				__( 'Toolkit for Polylang', self::$loader['text_domain'] ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain
				'manage_options',
				self::PAGE,
				array( $this, 'render_page' )
			);
		}

		/**
		 * Render the hub dashboard page.
		 */
		public function render_page() {
			require __DIR__ . '/views/hub-dashboard.php';
		}

		/**
		 * Move "Toolkit for Polylang" to sit right after
		 * Polylang's own four items (Languages, Translations, Settings,
		 * Setup) and directly above the three tools, so the list reads as
		 * "Toolkit" followed by "its" tools instead of four flat, unordered
		 * entries. Same array_splice technique Translation Inspector's own
		 * admin class already uses to position itself in this menu.
		 */
		public function reorder_submenu() {
			global $submenu;

			if ( ! isset( $submenu['mlang'] ) || ! is_array( $submenu['mlang'] ) ) {
				return;
			}

			$our_index = null;
			$our_item  = null;

			foreach ( $submenu['mlang'] as $index => $item ) {
				if ( is_array( $item ) && isset( $item[2] ) && self::PAGE === (string) $item[2] ) {
					$our_index = $index;
					$our_item  = $item;
					break;
				}
			}

			if ( null === $our_index ) {
				return;
			}

			array_splice( $submenu['mlang'], $our_index, 1 );

			// Polylang's own items use its mlang_* slugs; insert right after
			// the last one of those (or at the top if none are found).
			$insert_at = 0;
			foreach ( $submenu['mlang'] as $index => $item ) {
				$slug = ( is_array( $item ) && isset( $item[2] ) ) ? (string) $item[2] : '';
				if ( 'mlang' === $slug || 0 === strpos( $slug, 'mlang_' ) ) {
					$insert_at = $index + 1;
				}
			}

			array_splice( $submenu['mlang'], $insert_at, 0, array( $our_item ) );
		}

		/**
		 * Bold "Toolkit for Polylang" and slightly indent the
		 * three tools under it, so the grouping is visible even when the
		 * current page isn't one of these (WP only bolds the current item
		 * by default).
		 */
		public function print_submenu_style() {
			$screen = get_current_screen();
			if ( ! $screen || false === strpos( (string) $screen->id, '_page_' ) ) {
				return;
			}
			?>
			<style>
				#toplevel_page_mlang .wp-submenu a[href*="page=<?php echo esc_js( self::PAGE ); ?>"] {
					font-weight: 600;
				}
				#toplevel_page_mlang .wp-submenu a[href*="page=polylang-atfp-dashboard"],
					#toplevel_page_mlang .wp-submenu a[href*="page=polylang-atfpp-dashboard"],
				#toplevel_page_mlang .wp-submenu a[href*="page=translation-inspector-polylang"],
				#toplevel_page_mlang .wp-submenu a[href*="page=lsdp-get-started"] {
					padding-left: 22px;
				}
			</style>
			<?php
		}


		/**
		 * Enqueue the hub's CSS. Loads on the hub page itself and on each
		 * tool's own dashboard page, since those also print the shared header.
		 */
		public function enqueue_assets() {
			// nonce verification is not required here — reading the current screen only.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';

			$toolkit_pages = array( self::PAGE, 'polylang-atfp-dashboard', 'polylang-atfpp-dashboard', 'translation-inspector-polylang', 'lsdp-get-started' );

			if ( ! in_array( $page, $toolkit_pages, true ) ) {
				return;
			}

			// Explicit dependency (belt-and-braces): 'dashicons' is normally
			// enqueued on every wp-admin screen already, but the "Check Docs"
			// icon uses it, so don't rely on load order to get it there.
			$tfp_deps = array( 'dashicons' );

			// Version by the file's own mtime, not a host plugin's version
			// constant: ATFP_V (or any tool's own version) does not change
			// when this shared file is edited, so the browser would keep
			// serving a stale cached copy across every change otherwise.
			$tfp_css_path = __DIR__ . '/css/toolkit-hub.css';
			$tfp_css_ver  = file_exists( $tfp_css_path ) ? filemtime( $tfp_css_path ) : false;

			wp_enqueue_style(
				'tfp-toolkit-hub',
				plugins_url( 'css/toolkit-hub.css', __FILE__ ),
				$tfp_deps,
				$tfp_css_ver
			);

			// The duplicate-content toggle only exists on the hub page itself.
			if ( self::PAGE !== $page ) {
				return;
			}

			$tfp_js_path = __DIR__ . '/js/toolkit-hub.js';
			$tfp_js_ver  = file_exists( $tfp_js_path ) ? filemtime( $tfp_js_path ) : false;

			wp_enqueue_script(
				'tfp-toolkit-hub',
				plugins_url( 'js/toolkit-hub.js', __FILE__ ),
				array( 'jquery' ),
				$tfp_js_ver,
				true
			);

			$domain = self::$loader['text_domain'];
			wp_localize_script(
				'tfp-toolkit-hub',
				'tfpToolkitHub',
				array(
					'ajaxUrl'        => admin_url( 'admin-ajax.php' ),
					'nonce'          => wp_create_nonce( 'tfp_toggle_duplicate_content' ),
					'inspectorNonce' => wp_create_nonce( 'tfp_toggle_language_inspector' ),
					'inspectorUrl'   => self::tool_url( 'inspector' ),
					'disabledText'   => __( 'Disabled', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
					'i18n'           => array(
						'activeText'            => __( 'Active', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'protectionRule'        => __( 'Both features cannot be disabled at the same time.', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'inspectorOn'           => __( 'Enabled', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'inspectorOff'          => __( 'Disabled', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'duplicateOn'           => __( 'Enabled', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'duplicateOff'          => __( 'Disabled', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						'inspectorDisabledCard' => __( 'Translation Inspector is disabled. Enable it in Toolkit controls below.', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
					),
				)
			);
		}

		/**
		 * Real dashboard URL for one of the three tools.
		 *
		 * @param string $tool 'autopoly' | 'inspector' | 'switcher'.
		 * @return string
		 */
		public static function tool_url( $tool ) {
			switch ( $tool ) {
				case 'autopoly':
					// Pro dashboard when Pro is active; Free page otherwise.
					if ( ! function_exists( 'is_plugin_active' ) ) {
						require_once ABSPATH . 'wp-admin/includes/plugin.php';
					}
					if ( is_plugin_active( self::PLUGIN_AUTOPOLY_PRO ) ) {
						return admin_url( 'admin.php?page=polylang-atfpp-dashboard&tab=dashboard' );
					}
					return admin_url( 'admin.php?page=polylang-atfp-dashboard&tab=dashboard' );
				case 'inspector':
					// Feature off in Toolkit controls -> hub + pulse the toggle.
					$inspector_on = self::is_language_inspector_feature_enabled();
					if ( function_exists( 'dupcap_is_tool_enabled' ) ) {
						$inspector_on = dupcap_is_tool_enabled( 'inspector' );
					}
					if ( ! $inspector_on ) {
						return add_query_arg(
							array(
								'page'      => self::PAGE,
								'tfp_focus' => 'inspector',
							),
							admin_url( 'admin.php' )
						);
					}
					if ( class_exists( 'DUPCAP_Admin' ) ) {
						return DUPCAP_Admin::page_url();
					}
					return admin_url( 'admin.php?page=translation-inspector-polylang' );
				case 'switcher':
					return admin_url( 'admin.php?page=lsdp-get-started' );
				default:
					return admin_url( 'admin.php?page=' . self::PAGE );
			}
		}

		/**
		 * "Install this tool" URL — WordPress core's own plugin-information
		 * popup, same pattern this plugin already uses for the Polylang notice.
		 *
		 * @param string $slug WordPress.org plugin slug.
		 * @return string
		 */
		public static function install_url( $slug ) {
			return admin_url( 'plugin-install.php?tab=plugin-information&plugin=' . $slug . '&TB_iframe=true' );
		}

		/**
		 * "Activate this tool" URL — WordPress core's own nonced activate link.
		 *
		 * @param string $plugin_basename One of the PLUGIN_* constants above.
		 * @return string
		 */
		public static function activate_url( $plugin_basename ) {
			if ( self::PLUGIN_AUTOPOLY === $plugin_basename ) {
				$plugin_basename = self::autopoly_activate_basename();
			}

			return wp_nonce_url(
				admin_url( 'plugins.php?action=activate&plugin=' . rawurlencode( $plugin_basename ) ),
				'activate-plugin_' . $plugin_basename
			);
		}

		/**
		 * Text domain of whichever copy of this class actually loaded.
		 *
		 * @return string
		 */
		public static function text_domain() {
			return self::$loader['text_domain'];
		}

		/**
		 * "Get Support" URL of whichever plugin's copy actually loaded.
		 *
		 * @return string
		 */
		public static function support_url() {
			return self::$loader['support_url'];
		}

		/**
		 * "Check Docs" URL of whichever plugin's copy actually loaded.
		 *
		 * @return string
		 */
		public static function docs_url() {
			return self::$loader['docs_url'];
		}

		/**
		 * The three tools, for the nav row — key => label/plugin.
		 *
		 * @return array<string, array{label: string, plugin: string}>
		 */
		private static function nav_tools() {
			$domain = self::$loader['text_domain'];

			return array(
				'inspector' => array(
					'label'  => __( 'Translation Inspector', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
					'plugin' => self::PLUGIN_INSPECTOR,
				),
				'autopoly'  => array(
					'label'  => __( 'AutoPoly', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
					'plugin' => self::PLUGIN_AUTOPOLY,
				),
				'switcher'  => array(
					'label'  => __( 'Language Switcher', $domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
					'plugin' => self::PLUGIN_SWITCHER,
				),
			);
		}

		/**
		 * Cross-nav between the three tools: "Translation Inspector | AutoPoly |
		 * Language Switcher". Meant to be dropped inside a header a plugin
		 * already has — it prints only the <nav>, no wrapping header markup.
		 *
		 * @param string $active_tool 'autopoly' | 'inspector' | 'switcher'.
		 */
		public static function render_nav( $active_tool ) {
			?>
			<nav class="tfp-nav" aria-label="<?php echo esc_attr__( 'Toolkit tools', self::$loader['text_domain'] ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>">
				<?php foreach ( self::nav_tools() as $tfp_key => $tfp_nav_tool ) : ?>
					<?php
					$tfp_is_active = ( 'active' === self::tool_status( $tfp_nav_tool['plugin'] ) );
					$tfp_is_here   = ( $tfp_key === $active_tool );
					if ( $tfp_is_active ) {
						$tfp_href = self::tool_url( $tfp_key );
					} else {
						// Hub + focus so Install/Activate on that card pulses until clicked.
						$tfp_href = add_query_arg(
							array(
								'page'        => self::PAGE,
								'tfp_install' => $tfp_key,
							),
							admin_url( 'admin.php' )
						);
					}
					// Plain text menu links (not buttons). Active uses WP primary blue;
					// inactive (and not-installed) use #0f172a.
					if ( $tfp_is_here ) {
						$tfp_nav_class = 'tfp-nav-item active';
					} elseif ( ! $tfp_is_active ) {
						$tfp_nav_class = 'tfp-nav-item not-installed';
					} else {
						$tfp_nav_class = 'tfp-nav-item';
					}
					?>
					<a href="<?php echo esc_url( $tfp_href ); ?>" class="<?php echo esc_attr( $tfp_nav_class ); ?>"><?php echo esc_html( $tfp_nav_tool['label'] ); ?></a>
				<?php endforeach; ?>
			</nav>
			<?php
		}

		/**
		 * The hub page's own header. Uses the same ".atfp-dashboard-header"
		 * class names as every tool's own dashboard, but toolkit-hub.css
		 * styles them itself — it does not depend on AutoPoly's
		 * admin-styles.css being loaded, so the hub still looks right on a
		 * site where AutoPoly isn't installed (whichever plugin's copy of
		 * this class loads, the hub looks the same). Title/logo are plain
		 * text here, not a link — this already is "home"; every tool's own
		 * header links here instead.
		 */
		public static function render_header() {
			$domain = self::$loader['text_domain'];
			?>
			<div class="atfp-dashboard-header">
				<div class="atfp-dashboard-header-left">
					<span class="tfp-logo" aria-hidden="true"></span>
					<h2 class="atfp-dashboard-logo-text"><?php echo esc_html__( 'Toolkit for Polylang', $domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></h2>
				</div>
				<div class="atfp-dashboard-header-right">
					<a href="<?php echo esc_url( self::support_url() ); ?>" class="tfp-header-btn tfp-header-btn-support" target="_blank" rel="noopener noreferrer">
						<?php echo esc_html__( 'Get Support', $domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>
					</a>
					<a href="<?php echo esc_url( self::docs_url() ); ?>" class="tfp-header-btn tfp-header-btn-docs" target="_blank" rel="noopener noreferrer">
						<span class="dashicons dashicons-media-document tfp-header-btn-icon" aria-hidden="true"></span>
						<?php echo esc_html__( 'Check Docs', $domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>
					</a>
				</div>
			</div>
			<?php
		}
	}

}
