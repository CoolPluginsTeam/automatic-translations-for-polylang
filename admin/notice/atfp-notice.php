<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Notices' ) ) :

	final class ATFP_Notices {

		private static $instance = null;

		private $notice_data_cache = array();

		private function __construct() {
			add_action( 'admin_notices', array( $this, 'language_switcher_notice' ) );
			add_action( 'admin_footer', array( $this, 'language_switcher_sidebar_notice' ) );
			add_action( 'wp_ajax_atfp_notice_dismiss', array( $this, 'atfp_notice_dismiss' ) );
		}

		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		private function get_language_switcher_notice_config( $notice_option = 'dupcap-lsdp-notice' ) {
			return array(
				'notice_option'       => $notice_option,
				'icon'                => 'dashicons-translation',
				'title'               => __( 'Add a Language Switcher', 'automatic-translations-for-polylang' ),
				'description'         => __( 'Did you know? You can add a customizable language switcher to help visitors easily browse your website in their preferred language.', 'automatic-translations-for-polylang' ),
				'description_sidebar' => __( 'Let visitors browse in their preferred language with Language Switcher for Polylang for Elementor, Gutenberg, and Divi.', 'automatic-translations-for-polylang' ),
				'active_constant'     => 'LSDP',
				'plugin_file'         => 'language-switcher-for-divi-polylang/language-switcher-for-divi-polylang.php',
				'plugin_slug'         => 'language-switcher-for-divi-polylang',
			);
		}

		private function get_plugin_notice_data( $config ) {
			$notice_option = isset( $config['notice_option'] ) ? $config['notice_option'] : '';

			if ( '' !== $notice_option && isset( $this->notice_data_cache[ $notice_option ] ) ) {
				return $this->notice_data_cache[ $notice_option ];
			}

			if ( get_option( $notice_option ) === 'yes' ||
				( ! current_user_can( 'install_plugins' ) && ! current_user_can( 'activate_plugins' ) ) ) {
				return $this->cache_notice_data( $notice_option, false );
			}

			if ( ! empty( $config['active_constant'] ) && defined( $config['active_constant'] ) ) {
				return $this->cache_notice_data( $notice_option, false );
			}

			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$plugin_file = isset( $config['plugin_file'] ) ? $config['plugin_file'] : '';
			if ( '' !== $plugin_file && is_plugin_active( $plugin_file ) ) {
				return $this->cache_notice_data( $notice_option, false );
			}

			$all_plugins  = get_plugins();
			$is_installed = isset( $all_plugins[ $plugin_file ] );

			$data = array(
				'action'              => $is_installed ? 'activate' : 'install',
				'button_text'         => $is_installed ? __( 'Activate Now', 'automatic-translations-for-polylang' ) : __( 'Install Now', 'automatic-translations-for-polylang' ),
				'nonce'               => wp_create_nonce( 'atfp_install_nonce' ),
				'dismiss_nonce'       => wp_create_nonce( 'atfp_lsdp_notice' ),
				'notice_option'       => $notice_option,
				'icon'                => isset( $config['icon'] ) ? $config['icon'] : 'dashicons-translation',
				'title'               => isset( $config['title'] ) ? $config['title'] : '',
				'description'         => isset( $config['description'] ) ? $config['description'] : '',
				'description_sidebar' => isset( $config['description_sidebar'] ) ? $config['description_sidebar'] : '',
				'plugin_slug'         => isset( $config['plugin_slug'] ) ? $config['plugin_slug'] : '',
			);

			return $this->cache_notice_data( $notice_option, $data );
		}

		private function cache_notice_data( $notice_option, $data ) {
			if ( '' !== $notice_option ) {
				$this->notice_data_cache[ $notice_option ] = $data;
			}
			return $data;
		}

		private function maybe_render_notice( $notice_option, $layout ) {
			$data = $this->get_plugin_notice_data( $this->get_language_switcher_notice_config( $notice_option ) );
			if ( $data ) {
				$this->render_notice( $data, $layout );
			}
		}

		private function render_notice( $data, $layout = 'admin' ) {
			wp_enqueue_style( 'atfp-marketing-notice', ATFP_URL . 'admin/notice/assets/css/markting-notice.css', array(), ATFP_V );
			wp_enqueue_script( 'atfp-language-switcher-notice', ATFP_URL . 'admin/notice/assets/js/atfp-language-switcher-notice.js', array( 'jquery' ), ATFP_V, true );

			if ( 'sidebar' === $layout ) {
				?>
				<div id="atfp-lsdp-ml-box-notice" class="notice notice-info inline atfp-lsdp-card-wrapper" style="display:none;" data-notice="<?php echo esc_attr( $data['notice_option'] ); ?>" data-nonce="<?php echo esc_attr( $data['dismiss_nonce'] ); ?>" data-url="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
					<div class="atfp-lsdp-card-icon"><span class="dashicons <?php echo esc_attr( $data['icon'] ); ?>"></span></div>
					<p class="atfp-lsdp-card-title"><strong><?php echo esc_html( $data['title'] ); ?></strong></p>
					<p class="atfp-lsdp-card-description"><?php echo esc_html( $data['description_sidebar'] ); ?></p>
					<button type="button" class="button button-primary atfp-install-plugin" data-action="<?php echo esc_attr( $data['action'] ); ?>" data-slug="<?php echo esc_attr( $data['plugin_slug'] ); ?>" data-nonce="<?php echo esc_attr( $data['nonce'] ); ?>">
						<span class="atfp-btn-text"><?php echo esc_html( $data['button_text'] ); ?></span>
					</button>
					<div class="atfp-install-message" style="margin-top: 5px; color: #d63638;"></div>
					<button type="button" class="notice-dismiss atfp-dismiss-btn"><span class="screen-reader-text"><?php esc_html_e( 'Dismiss this notice.', 'automatic-translations-for-polylang' ); ?></span></button>
				</div>
				<?php
				return;
			}

			echo '<div class="notice notice-info is-dismissible atfp-lsdp-card-wrapper" data-notice="' . esc_attr( $data['notice_option'] ) . '" data-nonce="' . esc_attr( $data['dismiss_nonce'] ) . '" data-url="' . esc_url( admin_url( 'admin-ajax.php' ) ) . '">
					<p class="atfp-admin-card-title"><span class="dashicons ' . esc_attr( $data['icon'] ) . '"></span><strong>' . esc_html( $data['title'] ) . '</strong> ' . esc_html( $data['description'] ) . ' <button type="button" class="button button-primary atfp-install-plugin" style="margin-left: 10px;" data-action="' . esc_attr( $data['action'] ) . '" data-slug="' . esc_attr( $data['plugin_slug'] ) . '" data-nonce="' . esc_attr( $data['nonce'] ) . '"><span class="atfp-btn-text">' . esc_html( $data['button_text'] ) . '</span></button></p>
					<div class="atfp-install-message" style="margin-top: 5px; color: #d63638;"></div>
				</div>';
		}

		public function language_switcher_notice() {
			$screen = get_current_screen();
			if ( ! $screen ) {
				return;
			}

			$page           = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
			$polylang_pages = array( 'mlang', 'mlang_strings', 'mlang_settings' );

			if ( ! in_array( $page, $polylang_pages, true ) && 'edit-page' !== $screen->id && 'plugins' !== $screen->id ) {
				return;
			}

			$this->maybe_render_notice( 'dupcap-lsdp-notice', 'admin' );
		}

		public function language_switcher_sidebar_notice() {
			$screen = get_current_screen();
			if ( ! $screen || 'post' !== $screen->base ) {
				return;
			}

			$this->maybe_render_notice( 'dupcap-lsdp-sidebar-notice', 'sidebar' );
		}

		public function atfp_notice_dismiss() {
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( __( 'Unauthorized access.', 'automatic-translations-for-polylang' ) );
			}

			if ( ! check_ajax_referer( 'atfp_lsdp_notice', 'nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
			}

			$notice_dismiss  = ! empty( $_POST['atfp_lsdp_dismiss'] );
			$notice_option   = isset( $_POST['notice_option'] ) ? sanitize_key( wp_unslash( $_POST['notice_option'] ) ) : 'dupcap-lsdp-notice';
			$allowed_options = array( 'dupcap-lsdp-notice', 'dupcap-lsdp-sidebar-notice' );

			if ( $notice_dismiss && in_array( $notice_option, $allowed_options, true ) ) {
				update_option( $notice_option, 'yes' );
			}

			wp_send_json_success();
		}
	}

endif;

ATFP_Notices::get_instance();
