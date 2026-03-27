<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Re_Translation' ) ) {

	/**
	 * ATFP_Re_Translation class
	 *
	 * @package Autopoly
	 * @subpackage Autopoly_Translation_For_Polylang_Pro
	 * @since 1.0.0
	 */
	class ATFP_Re_Translation {

		/**
		 * Current post id
		 *
		 * @var int|null
		 */
		private static $current_post_id;

		/**
		 * Get the retranslation status
		 *
		 * @param int $post_id
		 * @return array|false
		 */
		public static function retranslation_status( $post_id ) {

			if(isset($post_id) && $post_id > 0){
				self::$current_post_id=$post_id;
			}

			$retranslation_post_ids=self::get_retranslation_post_ids();

			if(!empty($retranslation_post_ids) && in_array($post_id, $retranslation_post_ids)){
				return true;
			}

			return false;
		}

		private static function get_retranslation_post_ids() {
			if ( ! isset( self::$current_post_id ) || false === self::$current_post_id ) {
				return array();
			}

			$cache_key   = 'atfp_translation_data_post_ids';
			$cache_group = 'atfp_translation_info';

			/* 1️⃣ Try object cache (fastest) */
			$data = wp_cache_get( $cache_key, $cache_group );
			if ( false !== $data ) {
				return $data;
			}

			/* 2️⃣ Fallback to transient (persistent) */
			$data = get_transient( $cache_key );

			if ( false !== $data ) {
				// Re-prime object cache for this request
				wp_cache_set( $cache_key, $data, $cache_group, DAY_IN_SECONDS );
				return $data;
			}

			/* 3️⃣ Build fresh data */
			$translation_data = get_option( 'cpt_dashboard_data', array() );
			$atfp_data        = $translation_data['atfp'] ?? array();

			if ( empty( $atfp_data ) ) {
				return array();
			}

			$post_ids = array_map(
				'intval',
				array_column( $atfp_data, 'post_id' )
			);

			$data = array_keys( array_flip( $post_ids ) );

			/* 4️⃣ Store in both caches */
			wp_cache_set( $cache_key, array_values( $data ), $cache_group, DAY_IN_SECONDS );
			set_transient( $cache_key, array_values( $data ), DAY_IN_SECONDS );

			return $data;
		}
	}

	new ATFP_Re_Translation();
}
