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
				$post_title    = esc_html__('Add More Gutenberg Blocks', 'automatic-translation-for-polylang');
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
			$response = wp_remote_get( esc_url_raw( ATFP_URL . 'includes/block-translation-rules/block-rules.json' ), array(
				'timeout' => 15,
			) );
			
			if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
				global $wp_filesystem;

				// Initialize the WordPress filesystem
				if ( ! function_exists( 'WP_Filesystem' ) ) {
					require_once ABSPATH . 'wp-admin/includes/file.php';
				}
				
				WP_Filesystem();

				$local_path = ATFP_DIR_PATH . 'includes/block-translation-rules/block-rules.json';
				if($wp_filesystem->exists($local_path) && $wp_filesystem->is_readable( $local_path )){
					$block_rules = $wp_filesystem->get_contents( $local_path );
				}else{
					$block_rules = array();
				}
				
			} else {
				$block_rules = wp_remote_retrieve_body( $response );
			}

			if(empty($block_rules)){
				return array();
			}

			$block_translation_rules = json_decode($block_rules, true);

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
			$home_url = preg_quote(get_home_url(), '/');
			$pattern = '/(' . $home_url . '[^\s"\'<>]*)/i';
			$terms_data=self::get_terms_data();

			if (preg_match_all($pattern, $content, $matches)) {

				foreach ($matches[1] as $href) {
					$postID = url_to_postid($href);
		
					if ($postID > 0) {
						$translatedPost = pll_get_post($postID, $locale);
						if ($translatedPost) {
							$link = get_permalink($translatedPost);
							
							if ($link) {
								$link=esc_url(urldecode_deep($link));
								$content = str_replace($href, $link, $content);
							}
						}
					} else {
						$path = trim(str_replace(home_url(), '', $href), '/');
						$category_slug = end(array_filter(explode('/', $path)));
						$taxonomy_name=self::extract_taxonomy_name($path, $terms_data);
						$taxonomy_name=$taxonomy_name ? $taxonomy_name : 'category';

						$category = get_term_by('slug', $category_slug, $taxonomy_name);

						if(!$category){
								// Remove the language prefix if using Polylang
							$languages = pll_languages_list(); // e.g., ['en', 'fr']
							$segments = explode('/', $path);
							if (in_array($segments[0], $languages)) {
								$lang_code=$segments[0];
								$category_id=Pll()->model->term_exists_by_slug($category_slug, $lang_code, $taxonomy_name);

								if($category_id){
									$category=get_term($category_id, $taxonomy_name);
								}
							}
						}

						
						if ($category) {
							$term_id = pll_get_term($category->term_id, $locale);
							if ($term_id > 0) {
								$link = get_category_link($term_id);
								$content = str_replace($href, esc_url($link), $content);
							}
						}
					}
				}
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
	}
}
