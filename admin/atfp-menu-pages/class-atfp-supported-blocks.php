<?php
/**
 * Do not access the page directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'ATFP_Supported_Blocks' ) ) {
	/**
	 * Class ATFP_Supported_Blocks
	 *
	 * This class handles the supported blocks for the Automatic Translations For Polylang plugin.
	 *
	 * @package ATFP
	 */
	class ATFP_Supported_Blocks {
		/**
		 * Singleton instance.
		 *
		 * @var ATFP_Supported_Blocks
		 */
		private static $instance = null;

		/**
		 * Get the singleton instance of the class.
		 *
		 * @return ATFP_Supported_Blocks
		 */
		public static function get_instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor for the ATFP_Supported_Blocks class.
		 */
		private function __construct() {
			add_action( 'admin_menu', array( $this, 'atfp_add_submenu_page' ), 11 );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_editor_assets' ) );

		}

		/**
		 * Enqueue editor CSS for the supported blocks page.
		 */
		public function enqueue_editor_assets( $hook ) {
			if ( $hook === 'languages_page_atfp-supported-blocks' ) {
				wp_enqueue_script( 'atfp-datatable-script', ATFP_URL . 'assets/js/dataTables.min.js', array(), ATFP_V, true );
				wp_enqueue_script( 'atfp-datatable-style', ATFP_URL . 'assets/js/dataTables.min.js', array(), ATFP_V, true );
				wp_enqueue_style( 'atfp-editor-supported-blocks', ATFP_URL . 'assets/css/atfp-supported-blocks.min.css', array(), ATFP_V );
				wp_enqueue_script( 'atfp-editor-supported-blocks', ATFP_URL . 'assets/js/atfp-supported-block.min.js', array('atfp-datatable-script'), ATFP_V, true );
			}
		}
		/**
		 * Add submenu page under the Polylang menu.
		 */
		public function atfp_add_submenu_page() {
			add_submenu_page(
				'mlang', // Parent slug
				__( 'Support Blocks', 'automatic-translations-for-polylang' ), // Page title
				__( 'Support Blocks', 'automatic-translations-for-polylang' ), // Menu title
				'manage_options', // Capability
				'atfp-supported-blocks', // Menu slug
				array( $this, 'atfp_render_support_blocks_page' ) // Callback function
			);
		}

		/**
		 * Render the support blocks page.
		 */
		public function atfp_render_support_blocks_page() {
			// $content = $this->atfp_get_supported_blocks_table();
			?>
		<div class="atfp-supported-blocks-wrapper">
			<div class="atfp-help-section">
				<h2><?php esc_html_e( 'Help', 'automatic-translations-for-polylang' ); ?></h2>
				<p><?php esc_html_e( 'This section provides information on the number of blocks that are supported for automatic translation.', 'automatic-translations-for-polylang' ); ?></p>
			</div>
			<div class="atfp-supported-blocks-filters">
				<div class="atfp-filter-tab">
					<h3><?php esc_html_e( 'Filter Blocks:', 'automatic-translations-for-polylang' ); ?></h3>
					<select id="atfp-blocks-filter" name="atfp_blocks_filter">
						<option value="all"><?php esc_html_e( 'All Blocks', 'automatic-translations-for-polylang' ); ?></option>
						<option value="supported"><?php esc_html_e( 'Supported Blocks', 'automatic-translations-for-polylang' ); ?></option>
						<option value="unsupported"><?php esc_html_e( 'Unsupported Blocks', 'automatic-translations-for-polylang' ); ?></option>
					</select>
				</div>
				<div class="atfp-sortby-tab">
					<h3><?php esc_html_e( 'Sort By:', 'automatic-translations-for-polylang' ); ?></h3>
					<select id="atfp-sortby-tab" name="atfp_sortby_filter">
						<option value="name"><?php esc_html_e( 'Name', 'automatic-translations-for-polylang' ); ?></option>
						<option value="supported" selected><?php esc_html_e( 'Supported Block', 'automatic-translations-for-polylang' ); ?></option>
						<option value="unsupported"><?php esc_html_e( 'Unsupported Block', 'automatic-translations-for-polylang' ); ?></option>
					</select>
				</div>
				<!-- <div class="atfp-search-tab">
					<h3><?php esc_html_e( 'Search Blocks:', 'automatic-translations-for-polylang' ); ?></h3>
					<input type="search" id="atfp-blocks-search" name="atfp_blocks_search" placeholder="<?php esc_attr_e( 'Search Blocks...', 'automatic-translations-for-polylang' ); ?>" />
				</div> -->
			</div>
			<div class="atfp-blocks-section">
				<h3><?php esc_html_e( 'Supported Blocks', 'automatic-translations-for-polylang' ); ?></h3>
				<div class="atfp-blocks-lists">
					<table class="atfp-supported-blocks-table" id="atfp-supported-blocks-table">
						<thead>
							<tr>
								<th><?php esc_html_e( 'S No', 'automatic-translations-for-polylang' ); ?></th>
								<th><?php esc_html_e( 'Block Name', 'automatic-translations-for-polylang' ); ?></th>
								<th><?php esc_html_e( 'Block Title', 'automatic-translations-for-polylang' ); ?></th>
								<th><?php esc_html_e( 'Status', 'automatic-translations-for-polylang' ); ?></th>
								<th><?php esc_html_e( 'Modify', 'automatic-translations-for-polylang' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php 
							// echo $content['html'];
								$this->atfp_get_supported_blocks_table()
							?>
						</tbody>
					</table>
			</div>
		</div>
			<?php
			// echo $content['pagination'];
			?>
			<?php
		}

		/**
		 * Get the supported blocks.
		 */
		public function atfp_get_supported_blocks() {

			if ( class_exists( 'WP_Block_Type_Registry' ) && method_exists( 'WP_Block_Type_Registry', 'get_all_registered' ) ) {
				$atfp_block_parse_rules      = ATFP_Helper::get_instance()->get_block_parse_rules();
				$blocks_data                 = WP_Block_Type_Registry::get_instance()->get_all_registered();
				$atfp_supported_blocks       = $atfp_block_parse_rules['AtfpBlockParseRules'];
				$atfp_supported_blocks_names = array_keys( $atfp_supported_blocks );
				$s_no                        = 1;
				$atfp_post_id                = ATFP_Helper::get_custom_block_post_id();
				$paged                       = isset( $_GET['paged'] ) ? intval( $_GET['paged'] ) : 1;
				
				$filter_blocks_data = array_filter( $blocks_data, function( $block ) {
					return !in_array($block->category, array( 'media', 'reusable' ));
				} );
				
				$max_page                    = ceil( count( $filter_blocks_data ) / 20 );

				$offset              = ( $paged - 1 ) * 20; // Calculate the starting index

				$limited_blocks_data = array_slice( $filter_blocks_data, $offset, 20 ); // Get the subset of blocks
				// $limited_blocks_data = $blocks_data; // Get the subset of blocks
				$html                = '';
				foreach ( $limited_blocks_data as $block ) {

					$block_name  = esc_html( $block->name );
					$block_title = esc_html( $block->title );
					$status      = ! in_array( $block_name, $atfp_supported_blocks_names ) ? 'Unsupported' : 'Supported'; // You can modify this logic based on your requirements
					$modify_text = ! in_array( $block_name, $atfp_supported_blocks_names ) ? esc_html__( 'Add', 'automatic-translations-for-polylang' ) : esc_html__( 'Edit', 'automatic-translations-for-polylang' );
					$modify_link = '<a href="' . esc_url( admin_url( 'post.php?post=' . esc_attr( $atfp_post_id ) . '&action=edit&atfp_new_block=' ) . esc_attr( $block_name ) ) . '">' . $modify_text . '</a>'; // Modify link
					$modify_link = '<a href="' . esc_url( admin_url( 'post.php?post=' . esc_attr( $atfp_post_id ) . '&action=edit&atfp_new_block=' ) . esc_attr( $block_name ) ) . '">' . $modify_text . '</a>'; // Modify link

					$html .= '<tr data-block-name="' . esc_attr( strtolower( $block_name ) ) . '" data-block-status="' . esc_attr( strtolower( $status ) ) . '" >';
					$html .= '<td>' . $s_no++ . '</td>';
					$html .= '<td>' . $block_name . '</td>';
					$html .= '<td>' . $block_title . '</td>';
					$html .= '<td>' . $status . '</td>';
					$html .= '<td>' . $modify_link . '</td>';
					$html .= '</tr>';
				}

				$pagination = ATFP_Helper::atfp_pagination( $max_page, $paged );

				return array(
					'pagination' => $pagination,
					'html'       => $html,
				);
			}

		}

		/**
		 * Get the supported blocks.
		 */
		public function atfp_get_supported_blocks_table() {

			if ( class_exists( 'WP_Block_Type_Registry' ) && method_exists( 'WP_Block_Type_Registry', 'get_all_registered' ) ) {
				$atfp_block_parse_rules      = ATFP_Helper::get_instance()->get_block_parse_rules();
				$blocks_data                 = WP_Block_Type_Registry::get_instance()->get_all_registered();
				$atfp_supported_blocks       = $atfp_block_parse_rules['AtfpBlockParseRules'];
				$atfp_supported_blocks_names = array_keys( $atfp_supported_blocks );
				$s_no                        = 1;
				$atfp_post_id                = ATFP_Helper::get_custom_block_post_id();
				
				$filter_blocks_data = array_filter( $blocks_data, function( $block ) {
					return !in_array($block->category, array( 'media', 'reusable' ));
				} );

				$html                = '';
				foreach ( $filter_blocks_data as $block ) {

					$block_name  = esc_html( $block->name );
					$block_title = esc_html( $block->title );
					$status      = ! in_array( $block_name, $atfp_supported_blocks_names ) ? 'Unsupported' : 'Supported'; // You can modify this logic based on your requirements
					$modify_text = ! in_array( $block_name, $atfp_supported_blocks_names ) ? esc_html__( 'Add', 'automatic-translations-for-polylang' ) : esc_html__( 'Edit', 'automatic-translations-for-polylang' );
					$modify_link = '<a href="' . esc_url( admin_url( 'post.php?post=' . esc_attr( $atfp_post_id ) . '&action=edit&atfp_new_block=' ) . esc_attr( $block_name ) ) . '">' . $modify_text . '</a>'; // Modify link
					$modify_link = '<a href="' . esc_url( admin_url( 'post.php?post=' . esc_attr( $atfp_post_id ) . '&action=edit&atfp_new_block=' ) . esc_attr( $block_name ) ) . '">' . $modify_text . '</a>'; // Modify link

					echo '<tr data-block-name="' . esc_attr( strtolower( $block_name ) ) . '" data-block-status="' . esc_attr( strtolower( $status ) ) . '" >';
					echo '<td>' . $s_no++ . '</td>';
					echo '<td>' . $block_name . '</td>';
					echo '<td>' . $block_title . '</td>';
					echo '<td>' . $status . '</td>';
					echo '<td>' . $modify_link . '</td>';
					echo '</tr>';
				}
			}

		}
	}

	ATFP_Supported_Blocks::get_instance();
}
