<?php
/**
 * Dashboard tab of the AutoPoly admin screen.
 *
 * @package automatic-translations-for-polylang
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$atfp_active_providers  = ATFP_Helper::get_active_providers();
$atfp_default_provider  = ATFP_Helper::get_default_provider();
$atfp_default_nonce     = wp_create_nonce( 'atfp_update_enabled_providers' );

/**
 * Translation engines shipped with the free version.
 *
 * The Pro engines (OpenAI, Gemini, DeepL) are promoted on the Free vs Pro tab,
 * so this list only carries what the user can actually switch on today.
 *
 * `configure` marks the browser based engines: the readiness script reveals
 * their Configure link when the browser cannot run the built-in translator.
 */
$atfp_providers = array(
	'google-translate'   => array(
		'name'      => __( 'Google Translate', 'automatic-translations-for-polylang' ),
		'logo'      => 'google.png',
		'docs'      => 'https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_google',
		'configure' => '',
	),
	'chrome-built-in-ai' => array(
		'name'      => __( 'Chrome Built-in AI', 'automatic-translations-for-polylang' ),
		'logo'      => 'chrome.png',
		'docs'      => 'https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_chrome_pro',
		'configure' => 'chrome',
	),
	'edge-built-in-ai'   => array(
		'name'      => __( 'Edge Built-in AI', 'automatic-translations-for-polylang' ),
		'logo'      => 'edge.png',
		'docs'      => 'https://docs.coolplugins.net/doc/microsoft-edge-ai-polylang-translation/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_edge_pro',
		'configure' => 'edge',
	),
	'yandex-translate'   => array(
		'name'      => __( 'Yandex Translate', 'automatic-translations-for-polylang' ),
		'logo'      => 'yandex.png',
		'docs'      => 'https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_yandex_pro',
		'configure' => '',
	),
);

$atfp_steps = array(
	__( 'Choose the page or post you want to translate.', 'automatic-translations-for-polylang' ),
	__( 'Click the AI Translate button.', 'automatic-translations-for-polylang' ),
	__( 'Choose your target languages and AI translation provider.', 'automatic-translations-for-polylang' ),
	__( 'Start the translation and update the page to save it.', 'automatic-translations-for-polylang' ),
);

$atfp_video_id          = 'ecHsOyIL_J4';
$atfp_video_title       = __( 'Automate the Translation Process with AutoPoly - AI Translation For Polylang', 'automatic-translations-for-polylang' );
?>
<div class="atfp-dashboard-left-section">


	<div class="atfp-dashboard-card atfp-dashboard-start">
		<div class="atfp-dashboard-welcome">
			<h1><?php echo esc_html__( 'Welcome to AutoPoly 👋', 'automatic-translations-for-polylang' ); ?></h1>
			<p><?php echo esc_html__( 'Translate your WordPress content with AI and make your website multilingual in minutes.', 'automatic-translations-for-polylang' ); ?></p>
		</div>

		<div class="atfp-dashboard-start-grid">
			<div class="atfp-dashboard-video" data-video-id="<?php echo esc_attr( $atfp_video_id ); ?>" data-video-title="<?php echo esc_attr( $atfp_video_title ); ?>">
				<div class="atfp-dashboard-video-frame" style="background-image:url('<?php echo esc_url( ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-video.png' ); ?>');">
					<button type="button" class="atfp-dashboard-video-play" aria-label="<?php esc_attr_e( 'Play the AutoPoly walkthrough video', 'automatic-translations-for-polylang' ); ?>">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
							<path d="M6.5 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
						</svg>
					</button>
				</div>
			</div>

			<div class="atfp-dashboard-steps">
				<h2><?php echo esc_html__( 'Translate your first page in 4 simple steps', 'automatic-translations-for-polylang' ); ?></h2>
				<ol class="atfp-dashboard-step-list">
					<?php foreach ( $atfp_steps as $atfp_step_index => $atfp_step ) : ?>
						<li>
							<span class="atfp-dashboard-step-num"><?php echo esc_html( $atfp_step_index + 1 ); ?></span>
							<span class="atfp-dashboard-step-text"><?php echo esc_html( $atfp_step ); ?></span>
						</li>
					<?php endforeach; ?>
				</ol>
				<div class="atfp-dashboard-btns-row">
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>" class="atfp-dashboard-btn primary"><?php echo esc_html__( 'Translate Pages', 'automatic-translations-for-polylang' ); ?></a>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=post' ) ); ?>" class="atfp-dashboard-btn primary"><?php echo esc_html__( 'Translate Posts', 'automatic-translations-for-polylang' ); ?></a>
				</div>
				<p>Choose the post status from <a href="<?php echo esc_url( admin_url( 'admin.php?page=polylang-atfp-dashboard&tab=settings' ) ); ?>">Settings</a> to set the default status for translated content.</p>
			</div>
		</div>
	</div>

	<div class="atfp-dashboard-card atfp-dashboard-engines">
		<h3><?php echo esc_html__( 'Translation Providers', 'automatic-translations-for-polylang' ); ?></h3>
		<p class="atfp-engine-intro"><?php echo esc_html__( 'Select your default translation provider. This provider will be pre-selected when the translation modal opens.', 'automatic-translations-for-polylang' ); ?></p>

		<div class="atfp-engine-note">
			<span class="atfp-engine-note-icon" aria-hidden="true">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="10" fill="currentColor" />
					<path d="M12 11v6" stroke="#fff" stroke-width="2" stroke-linecap="round" />
					<circle cx="12" cy="7.8" r="1.2" fill="#fff" />
				</svg>
			</span>
			<p><?php echo esc_html__( 'You can switch providers anytime from the translation modal.', 'automatic-translations-for-polylang' ); ?></p>
		</div>

		<ul class="atfp-engine-list" data-nonce="<?php echo esc_attr( $atfp_default_nonce ); ?>">
			<?php foreach ( $atfp_providers as $atfp_provider_key => $atfp_provider ) : ?>
				<?php $atfp_is_default = ( $atfp_default_provider === $atfp_provider_key ); ?>
				<li class="atfp-engine-row atfp-card-<?php echo esc_attr( $atfp_provider_key ); ?><?php echo $atfp_is_default ? ' is-default' : ''; ?>">
					<img class="atfp-engine-logo" src="<?php echo esc_url( ATFP_URL . 'assets/images/' . $atfp_provider['logo'] ); ?>" alt="">
					<span class="atfp-engine-name"><?php echo esc_html( $atfp_provider['name'] ); ?></span>
					<span class="atfp-engine-status">
						<span class="atfp-engine-status-ready"><?php echo esc_html__( 'Ready', 'automatic-translations-for-polylang' ); ?></span>
						<span class="atfp-engine-status-setup"><?php echo esc_html__( 'Not Configured', 'automatic-translations-for-polylang' ); ?></span>
					</span>
					<label class="atfp-engine-default">
						<input
							type="radio"
							name="atfp_default_provider"
							class="atfp-engine-default-input"
							value="<?php echo esc_attr( $atfp_provider_key ); ?>"
							<?php checked( $atfp_is_default, true ); ?>
						/>
						<span class="atfp-engine-default-mark" aria-hidden="true"></span>
						<span class="atfp-engine-default-text"><?php echo esc_html__( 'Set as default', 'automatic-translations-for-polylang' ); ?></span>
						<span class="atfp-engine-default-active"><?php echo esc_html__( 'Default provider', 'automatic-translations-for-polylang' ); ?></span>
					</label>
					<a class="atfp-engine-docs" href="<?php echo esc_url( $atfp_provider['docs'] ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__( 'Docs', 'automatic-translations-for-polylang' ); ?></a>
					<?php if ( '' !== $atfp_provider['configure'] ) : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=polylang-atfp-dashboard&tab=settings' ) ); ?>" class="atfp-<?php echo esc_attr( $atfp_provider['configure'] ); ?>-configure-button atfp-dashboard-btn primary" style="display: none;"><?php echo esc_html__( 'Configure', 'automatic-translations-for-polylang' ); ?></a>
					<?php endif; ?>
					<div class="atfp-provider-switch-container" data-provider="<?php echo esc_attr( $atfp_provider_key ); ?>">
						<label class="atfp-provider-switch">
							<input
								type="checkbox"
								class="atfp-provider-toggle"
								data-provider="<?php echo esc_attr( $atfp_provider_key ); ?>"
								<?php checked( in_array( $atfp_provider_key, $atfp_active_providers, true ), true ); ?>
								<?php disabled( $atfp_is_default, true ); ?>
								title="<?php echo $atfp_is_default ? esc_attr__( 'The default provider stays enabled. Pick another default to turn this off.', 'automatic-translations-for-polylang' ) : ''; ?>"
							/>
							<span class="atfp-switch-slider"></span>
							<span class="screen-reader-text">
								<?php
								printf(
									/* translators: %s: translation engine name */
									esc_html__( 'Enable %s', 'automatic-translations-for-polylang' ),
									esc_html( $atfp_provider['name'] )
								);
								?>
							</span>
						</label>
					</div>
				</li>
			<?php endforeach; ?>
		</ul>


		<div class="atfp-engine-default-message" aria-live="polite"></div>
	</div>

	<?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
</div>
