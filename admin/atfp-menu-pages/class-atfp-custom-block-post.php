<?php
/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Custom_Block_Post' ) ) {
	/**
	 * Class ATFP_Custom_Block_Post
	 *
	 * This class handles the custom block post type for the Automatic Translations For Polylang plugin.
	 * It manages the registration of the custom post type, adds submenu pages under the Polylang menu,
	 * and handles post save actions.
	 *
	 * @package ATFP
	 */
	class ATFP_Custom_Block_Post {
		/**
		 * Singleton instance.
		 *
		 * @var Atfp_Custom_Block_Post
		 */
		private static $instance = null;

		/**
		 * Constructor.
		 */
		private function __construct() {
			add_action( 'init', array( $this, 'register_custom_post_type' ) );
			add_action( 'admin_menu', array( $this, 'remove_post_type_menu' ) );
			add_action( 'admin_menu', array( $this, 'atfp_add_submenu_page' ), 11 );
			add_action( 'save_post', array( $this, 'on_save_post' ), 10, 3 );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}

		/**
		 * Enqueue scripts.
		 */
		public function enqueue_scripts( $hook ) {
			$current_screen = get_current_screen();
			if ( 'atfp_add_blocks' === $current_screen->post_type && is_object( $current_screen ) && 'post.php' === $hook && $current_screen->is_block_editor ) {
				wp_enqueue_script( 'atfp-add-new-block', ATFP_URL . 'assets/js/atfp-add-new-block.min.js', array( 'jquery','wp-data', 'wp-element' ), '1.0.0', true );
			}
		}

		/**
		 * Add submenu page under the Polylang menu.
		 */
		public function atfp_add_submenu_page() {
			global $polylang;
			$atfp_polylang = $polylang;
			if ( isset( $atfp_polylang ) ) {
				add_submenu_page(
					'mlang', // Parent slug
					__( 'Automatic Translations', 'automatic-translations-for-polylang' ), // Page title
					__( 'Automatic Translations', 'automatic-translations-for-polylang' ), // Menu title
					'manage_options', // Capability
					'edit.php?post_type=atfp_add_blocks', // Menu slug
					false, // Callback function
				);
			}
		}

		/**
		 * Function to run on post save or update.
		 *
		 * @param int          $post_id The ID of the post being saved.
		 * @param WP_Post|null $post The post object.
		 * @param bool         $update Whether this is an existing post being updated.
		 */
		public function on_save_post( $post_id, $post, $update ) {
			if ( isset( $post->post_type ) && 'atfp_add_blocks' === $post->post_type ) {
				update_option( 'atfp_custom_block_data', $post->post_content );
				update_option( 'atfp_custom_block_status', 'true' );
			}
		}

		/**
		 * Get the singleton instance.
		 *
		 * @return Atfp_Custom_Block_Post
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Register custom post type.
		 */
		public function register_custom_post_type() {
			$labels = array(
				'name'               => _x( 'Automatic Translations', 'post type general name' ),
				'singular_name'      => _x( 'Automatic Translation', 'post type singular name' ),
				'menu_name'          => _x( 'Automatic Translations', 'admin menu' ),
				'name_admin_bar'     => _x( 'Automatic Translation', 'add new on admin bar' ),
				'add_new'            => _x( 'Add New', 'Automatic Translation' ),
				'add_new_item'       => __( 'Add New Automatic Translation' ),
				'new_item'           => __( 'New Automatic Translation' ),
				'edit_item'          => __( 'Edit Automatic Translation' ),
				'view_item'          => __( 'View Automatic Translation' ),
				'all_items'          => __( 'Automatic Translations' ),
				'search_items'       => __( 'Search Automatic Translations' ),
				'not_found'          => __( 'No Automatic Translations found.' ),
				'not_found_in_trash' => __( 'No Automatic Translations found in Trash.' ),
			);

			$args = array(
				'labels'             => $labels,
				'public'             => true,
				'publicly_queryable' => true,
				'show_ui'            => true,
				'show_in_menu'       => false, // Ensure it shows in the menu
				'query_var'          => true,
				'rewrite'            => array( 'slug' => 'automatic-translation' ),
				'capability_type'    => 'page',
				'has_archive'        => true,
				'hierarchical'       => true,
				'menu_position'      => 0,
				'show_in_rest'       => true,
				'supports'           => array( 'editor' ), // Added support for excerpt and thumbnail
				'capabilities'       => array(
					'create_post'  => false,
					'create_posts' => false,
					'delete_post'  => false,
					'edit_post'    => 'edit_pages',
					'delete_posts' => false,
					'edit_posts'   => 'edit_pages',
				),
			);

			register_post_type( 'atfp_add_blocks', $args );


			ATFP_Helper::get_custom_block_post_id();
		}

		/**
		 * Hide the "Add New" and "Remove" options.
		 */
		public function remove_post_type_menu() {
			remove_menu_page( 'edit.php?post_type=automatic_translation_add_block' );
		}
	}

	// Initialize the class
	Atfp_Custom_Block_Post::get_instance();
}