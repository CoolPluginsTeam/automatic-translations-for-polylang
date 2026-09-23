<?php
/**
 * Toolkit for Polylang - hub dashboard view.
 *
 * Included by TFP_Toolkit_Hub::render_page(). $this is the TFP_Toolkit_Hub
 * instance; all data here is read fresh from is_plugin_active() / the
 * filesystem on every load, never cached.
 *
 * @package ToolkitForPolylang
 * @var TFP_Toolkit_Hub $this
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tfp_domain = TFP_Toolkit_Hub::text_domain();

$tfp_onboarding_data   = get_option( 'dupcap_onboarding_data', array() );
$tfp_inspector_enabled = ! isset( $tfp_onboarding_data['translation_inspector'] ) || ! empty( $tfp_onboarding_data['translation_inspector'] );
$tfp_duplicate_enabled = ! isset( $tfp_onboarding_data['duplicate_content'] ) || ! empty( $tfp_onboarding_data['duplicate_content'] );

$tfp_tools = array(
	'inspector' => array(
		'name'   => __( 'Translation Inspector', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'desc'   => __( 'Deep-scan taxonomies, posts, pages, and meta strings to pinpoint missing translations and sync errors.', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'plugin' => TFP_Toolkit_Hub::PLUGIN_INSPECTOR,
		'slug'   => TFP_Toolkit_Hub::SLUG_INSPECTOR,
		'icon'   => 'blue',
		'short'  => __( 'Inspector', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
	),
	'autopoly'  => array(
		'name'   => __( 'AutoPoly (AI Engine)', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'desc'   => __( 'Automate WordPress batch translations while faithfully preserving Elementor and Gutenberg layouts.', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'plugin' => TFP_Toolkit_Hub::PLUGIN_AUTOPOLY,
		'slug'   => TFP_Toolkit_Hub::SLUG_AUTOPOLY,
		'icon'   => 'green',
		'short'  => __( 'AutoPoly', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
	),
	'switcher'  => array(
		'name'   => __( 'Language Switcher', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'desc'   => __( 'Embed lightweight, accessible flag or text switchers directly inside Elementor, Divi, and Gutenberg.', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction, WordPress.WP.I18n.MissingTranslatorsComment
		'plugin' => TFP_Toolkit_Hub::PLUGIN_SWITCHER,
		'slug'   => TFP_Toolkit_Hub::SLUG_SWITCHER,
		'icon'   => 'blue',
		'short'  => __( 'Switcher', $tfp_domain ), // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
	),
);

$tfp_hub_asset = dirname( __DIR__ ) . '/class-tfp-toolkit-hub.php';
$tfp_icons     = array(
	'inspector' => '<img class="tfp-icon-logo" src="' . esc_url( plugins_url( 'images/inspector-logo.png', $tfp_hub_asset ) ) . '" alt="" width="48" height="48" />',
	'autopoly'  => '<img class="tfp-icon-logo" src="' . esc_url( plugins_url( 'images/autopoly-logo.png', $tfp_hub_asset ) ) . '" alt="" width="48" height="48" />',
	'switcher'  => '<img class="tfp-icon-logo" src="' . esc_url( plugins_url( 'images/switcher-logo.png', $tfp_hub_asset ) ) . '" alt="" width="48" height="48" />',
);

$tfp_download_icon = '<svg class="tfp-btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.69L6.3 8.49a.75.75 0 10-1.1 1.02l4.25 4.5a.75.75 0 001.1 0l4.25-4.5a.75.75 0 00-1.1-1.02l-2.95 3.12V2.75z"/><path d="M3.5 15.25a.75.75 0 000 1.5h13a.75.75 0 000-1.5h-13z"/></svg>';
$tfp_arrow_icon    = '<svg class="tfp-btn-icon tfp-btn-icon-end" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H3.75A.75.75 0 013 10z" clip-rule="evenodd"/></svg>';

/*
 * Same walkthrough as AutoPoly dashboard (admin/atfp-dashboard/views/dashboard.php).
 * Poster from YouTube; hqdefault falls back if maxresdefault is missing.
 */
$tfp_video_id         = 'ubDSMP2qjpY';
$tfp_video_title      = __( 'Automate the Translation Process with AutoPoly - AI Translation For Polylang', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
$tfp_video_poster     = 'https://i.ytimg.com/vi/' . $tfp_video_id . '/maxresdefault.jpg';
$tfp_video_poster_alt = 'https://i.ytimg.com/vi/' . $tfp_video_id . '/hqdefault.jpg';

?>
<div class="atfp-dashboard-wrapper">

	<?php TFP_Toolkit_Hub::render_header(); ?>

	<div class="tfp-hub-body">

		<section class="tfp-hero" aria-label="<?php echo esc_attr__( 'Toolkit overview', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>">
			<div class="tfp-hero-copy">
				<span class="tfp-hero-badge"><?php echo esc_html__( 'All-in-one translation workflow', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></span>
				<h2 class="tfp-hero-title"><?php echo esc_html__( 'Translate, inspect and switch languages from one elegant toolkit.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></h2>
				<p class="tfp-hero-desc"><?php echo esc_html__( 'Translation Inspector, AutoPoly and Language Switcher work together so you can install, translate, review and switch languages without leaving this hub.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
				<div class="tfp-hero-highlights" aria-label="<?php echo esc_attr__( 'Toolkit highlights', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>">
					<div class="tfp-hero-chip">
						<span class="tfp-hero-chip-icon tfp-hero-chip-icon--tools" aria-hidden="true">
							<svg class="tfp-hero-chip-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6.5" cy="7" r="2.2"/><circle cx="17.5" cy="7" r="2.2"/><circle cx="12" cy="17" r="2.2"/><path d="M8.4 8.4l2.4 6.2M15.6 8.4l-2.4 6.2M8.7 7h6.6"/></svg>
							<span class="tfp-hero-chip-badge">3</span>
						</span>
						<span class="tfp-hero-chip-text">
							<strong><?php echo esc_html__( '3 Connected Tools', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></strong>
							<span><?php echo esc_html__( 'One unified workflow & sync', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></span>
						</span>
					</div>
					<div class="tfp-hero-chip">
						<span class="tfp-hero-chip-icon tfp-hero-chip-icon--ai" aria-hidden="true"><svg class="tfp-hero-chip-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.2l1.1 3.4c.2.6.7 1.1 1.3 1.3L18 9l-3.4 1.1c-.6.2-1.1.7-1.3 1.3L12 14.8l-1.1-3.4c-.2-.6-.7-1.1-1.3-1.3L6.2 9l3.4-1.1c.6-.2 1.1-.7 1.3-1.3L12 3.2z"/><path d="M18.2 14.2l.7 2.1c.1.4.4.7.8.8l2.1.7-2.1.7c-.4.1-.7.4-.8.8l-.7 2.1-.7-2.1c-.1-.4-.4-.7-.8-.8l-2.1-.7 2.1-.7c.4-.1.7-.4.8-.8l.7-2.1z"/><path d="M6.4 15.5l.5 1.5c.1.3.3.5.6.6l1.5.5-1.5.5c-.3.1-.5.3-.6.6l-.5 1.5-.5-1.5c-.1-.3-.3-.5-.6-.6L4.3 18l1.5-.5c.3-.1.5-.3.6-.6l.5-1.5z"/></svg></span>
						<span class="tfp-hero-chip-text">
							<strong><?php echo esc_html__( 'AI Translation', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></strong>
							<span><?php echo esc_html__( 'Instant batch pages & posts', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></span>
						</span>
					</div>
														</div>


				

			</div>
			<div class="tfp-hero-video" data-video-id="<?php echo esc_attr( $tfp_video_id ); ?>" data-video-title="<?php echo esc_attr( $tfp_video_title ); ?>">
				<div class="tfp-hero-video-frame" style="background-image:url('<?php echo esc_url( $tfp_video_poster ); ?>'), url('<?php echo esc_url( $tfp_video_poster_alt ); ?>');" role="button" tabindex="0" aria-label="<?php echo esc_attr__( 'Play the AutoPoly walkthrough video', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?>">
					<button type="button" class="tfp-hero-play" aria-hidden="true" tabindex="-1">
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 5.5v13l11-6.5-11-6.5z"/></svg>
					</button>
				</div>

			

			</div>

			

		</section>

		<section class="tfp-tools-section" aria-labelledby="tfp-tools-heading">
			

			<div class="tfp-grid">
				<?php foreach ( $tfp_tools as $tfp_key => $tfp_tool ) : ?>
					<?php
					$tfp_status        = TFP_Toolkit_Hub::tool_status( $tfp_tool['plugin'] );
					$tfp_btn_icon_html = '';
					$tfp_show_arrow    = false;

					if ( 'active' === $tfp_status ) {
						$tfp_badge_class = 'active';
						$tfp_badge_text  = __( 'Active', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_url    = TFP_Toolkit_Hub::tool_url( $tfp_key );
						$tfp_btn_text   = __( 'Open Settings', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_class  = 'button button-primary';
						$tfp_show_arrow = true;
					} elseif ( 'inactive' === $tfp_status ) {
						$tfp_badge_class = 'addon';
						$tfp_badge_text  = __( 'Inactive', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_url     = TFP_Toolkit_Hub::activate_url( $tfp_tool['plugin'] );
						// translators: %s is a short tool label, e.g. "AutoPoly".
						$tfp_btn_text      =__( 'Activate', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_class     = 'dark';
						$tfp_btn_icon_html = $tfp_download_icon;
					} else {
						$tfp_badge_class = 'addon';
						$tfp_badge_text  = __( 'Available Add-on', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_url     = TFP_Toolkit_Hub::install_url( $tfp_tool['slug'] );
						// translators: %s is a short tool label, e.g. "AutoPoly".
						$tfp_btn_text      = __( 'Install', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						$tfp_btn_class     = 'dark';
						$tfp_btn_icon_html = $tfp_download_icon;
					}

					$tfp_btn_extra_class = ( 'not_installed' === $tfp_status ) ? ' thickbox' : '';

					/*
					 * Hub AJAX installer (TFP_Toolkit_Hub::ajax_install_plugin) — works for
					 * AutoPoly, Translation Inspector and Language Switcher from any host plugin.
					 */
					$tfp_ajax_supported_slugs = array(
						TFP_Toolkit_Hub::SLUG_AUTOPOLY,
						TFP_Toolkit_Hub::SLUG_INSPECTOR,
						TFP_Toolkit_Hub::SLUG_SWITCHER,
					);
					$tfp_ajax_slug = null;
					if ( 'active' !== $tfp_status && in_array( $tfp_tool['slug'], $tfp_ajax_supported_slugs, true ) ) {
						$tfp_ajax_slug = $tfp_tool['slug'];
					}
					$tfp_ajax_action = ( 'inactive' === $tfp_status ) ? 'activate' : 'install';
					if ( $tfp_ajax_slug ) {
						$tfp_btn_extra_class = '';
					}

					$tfp_open_inspector_class = '';
					$tfp_open_inspector_attrs = '';
					$tfp_open_label           = '';
					$tfp_enable_label         = '';
					if ( 'inspector' === $tfp_key && 'active' === $tfp_status ) {
						$tfp_open_inspector_class = ' tfp-open-inspector-btn';
						$tfp_open_label           = $tfp_btn_text;
						$tfp_enable_label         = __( 'Enable inspector', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
						if ( ! $tfp_inspector_enabled ) {
							$tfp_badge_class            = 'disabled';
							$tfp_badge_text             = __( 'Disabled', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
							$tfp_open_inspector_class  .= ' tfp-enable-inspector-btn';
							$tfp_btn_url                = '#';
							$tfp_btn_text               = $tfp_enable_label;
							$tfp_show_arrow             = false;
						}
					}
					?>
					<article class="tfp-card" data-tool="<?php echo esc_attr( $tfp_key ); ?>">
						<div class="tfp-card-top">
							<div class="tfp-icon-tile <?php echo esc_attr( $tfp_tool['icon'] ); ?>">
								<?php echo $tfp_icons[ $tfp_key ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
							</div>
							<div class="tfp-card-badges">
								<span class="tfp-badge <?php echo esc_attr( $tfp_badge_class ); ?>">
									<?php if ( 'active' === $tfp_badge_class ) : ?>
										<span class="tfp-badge-dot" aria-hidden="true"></span>
									<?php endif; ?>
									<?php echo esc_html( $tfp_badge_text ); ?>
								</span>
								<?php
								if ( 'autopoly' === $tfp_key ) {
									$tfp_edition = TFP_Toolkit_Hub::autopoly_edition();
									if ( 'pro' === $tfp_edition || 'free' === $tfp_edition ) {
										$tfp_edition_label = ( 'pro' === $tfp_edition )
											? __( 'Pro', $tfp_domain ) // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
											: __( 'Free', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction
										?>
										<span class="tfp-badge edition <?php echo esc_attr( $tfp_edition ); ?>">
											<span class="tfp-badge-dot" aria-hidden="true"></span>
											<?php echo esc_html( $tfp_edition_label ); ?>
										</span>
										<?php
									}
								}
								?>
							</div>
						</div>
						<h4 class="tfp-card-title"><?php echo esc_html( $tfp_tool['name'] ); ?></h4>
						<p class="tfp-card-desc"><?php echo esc_html( $tfp_tool['desc'] ); ?></p>
						<?php if ( $tfp_ajax_slug ) : ?>
							<a href="<?php echo esc_url( $tfp_btn_url ); ?>" class="tfp-btn <?php echo esc_attr( $tfp_btn_class ); ?> tfp-btn-block tfp-ajax-install"
								data-slug="<?php echo esc_attr( $tfp_ajax_slug ); ?>"
								data-action="<?php echo esc_attr( $tfp_ajax_action ); ?>"
								data-redirect="<?php echo esc_url( TFP_Toolkit_Hub::tool_url( $tfp_key ) ); ?>"
								data-nonce="<?php echo esc_attr( wp_create_nonce( 'tfp_install_nonce' ) ); ?>">
								<?php echo $tfp_btn_icon_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
								<span class="tfp-btn-text"><?php echo esc_html( $tfp_btn_text ); ?></span>
							</a>
							<p class="tfp-install-message"></p>
						<?php else : ?>
							<?php
							$tfp_is_open_inspector = ( false !== strpos( $tfp_open_inspector_class, 'tfp-open-inspector-btn' ) );
							?>
							<?php if ( $tfp_is_open_inspector ) : ?>
								<div class="tfp-btn-wrap">
									<a href="<?php echo esc_url( $tfp_btn_url ); ?>"
										class="tfp-btn <?php echo esc_attr( $tfp_btn_class ); ?> tfp-btn-block<?php echo esc_attr( $tfp_btn_extra_class . $tfp_open_inspector_class ); ?>"
										data-open-label="<?php echo esc_attr( $tfp_open_label ); ?>"
										data-enable-label="<?php echo esc_attr( $tfp_enable_label ); ?>"
										<?php echo $tfp_open_inspector_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static attrs only. ?>>
										<?php echo $tfp_btn_icon_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
										<span class="tfp-btn-text"><?php echo esc_html( $tfp_btn_text ); ?></span>
										<?php echo $tfp_arrow_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- always in DOM; hidden while Enable mode. ?>
									</a>
								</div>
							<?php else : ?>
								<a href="<?php echo esc_url( $tfp_btn_url ); ?>" class="tfp-btn <?php echo esc_attr( $tfp_btn_class ); ?> tfp-btn-block<?php echo esc_attr( $tfp_btn_extra_class . $tfp_open_inspector_class ); ?>"<?php echo $tfp_open_inspector_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static aria/tabindex only. ?>>
									<?php echo $tfp_btn_icon_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
									<span class="tfp-btn-text"><?php echo esc_html( $tfp_btn_text ); ?></span>
									<?php if ( $tfp_show_arrow ) : ?>
										<?php echo $tfp_arrow_icon; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
									<?php endif; ?>
								</a>
							<?php endif; ?>
						<?php endif; ?>
					</article>
				<?php endforeach; ?>
			</div>
		</section>

		<div class="tfp-bottom-grid">
			<?php if ( 'active' === TFP_Toolkit_Hub::tool_status( TFP_Toolkit_Hub::PLUGIN_INSPECTOR ) ) : ?>
				<section class="tfp-panel tfp-controls-panel" aria-labelledby="tfp-controls-heading">
					<div class="tfp-section-head">
						<h3 id="tfp-controls-heading" class="tfp-section-title"><?php echo esc_html__( 'Toolkit controls', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></h3>
						<p class="tfp-section-sub"><?php echo esc_html__( 'Choose which built-in Translation Inspector features stay active on your site.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
					</div>

					<div class="tfp-control-row" data-control="inspector">
						<div class="tfp-control-main">
							<div class="tfp-control-left">
								<div class="tfp-icon-circle blue sm">
									<?php echo $tfp_icons['inspector']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped URL built above. ?>
								</div>
								<div>
									<p class="tfp-row-text-title"><?php echo esc_html__( 'Translation Inspector', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
									<p class="tfp-row-text-desc"><?php echo esc_html__( 'Scan and fix translation issues across your multilingual website.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
								</div>
							</div>
							<div class="tfp-row-right">
								<?php // Saves via AJAX — see ajax_toggle_language_inspector(). ?>
								<?php
								$tfp_inspector_locked = $tfp_inspector_enabled && ! $tfp_duplicate_enabled;
								?>
								<label class="tfp-toggle<?php echo $tfp_inspector_locked ? ' is-locked' : ''; ?>">
									<input type="checkbox" class="tfp-inspector-toggle" <?php checked( $tfp_inspector_enabled ); ?> <?php disabled( $tfp_inspector_locked ); ?>>
									<span class="tfp-toggle-track"></span>
									<span class="tfp-toggle-tip" <?php echo $tfp_inspector_locked ? '' : 'hidden'; ?>><?php echo esc_html__( 'Both features cannot be disabled at the same time.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></span>
								</label>
							</div>
						</div>
						</div>

					<div class="tfp-control-row" data-control="duplicate">
						<div class="tfp-control-main">
							<div class="tfp-control-left">
								<div class="tfp-icon-circle amber sm">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-3M8 7h6a2 2 0 012 2v6" /></svg>
								</div>
								<div>
									<p class="tfp-row-text-title"><?php echo esc_html__( 'Duplicate Content Check', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
									<p class="tfp-row-text-desc"><?php echo esc_html__( 'Detect duplicate content across your languages to improve SEO and avoid issues with search engines.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
								</div>
							</div>
							<div class="tfp-row-right">
								<?php // Saves via AJAX — see ajax_toggle_duplicate_content(). ?>
								<?php
								$tfp_duplicate_locked = $tfp_duplicate_enabled && ! $tfp_inspector_enabled;
								?>
								<label class="tfp-toggle<?php echo $tfp_duplicate_locked ? ' is-locked' : ''; ?>">
									<input type="checkbox" class="tfp-duplicate-toggle" <?php checked( $tfp_duplicate_enabled ); ?> <?php disabled( $tfp_duplicate_locked ); ?>>
									<span class="tfp-toggle-track"></span>
									<span class="tfp-toggle-tip" <?php echo $tfp_duplicate_locked ? '' : 'hidden'; ?>><?php echo esc_html__( 'Both features cannot be disabled at the same time.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></span>
								</label>
							</div>
						</div>
						</div>

					<p class="tfp-controls-note"><?php echo esc_html__( 'Protection rule: both features cannot be disabled at the same time.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
				</section>
			<?php else : ?>
				<section class="tfp-panel tfp-controls-panel tfp-controls-empty" aria-labelledby="tfp-controls-heading">
					<div class="tfp-section-head">
						<h3 id="tfp-controls-heading" class="tfp-section-title"><?php echo esc_html__( 'Toolkit controls', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></h3>
						<p class="tfp-section-sub"><?php echo esc_html__( 'Install and activate Translation Inspector to manage Language Inspector and Duplicate Content Check here.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
					</div>
				</section>
			<?php endif; ?>

			<section class="tfp-panel tfp-workflow-panel" aria-labelledby="tfp-workflow-heading">
				<div class="tfp-section-head">
					<h3 id="tfp-workflow-heading" class="tfp-section-title"><?php echo esc_html__( 'Recommended workflow', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></h3>
					<p class="tfp-section-sub"><?php echo esc_html__( 'A simple path from install to a polished multilingual site.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
				</div>
				<ol class="tfp-workflow-list">
					<li>
						<span class="tfp-step-num">1</span>
						<div>
							<p class="tfp-step-title"><?php echo esc_html__( 'Install your tools', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
							<p class="tfp-step-desc"><?php echo esc_html__( 'Add AutoPoly, Translation Inspector and Language Switcher from the cards above.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
						</div>
					</li>
					<li>
						<span class="tfp-step-num">2</span>
						<div>
							<p class="tfp-step-title"><?php echo esc_html__( 'Translate your content', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
							<p class="tfp-step-desc"><?php echo esc_html__( 'Use AutoPoly to create AI translations for posts, pages and more.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
						</div>
					</li>
					<li>
						<span class="tfp-step-num">3</span>
						<div>
							<p class="tfp-step-title"><?php echo esc_html__( 'Add language switching', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
							<p class="tfp-step-desc"><?php echo esc_html__( 'Place a Language Switcher with Elementor, Divi, Gutenberg or a shortcode.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
						</div>
					</li>
					<li>
						<span class="tfp-step-num">4</span>
						<div>
							<p class="tfp-step-title"><?php echo esc_html__( 'Inspect the site', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
							<p class="tfp-step-desc"><?php echo esc_html__( 'Run Translation Inspector to catch missing or duplicate content early.', $tfp_domain ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.WP.I18n.LowLevelTranslationFunction ?></p>
						</div>
					</li>
				</ol>
			</section>
		</div>

	</div>

</div>
