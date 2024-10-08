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
 * ATFP Helper
 */
if ( ! class_exists( 'ATFP_Helper' ) ) {
	class ATFP_Helper {
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
		private static $custom_block_data_array = array();

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

		public function get_block_parse_rules() {
			$response = wp_remote_get( ATFP_URL . 'includes/automatic-translate/translate-block-rules/block-rules.json' );

			if ( is_wp_error( $response ) ) {
				$block_rules = '';
			} else {
				$block_rules = wp_remote_retrieve_body( $response );
			}

			$block_translation_rules = json_decode( $block_rules, true );

			$this->custom_block_data_array = isset( $block_translation_rules['AtfpBlockParseRules'] ) ? $block_translation_rules['AtfpBlockParseRules'] : array();

			$custom_block_translation = get_option( 'atfp_custom_block_translation', false );

			if ( ! empty( $custom_block_translation ) && is_array( $custom_block_translation ) ) {
				foreach ( $custom_block_translation as $key => $block_data ) {
					$this->filter_custom_block_rules( array( $key ), $block_data, $block_translation_rules['AtfpBlockParseRules'][ $key ] );
				}
			}

			$block_translation_rules['AtfpBlockParseRules'] = $this->custom_block_data_array;

			return $block_translation_rules;
		}

		private function filter_custom_block_rules( $id_keys = array(), $value, $block_rules, $attr_key = false ) {

			$latest_data = array();
			$block_rules = is_object( $block_rules ) ? json_decode( json_encode( $block_rules ) ) : $block_rules;

			if ( ! isset( $block_rules ) ) {
				return $this->merge_nested_attribute( $id_keys, $value );
			}
			if ( is_object( $value ) && isset( $block_rules ) ) {
				foreach ( $value as $key => $item ) {
					if ( isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->filter_custom_block_rules( array_merge( $id_keys, array( $key ) ), $item, $block_rules[ $key ], false );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && true === $item ) {
						$this->merge_nested_attribute( array_merge( $id_keys, array( $key ) ), true );
						continue;
					} elseif ( ! isset( $block_rules[ $key ] ) && is_object( $item ) ) {
						$this->merge_nested_attribute( array_merge( $id_keys, array( $key ) ), $item );
						continue;
					}
				}
			}
		}

		private function merge_nested_attribute( $id_keys = array(), $value ) {
			$value = is_object( $value ) ? json_decode( json_encode( $value ), true ) : $value;

			$current_array = &$this->custom_block_data_array;

			foreach ( $id_keys as $index => $id ) {
				if ( ! isset( $current_array[ $id ] ) ) {
					$current_array[ $id ] = array();
				}
				$current_array = &$current_array[ $id ];
			}

			$current_array = $value;
		}
	}
}
