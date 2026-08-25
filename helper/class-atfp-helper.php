<?php

/**
 * ATFP Ajax Handler
 *
 * @package ATFP
 */

/**
 * Do not access the page directly
 */
if (! defined('ABSPATH')) {
	exit;
}

/**
 * ATFP Helper
 */
if (! class_exists('ATFP_Helper')) {
	class ATFP_Helper
	{
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
		public static function get_instance()
		{
			if (null === self::$instance) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		public static function get_custom_block_post_id()
		{
			$first_post_id = null;

			$query = new WP_Query(
				array(
					'post_type'      => 'atfp_add_blocks',
					'posts_per_page' => 1,
					'orderby'        => 'date',
					'order'          => 'ASC',
				)
			);

			$existing_post = $query->posts ? $query->posts[0] : null;

			if (! $existing_post) {
				$post_title    = esc_html__('Add More Gutenberg Blocks', 'automatic-translations-for-polylang');
				$first_post_id = wp_insert_post(
					array(
						'post_title'   => $post_title,
						'post_content' => '',
						'post_status'  => 'publish',
						'post_type'    => 'atfp_add_blocks',
					)
				);
			} elseif ($query->have_posts()) {
				$query->the_post();
				$first_post_id = get_the_ID();
			}

			return $first_post_id;
		}

		public function get_block_parse_rules()
		{
			$block_rules = '';
			$local_path  = ATFP_DIR_PATH . 'includes/block-translation-rules/block-rules.json';

			// Prefer local file first (remote should be unnecessary in normal cases).
			global $wp_filesystem;
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
			}

			WP_Filesystem();

			if ( $wp_filesystem && $wp_filesystem->exists( $local_path ) && $wp_filesystem->is_readable( $local_path ) ) {
				$block_rules = (string) $wp_filesystem->get_contents( $local_path );
			}

			// Fallback to remote only if local rules are missing/empty.
			if ( empty( $block_rules ) ) {
				$response = wp_remote_get(
					esc_url_raw( ATFP_URL . 'includes/block-translation-rules/block-rules.json' ),
					array(
						'timeout' => 15,
					)
				);

				if ( ! is_wp_error( $response ) && 200 === (int) wp_remote_retrieve_response_code( $response ) ) {
					$remote_body = wp_remote_retrieve_body( $response );
					if ( ! empty( $remote_body ) ) {
						$block_rules = (string) $remote_body;
					}
				}
			}

			if ( empty( $block_rules ) ) {
				return array();
			}

			$block_translation_rules = json_decode( $block_rules, true );
			if ( ! is_array( $block_translation_rules ) ) {
				return array();
			}

			$this->custom_block_data_array = isset($block_translation_rules['AtfpBlockParseRules']) ? $block_translation_rules['AtfpBlockParseRules'] : null;

			$custom_block_translation = get_option('atfp_custom_block_translation', false);

			if (! empty($custom_block_translation) && is_array($custom_block_translation)) {
				foreach ($custom_block_translation as $key => $block_data) {
					$block_rules = isset($block_translation_rules['AtfpBlockParseRules'][$key]) ? $block_translation_rules['AtfpBlockParseRules'][$key] : null;
					$this->filter_custom_block_rules(array($key), $block_data, $block_rules);
				}
			}

			$block_translation_rules['AtfpBlockParseRules'] = $this->custom_block_data_array ? $this->custom_block_data_array : array();

			return $block_translation_rules;
		}

		private function filter_custom_block_rules(array $id_keys, $value, $block_rules, $attr_key = false)
		{
			$block_rules = is_object($block_rules) ? json_decode(json_encode($block_rules)) : $block_rules;

			if (! isset($block_rules)) {
				return $this->merge_nested_attribute($id_keys, $value);
			}
			if (is_object($value) && isset($block_rules)) {
				foreach ($value as $key => $item) {
					if (isset($block_rules[$key]) && is_object($item)) {
						$this->filter_custom_block_rules(array_merge($id_keys, array($key)), $item, $block_rules[$key], false);
						continue;
					} elseif (! isset($block_rules[$key]) && true === $item) {
						$this->merge_nested_attribute(array_merge($id_keys, array($key)), true);
						continue;
					} elseif (! isset($block_rules[$key]) && is_object($item)) {
						$this->merge_nested_attribute(array_merge($id_keys, array($key)), $item);
						continue;
					}
				}
			}
		}

		private function merge_nested_attribute(array $id_keys, $value)
		{
			$value = is_object($value) ? json_decode(json_encode($value), true) : $value;

			$current_array = &$this->custom_block_data_array;

			foreach ($id_keys as $index => $id) {
				if (! isset($current_array[$id])) {
					$current_array[$id] = array();
				}
				$current_array = &$current_array[$id];
			}

			$current_array = $value;
		}

		public static function replace_links_with_translations($content, $locale, $current_locale)
		{
			// Get all URLs in the content that start with the current home page URL (current domain), regardless of attribute or tag
			$home_url = get_home_url();
			$pattern = '/(' . preg_quote($home_url, '/') . '[^\s"\'<>]*)/i';
			$terms_data=self::get_terms_data();

			preg_match_all($pattern, $content, $matches);
			$content=self::update_urls_translations_in_arrya($content, $matches, $terms_data, $pattern, $locale, $current_locale);
			
			$home_url = untrailingslashit(
				str_replace( '\/', '/', $home_url )
			);

			$escaped_home_url = preg_quote( $home_url, '~' );

			// Match both "/" and JSON-escaped "\/".
			$escaped_home_url = str_replace(
				'/',
				'(?:\\\\)?/',
				$escaped_home_url
			);

			$pattern = '~(' . $escaped_home_url . '[^\s"\'<>]*)~i';
			preg_match_all($pattern, $content, $matches);
			
			$content=self::update_urls_translations_in_arrya($content, $matches, $terms_data, $pattern, $locale, $current_locale, true);

			return $content;
		}

		private static function update_urls_translations_in_arrya($content, $matches = [], $terms_data = [], $pattern = '', $locale = '', $current_locale = '', $is_plain_url = false){
			if ($matches && count($matches) > 0) {

				if($is_plain_url){
					$matches[1]=str_replace('\/', '/', $matches[1]);
				}

				$image_urls=self::get_image_ids_by_urls($matches[1], $locale);

				$content = preg_replace_callback($pattern, function ($match) use ($image_urls, $locale, $current_locale, $terms_data, $is_plain_url) {		
					$original_href = $match[1];
					$href = $match[1];

					if($is_plain_url){
						$href = str_replace('\/', '/', $href);
					}
		
					if (preg_match('/<img[^>]+(src|srcset)=[\'"][^\'"]*' . preg_quote($href, '/') . '[\'"][^>]*>/i', $match[0])) {
						return $href;
					}
		
					if (isset($image_urls[$href]) && !empty($image_urls[$href])) {
						return $image_urls[$href];
					}
		
					$postID = url_to_postid($href);

					if ($postID > 0) {
						$translatedPost = pll_get_post($postID, $locale);
						if ($translatedPost) {
							$link = get_permalink($translatedPost);
							if ($link) {
								return esc_url(urldecode_deep($link));
							}
						}
					}

					$path = trim(str_replace(pll_home_url($current_locale), '', $original_href), '/');
					$path_segments = array_filter( explode( '/', $path ) );
					$category_slug = end( $path_segments );
		
					$taxonomy_name = self::extract_taxonomy_name($path, $terms_data);
					$taxonomy_name = $taxonomy_name ? $taxonomy_name : 'category';
		
					$category = get_term_by('slug', $category_slug, $taxonomy_name);
		
					if (!$category) {
						// Remove the language prefix if using Polylang
						$languages = pll_languages_list(); // e.g., ['en', 'fr']
						$segments = explode('/', $path);
						if (in_array($segments[0], $languages)) {
							$lang_code = $segments[0];
							$category_id = Pll()->model->term_exists_by_slug($category_slug, $lang_code, $taxonomy_name);

							if ($category_id) {
								$category = get_term($category_id, $taxonomy_name);
							}
						}
					}
		
					if ($category) {
						$term_id = pll_get_term($category->term_id, $locale);
						if ($term_id > 0) {
							$link = get_category_link($term_id);
							return esc_url($link);

						}
					}
					return $href;
		
				}, $content);
			}

			return $content;
		}

		private static function extract_taxonomy_name($path, $terms_data){
			// Remove the language prefix if using Polylang
			$languages = pll_languages_list(); // e.g., ['en', 'fr']
			$segments = explode('/', $path);
			if (in_array($segments[0], $languages)) {
				array_shift($segments); // remove 'en', 'fr', etc.
			}
			
			if (empty($segments)) {
				return null;
			}

			// First segment after language is usually the taxonomy slug
			$possible_tax = $segments[0];

			if (taxonomy_exists($possible_tax) || (isset($terms_data[$possible_tax]) && taxonomy_exists($terms_data[$possible_tax]))) {
		   		return isset($terms_data[$possible_tax]) ? $terms_data[$possible_tax] : $possible_tax;
			}

			return false;
		}

		private static function get_terms_data(){
			$taxonomies=get_taxonomies([],'objects');

			$taxonomies_data=array();
			foreach($taxonomies as $key=>$taxonomy){
				if(isset($taxonomy->rewrite['slug'])){
					$taxonomies_data[$taxonomy->rewrite['slug']]=$key;
				}else{
					$taxonomies_data[$key]=$key;
				}
			}

			return $taxonomies_data;
		}

		private static function get_image_ids_by_urls( $image_urls = [] , $locale='en') {
			global $wpdb;
		
			// Convert single URL string to array
			if ( is_string( $image_urls ) ) {
				$image_urls = [ $image_urls ];
			}
		
			if ( empty( $image_urls ) || ! is_array( $image_urls ) ) {
				return [];
			}
		
			$upload_dir = wp_upload_dir();
			$base_url   = $upload_dir['baseurl'];
			$results    = [];

			$cleaned_paths_map = []; // [cleaned_path] => [original_urls]
		
			foreach ( $image_urls as $url ) {
				if ( strpos( $url, $base_url ) === false ) {
					$results[ $url ] = false;
					continue;
				}
		
				// Relative path
				$relative_path = str_replace( $base_url . '/', '', $url );
		
				// Strip size suffix if present
				$cleaned_path = preg_replace( '/-\d+x\d+(?=\.(jpg|jpeg|png|gif|webp)$)/i', '', $relative_path );

				if(empty($cleaned_path)){
					$results[ $url ] = false;
					continue;
				}
		
				// Map cleaned path to original URL(s)
				if ( ! isset( $cleaned_paths_map[ $cleaned_path ] ) ) {
					$cleaned_paths_map[ $cleaned_path ] = [];
				}
		
				$cleaned_paths_map[ $cleaned_path ][] = $url;
			}

			$like_parts = [];
			$args       = [];

			// Build the OR'ed LIKEs and gather args
			foreach ( array_keys( $cleaned_paths_map ) as $path ) {
				$like_parts[] = 'guid LIKE %s';
				// Always escape for LIKE, then add wildcards yourself
				$args[] = '%' . $wpdb->esc_like( sanitize_text_field($path) ) . '%';
			}

			// Nothing to search? bail early.
			if ( empty( $like_parts ) ) {
				return $results;
			}

			// Compose the SQL with placeholders only
			$sql = "
				SELECT ID, guid
				FROM {$wpdb->posts}
				WHERE post_type = %s
				AND (" . implode( ' OR ', $like_parts ) . ")
			";

			// First arg is for post_type, then all the LIKE args
			array_unshift( $args, 'attachment' );

			// Run the query
			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, PluginCheck.Security.DirectDB.UnescapedDBParameter -- $sql is already sanitized and sql esc_like it's safe.
			$found = $wpdb->get_results( $wpdb->prepare( $sql, $args ) );

		
			// Map found GUIDs to IDs
			$guid_to_id = [];
			foreach ( $found as $row ) {
				
				$guid_to_id[ $row->guid ] = esc_url($row->guid);
				$translated_post=pll_get_post(intval($row->ID), $locale);

				if($translated_post){
					$image_url=wp_get_attachment_url(intval($translated_post));

					if($image_url && !empty($image_url)){
						$guid_to_id[$row->guid]=esc_url($image_url);
					}
				}
			}
		
			// Match original URLs to found IDs
			foreach ( $image_urls as $original_url ) {
				$found_id = false;
		
				if(isset($guid_to_id[$original_url])){
					$results[$original_url]=$guid_to_id[$original_url];
					continue;
				}

				// Exact match first
				if ( isset( $guid_to_id[ $original_url ] ) ) {
					$found_id = $guid_to_id[ $original_url ];
				} else {
					// Fallback to cleaned path match
					$relative_path = str_replace( $base_url . '/', '', $original_url );
					$cleaned_path  = preg_replace('/-\d+x\d+(?=\.(jpg|jpeg|png|gif|webp)$)/i', '', $relative_path );

					if(empty($cleaned_path)){
						$results[ $original_url ] = $original_url;
						continue;
					}

					preg_match('/-\d+x\d+(?=\.(jpg|jpeg|png|gif|webp)$)/i', $original_url, $matches);
					$suffix = isset($matches[0]) ? $matches[0] : '';

					foreach ( $guid_to_id as $guid => $url ) {
						if ( strpos( $guid, $cleaned_path ) !== false ) {
							if (!empty($suffix)) {
								// Insert $suffix before the file extension in $url
								$found_id = preg_replace('/(\.[a-zA-Z0-9]+)$/', $suffix . '$1', $url);
							} else {
								$found_id = $url;
							}
							break;
						}
					}
				}
		
				$results[ $original_url ] = esc_url($found_id);
			}


			return $results;
		}

		public static function get_translation_data($key_exists=array()){
			if(class_exists('Atfp_Dashboard') && method_exists('Atfp_Dashboard', 'get_translation_data')){
				return Atfp_Dashboard::get_translation_data('atfp', $key_exists);
			}else{
				return false;

			}
		}

		public static function translation_data_migration(){
			$already_migrated = get_option('atfp_translation_string_migration', false);

			if(!$already_migrated){
				$translation_data = self::get_translation_data();
				
				$old_data=get_option('cpt_dashboard_data', array());

				$updated=array();

				if(isset($old_data['atfp']) && count($old_data['atfp']) > 0){
					foreach($old_data['atfp'] as $data){
						$updated_data=$data;
						if(isset($data['string_count'])){
							$updated_data['word_count']=$data['string_count'];
							$updated_data['string_count']=$data['string_count'] / 30;
						}

						if(isset($data['source_string_count'])){
							$updated_data['source_word_count']=$data['source_string_count'];
							$updated_data['source_string_count']=$data['source_string_count'] / 30;
						}

						$updated[]=$updated_data;
					}

					if(count($updated) > 0){
						$old_data['atfp']=$updated;

						update_option('cpt_dashboard_data', $old_data);
					}
				}

				update_option('atfp_translation_string_migration', true);
			}
		}

		public static function is_translated_post_type($current_screen){
			global $polylang;
        
			if(!$polylang || !property_exists($polylang, 'model')){
				return false;
			}

			$translated_post_types = $polylang->model->get_translated_post_types();
			$translated_taxonomies = $polylang->model->get_translated_taxonomies();
	
			$translated_post_types = array_values($translated_post_types);
			$translated_taxonomies = array_values($translated_taxonomies);
				
			$translated_post_types=array_filter($translated_post_types, function($post_type){
				return is_string($post_type);
			});
	
			$translated_taxonomies=array_filter($translated_taxonomies, function($taxonomy){
				return is_string($taxonomy);
			});
	
			$valid_post_type=(isset($current_screen->post_type) && !empty($current_screen->post_type)) && in_array($current_screen->post_type, $translated_post_types) && $current_screen->post_type !== 'attachment' ? $current_screen->post_type : false;
			$valid_taxonomy=(isset($current_screen->taxonomy) && !empty($current_screen->taxonomy)) && in_array($current_screen->taxonomy, $translated_taxonomies) ? $current_screen->taxonomy : false;
	
			if((!$valid_post_type && !$valid_taxonomy) || ((!$valid_post_type || empty($valid_post_type)) && !isset($valid_taxonomy)) || (isset($current_screen->taxonomy) && !empty($current_screen->taxonomy) && !$valid_taxonomy)){
				return false;
			}

			return true;
		}

		public static function utm_source_text(){
			
			if(defined('ATFP_REDIRECT_REFRENCE_TEXT')){
				return self::get_utm_parameter(sanitize_text_field(ATFP_REDIRECT_REFRENCE_TEXT));
			}
			
			if(function_exists('get_option') ){
				$refrence_text=get_option('cpel_autopoly_installed', 'atfp');
				
				if(!defined('ATFP_REDIRECT_REFRENCE_TEXT')){
					define('ATFP_REDIRECT_REFRENCE_TEXT', sanitize_text_field($refrence_text));
				}

				return self::get_utm_parameter(sanitize_text_field($refrence_text));
			}

			return self::get_utm_parameter('atfp');
		}

		private static function get_utm_parameter($prefix){
			if($prefix === 'cpel'){
				return 'ref=creame&utm_source='.$prefix.'_plugin';
			}else{
				return 'utm_source='.$prefix.'_plugin';
			}
		}

		public static function bulk_translation_render($current_screen){
			global $polylang;

			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verification is not required here
			$post_status=isset($_GET['post_status']) ? sanitize_text_field(wp_unslash($_GET['post_status'])) : '';

			if('trash' === $post_status){
				return;
			}
        
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- No need to verify nonce here.
			if(!$polylang || !property_exists($polylang, 'model') || (isset($current_screen->action) && $current_screen->action === 'add') || (isset($_GET['post']) && isset($_GET['action']) && $_GET['action'] === 'edit')){
				return false;
			}

			$translated_post_types = $polylang->model->get_translated_post_types();
			$translated_post_types = array_values($translated_post_types);
				
			$translated_post_types=array_filter($translated_post_types, function($post_type){
				return is_string($post_type);
			});

			if(isset($current_screen->taxonomy) && !empty($current_screen->taxonomy)){
				return false;
			}
	
			$valid_post_type=(isset($current_screen->post_type) && !empty($current_screen->post_type)) && in_array($current_screen->post_type, $translated_post_types) && $current_screen->post_type !== 'attachment' ? $current_screen->post_type : false;

			if(isset($current_screen->is_block_editor) && true === $current_screen->is_block_editor){
				return false;
			}
	
			if(!$valid_post_type || empty($valid_post_type)){
				return false;
			}

			return true;
		}

		public static function get_polylang_default_language(){
			if(function_exists('pll_default_language')){
				return pll_default_language();
			}
			return '';
		}

		public static function get_polylang_supported_languages(){
			if(function_exists('PLL') && property_exists(PLL(), 'model')){
				$atfp_polylang_languages = PLL()->model->get_languages_list();
				$atfp_polylang_languages_object = array();
				foreach ($atfp_polylang_languages as $lang) {
					$atfp_polylang_languages_object[$lang->slug] = array('name' => $lang->name);
				}

				return $atfp_polylang_languages_object;
			}
			return array();
		}

		/**
		 * Translation engines shipped with the free version.
		 *
		 * Single source of truth for the provider allow-list, so option values
		 * coming from settings and AJAX are validated against the same set.
		 *
		 * @since 1.5.0
		 *
		 * @return string[] Provider keys.
		 */
		public static function get_supported_providers(){
			return array('chrome-built-in-ai', 'edge-built-in-ai', 'yandex-translate', 'google-translate');
		}

		/**
		 * Provider pre-selected when the translation modal opens.
		 *
		 * Falls back to Google Translate when the site has not chosen one, and
		 * returns an empty string when that engine is switched off, so callers
		 * never get a default the modal could not actually use.
		 *
		 * @since 1.5.0
		 *
		 * @return string Provider key, or '' when there is no usable default.
		 */
		/**
		 * Translation status for the rows currently listed.
		 *
		 * Embedded in the page so the modal can suggest which single post to
		 * translate without an admin-ajax round trip, which on a site with many
		 * plugins costs far more than the lookup itself.
		 *
		 * @since 1.6.0
		 *
		 * @param int[] $post_ids Listed post IDs.
		 *
		 * @return array Map of post ID to title, translation counts and support flags.
		 */
		public static function get_posts_translation_meta( $post_ids ) {
			$post_ids = array_values( array_filter( array_unique( array_map( 'absint', (array) $post_ids ) ) ) );
			$post_ids = array_slice( $post_ids, 0, 200 );

			$meta = array();

			if ( empty( $post_ids ) || ! function_exists( 'pll_get_post_translations' ) ) {
				return $meta;
			}

			// Single query for every row, so the lookups below are cache hits.
			_prime_post_caches( $post_ids );

			$language_count   = count( self::get_polylang_supported_languages() );
			$default_language = function_exists( 'pll_default_language' ) ? pll_default_language( 'slug' ) : '';

			foreach ( $post_ids as $post_id ) {
				if ( ! current_user_can( 'edit_post', $post_id ) ) {
					continue;
				}

				$editor_type = self::get_post_editor_type( $post_id );

				// pll_get_post_translations() includes the post itself.
				$translations  = pll_get_post_translations( $post_id );
				$post_language = function_exists( 'pll_get_post_language' ) ? pll_get_post_language( $post_id, 'slug' ) : '';
				$title         = get_the_title( $post_id );

				$meta[ (string) $post_id ] = array(
					'title'     => '' !== trim( $title ) ? $title : __( '(no title)', 'automatic-translations-for-polylang' ),
					'done'      => max( 0, count( $translations ) - 1 ),
					'complete'  => ( $language_count > 0 && count( $translations ) >= $language_count ),
					'source'    => ( '' !== $default_language && $post_language === $default_language ),
					'supported' => (bool) ( $editor_type && self::is_supported_editor_type( $editor_type ) ),
				);
			}

			return $meta;
		}

		public static function get_default_provider(){
			$default_provider = sanitize_key( get_option( 'atfp_default_provider', 'google-translate' ) );

			return in_array( $default_provider, self::get_active_providers(), true ) ? $default_provider : '';
		}

		public static function get_active_providers(){
			$active_providers = get_option('atfp_enabled_providers', array());

			$default_active_providers = array_fill_keys(self::get_supported_providers(), true);

			if($active_providers && !empty($active_providers)){
				$active_providers_values=array_values($active_providers);

				$first_value_type=gettype($active_providers_values[0]);

				if($first_value_type !== 'boolean'){
					$update_values=array_fill_keys($active_providers_values, true);
					update_option('atfp_enabled_providers', $update_values);
				}
			}

			$active_providers=array_merge($default_active_providers, $active_providers);
	
			$valid_providers = self::get_supported_providers();
	
			$active_providers = array_filter($active_providers, function($status) {
				return $status === true;
			});

			$active_providers = array_intersect(array_keys($active_providers), $valid_providers);

			return $active_providers;
		}


		public static function get_automatic_translate_meta_fields( $post_id = 0 ) {
			$allowed_fields = array(
				'_yoast_wpseo_title'                 => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_focuskw'               => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_metadesc'              => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_bctitle'               => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_opengraph-title'       => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_opengraph-description' => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_twitter-title'         => array( 'status' => true, 'type' => 'string' ),
				'_yoast_wpseo_twitter-description'   => array( 'status' => true, 'type' => 'string' ),
				'rank_math_title'                    => array( 'status' => true, 'type' => 'string' ),
				'rank_math_description'              => array( 'status' => true, 'type' => 'string' ),
				'rank_math_focus_keyword'            => array( 'status' => true, 'type' => 'string' ),
				'rank_math_facebook_title'           => array( 'status' => true, 'type' => 'string' ),
				'rank_math_facebook_description'     => array( 'status' => true, 'type' => 'string' ),
				'rank_math_twitter_title'            => array( 'status' => true, 'type' => 'string' ),
				'rank_math_twitter_description'      => array( 'status' => true, 'type' => 'string' ),
				'rank_math_breadcrumb_title'         => array( 'status' => true, 'type' => 'string' ),
				'_seopress_titles_title'             => array( 'status' => true, 'type' => 'string' ),
				'_seopress_titles_desc'              => array( 'status' => true, 'type' => 'string' ),
				'_seopress_social_fb_title'          => array( 'status' => true, 'type' => 'string' ),
				'_seopress_social_fb_desc'           => array( 'status' => true, 'type' => 'string' ),
				'_seopress_social_twitter_title'     => array( 'status' => true, 'type' => 'string' ),
				'_seopress_social_twitter_desc'      => array( 'status' => true, 'type' => 'string' ),
				'_seopress_analysis_target_kw'       => array( 'status' => true, 'type' => 'string' ),
			);

			$post_id = absint( $post_id );
			if ( $post_id ) {
				$allowed_fields = array_merge( $allowed_fields, self::get_post_acf_meta_fields( $post_id ) );
			}

			return $allowed_fields;
		}

		/**
		 * Collects ACF text/textarea/wysiwyg meta keys for a post, including nested repeater and flexible-content rows.
		 *
		 * Nested keys (e.g. repeater_0_title) are stored as public post meta with a matching _key field reference.
		 * Parent repeater/flexible fields are skipped; those are synced as-is, not translated.
		 *
		 * @param int $post_id Source post ID.
		 * @return array
		 */
		private static function get_post_acf_meta_fields( $post_id ) {
			$allowed_fields = array();
			$post_id        = absint( $post_id );

			if ( ! $post_id ) {
				return $allowed_fields;
			}

			if ( ! function_exists( 'acf_get_field' ) ) {
				if ( ! function_exists( 'get_field_objects' ) ) {
					return $allowed_fields;
				}

				$acf_fields = get_field_objects( $post_id );
				if ( ! is_array( $acf_fields ) ) {
					return $allowed_fields;
				}

				foreach ( $acf_fields as $field ) {
					if ( isset( $field['type'], $field['name'] ) && in_array( $field['type'], array( 'text', 'textarea', 'wysiwyg' ), true ) && ! empty( $field['name'] ) ) {
						$allowed_fields[ $field['name'] ] = array( 'status' => true, 'type' => 'string' );
					}
				}

				return $allowed_fields;
			}

			$text_types = array( 'text', 'textarea', 'wysiwyg' );
			$all_meta   = get_post_meta( $post_id );

			foreach ( (array) $all_meta as $key => $values ) {
				if ( '' === $key || '_' === $key[0] ) {
					continue;
				}

				if ( self::is_acf_structural_field( $key, $post_id ) ) {
					continue;
				}

				$field_ref = isset( $all_meta[ '_' . $key ][0] ) ? maybe_unserialize( $all_meta[ '_' . $key ][0] ) : '';
				$field     = ( is_string( $field_ref ) && isset( $field_ref[0] ) && 'field_' === substr( $field_ref, 0, 6 ) ) ? acf_get_field( $field_ref ) : acf_get_field( $key );

				if ( ! $field || ! isset( $field['type'] ) || ! in_array( $field['type'], $text_types, true ) ) {
					continue;
				}

				$allowed_fields[ $key ] = array( 'status' => true, 'type' => 'string' );
			}

			return $allowed_fields;
		}

		/**
		 * Checks whether a meta key is the parent field of an ACF flexible content or repeater field.
		 *
		 * @param string $meta_key Meta key to check.
		 * @param int    $post_id  Optional post ID used to resolve nested field keys.
		 * @return bool
		 */
		public static function is_acf_structural_field( $meta_key, $post_id = 0 ) {
			if ( ! function_exists( 'acf_get_field' ) ) {
				return false;
			}

			$meta_key  = sanitize_text_field( $meta_key );
			$field_key = $post_id ? get_post_meta( absint( $post_id ), '_' . $meta_key, true ) : '';
			$field     = ( is_string( $field_key ) && isset( $field_key[0] ) && 'field_' === substr( $field_key, 0, 6 ) ) ? acf_get_field( $field_key ) : acf_get_field( $meta_key );

			return $field && isset( $field['type'] ) && in_array( $field['type'], array( 'flexible_content', 'repeater' ), true );
		}

		/**
		 * Returns hashes of ACF repeater/flexible parent fields on a post.
		 *
		 * @param int $post_id Source post ID.
		 * @return array
		 */
		public static function get_acf_structural_field_hashes( $post_id ) {
			$hashes  = array();
			$post_id = absint( $post_id );

			if ( ! $post_id ) {
				return $hashes;
			}

			foreach ( array_keys( (array) get_post_meta( $post_id ) ) as $key ) {
				if ( '' !== $key && '_' !== $key[0] && self::is_acf_structural_field( $key, $post_id ) ) {
					$value           = get_post_meta( $post_id, $key, true );
					$hashes[ sanitize_text_field( $key ) ] = md5( sanitize_text_field( is_array( $value ) ? maybe_serialize( $value ) : $value ) );
				}
			}

			return $hashes;
		}

		/**
		 * Copies ACF repeater/flexible parent structure and nested field-key references from source to target.
		 *
		 * The parent field stores row counts or layout names. Translating those values breaks ACF rendering
		 * even when subfields are translated correctly. They must be copied as-is.
		 *
		 * @param int $source_post_id Source post ID.
		 * @param int $target_post_id Target post ID.
		 * @return void
		 */
		public static function sync_acf_structural_fields( $source_post_id, $target_post_id ) {
			$source_post_id = absint( $source_post_id );
			$target_post_id = absint( $target_post_id );

			if ( ! $source_post_id || ! $target_post_id || $source_post_id === $target_post_id ) {
				return;
			}

			$source_meta              = get_post_meta( $source_post_id );
			$structural_field_hashes  = self::get_acf_structural_field_hashes( $source_post_id );

			foreach ( array_keys( $structural_field_hashes ) as $key ) {
				if ( isset( $source_meta[ $key ][0] ) ) {
					update_post_meta( $target_post_id, $key, maybe_unserialize( $source_meta[ $key ][0] ) );
				}

				$field_key = isset( $source_meta[ '_' . $key ][0] ) ? maybe_unserialize( $source_meta[ '_' . $key ][0] ) : '';
				if ( is_string( $field_key ) && isset( $field_key[0] ) && 'field_' === substr( $field_key, 0, 6 ) ) {
					update_post_meta( $target_post_id, '_' . $key, $field_key );
				}

				$nested_meta_prefix = '_' . $key . '_';
				foreach ( (array) $source_meta as $meta_key => $values ) {
					if ( isset( $meta_key[0] ) && substr( $meta_key, 0, strlen( $nested_meta_prefix ) ) === $nested_meta_prefix && isset( $values[0] ) && is_string( $values[0] ) && isset( $values[0][0] ) && 'field_' === substr( $values[0], 0, 6 ) ) {
						update_post_meta( $target_post_id, $meta_key, $values[0] );
					}
				}
			}
		}

		/**
		 * Editor types the free version can translate.
		 *
		 * The automatic (single post) flow only translates block editor and Elementor
		 * content; classic editor content is a Pro capability. Bulk translation must
		 * honour exactly the same list so both flows offer identical support.
		 *
		 * @since 1.5.0
		 * @return string[] Supported editor type slugs.
		 */
		public static function get_supported_editor_types() {
			return array( 'block', 'elementor' );
		}

		/**
		 * Whether the given editor type can be translated by the free version.
		 *
		 * @since 1.5.0
		 * @param string $editor_type Editor type slug.
		 * @return bool
		 */
		public static function is_supported_editor_type( $editor_type ) {
			return in_array( $editor_type, self::get_supported_editor_types(), true );
		}

		/**
		 * Resolve which editor a post's content belongs to.
		 *
		 * @since 1.5.0
		 * @param int $post_id Post ID.
		 * @return string|false One of 'elementor', 'block', 'classic', or false when the post is missing.
		 */
		public static function get_post_editor_type( $post_id ) {
			$post_id   = absint( $post_id );
			$post_data = get_post( $post_id );

			if ( ! $post_data ) {
				return false;
			}

			if (
				'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true )
				&& defined( 'ELEMENTOR_VERSION' )
				&& self::has_elementor_data( (int) $post_id )
			) {
				return 'elementor';
			}

			return has_blocks( $post_data->post_content ) ? 'block' : 'classic';
		}

		public static function has_elementor_data(int $post_id): bool {
			$elementor_data = get_post_meta($post_id, '_elementor_data', true);

			if (is_array($elementor_data)) {
				return !empty($elementor_data);
			}

			if (!is_string($elementor_data)) {
				return !empty($elementor_data);
			}

			$elementor_data = trim($elementor_data);

			if ('' === $elementor_data) {
				return false;
			}

			$decoded_data = json_decode($elementor_data, true);

			if (JSON_ERROR_NONE === json_last_error()) {
				return self::elementor_data_has_widgets($decoded_data);
			}

			return true;
		}

		private static function elementor_data_has_widgets($data): bool {
			if (!is_array($data) || empty($data)) {
				return false;
			}

			foreach ($data as $element) {
				if (!is_array($element)) {
					continue;
				}

				if ((isset($element['elType']) && 'widget' === $element['elType']) || !empty($element['widgetType'])) {
					return true;
				}

				if (isset($element['elements']) && self::elementor_data_has_widgets($element['elements'])) {
					return true;
				}
			}

			return false;
		}
	}
}
