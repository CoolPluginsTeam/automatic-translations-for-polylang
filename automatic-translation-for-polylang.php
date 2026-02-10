<?php
/*
Plugin Name: AutoPoly - AI Translation For Polylang
Plugin URI: https://coolplugins.net/
Version: 1.4.8
Author: Cool Plugins
Author URI: https://coolplugins.net/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugin_list
Description: AutoPoly - AI Translation For Polylang simplifies your translation process by automatically translating all pages/posts content from one language to another.
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: automatic-translations-for-polylang
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'ATFP_V' ) ) {
	define( 'ATFP_V', '1.4.8' );
}
if ( ! defined( 'ATFP_DIR_PATH' ) ) {
	define( 'ATFP_DIR_PATH', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'ATFP_URL' ) ) {
	define( 'ATFP_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'ATFP_FILE' ) ) {
	define( 'ATFP_FILE', __FILE__ );
}

if ( ! defined( 'ATFP_FEEDBACK_API' ) ) {
	define( 'ATFP_FEEDBACK_API', "https://feedback.coolplugins.net/" );
}

if ( ! class_exists( 'AutoPoly' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- AutoPoly is our plugin name.
	final class AutoPoly {

		/**
		 * Plugin instance.
		 *
		 * @var AutoPoly
		 * @access private
		 */
		private static $instance = null;

		/**
		 * Get plugin instance.
		 *
		 * @return AutoPoly
		 * @static
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}
		/**
		 * Constructor
		 */
		private function __construct() {
			$this->atfp_load_files();
			add_action( 'plugins_loaded', array( $this, 'atfp_init' ) );
			register_activation_hook( ATFP_FILE, array( $this, 'atfp_activate' ) );
			register_deactivation_hook( ATFP_FILE, array( $this, 'atfp_deactivate' ) );
			add_action( 'admin_menu', array( $this, 'atfp_add_submenu_page' ), 11 );
			add_action( 'admin_enqueue_scripts', array( $this, 'atfp_set_dashboard_style' ) );
			add_action('admin_init', array($this, 'atfp_admin_notice'));
			add_action('init', array($this, 'atfp_translation_string_migration'));
			add_action( 'activated_plugin', array( $this, 'atfp_plugin_redirection' ) );
			
			// Initialize cron
			$this->init_cron();

			// Initialize feedback notice.
			$this->init_feedback_notice();
			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'atfp_plugin_action_links' ) );

			// nonce verification is not required here because we are not using the nonce here.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$page=isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';

			// Add the action to hide unrelated notices
			if($page == 'polylang-atfp-dashboard'){
				add_action('admin_print_scripts', array($this, 'atfp_hide_unrelated_notices'));
			}

			add_action('current_screen', array($this, 'atfp_append_view_languages_link'));
		}

		public function atfp_plugin_action_links($links) {
			$atfp_utm_parameters='utm_source=atfp_plugin';

			if(class_exists('ATFP_Helper')){
				$atfp_utm_parameters=ATFP_Helper::utm_source_text();
			}

			$links[] = '<a href="https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=plugin_list" target="_blank">' . __( 'Buy Pro', 'automatic-translations-for-polylang' ) . '</a>';
			return $links;
		}

		public function atfp_plugin_redirection($plugin) {
			if ( ! is_plugin_active( 'polylang/polylang.php' ) && ! is_plugin_active( 'polylang-pro/polylang.php' ) ) {
				return false;
			}

			if(defined('ATFPP_V')){
				return false;
			}

			if ( $plugin == plugin_basename( __FILE__ ) ) {
				wp_safe_redirect(
					esc_url( admin_url( 'admin.php?page=polylang-atfp-dashboard&tab=dashboard' ) )
				);
				exit;
			}
		}

		public static function atfp_translation_string_migration(){
			$previous_version=get_option('atfp-v', false);
			$migration_status=get_option('atfp_translation_string_migration', false);

			if($previous_version && version_compare($previous_version, '1.4.0', '<') && !$migration_status){
				ATFP_Helper::translation_data_migration();
			}

		}

		/**
		 * Enqueue editor CSS for the supported blocks page.
		 */
		public function atfp_set_dashboard_style( $hook ) {
			// nonce verification is not required here
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$page=isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';
			if($page == 'polylang-atfp-dashboard') {
				wp_enqueue_style( 'atfp-dashboard-style', ATFP_URL . 'admin/atfp-dashboard/css/admin-styles.css',null, ATFP_V, 'all' );
				wp_enqueue_script( 'atfp-dashboard-script', ATFP_URL . 'admin/atfp-dashboard/js/atfp-data-share-setting.js', array('jquery'), ATFP_V, true );
			}
		}

		/**
		 * Initialize the cron job for the plugin.
		 */
		public function init_cron(){
			// if (is_admin()) {
			require_once ATFP_DIR_PATH . '/admin/cpfm-feedback/cron/atfp-cron.php';
			$cron = new ATFP_cronjob();
			$cron->atfp_cron_init_hooks();
			// }
			}

			/**
			 * Initialize the feedback notice for the plugin.
			 */

			public function init_feedback_notice() {
				if (is_admin()) {
	
					if(!class_exists('CPFM_Feedback_Notice')){
						require_once ATFP_DIR_PATH . '/admin/cpfm-feedback/cpfm-common-notice.php';

					}
	
				add_action('cpfm_register_notice', function () {
					if (!class_exists('CPFM_Feedback_Notice') || !current_user_can('manage_options')) {
						return;
					}
					
					$notice = [
						'title' => __('AutoPoly - AI Translation For Polylang', 'automatic-translations-for-polylang'),
						'message' => __('Help us make this plugin more compatible with your site by sharing non-sensitive site data.', 'automatic-translations-for-polylang'),
						'pages' => ['polylang-atfp-dashboard'],
						'always_show_on' => ['polylang-atfp-dashboard'], // This enables auto-show
						'plugin_name'=>'atfp'
					];
					CPFM_Feedback_Notice::cpfm_register_notice('cool_translations', $notice);
						if (!isset($GLOBALS['cool_plugins_feedback'])) {
							// cool_plugins is our company name
							// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
							$GLOBALS['cool_plugins_feedback'] = [];
						}
						// cool_plugins is our company name
						// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
						$GLOBALS['cool_plugins_feedback']['cool_translations'][] = $notice;
				});
	
				add_action('cpfm_after_opt_in_atfp', function($category) {
					if ($category === 'cool_translations') {
						ATFP_cronjob::atfp_send_data();
						$options = get_option('atfp_feedback_opt_in');
						$options = 'yes';
						update_option('atfp_feedback_opt_in', $options);	
					}
				  });
				}
			}

		/*
		|------------------------------------------------------------------------
		|  Hide unrelated notices
		|------------------------------------------------------------------------
		*/

		public function atfp_hide_unrelated_notices()
			{ // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded, Generic.Metrics.NestingLevel.MaxExceeded
				$cfkef_pages = false;

				// nonce verification is not required here because we are not using the nonce here.
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$page=isset($_GET['page']) ? sanitize_text_field(wp_unslash($_GET['page'])) : '';

				if($page == 'polylang-atfp-dashboard'){
					$cfkef_pages = true;
				}

				if ($cfkef_pages) {
					global $wp_filter;
					// Define rules to remove callbacks.
					$rules = [
						'user_admin_notices' => [], // remove all callbacks.
						'admin_notices'      => [],
						'all_admin_notices'  => [],
						'admin_footer'       => [
							'render_delayed_admin_notices', // remove this particular callback.
						],
					];
					$notice_types = array_keys($rules);
					foreach ($notice_types as $notice_type) {
						if (empty($wp_filter[$notice_type]->callbacks) || ! is_array($wp_filter[$notice_type]->callbacks)) {
							continue;
						}
						$remove_all_filters = empty($rules[$notice_type]);
						foreach ($wp_filter[$notice_type]->callbacks as $priority => $hooks) {
							foreach ($hooks as $name => $arr) {
								if (is_object($arr['function']) && is_callable($arr['function'])) {
									if ($remove_all_filters) {
										unset($wp_filter[$notice_type]->callbacks[$priority][$name]);
									}
									continue;
								}
								$class = ! empty($arr['function'][0]) && is_object($arr['function'][0]) ? strtolower(get_class($arr['function'][0])) : '';
								// Remove all callbacks except WPForms notices.
								if ($remove_all_filters && strpos($class, 'wpforms') === false) {
									unset($wp_filter[$notice_type]->callbacks[$priority][$name]);
									continue;
								}
								$cb = is_array($arr['function']) ? $arr['function'][1] : $arr['function'];
								// Remove a specific callback.
								if (! $remove_all_filters) {
									if (in_array($cb, $rules[$notice_type], true)) {
										unset($wp_filter[$notice_type]->callbacks[$priority][$name]);
									}
									continue;
								}
							}
						}
					}
				}

				add_action( 'admin_notices', [ $this, 'atfp_admin_notices' ], PHP_INT_MAX );
			}

		function atfp_admin_notices() {
			do_action( 'atfp_display_admin_notices' );
		}


		/*
		|------------------------------------------------------------------------
		|  Get user info
		|------------------------------------------------------------------------
		*/

		public static function atfp_get_user_info() {
			global $wpdb;
			$server_info = [
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			'server_software'        => sanitize_text_field(wp_unslash($_SERVER['SERVER_SOFTWARE'] ?? 'N/A')),
			// no cache needed for this query it will run only once in 30 days and it is a valid query for getting mysql version.
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching 
			'mysql_version'          => sanitize_text_field($wpdb->get_var("SELECT VERSION()")),
			'php_version'            => sanitize_text_field(phpversion()),
			'wp_version'             => sanitize_text_field(get_bloginfo('version')),
			'wp_debug'               => sanitize_text_field(defined('WP_DEBUG') && WP_DEBUG ? 'Enabled' : 'Disabled'),
			'wp_memory_limit'        => sanitize_text_field(ini_get('memory_limit')),
			'wp_max_upload_size'     => sanitize_text_field(ini_get('upload_max_filesize')),
			'wp_permalink_structure' => sanitize_text_field(get_option('permalink_structure', 'Default')),
			'wp_multisite'           => sanitize_text_field(is_multisite() ? 'Enabled' : 'Disabled'),
			'wp_language'            => sanitize_text_field(get_option('WPLANG', get_locale()) ?: get_locale()),
			'wp_prefix'              => sanitize_key($wpdb->prefix), // Sanitizing database prefix
			];
			$theme_data = [
			'name'      => sanitize_text_field(wp_get_theme()->get('Name')),
			'version'   => sanitize_text_field(wp_get_theme()->get('Version')),
			'theme_uri' => esc_url(wp_get_theme()->get('ThemeURI')),
			];
			if (!function_exists('get_plugins')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}
			$plugin_data = array_map(function ($plugin) {
			$plugin_info = get_plugin_data(WP_PLUGIN_DIR . '/' . sanitize_text_field($plugin));
			$author_url = ( isset( $plugin_info['AuthorURI'] ) && !empty( $plugin_info['AuthorURI'] ) ) ? esc_url( $plugin_info['AuthorURI'] ) : 'N/A';
			$plugin_url = ( isset( $plugin_info['PluginURI'] ) && !empty( $plugin_info['PluginURI'] ) ) ? esc_url( $plugin_info['PluginURI'] ) : '';
			return [
				'name'       => sanitize_text_field($plugin_info['Name']),
				'version'    => sanitize_text_field($plugin_info['Version']),
				'plugin_uri' => !empty($plugin_url) ? $plugin_url : $author_url,
			];
			}, get_option('active_plugins', []));
			return [
				'server_info' => $server_info,
				'extra_details' => [
					'wp_theme' => $theme_data,
					'active_plugins' => $plugin_data,
				]
			];
		}

		/**
		 * Add submenu page under the Polylang menu.
		 */
		public function atfp_add_submenu_page() {
			if(defined('ATFPP_V')){
				return;
			}

			add_submenu_page(
				'mlang', // Parent slug
				__( 'AutoPoly - AI Translation For Polylang', 'automatic-translations-for-polylang' ), // Page title
				__( 'AutoPoly', 'automatic-translations-for-polylang' ), // Menu title
				'manage_options', // Capability
				'polylang-atfp-dashboard', // Menu slug
				array( $this, 'atfp_render_dashboard_page' ) // Callback function
			);
		}

		public function atfp_render_dashboard_page() {
			$file_prefix = 'admin/atfp-dashboard/views/';
			
			$valid_tabs = [
				'dashboard'       => __('Dashboard', 'automatic-translations-for-polylang'),
				'ai-translations' => __('AI Translations', 'automatic-translations-for-polylang'),
				'settings'        => __('Settings', 'automatic-translations-for-polylang'),
				'license'         => __('License', 'automatic-translations-for-polylang'),
				'free-vs-pro'     => __('Free vs Pro', 'automatic-translations-for-polylang'),
				'support-blocks'  => __('Supported Blocks', 'automatic-translations-for-polylang')
			];
	
			// Get current tab with fallback
	
			// nonce verification is not required here because we are not using the nonce here.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$tab 			= isset($_GET['tab']) ? sanitize_key(wp_unslash($_GET['tab'])) : 'dashboard';
			$current_tab 	= array_key_exists($tab, $valid_tabs) ? $tab : 'dashboard';
			
			$atfp_utm_parameters='utm_source=atfp_plugin';

			if(class_exists('ATFP_Helper')){
				$atfp_utm_parameters=ATFP_Helper::utm_source_text();
			}

			// Action buttons configuration
			$buttons = [
				[
					'url' => 'https://coolplugins.net/support/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=support&utm_content=dashboard_header',
					'img' => 'contact.svg',
					'alt' => __('contact', 'automatic-translations-for-polylang')
				]
			];
	
			// Start HTML output
			?>
			<div class="atfp-dashboard-wrapper">
				<div class="atfp-dashboard-header">
					<div class="atfp-dashboard-header-left">
						<a href="?page=polylang-atfp-dashboard&tab=dashboard" class="atfp-dashboard-logo-link">
							<img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-logo.svg'); ?>" alt="<?php esc_attr_e('Polylang Addon Logo', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-dashboard-tab-title">
							<span>↳</span> <?php echo esc_html($valid_tabs[$current_tab]); ?>
						</div>
					</div>
					<div class="atfp-dashboard-header-right">
						<span><?php echo esc_html('AutoPoly - AI Translation For Polylang'); ?></span>
						<?php foreach ($buttons as $button): ?>
							<a href="<?php echo esc_url($button['url']); ?>" 
							class="atfp-dashboard-btn" 
							target="_blank"
							aria-label="<?php echo isset($button['alt']) ? esc_attr($button['alt']) : ''; ?>">
								<img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/' . $button['img']); ?>" 
									alt="<?php echo esc_attr($button['alt']); ?>">
								<?php if (isset($button['text'])): ?>
									<span><?php echo esc_html($button['text']); ?></span>
								<?php endif; ?>
							</a>
						<?php endforeach; ?>
					</div>
				</div>
				
				<nav class="nav-tab-wrapper" aria-label="<?php esc_attr_e('Dashboard navigation', 'automatic-translations-for-polylang'); ?>">
					<?php foreach ($valid_tabs as $tab_key => $tab_title): ?>
						<a href="?page=polylang-atfp-dashboard&tab=<?php echo esc_attr($tab_key); ?>" 
						class="nav-tab <?php echo esc_attr($tab === $tab_key ? 'nav-tab-active' : ''); ?>">
							<?php echo esc_html($tab_title); ?>
						</a>
					<?php endforeach; ?>
				</nav>
				
				<div class="tab-content">
					<?php
					require_once ATFP_DIR_PATH . $file_prefix . $current_tab . '.php';
					if($current_tab !== 'support-blocks'){
						require_once ATFP_DIR_PATH . $file_prefix . 'sidebar.php';
					}
					
					?>
				</div>
				
				<?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
			</div>
			<?php
			//Append view languages link in page
		}

		public function atfp_append_view_languages_link($current_screen) {
			if(is_admin()) {

				global $polylang;
        
				if(!$polylang || !property_exists($polylang, 'model')){
					return;
				}

				$translated_post_types = $polylang->model->get_translated_post_types();
				$translated_post_types = array_keys($translated_post_types);

				if(!in_array($current_screen->post_type, $translated_post_types)){
					return;
				}

				add_filter( "views_{$current_screen->id}", array($this, 'list_table_views_filter') );
			}
		}

		public function list_table_views_filter($views) {
			if(!function_exists('PLL') || !function_exists('pll_count_posts') || !function_exists('get_current_screen') || !property_exists(PLL(), 'model') || !function_exists('pll_current_language')){
				return $views;
			}

			$pll_languages =  PLL()->model->get_languages_list();
			$current_screen=get_current_screen();
			$index=0;
			$total_languages=count($pll_languages);
			$pll_active_languages=pll_current_language();
			
			$post_type=isset($current_screen->post_type) ? $current_screen->post_type : '';
			// nonce verification is not required here because we are not using the nonce here.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$post_status=(isset($_GET['post_status']) && 'trash' === sanitize_text_field(wp_unslash($_GET['post_status']))) ? 'trash' : 'publish';
			$all_translated_post_count=0;
			$list_html='';
			if(count($pll_languages) > 1){
				echo "<div class='atfp_subsubsub' style='display:none; clear:both;'>
					<ul class='subsubsub atfp_subsubsub_list'>";
					foreach($pll_languages as $lang){
	
						$flag=isset($lang->flag) ? $lang->flag : '';
						$language_slug=isset($lang->slug) ? $lang->slug : '';
						$current_class=$pll_active_languages && $pll_active_languages == $language_slug ? 'current' : '';
						$translated_post_count=pll_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>$post_status));

						if('publish' === $post_status){
							$draft_post_count=pll_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>'draft'));
							$translated_post_count+=$draft_post_count;

							$pending_post_count=pll_count_posts($language_slug, array('post_type'=>$post_type, 'post_status'=>'pending'));
							$translated_post_count+=$pending_post_count;
						}

						$all_translated_post_count+=$translated_post_count;
						$list_html.="<li class='atfp_pll_lang_".esc_attr($language_slug)."'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=".esc_attr($language_slug)."' class='".esc_attr($current_class)."'>".esc_html( wp_kses( $lang->name, array() ) )." <span class='count'>(".esc_html($translated_post_count).")</span></a>".($index < $total_languages-1 ? ' |&nbsp;' : '')."</li>";
						$index++;
					}

					echo "<li class='atfp_pll_lang_all'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=all"."' class=''>All Languages<span class='count'>(".esc_html($all_translated_post_count).")</span></a> |&nbsp;</li>";

					$allowed = [
						'ul'   => [ 'class' => true ],
						'ol'   => [ 'class' => true ],
						'li'   => [ 'class' => true ],
						'a'    => [ 'href' => true, 'title' => true, 'target' => true, 'rel' => true ],
						'span' => [ 'class' => true, 'aria-hidden' => true ],
						'strong' => [],
						'em'     => [],
					];
					
				echo wp_kses( (string) $list_html, $allowed );
				echo "</ul>
				</div>";
			}

			return $views;
		}

		public function atfp_load_files() {
			if(!class_exists('Atfp_Dashboard')) {
				require_once ATFP_DIR_PATH . 'admin/cpt_dashboard/cpt_dashboard.php';
				new Atfp_Dashboard();
			}

			require_once ATFP_DIR_PATH . '/helper/class-atfp-helper.php';
			require_once ATFP_DIR_PATH . 'admin/atfp-menu-pages/class-atfp-custom-block-post.php';
			require_once ATFP_DIR_PATH . 'includes/class-atfp-register-backend-assets.php';
			require_once ATFP_DIR_PATH . '/includes/bulk-translation/class-atfp-bulk-translation.php';
			require_once ATFP_DIR_PATH . 'includes/elementor-translate/class-atfp-elementor-translate.php';
		}
		/**
		 * Initialize the Automatic Translation for Polylang plugin.
		 *
		 * @return void
		 */
		function atfp_init() {
			if ( is_admin() ) {
				require_once ATFP_DIR_PATH . 'admin/feedback/atfp-users-feedback.php';
			}
		}

		public function atfp_admin_notice(){
			// Check Polylang plugin is installed and active
			global $polylang;
			$atfp_polylang = $polylang;
			if ( isset( $atfp_polylang ) && is_admin() ) {

				require_once ATFP_DIR_PATH . '/helper/class-atfp-ajax-handler.php';
				if ( class_exists( 'ATFP_Ajax_Handler' ) ) {
					ATFP_Ajax_Handler::get_instance();
				}

				add_action( 'add_meta_boxes', array( $this, 'atfp_shortcode_metabox' ) );

				if(class_exists('ATFP_Bulk_Translation')) {
					ATFP_Bulk_Translation::get_instance();
				}

				$this->atfp_register_backend_assets();

				$this->atfp_initialize_elementor_translation();

				// Review Notice
				if(class_exists('Atfp_Dashboard') && !defined('ATFPP_V')) {
					Atfp_Dashboard::review_notice(
						'atfp', // Required
						'AutoPoly - AI Translation For Polylang', // Required
						'https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post', // Required
					);
				}
			} else {
				add_action( 'admin_notices', array( self::$instance, 'atfp_plugin_required_admin_notice' ) );
			}
		}

		/**
		 * Display admin notice for required plugin activation.
		 *
		 * @return void
		 */
		function atfp_plugin_required_admin_notice() {
			if ( current_user_can( 'activate_plugins' ) ) {
				$url         = 'plugin-install.php?tab=plugin-information&plugin=polylang&TB_iframe=true';
				$title       = 'Polylang';
				$plugin_info = get_plugin_data( __FILE__, true, true );
				echo '<div class="error"><p>' .
				sprintf(
					// translators: 1: Plugin Name, 2: Plugin URL
					esc_html__(
						'In order to use %1$s plugin, please install and activate the latest version  of %2$s',
						'automatic-translations-for-polylang'
					),
					wp_kses( '<strong>' . esc_html( $plugin_info['Name'] ) . '</strong>', 'strong' ),
					wp_kses( '<a href="' . esc_url( $url ) . '" class="thickbox" title="' . esc_attr( $title ) . '">' . esc_html( $title ) . '</a>', 'a' )
				) . '.</p></div>';
			}
		}

		/**
		 * Register backend assets for Automatic Translation for Polylang plugin.
		 *
		 * @return void
		 */
		function atfp_register_backend_assets() {
			if(class_exists('ATFP_Register_Backend_Assets')) {
				ATFP_Register_Backend_Assets::get_instance();
			}
		}

		/**
		 * Initialize Elementor Translation.
		 *
		 * @return void
		 */
		function atfp_initialize_elementor_translation() {
			if(class_exists('ATFP_Elementor_Translate')) {
				ATFP_Elementor_Translate::get_instance();
			}
		}

		/**
		 * Register and display the automatic translation metabox.
		 */
		function atfp_shortcode_metabox() {
			if ( isset( $_GET['from_post'], $_GET['new_lang'], $_GET['_wpnonce'] ) &&
				 wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
				$post_id = isset( $_GET['from_post'] ) ? absint( $_GET['from_post'] ) : 0;

				if ( 0 === $post_id ) {
					return;
				}

				$editor = '';
				if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) ) {
					$editor = 'Elementor';
				}
				if ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) ) {
					$editor = 'Divi';
				}

				$current_screen = get_current_screen();
				if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() && ! in_array( $editor, array( 'Elementor', 'Divi' ), true ) ) {
					if ( 'post-new.php' === $GLOBALS['pagenow'] && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {
						global $post;

						if ( ! ( $post instanceof WP_Post ) ) {
							return;
						}

						if ( ! function_exists( 'PLL' ) || ! PLL()->model->is_translated_post_type( $post->post_type ) ) {
							return;
						}
						add_meta_box( 'atfp-meta-box', __( 'Automatic Translate', 'automatic-translations-for-polylang' ), array( $this, 'atfp_shortcode_text' ), null, 'side', 'high' );
					}
				}
			}
		}

		/**
		 * Display the automatic translation metabox button.
		 */
		function atfp_shortcode_text() {
			if ( isset( $_GET['_wpnonce'] ) &&
				 wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'new-post-translation' ) ) {
				$target_language = '';
				$source_language = isset($_GET['from_post']) ? pll_get_post_language(absint( $_GET['from_post'] ), 'name') : '';
				if ( function_exists( 'PLL' ) ) {
					$target_code = isset( $_GET['new_lang'] ) ? sanitize_key( $_GET['new_lang'] ) : '';
					$languages   = PLL()->model->get_languages_list();
					foreach ( $languages as $lang ) {
						if ( $lang->slug === $target_code ) {
							$target_language = $lang->name;
						}
					}
				}
				?>
				<input type="button" class="button button-primary" name="atfp_meta_box_translate" id="atfp-translate-button" value="<?php echo esc_attr__( 'Translate Page', 'automatic-translations-for-polylang' ); ?>" readonly/><br><br>
				<p style="margin-bottom: .5rem;"><?php
				// translators: 1: Source language, 2: Target language
				echo esc_html( sprintf( __( 'Translate or duplicate content from %1$s to %2$s', 'automatic-translations-for-polylang' ), $source_language, $target_language ) ); ?></p>
				<?php
				if(class_exists('Atfp_Dashboard') && !Atfp_Dashboard::atfp_hide_review_notice_status('atfp')){
					?>
					<hr>
					<div class="atfp-review-meta-box">
					<p><?php echo esc_html__( 'We hope you find our plugin helpful for your translation needs. Your feedback is valuable to us!', 'automatic-translations-for-polylang' ); ?>
					<br>
					<a href="<?php echo esc_url( 'https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post' ); ?>" class="components-button is-primary is-small" target="_blank"><?php echo esc_html__( 'Rate Us', 'automatic-translations-for-polylang' ); ?><span> ★★★★★</span></a>
					</p>
					</div>
					<?php
				}
			}
		}

		/*
		|----------------------------------------------------------------------------
		| Run when activate plugin.
		|----------------------------------------------------------------------------
		*/
		public static function atfp_activate() {
			self::atfp_translation_string_migration();
			update_option( 'atfp-v', ATFP_V );
			update_option( 'atfp-type', 'FREE' );
			update_option( 'atfp-installDate', gmdate( 'Y-m-d h:i:s' ) );

			if(!get_option('atfp-install-date')) {
				add_option('atfp-install-date', gmdate('Y-m-d h:i:s'));
			}

			if (!get_option( 'atfp_initial_save_version' ) ) {
				add_option( 'atfp_initial_save_version', ATFP_V );
			}

			$get_opt_in = get_option('atfp_feedback_opt_in');
			
			if ($get_opt_in =='yes' && !wp_next_scheduled('atfp_extra_data_update')) {

				wp_schedule_event(time(), 'every_30_days', 'atfp_extra_data_update');
			}
		}

		/*
		|----------------------------------------------------------------------------
		| Run when de-activate plugin.
		|----------------------------------------------------------------------------
		*/
		public static function atfp_deactivate() {
			wp_clear_scheduled_hook('atfp_extra_data_update');
		}

	}

}

// AutoPoly is our plugin name and it is used to call the plugin instance
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
function ATFP_AutoPoly() {
	return AutoPoly::get_instance();
}

// AutoPoly is our plugin name and it is used to call the plugin instance
// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$ATFP_AutoPoly = ATFP_AutoPoly(); 
