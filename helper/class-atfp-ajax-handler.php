<?php
/**
 * ATFP Ajax Handler
 *
 * @package ATFP
 */

/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handle ATFP ajax requests
 */
if ( ! class_exists( 'ATFP_Ajax_Handler' ) ) {
	class ATFP_Ajax_Handler {
		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;
		/**
		 * Stores custom block data for processing and retrieval.
		 *
		 * This static array holds the data related to custom blocks that are
		 * used within the plugin. It can be utilized to manage and manipulate
		 * the custom block information as needed during AJAX requests.
		 *
		 * @var array
		 */
		private $custom_block_data_array = array();

		/**
		 * Gets an instance of our plugin.
		 *
		 * @param object $settings_obj timeline settings.
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor.
		 *
		 * @param object $settings_obj Plugin settings.
		 */
		public function __construct() {
			if ( is_admin() ) {
				add_action( 'wp_ajax_atfp_fetch_post_content', array( $this, 'fetch_post_content' ) );
				add_action( 'wp_ajax_atfp_block_parsing_rules', array( $this, 'block_parsing_rules' ) );
				add_action( 'wp_ajax_atfp_get_custom_blocks_content', array( $this, 'get_custom_blocks_content' ) );
				add_action( 'wp_ajax_atfp_update_custom_blocks_content', array( $this, 'update_custom_blocks_content' ) );
				add_action('wp_ajax_atfp_update_translate_data', array($this, 'atfp_update_translate_data'));
				add_action( 'wp_ajax_atfp_update_elementor_data', array( $this, 'update_elementor_data' ) );
				add_action( 'wp_ajax_atfp_update_enabled_providers', array( $this, 'update_enabled_providers' ) );
				add_action( 'wp_ajax_atfp_install_plugin', array( $this, 'atfp_install_plugin' ) );

			}
		}

		/**
		 * Block Parsing Rules
		 *
		 * Handles the block parsing rules AJAX request.
		 */
		public function block_parsing_rules() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			if(!current_user_can('manage_options')){
				wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
				wp_die( '0', 403 );
			}

			$block_parse_rules = ATFP_Helper::get_instance()->get_block_parse_rules();

			$data = array(
				'blockRules' => json_encode( $block_parse_rules ),
			);

			return wp_send_json_success( $data );
			exit;
		}

		/**
		 * Fetches post content via AJAX request.
		 */
		public function fetch_post_content() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$post_id = absint(isset( $_POST['postId'] ) ? (int) filter_var( wp_unslash($_POST['postId']), FILTER_SANITIZE_NUMBER_INT ) : false);
			
			if(!current_user_can('edit_post', $post_id)){
				wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
				wp_die( '0', 403 );
			}

			if ( false !== $post_id ) {
				$post_data = get_post( absint($post_id) );
                $locale = isset($_POST['local']) ? sanitize_text_field(wp_unslash($_POST['local'])) : 'en';
                $current_locale = isset($_POST['current_local']) ? sanitize_text_field(wp_unslash($_POST['current_local'])) : 'en';

				$content = $post_data->post_content;
				$content = ATFP_Helper::replace_links_with_translations($content, $locale, $current_locale);

				$meta_fields=get_post_meta($post_id);

				$data    = array(
					'title'   => $post_data->post_title,
					'excerpt' => $post_data->post_excerpt,
					'content' => $content,
					'metaFields' => $meta_fields
				);

				return wp_send_json_success( $data );
			} else {
				wp_send_json_error( __( 'Invalid Post ID.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
			}

			exit;
		}

		public function get_custom_blocks_content() {
			if ( ! check_ajax_referer( 'atfp_block_update_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			if(!current_user_can('manage_options')){
				wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
				wp_die( '0', 403 );
			}

			$custom_content = get_option( 'atfp_custom_block_data', false ) ? get_option( 'atfp_custom_block_data', false ) : false;

			if ( $custom_content && is_string( $custom_content ) && ! empty( trim( $custom_content ) ) ) {
				return wp_send_json_success( array( 'block_data' => $custom_content ) );
			} else {
				return wp_send_json_success( array( 'message' => __( 'No custom blocks found.', 'automatic-translations-for-polylang' ) ) );
			}
			exit();
		}

		public function update_custom_blocks_content() {
			if ( ! check_ajax_referer( 'atfp_block_update_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
			}

			if(!current_user_can('edit_posts')){
				wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
				wp_die( '0', 403 );
			}

			// no need to sanitize here because we are using sanitize according to data type where have using this data.
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$json = isset($_POST['save_block_data']) ? wp_unslash($_POST['save_block_data']) : false;
			$updated_blocks_data = json_decode($json, true);
			if(json_last_error() !== JSON_ERROR_NONE){ 
				wp_send_json_error( __( 'Invalid JSON', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
			}

			if ( $updated_blocks_data ) {
				$block_parse_rules = ATFP_Helper::get_instance()->get_block_parse_rules();

				if ( isset( $block_parse_rules['AtfpBlockParseRules'] ) ) {
					$previous_translate_data = get_option( 'atfp_custom_block_translation', false );
					if ( $previous_translate_data && ! empty( $previous_translate_data ) ) {
						$this->custom_block_data_array = $previous_translate_data;
					}

					foreach ( $updated_blocks_data as $key => $block_data ) {
						$this->verify_block_data( array( $key ), $block_data, $block_parse_rules['AtfpBlockParseRules'][ $key ] );
					}

					if ( count( $this->custom_block_data_array ) > 0 ) {
						update_option( 'atfp_custom_block_translation', $this->custom_block_data_array );
					}

					delete_option( 'atfp_custom_block_data' );

				}
			}

			return wp_send_json_success( array( 'message' => __( 'Automatic Translation for Polylang: Custom Blocks data updated successfully', 'automatic-translations-for-polylang' ) ) );
		}

		private function verify_block_data( $id_keys, $value, $block_rules ) {
			$block_rules = is_object( $block_rules ) ? json_decode( json_encode( $block_rules ) ) : $block_rules;

			if ( ! isset( $block_rules ) ) {
				return $this->create_nested_attribute( $value,$id_keys );
			}
			if ( is_object( $value ) && isset( $block_rules ) ) {
				foreach ( $value as $key => $item ) {
					if ( isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->verify_block_data( array_merge( $id_keys, array( $key ) ), $item, $block_rules[ $key ], false );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && true === $item ) {
						$this->create_nested_attribute(  true,array_merge( $id_keys, array( $key ) ) );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->create_nested_attribute(  $item,array_merge( $id_keys, array( $key ) ) );
						continue;
					}
				}
			}
		}

		private function create_nested_attribute( $value,$id_keys = array() ) {
			$value = is_object( $value ) ? json_decode( json_encode( $value ), true ) : $value;

			$current_array = &$this->custom_block_data_array;

			foreach ( $id_keys as $index => $id ) {
				$index_id=gettype($id) === 'integer' ? intval($id) : sanitize_text_field($id);

				if ( ! isset( $current_array[ $id ] ) ) {
					$current_array[ $index_id ] = array();
				}

				$current_array = &$current_array[ $index_id ];
			}

			$current_array = $this->sanitize_block_data($value);
		}

		private function sanitize_block_data($data){
			 // Handle arrays.
			 if ( is_array( $data ) ) {
				foreach ( $data as $key => $value ) {
					$data[ sanitize_text_field($key) ] = $this->sanitize_block_data( $value );
				}
				return $data;
			}
		
			// Handle objects.
			if ( is_object( $data ) ) {
				foreach ( $data as $key => $value ) {
					$key = sanitize_text_field($key);
					$data->$key = $this->sanitize_block_data( $value );
				}
				return $data;
			}
		
			// Handle scalar values.
			if ( is_string( $data ) ) {
				return sanitize_text_field( wp_unslash( $data ) );
			}
		
			if ( is_int( $data ) ) {
				return absint( $data );
			}
		
			if ( is_float( $data ) ) {
				return floatval( $data );
			}
		
			if ( is_bool( $data ) ) {
				return (bool) $data;
			}
		
			// Null or unknown type.
			return $data;
		}

		public function atfp_update_translate_data() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}

			$post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;

			// Require capability based on context
			if ( $post_id > 0 ) {
				if ( ! current_user_can('edit_post', $post_id) ) {
					wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
					wp_die( '0', 403 );
				}
			} else {
				if ( ! current_user_can('manage_options') ) {
					wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
					wp_die( '0', 403 );
				}
			}

			$provider = isset($_POST['provider']) ? sanitize_text_field(wp_unslash($_POST['provider'])) : '';
			$total_string_count = isset($_POST['totalStringCount']) ? absint(wp_unslash($_POST['totalStringCount'])) : 0;
			$total_word_count = isset($_POST['totalWordCount']) ? absint(wp_unslash($_POST['totalWordCount'])) : 0;
			$total_char_count = isset($_POST['totalCharacterCount']) ? absint(wp_unslash($_POST['totalCharacterCount'])) : 0;
			$editor_type = isset($_POST['editorType']) ? sanitize_text_field(wp_unslash($_POST['editorType'])) : '';
			$date = isset($_POST['date']) ? gmdate('Y-m-d H:i:s', strtotime(sanitize_text_field(wp_unslash($_POST['date'])))) : '';
			$source_string_count = isset($_POST['sourceStringCount']) ? absint(wp_unslash($_POST['sourceStringCount'])) : 0;
			$source_word_count = isset($_POST['sourceWordCount']) ? absint(wp_unslash($_POST['sourceWordCount'])) : 0;
			$source_char_count = isset($_POST['sourceCharacterCount']) ? absint(wp_unslash($_POST['sourceCharacterCount'])) : 0;
			$source_lang = isset($_POST['sourceLang']) ? sanitize_text_field(wp_unslash($_POST['sourceLang'])) : '';
			$target_lang = isset($_POST['targetLang']) ? sanitize_text_field(wp_unslash($_POST['targetLang'])) : '';
			$time_taken = isset($_POST['timeTaken']) ? absint(wp_unslash($_POST['timeTaken'])) : 0;

			if (class_exists('Atfp_Dashboard')) {
				$translation_data = array(
					'post_id' => $post_id,
					'service_provider' => $provider,
					'source_language' => $source_lang,
					'target_language' => $target_lang,
					'time_taken' => $time_taken,
					'string_count' => $total_string_count,
					'word_count' => $total_word_count,
					'character_count' => $total_char_count,
					'source_string_count' => $source_string_count,
					'source_word_count' => $source_word_count,
					'source_character_count' => $source_char_count,
					'editor_type' => $editor_type,
					'date_time' => $date,
					'version_type' => 'free'
				);

				Atfp_Dashboard::store_options(
					'atfp',
					'post_id', 
					'update',
					$translation_data
				);

				wp_send_json_success(array(
					'message' => __('Translation data updated successfully', 'automatic-translations-for-polylang')
				));
			} else {
				wp_send_json_error(array(
					'message' => __('Atfp_Dashboard class not found', 'automatic-translations-for-polylang') 
				));
			}
			exit;
		}

		/**
         * Handle AJAX request to update Elementor data.
         */
        public function update_elementor_data() {
			if ( ! check_ajax_referer( 'atfp_translate_nonce', 'atfp_nonce', false ) ) {
				wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}
			$post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
			if ( ! $post_id || ! current_user_can('edit_post', $post_id) ) {
				wp_send_json_error( __( 'Unauthorized', 'automatic-translations-for-polylang' ), 403 );
				wp_die( '0', 403 );
			}
			
			// Optional hardening: enforce valid JSON if not using Elementor Document API
			if ( isset($_POST['elementor_data']) && is_string($_POST['elementor_data']) ) {
				// no need to sanitize we are not using this data this is only for json_decode content type checking.
				// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				$decoded = json_decode( wp_unslash($_POST['elementor_data'] ), true );
				if ( json_last_error() !== JSON_ERROR_NONE ) {
					wp_send_json_error( __( 'Invalid data.', 'automatic-translations-for-polylang' ), 400 );
					wp_die( '0', 400 );
				}
			}
			
            $elementor_data = isset($_POST['elementor_data']) ? sanitize_text_field(wp_unslash($_POST['elementor_data'])) : '';
		
			// Check if the current post has Elementor data
			if($elementor_data && '' !== $elementor_data){
				if(class_exists('Elementor\Plugin')){
					$plugin=\Elementor\Plugin::$instance;
					$document=$plugin->documents->get($post_id);
					
					// no need to sanitize elementor data internally sanitized and prevent page content formatting break issue.
					// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					$elementor_data=json_decode(wp_unslash($_POST['elementor_data']), true);

					if (json_last_error() !== JSON_ERROR_NONE) {
						wp_send_json_error( __( 'Invalid Elementor data.', 'automatic-translations-for-polylang' ), 400 );
						wp_die( '0', 400 );
					}
						
					$document->save( [
						'elements' => $elementor_data,
					] );

					$plugin->files_manager->clear_cache();
					update_post_meta($post_id, '_atfp_elementor_translated', 'true');
				}
			}
				
            wp_send_json_success( 'Elementor data updated.' );
			exit;
        }

        public function update_enabled_providers() {
            if ( ! check_ajax_referer( 'atfp_update_enabled_providers', 'update_providers_key', false ) ) {
                wp_send_json_error( __( 'Invalid security token sent.', 'automatic-translations-for-polylang' ) );
                wp_die( '0', 400 );
                exit();
            }

			$enabled_providers = isset($_POST['enabled_providers']) ? sanitize_text_field(wp_unslash($_POST['enabled_providers'])) : '';
			if(json_last_error() !== JSON_ERROR_NONE){
				wp_send_json_error( __( 'Invalid JSON.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}
			$enabled_providers = json_decode($enabled_providers, true);
			if(!is_array($enabled_providers)){
				wp_send_json_error( __( 'Invalid enabled providers.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}
			
			$valid_providers = array('chrome-built-in-ai', 'yandex-translate');

			$updated_providers = array();

			foreach($enabled_providers as $provider_key => $status){
				if(in_array($provider_key, $valid_providers) && $status === true){
					$updated_providers[] = sanitize_text_field($provider_key);
				}
			}

			update_option('atfp_enabled_providers', $updated_providers);
			wp_send_json_success( array( 'providers' => $updated_providers, 'message' => __( 'Enabled providers updated successfully.', 'automatic-translations-for-polylang' ) ) );
			exit;
        }

		public function atfp_install_plugin()
        {

            if (! current_user_can('install_plugins')) {
                wp_send_json_error([
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'errorMessage' => __('Sorry, you are not allowed to install plugins on this site.', 'automatic-translations-for-polylang'),
                ]);
            }

            check_ajax_referer('atfp_install_nonce', '_wpnonce', true);

            if (empty($_POST['slug'])) {
                wp_send_json_error([
                    'slug'         => '',
                    'errorCode'    => 'no_plugin_specified',
                    // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                    'errorMessage' => __('No plugin specified.', 'automatic-translations-for-polylang'),
                ]);
            }

            $slug = sanitize_key(wp_unslash($_POST['slug']));

            // Configuration for allowed plugins
            // 'files': array of main plugin files to check/activate (prioritized)
            // 'dependency': optional plugin that must be active
            // 'dependency_msg': error message if dependency is missing
            $plugins_config = [
                'automatic-translator-addon-for-loco-translate' => [
                    'files' => [
                        'loco-automatic-translate-addon-pro/loco-automatic-translate-addon-pro.php',
                        'automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php'
                    ],
                    'dependency'     => 'loco-translate/loco.php',
                    'dependency_msg' => esc_html__( 'Please activate Loco Translate plugin first.', 'automatic-translations-for-polylang' ),
                ]
            ];

            if (!isset($plugins_config[$slug])) {
                wp_send_json_error([
                    'errorMessage' => esc_html__('Invalid plugin slug.', 'automatic-translations-for-polylang'),
                ]);
            }

            $config = $plugins_config[$slug];

            if (! current_user_can('activate_plugins')) {
                wp_send_json_error([ 'message' => esc_html__( 'Permission denied.', 'automatic-translations-for-polylang' ) ]);
            }

            // Get the action (install or activate)
            $plugin_action = isset($_POST['plugin_action']) ? sanitize_text_field(wp_unslash($_POST['plugin_action'])) : 'install';
            if (! in_array($plugin_action, ['install', 'activate'], true)) {
                $plugin_action = 'install';
            }

            // 1. Check if any version is already installed
            foreach ($config['files'] as $file) {
                if (file_exists(WP_PLUGIN_DIR . '/' . $file)) {
                    // Check dependency requirements before activation (always enforce).
                    if (! empty($config['dependency']) && ! is_plugin_active($config['dependency'])) {
                        if ($plugin_action === 'activate') {
                            wp_send_json_error([ 'message' => $config['dependency_msg'] ]);
                        }

                        wp_send_json_success([ 'message' => $config['dependency_msg'], 'activated' => false ]);
                        return;
                    }

                    // Activate
                    $network_wide = is_multisite();
                    $result = activate_plugin($file, '', $network_wide, true);
                    if (is_wp_error($result)) {
                        wp_send_json_error(['message' => $result->get_error_message()]);
                    }
                    wp_send_json_success([ 'message' => esc_html__( 'Plugin activated successfully.', 'automatic-translations-for-polylang' ), 'activated' => true ]);
                    return;
                }
            }

            // 2. Not installed, proceed to install from repository
            $this->install_plugin_from_repo($slug, $config);
        }

        /**
         * Helper to install plugin from WP Repository
         *
         * @param string $slug Plugin slug
         * @param array $config Plugin configuration
         */
        private function install_plugin_from_repo($slug, $config)
        {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
            require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
            require_once ABSPATH . 'wp-admin/includes/plugin.php';

            $api = plugins_api('plugin_information', [
                'slug'   => $slug,
                'fields' => ['sections' => false],
            ]);

            if (is_wp_error($api)) {
                wp_send_json_error(['message' => $api->get_error_message()]);
            }

            $skin     = new WP_Ajax_Upgrader_Skin();
            $upgrader = new Plugin_Upgrader($skin);
            $result   = $upgrader->install($api->download_link);

            // Handle specific installation errors
            if (is_wp_error($result)) {
                wp_send_json_error(['message' => $result->get_error_message()]);
            } elseif (is_wp_error($skin->result)) {
                // Special handling for "Destination folder already exists"
                if ($skin->result->get_error_message() === 'Destination folder already exists.') {
                    $install_status = install_plugin_install_status($api);
                    if (current_user_can('activate_plugin', $install_status['file'])) {
                        // Check dependency
                        if (!empty($config['dependency']) && !is_plugin_active($config['dependency'])) {
                            wp_send_json_success(['message' => $config['dependency_msg'], 'activated' => false]);
                            return;
                        }

                        // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce already verified in atfp_install_plugin()
                        $pagenow = isset($_POST['pagenow']) ? sanitize_key(wp_unslash($_POST['pagenow'])) : '';
                        $network_wide = (is_multisite() && 'import' !== $pagenow);
                        $activation_result = activate_plugin($install_status['file'], '', $network_wide, true);

                        if (is_wp_error($activation_result)) {
                            wp_send_json_error(['message' => $activation_result->get_error_message()]);
                        } else {
                            wp_send_json_success([ 'activated' => true, 'message' => esc_html__( 'Plugin activated successfully.', 'automatic-translations-for-polylang' ) ]);
                        }
                    } else {
                        wp_send_json_error(['message' => $skin->result->get_error_message()]);
                    }
                } else {
                    wp_send_json_error(['message' => $skin->result->get_error_message()]);
                }
            } elseif ($skin->get_errors()->has_errors()) {
                wp_send_json_error(['message' => $skin->get_error_messages()]);
            } elseif (is_null($result)) {
                global $wp_filesystem;
                // phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
                $error_msg = __('Unable to connect to the filesystem. Please confirm your credentials.', 'automatic-translations-for-polylang');
                if ($wp_filesystem instanceof WP_Filesystem_Base && is_wp_error($wp_filesystem->errors) && $wp_filesystem->errors->has_errors()) {
                    $error_msg = esc_html($wp_filesystem->errors->get_error_message());
                }
                wp_send_json_error(['message' => $error_msg]);
            }

            // Auto-activate after successful install
            $install_status = install_plugin_install_status($api);
            if (current_user_can('activate_plugin', $install_status['file'])) {
                // Dependency check before auto-activate
                if (!empty($config['dependency']) && !is_plugin_active($config['dependency'])) {
                    // Installed but can't activate due to dependency
                    wp_send_json_success(['message' => $config['dependency_msg'], 'activated' => false]);
                    return;
                }

                // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce already verified in atfp_install_plugin()
                $pagenow = isset($_POST['pagenow']) ? sanitize_key(wp_unslash($_POST['pagenow'])) : '';
                $network_wide = (is_multisite() && 'import' !== $pagenow);
                $activation_result = activate_plugin($install_status['file'], '', $network_wide, true);
                if (is_wp_error($activation_result)) {
                    wp_send_json_error(['message' => $activation_result->get_error_message()]);
                }
                wp_send_json_success([ 'message' => esc_html__( 'Plugin installed and activated successfully.', 'automatic-translations-for-polylang' ), 'activated' => true ]);
            } else {
                wp_send_json_success([ 'message' => esc_html__( 'Plugin installed successfully.', 'automatic-translations-for-polylang' ), 'activated' => false ]);
            }
        }
	}
}
