<?php
/**
 * Toolkit for Polylang — versioned loader.
 *
 * Each sibling plugin ships an identical copy of the hub class. Plugins
 * register their copy here as early as possible (plugin file load / constructor).
 * On plugins_loaded (priority 1) the highest VERSION wins and only that file is
 * required — before older siblings that still do class_exists()+require on
 * plugins_loaded 10/20 can lock in an outdated copy.
 *
 * @package ToolkitForPolylang
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'tfp_toolkit_hub_register' ) ) {

	/**
	 * Register one plugin's copy of the Toolkit Hub for later boot.
	 *
	 * @param string $version SemVer of that copy's class-tfp-toolkit-hub.php.
	 * @param string $file    Absolute path to class-tfp-toolkit-hub.php.
	 * @param array  $loader  { text_domain, support_url, docs_url } for the winner.
	 * @return void
	 */
	function tfp_toolkit_hub_register( $version, $file, $loader = array() ) {
		global $tfp_toolkit_hub_registry;

		if ( ! is_array( $tfp_toolkit_hub_registry ) ) {
			$tfp_toolkit_hub_registry = array();
		}

		$tfp_toolkit_hub_registry[] = array(
			'version' => (string) $version,
			'file'    => (string) $file,
			'loader'  => (array) $loader,
		);

		// Priority 1: before typical sibling bootstraps (10 / 20) that still
		// use the old class_exists()+require pattern.
		if ( ! has_action( 'plugins_loaded', 'tfp_toolkit_hub_boot' ) ) {
			add_action( 'plugins_loaded', 'tfp_toolkit_hub_boot', 1 );
		}

		if ( did_action( 'plugins_loaded' ) ) {
			tfp_toolkit_hub_boot();
		}
	}
}

if ( ! function_exists( 'tfp_toolkit_hub_boot' ) ) {

	/**
	 * Require the highest-VERSION hub class and instantiate it once.
	 *
	 * @return void
	 */
	function tfp_toolkit_hub_boot() {
		global $tfp_toolkit_hub_registry;

		if ( class_exists( 'TFP_Toolkit_Hub', false ) ) {
			return;
		}

		if ( empty( $tfp_toolkit_hub_registry ) || ! is_array( $tfp_toolkit_hub_registry ) ) {
			return;
		}

		usort(
			$tfp_toolkit_hub_registry,
			static function ( $a, $b ) {
				return version_compare( $b['version'], $a['version'] );
			}
		);

		$winner = $tfp_toolkit_hub_registry[0];
		$file   = isset( $winner['file'] ) ? $winner['file'] : '';

		if ( '' === $file || ! is_readable( $file ) ) {
			return;
		}

		require_once $file;

		if ( class_exists( 'TFP_Toolkit_Hub' ) ) {
			TFP_Toolkit_Hub::instance( isset( $winner['loader'] ) ? $winner['loader'] : array() );
		}
	}
}
