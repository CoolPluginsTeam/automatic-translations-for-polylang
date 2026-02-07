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

			$translation_data = Atfp_Dashboard::get_translation_data('atfp');

			if(!isset($translation_data['total_character_count'])){
				wp_send_json_error( __( 'Character count not found.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
			}
			
			$total_character_count = $translation_data['total_character_count'];
			
			if($total_character_count > 500000){
				wp_send_json_error( __( 'Character count limit reached.', 'automatic-translations-for-polylang' ) );
				wp_die( '0', 400 );
				exit();
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
	}
}
