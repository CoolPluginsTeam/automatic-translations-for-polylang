<?php
/**
 * Menu sync controller.
 *
 * @package ATFP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Menu_Sync' ) ) {
	/**
	 * Adds a visible menu sync action to Appearance > Menus.
	 */
	class ATFP_Menu_Sync {
		const OPTION_NAME = 'atfp_menu_sync_enabled';

		/**
		 * Plugin instance.
		 *
		 * @var ATFP_Menu_Sync|null
		 */
		private static $instance = null;

		/**
		 * Current theme slug.
		 *
		 * @var string
		 */
		private $theme;

		/**
		 * Languages cached for this request.
		 *
		 * @var array|null
		 */
		private $languages = null;

		/**
		 * Get instance.
		 *
		 * @return ATFP_Menu_Sync
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor.
		 */
		private function __construct() {
			$this->theme = get_option( 'stylesheet' );

			add_action( 'admin_init', array( $this, 'register_ajax_handler' ), 5 );
			add_action( 'load-nav-menus.php', array( $this, 'register_menu_page_assets' ) );
		}

		/**
		 * Whether menu sync is enabled.
		 *
		 * @return bool
		 */
		public static function is_enabled() {
			return 'yes' === get_option( self::OPTION_NAME, 'no' );
		}

		/**
		 * Register AJAX handler only when the feature can be used.
		 *
		 * @return void
		 */
		public function register_ajax_handler() {
			if ( ! $this->can_load() ) {
				return;
			}

			add_action( 'wp_ajax_atfp_sync_menu', array( $this, 'ajax_sync_menu' ) );
		}

		/**
		 * Register scripts/styles for Appearance > Menus.
		 *
		 * @return void
		 */
		public function register_menu_page_assets() {
			if ( ! $this->can_load() ) {
				return;
			}

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_menu_page_assets' ) );
		}

		/**
		 * Enqueue menu sync UI assets.
		 *
		 * @return void
		 */
		public function enqueue_menu_page_assets() {
			global $nav_menu_selected_id;

			$menu_id = absint( $nav_menu_selected_id );

			if ( ! $menu_id ) {
				return;
			}

			wp_enqueue_style( 'dashicons' );
			wp_enqueue_style( 'atfp-menu-sync', ATFP_URL . 'assets/css/atfp-menu-sync.min.css', array(), ATFP_V );
			wp_enqueue_script( 'atfp-menu-sync', ATFP_URL . 'assets/js/atfp-menu-sync.min.js', array( 'jquery' ), ATFP_V, true );

			wp_localize_script(
				'atfp-menu-sync',
				'atfpMenuSync',
				array(
					'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
					'nonce'     => wp_create_nonce( 'atfp_sync_menu' ),
					'menuId'    => $menu_id,
					'menuLang'  => $this->get_menu_language( $menu_id ),
					'languages' => $this->build_language_data( $menu_id ),
					'strings'   => array(
						'syncButton'          => __( 'Menu Synchronization', 'automatic-translations-for-polylang' ),
						'selectLanguages'     => __( 'Select languages to sync', 'automatic-translations-for-polylang' ),
						'selectAll'           => __( 'Select All', 'automatic-translations-for-polylang' ),
						'deselectAll'         => __( 'Unselect All', 'automatic-translations-for-polylang' ),
						'sync'                => __( 'Sync', 'automatic-translations-for-polylang' ),
						'cancel'              => __( 'Cancel', 'automatic-translations-for-polylang' ),
						'syncing'             => __( 'Syncing...', 'automatic-translations-for-polylang' ),
						'alreadySyncedTitle'  => __( 'Your menus are already synchronized.', 'automatic-translations-for-polylang' ),
						'alreadySyncedText'   => __( 'Choose the languages you want to resync.', 'automatic-translations-for-polylang' ),
						'notSyncedTitle'      => __( 'Sync your menus across languages', 'automatic-translations-for-polylang' ),
						'notSyncedText'       => __( 'This will copy your default language menu structure to the selected languages.', 'automatic-translations-for-polylang' ),
						'synchronized'        => __( 'Synchronized', 'automatic-translations-for-polylang' ),
						'updateNotice'        => __( 'This will update your existing menus in the selected languages with the latest changes.', 'automatic-translations-for-polylang' ),
						'overwriteNotice'     => __( 'This will overwrite existing menus in the selected languages. Please make sure to backup your menus before syncing.', 'automatic-translations-for-polylang' ),
						'noLanguages'         => __( 'Please select at least one language.', 'automatic-translations-for-polylang' ),
						'emptyMenuError'      => __( 'The source menu is empty. Please add menu items before syncing.', 'automatic-translations-for-polylang' ),
						'noTranslatedContent' => __( 'No translated content is available for selected menu items. Please add and translate content in other languages first.', 'automatic-translations-for-polylang' ),
						'error'               => __( 'Error syncing menu. Please try again.', 'automatic-translations-for-polylang' ),
						'permissionError'     => __( 'You do not have permission to sync menus.', 'automatic-translations-for-polylang' ),
					),
				)
			);
		}

		/**
		 * AJAX callback for syncing a menu to selected languages.
		 *
		 * @return void
		 */
		public function ajax_sync_menu() {
			check_ajax_referer( 'atfp_sync_menu', 'nonce' );

			if ( ! current_user_can( 'edit_theme_options' ) ) {
				wp_send_json_error(
					array(
						'message'    => __( 'You do not have permission to perform this action.', 'automatic-translations-for-polylang' ),
						'error_code' => 'permission_denied',
					)
				);
			}

			$menu_id      = isset( $_POST['menu_id'] ) ? absint( wp_unslash( $_POST['menu_id'] ) ) : 0;
			$target_langs = $this->get_requested_languages();

			if ( ! $menu_id || ! wp_get_nav_menu_object( $menu_id ) ) {
				wp_send_json_error(
					array(
						'message'    => __( 'Invalid menu selected.', 'automatic-translations-for-polylang' ),
						'error_code' => 'invalid_menu_id',
					)
				);
			}

			if ( empty( $target_langs ) ) {
				wp_send_json_error(
					array(
						'message'    => __( 'No target languages selected.', 'automatic-translations-for-polylang' ),
						'error_code' => 'no_languages_selected',
					)
				);
			}

			$result = $this->sync_menu_to_languages( $menu_id, $target_langs );

			if ( $result['success'] ) {
				wp_send_json_success( $result );
			}

			wp_send_json_error( $result );
		}

		/**
		 * Check required state before loading the feature.
		 *
		 * @return bool
		 */
		private function can_load() {
			return self::is_enabled()
				&& current_user_can( 'edit_theme_options' )
				&& function_exists( 'pll_languages_list' )
				&& function_exists( 'pll_get_post' )
				&& function_exists( 'pll_get_term' );
		}

		/**
		 * Get posted target languages after validating against Polylang languages.
		 *
		 * @return array
		 */
		private function get_requested_languages() {
			if ( empty( $_POST['target_langs'] ) || ! is_array( $_POST['target_langs'] ) ) {
				return array();
			}

			$allowed = wp_list_pluck( $this->get_languages(), 'slug' );
			$langs   = array_map( 'sanitize_key', wp_unslash( $_POST['target_langs'] ) );

			return array_values( array_intersect( array_filter( $langs ), $allowed ) );
		}

		/**
		 * Build language data for the modal.
		 *
		 * @param int $menu_id Current menu ID.
		 *
		 * @return array
		 */
		private function build_language_data( $menu_id ) {
			$source_items = wp_get_nav_menu_items( $menu_id );
			$menu_lang    = $this->get_menu_language( $menu_id );
			$languages    = array();

			foreach ( $this->get_languages() as $language ) {
				if ( '' !== $menu_lang && $language['slug'] === $menu_lang ) {
					continue;
				}

				if ( ! $this->menu_has_syncable_item( $source_items, $language['slug'] ) ) {
					continue;
				}

				$language['has_synced_menu'] = $this->target_menu_exists_for_language( $menu_id, $language['slug'] );
				$languages[]                 = $language;
			}

			return $languages;
		}

		/**
		 * Get Polylang languages.
		 *
		 * @return array
		 */
		private function get_languages() {
			if ( null !== $this->languages ) {
				return $this->languages;
			}

			$slugs   = pll_languages_list( array( 'fields' => 'slug' ) );
			$names   = pll_languages_list( array( 'fields' => 'name' ) );
			$locales = pll_languages_list( array( 'fields' => 'locale' ) );

			if ( ! is_array( $slugs ) ) {
				$this->languages = array();
				return $this->languages;
			}

			$this->languages = array();

			foreach ( array_values( $slugs ) as $index => $slug ) {
				$slug = sanitize_key( $slug );

				if ( '' === $slug ) {
					continue;
				}

				$this->languages[] = array(
					'slug'   => $slug,
					'name'   => isset( $names[ $index ] ) ? sanitize_text_field( $names[ $index ] ) : $slug,
					'locale' => isset( $locales[ $index ] ) ? sanitize_text_field( $locales[ $index ] ) : $slug,
				);
			}

			return $this->languages;
		}

		/**
		 * Sync source menu to selected languages.
		 *
		 * @param int   $source_menu_id Source menu ID.
		 * @param array $target_langs   Target language slugs.
		 *
		 * @return array
		 */
		private function sync_menu_to_languages( $source_menu_id, $target_langs ) {
			$source_menu  = wp_get_nav_menu_object( $source_menu_id );
			$source_items = wp_get_nav_menu_items( $source_menu_id );

			if ( empty( $source_items ) ) {
				return array(
					'success'    => false,
					'message'    => __( 'Source menu is empty.', 'automatic-translations-for-polylang' ),
					'error_code' => 'empty_menu',
				);
			}

			$details          = array();
			$synced_languages = array();
			$source_locations = $this->get_menu_locations( $source_menu_id );

			foreach ( $target_langs as $target_lang ) {
				$language = $this->get_language( $target_lang );

				if ( empty( $language ) ) {
					continue;
				}

				$result = $this->sync_menu_for_language( $source_menu, $source_items, $language, $source_locations );

				if ( $result['synced'] > 0 ) {
					$synced_languages[] = $language['name'];
				}

				$details[ $target_lang ] = $result;
			}

			if ( empty( $synced_languages ) ) {
				return array(
					'success'    => false,
					'message'    => __( 'No menus were synced. Please ensure translations exist.', 'automatic-translations-for-polylang' ),
					'error_code' => 'no_translations',
					'details'    => $details,
				);
			}

			return array(
				'success' => true,
				'message' => sprintf(
					/* translators: %s: comma-separated language names. */
					__( 'Menu synced to: %s', 'automatic-translations-for-polylang' ),
					implode( ', ', $synced_languages )
				),
				'details' => $details,
			);
		}

		/**
		 * Sync one menu for one language.
		 *
		 * @param WP_Term $source_menu      Source menu term.
		 * @param array   $source_items     Source menu items.
		 * @param array   $language         Target language data.
		 * @param array   $source_locations Source menu locations.
		 *
		 * @return array
		 */
		private function sync_menu_for_language( $source_menu, $source_items, $language, $source_locations ) {
			$result = array(
				'synced'  => 0,
				'skipped' => 0,
				'menu_id' => 0,
			);

			if ( ! $this->menu_has_syncable_item( $source_items, $language['slug'] ) ) {
				$result['skipped'] = count( $source_items );
				return $result;
			}

			$target_menu_id = $this->get_or_create_target_menu_id( $source_menu, $language );

			if ( ! $target_menu_id ) {
				return $result;
			}

			$this->delete_menu_items( $target_menu_id );

			$item_id_map = array();

			foreach ( $source_items as $item ) {
				$new_item_id = $this->sync_menu_item( $item, $target_menu_id, $language['slug'], $item_id_map );

				if ( $new_item_id ) {
					$result['synced']++;
				} else {
					$result['skipped']++;
				}
			}

			if ( 0 === $result['synced'] ) {
				wp_delete_nav_menu( $target_menu_id );
				return $result;
			}

			$result['menu_id'] = $target_menu_id;

			if ( ! empty( $source_locations ) ) {
				$this->assign_menu_to_locations( $target_menu_id, $language['slug'], $source_locations );
			}

			return $result;
		}

		/**
		 * Create or fetch a target menu.
		 *
		 * @param WP_Term $source_menu Source menu term.
		 * @param array   $language    Target language data.
		 *
		 * @return int
		 */
		private function get_or_create_target_menu_id( $source_menu, $language ) {
			$target_menu_id = $this->get_target_menu_id_from_locations( $source_menu->term_id, $language['slug'] );

			if ( $target_menu_id ) {
				return $target_menu_id;
			}

			$menu_name = $this->format_menu_name( $source_menu->name, $language['name'] );
			$menu      = wp_get_nav_menu_object( $menu_name );

			if ( $menu && $this->menu_name_can_be_reused( $menu->term_id, $language['slug'] ) ) {
				return (int) $menu->term_id;
			}

			if ( $menu ) {
				$menu_name = $this->generate_unique_menu_name( $source_menu->name, $language['name'] );
			}

			$target_menu_id = wp_create_nav_menu( $menu_name );

			return is_wp_error( $target_menu_id ) ? 0 : (int) $target_menu_id;
		}

		/**
		 * Sync a single menu item.
		 *
		 * @param object $item        Source menu item.
		 * @param int    $menu_id     Target menu ID.
		 * @param string $target_lang Target language slug.
		 * @param array  $item_id_map Source item ID to target item ID map.
		 *
		 * @return int|false
		 */
		private function sync_menu_item( $item, $menu_id, $target_lang, &$item_id_map ) {
			$item_data = array(
				'menu-item-title'       => wp_slash( $item->title ),
				'menu-item-url'         => esc_url_raw( $item->url ),
				'menu-item-status'      => 'publish',
				'menu-item-type'        => sanitize_key( $item->type ),
				'menu-item-object'      => sanitize_key( $item->object ),
				'menu-item-object-id'   => absint( $item->object_id ),
				'menu-item-position'    => absint( $item->menu_order ),
				'menu-item-classes'     => is_array( $item->classes ) ? implode( ' ', array_map( 'sanitize_html_class', $item->classes ) ) : '',
				'menu-item-xfn'         => sanitize_text_field( $item->xfn ),
				'menu-item-description' => wp_slash( $item->description ),
				'menu-item-attr-title'  => wp_slash( $item->attr_title ),
				'menu-item-target'      => sanitize_key( $item->target ),
			);

			if ( ! empty( $item->menu_item_parent ) && isset( $item_id_map[ $item->menu_item_parent ] ) ) {
				$item_data['menu-item-parent-id'] = absint( $item_id_map[ $item->menu_item_parent ] );
			}

			if ( 'post_type' === $item->type ) {
				$translated_post_id = absint( pll_get_post( $item->object_id, $target_lang ) );
				$translated_post    = $translated_post_id ? get_post( $translated_post_id ) : null;

				if ( ! $translated_post || ! in_array( $translated_post->post_status, array( 'publish', 'private' ), true ) ) {
					return false;
				}

				$item_data['menu-item-object-id'] = $translated_post_id;
				$item_data['menu-item-title']     = wp_slash( $this->get_post_type_item_title( $item, $translated_post ) );
				$item_data['menu-item-url']       = '';
			} elseif ( 'taxonomy' === $item->type ) {
				$translated_term_id = absint( pll_get_term( $item->object_id, $target_lang ) );
				$translated_term    = $translated_term_id ? get_term( $translated_term_id, $item->object ) : null;

				if ( ! $translated_term || is_wp_error( $translated_term ) ) {
					return false;
				}

				$item_data['menu-item-object-id'] = $translated_term_id;
				$item_data['menu-item-title']     = wp_slash( $this->get_taxonomy_item_title( $item, $translated_term ) );
				$item_data['menu-item-url']       = '';
			}

			$new_item_id = wp_update_nav_menu_item( $menu_id, 0, $item_data );

			if ( is_wp_error( $new_item_id ) || ! $new_item_id ) {
				return false;
			}

			$item_id_map[ $item->ID ] = (int) $new_item_id;

			if ( '#pll_switcher' === $item->url ) {
				$meta = get_post_meta( $item->ID, '_pll_menu_item', true );

				if ( $meta ) {
					update_post_meta( $new_item_id, '_pll_menu_item', $meta );
				}
			}

			return (int) $new_item_id;
		}

		/**
		 * Whether the menu has any item that can be synced.
		 *
		 * @param array|false $source_items Source menu items.
		 * @param string      $target_lang  Target language slug.
		 *
		 * @return bool
		 */
		private function menu_has_syncable_item( $source_items, $target_lang ) {
			if ( empty( $source_items ) || ! is_array( $source_items ) ) {
				return false;
			}

			foreach ( $source_items as $item ) {
				if ( $this->can_sync_item( $item, $target_lang ) ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Whether one item can be synced to a language.
		 *
		 * @param object $item        Source menu item.
		 * @param string $target_lang Target language slug.
		 *
		 * @return bool
		 */
		private function can_sync_item( $item, $target_lang ) {
			if ( 'custom' === $item->type ) {
				return true;
			}

			if ( 'post_type' === $item->type ) {
				$translated_id = absint( pll_get_post( $item->object_id, $target_lang ) );
				$post          = $translated_id ? get_post( $translated_id ) : null;

				return $post && in_array( $post->post_status, array( 'publish', 'private' ), true );
			}

			if ( 'taxonomy' === $item->type ) {
				$translated_id = absint( pll_get_term( $item->object_id, $target_lang ) );
				$term          = $translated_id ? get_term( $translated_id, $item->object ) : null;

				return $term && ! is_wp_error( $term );
			}

			return true;
		}

		/**
		 * Get the title for a synced post type menu item.
		 *
		 * @param object  $item            Source menu item.
		 * @param WP_Post $translated_post Translated post.
		 *
		 * @return string
		 */
		private function get_post_type_item_title( $item, $translated_post ) {
			$source_post = get_post( $item->object_id );

			if ( $source_post && $item->title === $source_post->post_title ) {
				return $translated_post->post_title;
			}

			return $item->title;
		}

		/**
		 * Get the title for a synced taxonomy menu item.
		 *
		 * @param object  $item            Source menu item.
		 * @param WP_Term $translated_term Translated term.
		 *
		 * @return string
		 */
		private function get_taxonomy_item_title( $item, $translated_term ) {
			$source_term = get_term( $item->object_id, $item->object );

			if ( $source_term && ! is_wp_error( $source_term ) && $item->title === $source_term->name ) {
				return $translated_term->name;
			}

			return $item->title;
		}

		/**
		 * Remove all menu items from a target menu before replacing it.
		 *
		 * @param int $menu_id Target menu ID.
		 *
		 * @return void
		 */
		private function delete_menu_items( $menu_id ) {
			$items = wp_get_nav_menu_items( $menu_id );

			if ( empty( $items ) ) {
				return;
			}

			foreach ( $items as $item ) {
				wp_delete_post( $item->ID, true );
			}
		}

		/**
		 * Get one language by slug.
		 *
		 * @param string $slug Language slug.
		 *
		 * @return array
		 */
		private function get_language( $slug ) {
			foreach ( $this->get_languages() as $language ) {
				if ( $language['slug'] === $slug ) {
					return $language;
				}
			}

			return array();
		}

		/**
		 * Get current menu language from Polylang nav menu locations.
		 *
		 * @param int $menu_id Menu ID.
		 *
		 * @return string
		 */
		private function get_menu_language( $menu_id ) {
			$nav_menus = $this->get_polylang_nav_menus();

			if ( empty( $nav_menus[ $this->theme ] ) ) {
				return '';
			}

			foreach ( $nav_menus[ $this->theme ] as $locations ) {
				foreach ( $locations as $lang => $assigned_menu_id ) {
					if ( absint( $assigned_menu_id ) === absint( $menu_id ) ) {
						return sanitize_key( $lang );
					}
				}
			}

			return '';
		}

		/**
		 * Get locations where a menu is assigned.
		 *
		 * @param int $menu_id Menu ID.
		 *
		 * @return array
		 */
		private function get_menu_locations( $menu_id ) {
			$locations = array();
			$nav_menus = $this->get_polylang_nav_menus();

			if ( ! empty( $nav_menus[ $this->theme ] ) ) {
				foreach ( $nav_menus[ $this->theme ] as $location => $languages ) {
					foreach ( $languages as $assigned_menu_id ) {
						if ( absint( $assigned_menu_id ) === absint( $menu_id ) ) {
							$locations[] = $location;
							break;
						}
					}
				}
			}

			if ( empty( $locations ) ) {
				foreach ( get_nav_menu_locations() as $location => $assigned_menu_id ) {
					if ( absint( $assigned_menu_id ) === absint( $menu_id ) ) {
						$locations[] = $location;
					}
				}
			}

			return array_values( array_unique( array_map( 'sanitize_key', $locations ) ) );
		}

		/**
		 * Assign target menu to the same locations for the target language.
		 *
		 * @param int    $menu_id     Target menu ID.
		 * @param string $target_lang Target language slug.
		 * @param array  $locations   Base locations.
		 *
		 * @return void
		 */
		private function assign_menu_to_locations( $menu_id, $target_lang, $locations ) {
			$nav_menus = $this->get_polylang_nav_menus();

			foreach ( $locations as $location ) {
				$nav_menus[ $this->theme ][ $location ][ $target_lang ] = absint( $menu_id );
			}

			$this->set_polylang_nav_menus( $nav_menus );
		}

		/**
		 * Check if a target menu exists for this source menu's locations/language.
		 *
		 * @param int    $source_menu_id Source menu ID.
		 * @param string $target_lang    Target language slug.
		 *
		 * @return bool
		 */
		private function target_menu_exists_for_language( $source_menu_id, $target_lang ) {
			return (bool) $this->get_target_menu_id_from_locations( $source_menu_id, $target_lang );
		}

		/**
		 * Get target menu by matching source locations and target language.
		 *
		 * @param int    $source_menu_id Source menu ID.
		 * @param string $target_lang    Target language slug.
		 *
		 * @return int
		 */
		private function get_target_menu_id_from_locations( $source_menu_id, $target_lang ) {
			$nav_menus = $this->get_polylang_nav_menus();

			foreach ( $this->get_menu_locations( $source_menu_id ) as $location ) {
				if ( ! empty( $nav_menus[ $this->theme ][ $location ][ $target_lang ] ) ) {
					return absint( $nav_menus[ $this->theme ][ $location ][ $target_lang ] );
				}
			}

			return 0;
		}

		/**
		 * Whether a menu name can be reused for the requested language.
		 *
		 * @param int    $menu_id     Menu ID.
		 * @param string $target_lang Target language slug.
		 *
		 * @return bool
		 */
		private function menu_name_can_be_reused( $menu_id, $target_lang ) {
			$menu_lang = $this->get_menu_language( $menu_id );

			return '' === $menu_lang || $target_lang === $menu_lang;
		}

		/**
		 * Read Polylang nav menu option.
		 *
		 * @return array
		 */
		private function get_polylang_nav_menus() {
			$options = $this->get_polylang_options();

			if ( $options && method_exists( $options, 'get' ) ) {
				$nav_menus = $options->get( 'nav_menus' );
				return is_array( $nav_menus ) ? $nav_menus : array();
			}

			return array();
		}

		/**
		 * Save Polylang nav menu option.
		 *
		 * @param array $nav_menus Nav menu option.
		 *
		 * @return void
		 */
		private function set_polylang_nav_menus( $nav_menus ) {
			$options = $this->get_polylang_options();

			if ( $options && method_exists( $options, 'set' ) ) {
				$options->set( 'nav_menus', $nav_menus );
			}
		}

		/**
		 * Get Polylang options object.
		 *
		 * @return object|null
		 */
		private function get_polylang_options() {
			global $polylang;

			if ( isset( $polylang->options ) ) {
				return $polylang->options;
			}

			if ( function_exists( 'PLL' ) && isset( PLL()->options ) ) {
				return PLL()->options;
			}

			return null;
		}

		/**
		 * Format target menu name.
		 *
		 * @param string $base_name Source menu name.
		 * @param string $lang_name Language name.
		 * @param string $extra     Optional suffix.
		 *
		 * @return string
		 */
		private function format_menu_name( $base_name, $lang_name, $extra = '' ) {
			$base_name = preg_replace( '/\s*\([^)]+\)\s*$/', '', sanitize_text_field( $base_name ) );
			$lang_name = sanitize_text_field( $lang_name );
			$extra     = '' !== $extra ? ' ' . sanitize_text_field( $extra ) : '';
			$suffix    = ' (' . $lang_name . ')' . $extra;
			$max       = 200;

			if ( strlen( $suffix ) >= $max ) {
				return substr( $suffix, 0, $max );
			}

			return rtrim( substr( $base_name, 0, $max - strlen( $suffix ) ) ) . $suffix;
		}

		/**
		 * Generate a unique target menu name.
		 *
		 * @param string $base_name Source menu name.
		 * @param string $lang_name Language name.
		 *
		 * @return string
		 */
		private function generate_unique_menu_name( $base_name, $lang_name ) {
			$count = 1;

			do {
				$name = $this->format_menu_name( $base_name, $lang_name, (string) $count );
				$count++;
			} while ( wp_get_nav_menu_object( $name ) && $count < 100 );

			if ( wp_get_nav_menu_object( $name ) ) {
				$name = $this->format_menu_name( $base_name, $lang_name, (string) time() );
			}

			return $name;
		}
	}
}
