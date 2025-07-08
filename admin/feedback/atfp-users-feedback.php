<?php

namespace ATFP\feedback;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class AtfpUsersFeedback {

	private $plugin_url     = ATFP_URL;
	private $plugin_version = ATFP_V;
	private $plugin_name    = 'Automatic Translations For Polylang';
	private $plugin_slug    = 'automatic-translations-for-polylang';
	private $plugin_domain  = 'atfp';
	/*
	|-----------------------------------------------------------------|
	|   Use this constructor to fire all actions and filters          |
	|-----------------------------------------------------------------|
	*/
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_feedback_scripts' ) );

		add_action( 'wp_ajax_' . $this->plugin_slug . '_submit_deactivation_response', array( $this, 'submit_deactivation_response' ) );
		add_action( 'admin_init', array( $this, 'onInit' ) );
	}
	public function onInit() {
		add_action( 'admin_head', array( $this, 'show_deactivate_feedback_popup' ) );
	}
	/*
	|-----------------------------------------------------------------|
	|   Enqueue all scripts and styles to required page only          |
	|-----------------------------------------------------------------|
	*/
	function enqueue_feedback_scripts() {
		$screen = get_current_screen();
		if ( isset( $screen ) && $screen->id == 'plugins' ) {
			wp_enqueue_script( __NAMESPACE__ . 'feedback-script', $this->plugin_url . 'admin/feedback/js/admin-feedback.js', array( 'jquery' ), $this->plugin_version );
			wp_enqueue_style( 'cool-plugins-feedback-style', $this->plugin_url . 'admin/feedback/css/admin-feedback.css', null, $this->plugin_version );
		}
	}

	/*
	|-----------------------------------------------------------------|
	|   HTML for creating feedback popup form                         |
	|-----------------------------------------------------------------|
	*/
	public function show_deactivate_feedback_popup() {
		$screen = get_current_screen();
		if ( ! isset( $screen ) || $screen->id != 'plugins' ) {
			return;
		}
		$deactivate_reasons = array(
			'didnt_work_as_expected'         => array(
				'title'             => esc_html( __( 'The plugin didn\'t work as expected', 'autopoly-ai-translation-for-polylang' ) ),
				'input_placeholder' => 'What did you expect?',
			),
			'found_a_better_plugin'          => array(
				'title'             => esc_html( __( 'I found a better plugin', 'autopoly-ai-translation-for-polylang' ) ),
				'input_placeholder' => esc_html( __( 'Please share which plugin', 'autopoly-ai-translation-for-polylang' ) ),
			),
			'couldnt_get_the_plugin_to_work' => array(
				'title'             => esc_html( __( 'The plugin is not working', 'autopoly-ai-translation-for-polylang' ) ),
				'input_placeholder' => 'Please share your issue. So we can fix that for other users.',
			),
			'temporary_deactivation'         => array(
				'title'             => esc_html( __( 'It\'s a temporary deactivation', 'autopoly-ai-translation-for-polylang' ) ),
				'input_placeholder' => '',
			),
			'other'                          => array(
				'title'             => esc_html( __( 'Other', 'autopoly-ai-translation-for-polylang' ) ),
				'input_placeholder' => esc_html( __( 'Please share the reason', 'autopoly-ai-translation-for-polylang' ) ),
			),
		);

		?>
		<div id="cool-plugins-deactivate-feedback-dialog-wrapper" class="hide-feedback-popup" data-slug="<?php echo esc_attr( $this->plugin_slug ); ?>">
						
			<div class="cool-plugins-deactivation-response">
			<div id="cool-plugins-deactivate-feedback-dialog-header">
				<span id="cool-plugins-feedback-form-title"><?php echo esc_html( __( 'Quick Feedback', 'autopoly-ai-translation-for-polylang' ) ); ?></span>
			</div>
			<div id="cool-plugins-loader-wrapper">
				<div class="cool-plugins-loader-container">
					<img class="cool-plugins-preloader" src="<?php echo esc_url( $this->plugin_url ); ?>admin/feedback/images/cool-plugins-preloader.gif">
				</div>
			</div>
			<div id="cool-plugins-form-wrapper" class="cool-plugins-form-wrapper-cls">
			<form id="cool-plugins-deactivate-feedback-dialog-form" method="post">
				<?php
				wp_nonce_field( '_cool-plugins_deactivate_feedback_nonce', "$this->plugin_slug-wpnonce" );
				?>
				<input type="hidden" name="action" value="cool-plugins_deactivate_feedback" />
				<div id="cool-plugins-deactivate-feedback-dialog-form-caption"><?php echo esc_html( __( 'If you have a moment, please share why you are deactivating this plugin.', 'autopoly-ai-translation-for-polylang' ) ); ?></div>
				<div id="cool-plugins-deactivate-feedback-dialog-form-body">
					<?php
					foreach ( $deactivate_reasons as $reason_key => $reason ) :
						?>
						<div class="cool-plugins-deactivate-feedback-dialog-input-wrapper">
							<input id="cool-plugins-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="cool-plugins-deactivate-feedback-dialog-input" type="radio" name="reason_key" value="<?php echo esc_attr( $reason_key ); ?>" />
							<label for="cool-plugins-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="cool-plugins-deactivate-feedback-dialog-label"><?php echo esc_html( $reason['title'] ); ?></label>
							<?php if ( ! empty( $reason['input_placeholder'] ) ) : ?>
								<textarea class="cool-plugins-feedback-text" type="textarea" name="<?php echo esc_attr( $this->plugin_domain ); ?>_reason_<?php echo esc_attr( $reason_key ); ?>" placeholder="<?php echo esc_attr( $reason['input_placeholder'] ); ?>"></textarea>
								<?php
							endif;
							?>
							<?php if ( ! empty( $reason['alert'] ) ) : ?>
								<div class="cool-plugins-feedback-text"><?php echo esc_html( $reason['alert'] ); ?></div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
					<input class="cool-plugins-GDPR-data-notice" id="cool-plugins-GDPR-data-notice-<?php echo esc_attr( $this->plugin_domain ); ?>" type="checkbox"><label for="cool-plugins-GDPR-data-notice"><?php echo esc_html( __( 'I agree to share anonymous usage data and basic site details (such as server, PHP, and WordPress versions) to support AI Translation Addon for Polylang improvement efforts. Additionally, I allow Cool Plugins to store all information provided through this form and to respond to my inquiry.', 'autopoly-ai-translation-for-polylang' ) ); ?></label>
				</div>
				<div class="cool-plugin-popup-button-wrapper">
					<a class="cool-plugins-button button-deactivate" id="cool-plugin-submitNdeactivate">Submit and Deactivate</a>
					<a class="cool-plugins-button" id="cool-plugin-skipNdeactivate">Skip and Deactivate</a>
				</div>
			</form>
			</div>
		   </div>
		</div>
		<?php
	}


	function submit_deactivation_response() {
		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], '_cool-plugins_deactivate_feedback_nonce' ) ) {
			wp_send_json_error();
		} else {
			$reason             = sanitize_text_field( $_POST['reason'] );
			$deactivate_reasons = array(
				'didnt_work_as_expected'         => array(
					'title'             => esc_html( __( 'The plugin didn\'t work as expected', 'autopoly-ai-translation-for-polylang' ) ),
					'input_placeholder' => 'What did you expect?',
				),
				'found_a_better_plugin'          => array(
					'title'             => esc_html( __( 'I found a better plugin', 'autopoly-ai-translation-for-polylang' ) ),
					'input_placeholder' => esc_html( __( 'Please share which plugin', 'autopoly-ai-translation-for-polylang' ) ),
				),
				'couldnt_get_the_plugin_to_work' => array(
					'title'             => esc_html( __( 'The plugin is not working', 'autopoly-ai-translation-for-polylang' ) ),
					'input_placeholder' => 'Please share your issue. So we can fix that for other users.',
				),
				'temporary_deactivation'         => array(
					'title'             => esc_html( __( 'It\'s a temporary deactivation', 'autopoly-ai-translation-for-polylang' ) ),
					'input_placeholder' => '',
				),
				'other'                          => array(
					'title'             => esc_html( __( 'Other', 'autopoly-ai-translation-for-polylang' ) ),
					'input_placeholder' => esc_html( __( 'Please share the reason', 'autopoly-ai-translation-for-polylang' ) ),
				),
			);

			$deativation_reason = array_key_exists( $reason, $deactivate_reasons ) ? $reason : 'other';

			$sanitized_message = sanitize_text_field( $_POST['message'] ) == '' ? 'N/A' : sanitize_text_field( $_POST['message'] );
			$admin_email       = sanitize_email( get_option( 'admin_email' ) );
			$site_url          = esc_url( site_url() );
			$install_date      = get_option('atfp-install-date');
			$plugin_initial =  get_option( 'atfp_initial_save_version' );
			$unique_key     = '41';  // Ensure this key is unique per plugin to prevent collisions when site URL and install date are the same across plugins
			$server_info 	   = \AutoPoly::atfp_get_user_info()['server_info'];
			$extra_details 	   = \AutoPoly::atfp_get_user_info()['extra_details'];
			$site_id        = $site_url . '-' . $install_date . '-' . $unique_key;
			$feedback_url      = esc_url( ATFP_FEEDBACK_API . 'wp-json/coolplugins-feedback/v1/feedback' );
			$response          = wp_remote_post(
				$feedback_url,
				array(
					'timeout' => 30,
					'body'    => array(
						'site_id'=>md5($site_id),
						'server_info' => serialize($server_info),
						'extra_details' => serialize($extra_details),
						'plugin_version' => $this->plugin_version,
						'plugin_name'    => $this->plugin_name,
						'plugin_initial'  => isset($plugin_initial) ? sanitize_text_field($plugin_initial) : 'N/A',
						'reason'         => $deativation_reason,
						'review'         => $sanitized_message,
						'email'          => $admin_email,
						'domain'         => $site_url,
					),
				)
			);

			die( json_encode( array( 'response' => $response ) ) );
		}

	}
}
new AtfpUsersFeedback();
