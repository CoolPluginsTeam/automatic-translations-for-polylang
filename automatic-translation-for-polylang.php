<?php
/*
Plugin Name: Automatic Translations For Polylang
Plugin URI: https://coolplugins.net/
Version: 1.0.0
Author: Cool Plugins
Author URI: https://coolplugins.net/
Description: Streamline your Polylang experience with this plugin that not only duplicates content but also translates core and specific blocks across multiple languages.
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: automatic-translation-for-polylang
*/


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'ATFP_VERSION' ) ) {
	define( 'ATFP_VERSION', '1.0.0' );
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



if ( ! class_exists( 'ATFP' ) ) {
	final class ATFP {

		/**
		 * Plugin instance.
		 *
		 * @var ATFP
		 * @access private
		 */
		private static $instance = null;

		/**
		 * Get plugin instance.
		 *
		 * @return ATFP
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
			add_action( 'plugins_loaded', array( $this, 'atfp_init' ) );
			register_activation_hook( ATFP_FILE, array( $this, 'atfp_activate' ) );
			register_deactivation_hook( ATFP_FILE, array( $this, 'atfp_deactivate' ) );
		}

		function atfp_init() {
			require_once ATFP_DIR_PATH . '/helper/class-atfp-ajax-handler.php';

			if ( class_exists( 'ATFP_Ajax_Handler' ) ) {
				ATFP_Ajax_Handler::get_instance();
			}

			// Check Polylang plugin is installed and active
			global $polylang;
			if ( isset( $polylang ) ) {
				add_action( 'add_meta_boxes', array( $this, 'atfp_shortcode_metabox' ) );
				add_action( 'admin_enqueue_scripts', array( $this, 'atfp_register_backend_assets' ) ); // registers js and css for frontend
			} else {
				add_action( 'admin_notices', array( self::$instance, 'atfp_plugin_required_admin_notice' ) );
			}
			load_plugin_textdomain( 'automatic-translation-for-polylang', false, basename( dirname( __FILE__ ) ) . '/languages/' );
		}

		function atfp_plugin_required_admin_notice() {
			if ( current_user_can( 'activate_plugins' ) ) {
				$url         = 'plugin-install.php?tab=plugin-information&plugin=polylang&TB_iframe=true';
				$title       = 'Polylang';
				$plugin_info = get_plugin_data( __FILE__, true, true );
				echo '<div class="error"><p>' .
				/*
				 * translators: 1: Plugin Name, 2: Plugin URL, 3: Plugin Title
				 */
				sprintf(
					__(
						'In order to use <strong>%1$s</strong> plugin, please install and activate the latest version  of <a href="%2$s" class="thickbox" title="%3$s">%4$s</a>',
						'automatic-translation-for-polylang'
					),
					$plugin_info['Name'],
					esc_url( $url ),
					esc_attr( $title ),
					esc_attr( $title )
				) . '.</p></div>';

				if ( function_exists( 'deactivate_plugins' ) ) {
					  deactivate_plugins( __FILE__ );
				}
			}
		}


		function atfp_register_backend_assets() {
			$current_screen = get_current_screen();

			if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
				wp_register_style( 'atfp-automatic-translate', ATFP_URL . 'assets/css/atfp-custom.min.css', ATFP_VERSION );

				$editor_script_asset = require_once ATFP_DIR_PATH . 'assets/build/index.asset.php';
				wp_register_script( 'atfp-automatic-translate', ATFP_URL . 'assets/build/index.js', $editor_script_asset['dependencies'], $editor_script_asset['version'], true );

				$from_post_id = isset( $_GET['from_post'] ) ? (int) filter_var( $_GET['from_post'], FILTER_SANITIZE_NUMBER_INT ) : false;

				global $post;

				if ( null === $post ) {
					return;
				}

				$editor = '';
				if ( false === $from_post_id ) {
					return;
				}
				if ( has_blocks( $from_post_id ) ) {
					$editor = 'Gutenberg';
				}
				if ( get_post_meta( $from_post_id, '_elementor_edit_mode', true ) === 'builder' ) {
					$editor = 'Elementor';
				}
				if ( get_post_meta( $from_post_id, '_et_pb_use_builder', true ) === 'on' ) {
					$editor = 'Divi';
				}

				if ( in_array( $editor, array( 'Elementor', 'Divi' ) ) ) {
					return;
				}

				$languages = PLL()->model->get_languages_list();

				$lang_object = array();
				foreach ( $languages as $lang ) {
					$lang_object[ $lang->slug ] = $lang->name;
				}

				$post_translate = PLL()->model->is_translated_post_type( $post->post_type );
				$lang           = isset( $_GET['new_lang'] ) ? htmlspecialchars( $_GET['new_lang'] ) : false;
				$post_type      = isset( $_GET['post_type'] ) ? htmlspecialchars( $_GET['post_type'] ) : false;

				if ( false !== $from_post_id && $post_translate && $lang && $post_type ) {
					wp_enqueue_style( 'atfp-automatic-translate' );
					wp_enqueue_script( 'atfp-automatic-translate' );

					wp_localize_script(
						'atfp-automatic-translate',
						'atfp_ajax_object',
						array(
							'ajax_url'           => admin_url( 'admin-ajax.php' ),
							'ajax_nonce'         => wp_create_nonce( 'atfp_translate_nonce' ),
							'atfp_url'           => ATFP_URL,
							'action_fetch'       => 'fetch_post_content',
							'action_block_rules' => 'block_parsing_rules',
							'source_lang'        => pll_get_post_language( $from_post_id, 'slug' ),
							'languageObject'     => $lang_object,
						)
					);
				}
			}

		}



		function atfp_shortcode_metabox() {
			$current_screen = get_current_screen();

			$post_id = isset( $_GET['from_post'] ) ? (int) filter_var( $_GET['from_post'], FILTER_SANITIZE_NUMBER_INT ) : false;

			$editor = '';
			if ( false === $post_id ) {
				return;
			}
			if ( has_blocks( $post_id ) ) {
				$editor = 'Gutenberg';
			}
			if ( get_post_meta( $post_id, '_elementor_edit_mode', true ) === 'builder' ) {
				$editor = 'Elementor';
			}
			if ( get_post_meta( $post_id, '_et_pb_use_builder', true ) === 'on' ) {
				$editor = 'Divi';
			}

			if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() && ! in_array( $editor, array( 'Elementor', 'Divi' ) ) ) {
				if ( $GLOBALS['pagenow'] == 'post-new.php' && isset( $_GET['from_post'], $_GET['new_lang'] ) ) {

					global $post;

					if ( ! ( $post instanceof WP_Post ) ) {
						return;
					}

					if ( ! PLL()->model->is_translated_post_type( $post->post_type ) ) {
						return;
					}
					add_meta_box( 'my-meta-box-id', __( 'Automatic Translate Content from Original Post', 'automatic-translation-for-polylang' ), array( $this, 'atfp_shortcode_text' ), null, 'side', 'high' );
				}
			}

		}

		function atfp_shortcode_text() {
			?>
			 <input type="button" class="button button-primary" name="atfp_meta_box_translate" id="atfp-translate-button" value="
				<?php
					echo __( 'Translate Content (Beta)', 'automatic-translation-for-polylang' );
				?>
			 " readonly/><br><br>
			<?php
		}

		/*
		|----------------------------------------------------------------------------
		| Run when activate plugin.
		|----------------------------------------------------------------------------
		*/
		public static function atfp_activate() {
			update_option( 'atfp-v', ATFP_VERSION );
			update_option( 'atfp-type', 'FREE' );
			update_option( 'atfp-installDate', date( 'Y-m-d h:i:s' ) );
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

function ATFP() {
	return ATFP::get_instance();
}

$ATFP = ATFP();
