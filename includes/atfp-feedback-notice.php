<?php

if ( ! class_exists( 'atfpFeedbackNotice' ) ) {
	class atfpFeedbackNotice {
		/**
		 * The Constructor
		 */
		public function __construct() {
			// register actions

			if ( is_admin() ) {
				add_action( 'admin_notices', array( $this, 'atfp_admin_notice_for_reviews' ) );
				add_action( 'admin_print_scripts', array( $this, 'atfp_load_script' ) );
				add_action( 'wp_ajax_atfp_dismiss_notice', array( $this, 'atfp_dismiss_review_notice' ) );
			}
		}

		/**
		 * Load script to dismiss notices.
		 *
		 * @return void
		 */
		public function atfp_load_script() {
			wp_register_script( 'atfp-feedback-notice-script', ATFP_URL . 'assets/js/atfp-admin-feedback-notice.js', array( 'jquery' ), null, true );
			wp_enqueue_script( 'atfp-feedback-notice-script' );
			wp_register_style( 'atfp-feedback-notice-styles', ATFP_URL . 'assets/css/atfp-admin-feedback-notice.css' );
			wp_enqueue_style( 'atfp-feedback-notice-styles' );
		}
		// ajax callback for review notice
		public function atfp_dismiss_review_notice() {
			if ( ! wp_verify_nonce( $_POST['private'], 'atfp_review_nonce' ) ) {
				wp_send_json_error( array( 'message' => 'nonce verification failed' ) );
				exit();
			}
			update_option( 'atfp-ratingDiv', 'yes' );
			echo json_encode( array( 'success' => 'true' ) );
			exit;
		}
		// admin notice
		public function atfp_admin_notice_for_reviews() {

			if ( ! current_user_can( 'update_plugins' ) ) {
				return;
			}
			 // get installation dates and rated settings
			 $installation_date = get_option( 'atfp-installDate' );
			 $alreadyRated      = get_option( 'atfp-ratingDiv' ) != false ? get_option( 'atfp-ratingDiv' ) : 'no';

			 // check user already rated
			if ( $alreadyRated == 'yes' ) {
				return;
			}

			// grab plugin installation date and compare it with current date
			$display_date = date( 'Y-m-d h:i:s' );
			$install_date = new DateTime( $installation_date );
			$current_date = new DateTime( $display_date );
			$difference   = $install_date->diff( $current_date );
			$diff_days    = $difference->days;

			// check if installation days is greator then week
			if ( isset( $diff_days ) && $diff_days >= 3 ) {
				  echo $this->create_notice_content();
			}
		}

		// generated review notice HTML
		function create_notice_content() {

			$ajax_url           = admin_url( 'admin-ajax.php' );
			$ajax_callback      = 'atfp_dismiss_notice';
			$wrap_cls           = 'notice notice-info is-dismissible';
			$img_path           = ATFP_URL . 'assets/images/atfp-logo.png';
			$p_name             = 'Automatic Translations For Polylang';
			$like_it_text       = 'Rate Now! ★★★★★';
			$already_rated_text = esc_html__( 'I already rated it', 'fatfp' );
			$not_like_it_text   = esc_html__( 'No, not good enough, i do not like to rate it!', 'fatfp' );
			$p_link             = esc_url( 'https://wordpress.org/support/plugin/duplicate-content-addon-for-polylang/reviews/#new-post' );
			$not_interested     = esc_html__( 'Not Interested', 'ect' );
			$nonce              = wp_create_nonce( 'atfp_review_nonce' );

			$message = "Thanks for using <b>$p_name</b> WordPress plugin. We hope it meets your expectations! <br/>Please give us a quick rating, it works as a boost for us to keep working on more <a href='https://coolplugins.net' target='_blank'><strong>Cool Plugins</strong></a>!<br/>";

			$html = '<div data-ajax-url="%8$s" data-nonce="%11$s" data-ajax-callback="%9$s" class="cool-feedback-notice-wrapper %1$s">
        <div class="logo_container"><a href="%5$s"><img src="%2$s" alt="%3$s"></a></div>
        <div class="message_container">%4$s
        <div class="callto_action">
        <ul>
            <li class="love_it"><a href="%5$s" class="like_it_btn button button-primary" target="_new" title="%6$s">%6$s</a></li>
            <li class="already_rated"><a href="javascript:void(0);" class="already_rated_btn button atfp_dismiss_notice" title="%7$s">%7$s</a></li>            
            <li class="already_rated"><a href="javascript:void(0);" class="already_rated_btn button atfp_dismiss_notice" title="%10$s">%10$s</a></li>
        </ul>
        <div class="clrfix"></div>
        </div>
        </div>
        </div>';

			return sprintf(
				$html,
				esc_attr( $wrap_cls ),
				esc_attr( $img_path ),
				esc_attr( $p_name ),
				$message,
				esc_url( $p_link ),
				esc_attr( $like_it_text ),
				esc_attr( $already_rated_text ),
				esc_url( $ajax_url ), // 8
				esc_attr( $ajax_callback ), // 9
				esc_attr( $not_interested ), // 10
				esc_attr( $nonce )
			);

		}

	} //class end

}



