<?php
if(!defined('ABSPATH')){
    exit;
}

$atfp_active_providers = get_option('atfp_enabled_providers', array('chrome-built-in-ai', 'yandex-translate'));

function atfp_render_checked_icon(){
	return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path d="M12 21a9 9 0 1 0-6.364-2.636"/><path d="m16 10l-3.598 4.318c-.655.786-.983 1.18-1.424 1.2s-.803-.343-1.527-1.067L8 13"/></g></svg>';
};

$atfp_render_icon_allowed_tags=array('svg' => array('xmlns' => array(), 'width' => array(), 'height' => array(), 'viewBox' => array()), 'g' => array('fill' => array(), 'stroke' => array(), 'stroke-linecap' => array(), 'stroke-width' => array()), 'path' => array('d' => array()));

?>
<div class="atfp-dashboard-left-section">

        <div class="atfp-dashboard-get-started">
           <div class="atfp-dashboard-get-started-container">
                <div class="header">
                    <h1><?php echo esc_html__('Automate the Translation Process', 'automatic-translations-for-polylang'); ?></h1>
                    <div class="atfp-dashboard-status">
                        <span><?php echo esc_html__('Free', 'automatic-translations-for-polylang'); ?></span>
                        <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=dashboard'); ?>" class='atfp-dashboard-btn' target="_blank">
                            <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_attr_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                            <?php echo esc_html__('Upgrade Now', 'automatic-translations-for-polylang'); ?>
                        </a>
                    </div>
                </div>
                <div class="atfp-dashboard-get-started-grid">
                <div class="atfp-dashboard-get-started-grid-content">
                    <h2><?php echo esc_html__('Welcome to AutoPoly - AI Translation For Polylang', 'automatic-translations-for-polylang'); ?></h2>
                    <p>
                    <?php
                    echo wp_kses_post(
                        sprintf(
                            // translators: 1: Opening strong tag, 2: Closing strong tag, 3: Opening strong tag, 4: Closing strong tag, 5: Opening strong tag, 6: Closing strong tag
                            __(
                                'Go to Pages or Posts and open the item you want to translate. In the languages section, click the %1$s“+”%2$s icon for the target language. Choose your preferred translation provider, then click %3$sTranslate%4$s. Your content will be translated automatically. Review and click %5$sUpdate%6$s to save changes.',
                                'automatic-translations-for-polylang'
                            ),
                            '<strong>',
                            '</strong>',
                            '<strong>',
                            '</strong>',
                            '<strong>',
                            '</strong>'
                        )
                    );
                    ?>
                    </p>
                    <div class="atfp-dashboard-btns-row">
                        <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=dashboard_bulk_translate'); ?>" target="_blank" class="atfp-dashboard-btn primary">Bulk Translation</a>
                        <a href="<?php echo esc_url(admin_url('edit.php?post_type=page')); ?>" target="_blank" class="atfp-dashboard-btn">Page Translation</a>
                    </div>
                    <a class="atfp-dashboard-docs" href="<?php echo esc_url('https://docs.coolplugins.net/plugin/ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=dashboard'); ?>" target="_blank"><img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/document.svg'); ?>" alt="document"> <span><?php echo esc_html__('Read Plugin Docs', 'automatic-translations-for-polylang'); ?></span></a>
                    </div>
                    <div class="atfp-dashboard-get-started-grid-content">
                        <iframe title="Automate the Translation Process with AutoPoly - AI Translation For Polylang"
                                src="https://www.youtube.com/embed/ecHsOyIL_J4?feature=oembed"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
           </div>
        </div>

        <div class="atfp-dashboard-translation-providers">
			<h3><?php echo esc_html__('AI Translation Providers', 'automatic-translations-for-polylang'); ?></h3>
			<div class="atfp-dashboard-providers-grid">
				<!-- Chrome Built-in AI Provider Card -->
				<div class="atfp-dashboard-provider-card atfp-chrome-ai-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_chrome'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/chrome-built-in-ai-logo.png'); ?>" alt="<?php echo esc_attr__('Chrome Built-in AI', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container">
							<label class="atfp-provider-switch">
								<input type="checkbox" class="atfp-provider-toggle" data-provider="chrome-built-in-ai" <?php checked(in_array('chrome-built-in-ai', $atfp_active_providers), true); ?>/>
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Fast AI Translations in Browser', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Bulk Translation (Pro)', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_chrome'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
						<a class="atfp-chrome-configure-button atfp-dashboard-btn primary" href="<?php echo esc_url(admin_url('admin.php?page=polylang-atfp-dashboard&tab=settings')); ?>" style="display: none;"><?php esc_html_e('Configure', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

                <!-- Yandex Translate Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_yandex'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/yandex-translate-logo.png'); ?>" alt="<?php echo esc_attr__('Yandex Translate', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container">
							<label class="atfp-provider-switch">
								<input type="checkbox" class="atfp-provider-toggle" data-provider="yandex-translate" <?php checked(in_array('yandex-translate', $atfp_active_providers), true); ?>/>
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('No API & No Extra Cost', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_yandex'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- Google Translate Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_google'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/google-translate-logo.png'); ?>" alt="<?php echo esc_attr__('Google Translate', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="google">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Fast & No API Key Required', 'automatic-translations-for-polylang'); ?></li>
                        <li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Bulk Translation (Pro)', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_google'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- OpenAI Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_openai'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/openai-translate-logo.png'); ?>" alt="<?php echo esc_attr__('OpenAI', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="openai">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Use Translation Modals', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_openai'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- Gemini Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_gemini'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/powered-by-google-gemini.png'); ?>" alt="<?php echo esc_attr__('Gemini', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="gemini">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Use Translation Modals', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_gemini'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- DeepL Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_deepl'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/deepl-logo.png'); ?>" alt="<?php echo esc_attr__('DeepL', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="deepl">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<ul>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li><?php echo wp_kses(atfp_render_checked_icon(), $atfp_render_icon_allowed_tags) . ' ' ; echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_deepl'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

			</div>
		</div>
        <?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
    </div>

