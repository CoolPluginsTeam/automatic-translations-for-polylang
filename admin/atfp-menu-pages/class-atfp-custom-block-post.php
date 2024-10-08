<?php
/**
 * ATFP ATFP_Custom_Block_Post
 *
 * @package ATFP
 */

/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Custom_Block_Post' ) ) {
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

			add_action( 'save_post', array( $this, 'on_save_post' ), 10, 3 );

			// add_action( 'wp_loaded', function() {
			// $blocks_data=WP_Block_Type_Registry::get_instance()->get_all_registered();
			// echo "<pre>";
			// var_dump($blocks_data);
			// echo "</pre>";
			// } );
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

			// Create a default post if it doesn't exist
			$post_title = 'Add More Gutenberg Blocks';
			$query      = new WP_Query(
				array(
					'post_type'      => 'atfp_add_blocks',
					'title'          => $post_title,
					'posts_per_page' => 1,
				)
			);

			$existing_post = $query->posts ? $query->posts[0] : null;

			if ( ! $existing_post ) {
				wp_insert_post(
					array(
						'post_title'   => $post_title,
						'post_content' => '',
						'post_status'  => 'publish',
						'post_type'    => 'atfp_add_blocks', // Corrected post type to match registered type
						'post_parent'  => 0, // Set the parent ID if needed, or adjust accordingly
					)
				);
			}
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
