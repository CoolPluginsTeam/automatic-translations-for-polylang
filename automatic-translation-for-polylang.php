<?php
/*
Plugin Name: AI Translation For Polylang
Plugin URI: https://coolplugins.net/
Version: 1.4.0
Author: Cool Plugins
Author URI: https://coolplugins.net/
Description: AI Translation for Polylang simplifies your translation process by automatically translating all pages/posts content from one language to another.
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: automatic-translations-for-polylang
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'ATFP_V' ) ) {
	define( 'ATFP_V', '1.4.0' );
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

if ( ! class_exists( 'Automatic_Translations_For_Polylang' ) ) {
	final class Automatic_Translations_For_Polylang {

		/**
		 * Plugin instance.
		 *
		 * @var Automatic_Translations_For_Polylang
		 * @access private
		 */
		private static $instance = null;

		/**
		 * Get plugin instance.
		 *
		 * @return Automatic_Translations_For_Polylang
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
			add_action('init', array($this, 'load_plugin_textdomain'));
			add_action( 'admin_menu', array( $this, 'atfp_add_submenu_page' ), 11 );
			add_action( 'admin_enqueue_scripts', array( $this, 'atfp_set_dashboard_style' ) );
			add_action('init', array($this, 'atfp_translation_string_migration'));
			add_action('admin_menu', array($this, 'atfp_add_support_blocks_submenu_page'), 12);
			add_action( 'activated_plugin', array( $this, 'atfp_plugin_redirection' ) );

			// Add the action to hide unrelated notices
			if(isset($_GET['page']) && $_GET['page'] == 'polylang-atfp-dashboard'){
				add_action('admin_print_scripts', array($this, 'atfp_hide_unrelated_notices'));
			}

			add_action('current_screen', array($this, 'atfp_append_view_languages_link'));
		}

		public function atfp_plugin_redirection($plugin) {
			if ( ! is_plugin_active( 'polylang/polylang.php' ) && ! is_plugin_active( 'polylang-pro/polylang.php' ) ) {
				return false;
			}

			if ( $plugin == plugin_basename( __FILE__ ) ) {
				exit( wp_redirect( admin_url( 'admin.php?page=polylang-atfp-dashboard&tab=dashboard' ) ) );
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
			if(isset($_GET['page']) && $_GET['page'] == 'polylang-atfp-dashboard') {
				wp_enqueue_style( 'atfp-dashboard-style', ATFP_URL . 'admin/atfp-dashboard/css/admin-styles.css',null, ATFP_V, 'all' );
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

				if(isset($_GET['page']) && $_GET['page'] == 'polylang-atfp-dashboard'){
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

		/**
		 * Add submenu page under the Polylang menu.
		 */
		public function atfp_add_submenu_page() {
			add_submenu_page(
				'mlang', // Parent slug
				__( 'Polylang - Auto Translate Addon', 'automatic-translations-for-polylang' ), // Page title
				__( 'Polylang - Auto Translate Addon', 'automatic-translations-for-polylang' ), // Menu title
				'manage_options', // Capability
				'polylang-atfp-dashboard', // Menu slug
				array( $this, 'atfp_render_dashboard_page' ) // Callback function
			);
		}

		// Add submenu page for support blocks
		public function atfp_add_support_blocks_submenu_page() {
			add_submenu_page(
				'mlang', // Parent slug
				__( 'Support Blocks', 'automatic-translations-for-polylang' ), // Page title
				__( '↳ Support Blocks', 'automatic-translations-for-polylang' ), // Menu title
				'manage_options', // Capability
				'polylang-atfp-dashboard&tab=support-blocks', // Menu slug (unique slug for submenu page)
				array( $this, 'atfp_render_dashboard_page' ) // Callback function
			);
		}

		public function atfp_render_dashboard_page() {
			$text_domain = 'automatic-translations-for-polylang';
			$file_prefix = 'admin/atfp-dashboard/views/';
			
			$valid_tabs = [
				'dashboard'       => __('Dashboard', $text_domain),
				// 'ai-translations' => __('AI Translations', $text_domain),
				'settings'        => __('Settings', $text_domain),
				'license'         => __('License', $text_domain),
				'free-vs-pro'     => __('Free vs Pro', $text_domain),
				'support-blocks'  => __('Support Blocks', $text_domain)
			];
	
			// Get current tab with fallback
	
			$tab 			= isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'dashboard';
			$current_tab 	= array_key_exists($tab, $valid_tabs) ? $tab : 'dashboard';
			
			// Action buttons configuration
			$buttons = [
				[
					'url'  => 'https://coolplugins.net/product/ai-translation-for-polylang-pro/',
					'img'  => 'upgrade-now.svg',
					'alt'  => __('premium', $text_domain),
					'text' => __('Unlock Pro Features', $text_domain)
				],
				[
					'url' => 'https://docs.coolplugins.net/docs/ai-translation-for-polylang/',
					'img' => 'document.svg',
					'alt' => __('document', $text_domain)
				],
				[
					'url' => 'https://coolplugins.net/support/?utm_source=tpa_plugin&utm_medium=inside&utm_campaign=support&utm_content=dashboard_header',
					'img' => 'contact.svg',
					'alt' => __('contact', $text_domain)
				]
			];
	
			// Start HTML output
			?>
			<div class="atfp-dashboard-wrapper">
				<div class="atfp-dashboard-header">
					<div class="atfp-dashboard-header-left">
						<img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-logo.svg'); ?>" 
							alt="<?php esc_attr_e('Polylang Addon Logo', $text_domain); ?>">
						<div class="atfp-dashboard-tab-title">
							<span>↳</span> <?php echo esc_html($valid_tabs[$current_tab]); ?>
						</div>
					</div>
					<div class="atfp-dashboard-header-right">
						<span><?php esc_html_e('Auto translate pages and posts.', $text_domain); ?></span>
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
				
				<nav class="nav-tab-wrapper" aria-label="<?php esc_attr_e('Dashboard navigation', $text_domain); ?>">
					<?php foreach ($valid_tabs as $tab_key => $tab_title): ?>
						<a href="?page=polylang-atfp-dashboard&tab=<?php echo esc_attr($tab_key); ?>" 
						class="nav-tab <?php echo esc_attr($tab === $tab_key ? 'nav-tab-active' : ''); ?>">
							<?php echo esc_html($tab_title); ?>
						</a>
					<?php endforeach; ?>
				</nav>
				
				<div class="tab-content">
					<?php
					require_once ATFP_DIR_PATH . $file_prefix . $tab . '.php';
					if($tab !== 'support-blocks'){
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
			$post_status=(isset($_GET['post_status']) && 'trash' === sanitize_text_field(wp_unslash($_GET['post_status']))) ? 'trash' : 'publish';

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
						// echo $flag; // phpcs:ignore WordPress.Security.EscapeOutput
						echo "<li class='atfp_pll_lang_".esc_attr($language_slug)."'><a href='edit.php?post_type=".esc_attr($post_type)."&lang=".esc_attr($language_slug)."' class='".esc_attr($current_class)."'>".esc_html($lang->name)." <span class='count'>(".esc_html($translated_post_count).")</span></a>".($index < $total_languages-1 ? ' |&nbsp;' : '')."</li>";
						$index++;
					}
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
			require_once ATFP_DIR_PATH . 'includes/elementor-translate/class-atfp-elementor-translate.php';
		}
		/**
		 * Initialize the Automatic Translation for Polylang plugin.
		 *
		 * @return void
		 */
		function atfp_init() {
			// Check Polylang plugin is installed and active
			global $polylang;
			$atfp_polylang = $polylang;
			if ( isset( $atfp_polylang ) && is_admin() ) {

				require_once ATFP_DIR_PATH . '/helper/class-atfp-ajax-handler.php';
				if ( class_exists( 'ATFP_Ajax_Handler' ) ) {
					ATFP_Ajax_Handler::get_instance();
				}

				add_action( 'add_meta_boxes', array( $this, 'atfp_shortcode_metabox' ) );
				$this->atfp_register_backend_assets();

				$this->atfp_initialize_elementor_translation();

				// Review Notice
				if(class_exists('Atfp_Dashboard') && !defined('ATFPP_V')) {
					Atfp_Dashboard::review_notice(
						'atfp', // Required
						'AI Translation For Polylang', // Required
						'https://wordpress.org/plugins/automatic-translations-for-polylang/reviews/#new-post', // Required
						ATFP_URL .'assets/images/ai-automatic-translation-for-polylang.png' // Required
					);
				}

			} else {
				add_action( 'admin_notices', array( self::$instance, 'atfp_plugin_required_admin_notice' ) );
			}

			if ( is_admin() ) {
				require_once ATFP_DIR_PATH . 'admin/feedback/atfp-users-feedback.php';
			}
		}

		/**
		 * Load plugin textdomain.
		 */
		public function load_plugin_textdomain() {
			load_plugin_textdomain( 'automatic-translations-for-polylang', false, basename( dirname( __FILE__ ) ) . '/languages/' );
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
				$source_language = pll_get_post_language(absint( $_GET['from_post'] ), 'name');
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
				<p style="margin-bottom: .5rem;"><?php echo esc_html( sprintf( __( 'Translate or duplicate content from %s to %s', 'automatic-translations-for-polylang' ), $source_language, $target_language ) ); ?></p>
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
		}

		/*
		|----------------------------------------------------------------------------
		| Run when de-activate plugin.
		|----------------------------------------------------------------------------
		*/
		public static function atfp_deactivate() {
		}

	}

}

function Automatic_Translations_For_Polylang() {
	return Automatic_Translations_For_Polylang::get_instance();
}

$Automatic_Translations_For_Polylang = Automatic_Translations_For_Polylang();
