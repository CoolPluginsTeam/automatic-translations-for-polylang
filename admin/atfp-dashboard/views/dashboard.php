<?php
if(!defined('ABSPATH')){
    exit;
}

$active_providers = get_option('atfp_enabled_providers', array('chrome-built-in-ai', 'yandex-translate'));
?>
<div class="atfp-dashboard-left-section">

        <div class="atfp-dashboard-get-started">
           <div class="atfp-dashboard-get-started-container">
                <div class="header">
                    <h1><?php echo esc_html__('Automate the Translation Process', 'automatic-translations-for-polylang'); ?></h1>
                    <div class="atfp-dashboard-status">
                        <span><?php echo esc_html__('Free', 'automatic-translations-for-polylang'); ?></span>
                        <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=settings'); ?>" class='atfp-dashboard-btn' target="_blank">
                            <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_attr_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                            <?php echo esc_html__('Upgrade Now', 'automatic-translations-for-polylang'); ?>
                        </a>
                    </div>
                </div>
                <div class="atfp-dashboard-get-started-grid">
                <div class="atfp-dashboard-get-started-grid-content">
                        <ul>
                            <li><?php
                            // translators: 1: strong tag, 2: strong tag
                            echo sprintf(esc_html__('Go to %1$sPages > All Pages%2$s in your WordPress dashboard. Find the page you want to translate and click to open it.', 'automatic-translations-for-polylang'), '<strong>', '</strong>'); ?></li>
                            <li><?php
                            // translators: 1: strong tag, 2: strong tag
                            echo sprintf(esc_html__('From the languages section, click the %1$s“+”%2$s icon next to the language you want page to translate into.', 'automatic-translations-for-polylang'), '<strong>', '</strong>'); ?></li>
                            <li><?php echo esc_html__('Next, select your preferred translation provider.', 'automatic-translations-for-polylang'); ?></li>
                            <li><?php
                            // translators: 1: strong tag, 2: strong tag
                            echo sprintf(esc_html__('Click the %1$sTranslate%2$s button. The plugin will automatically generate the translation.', 'automatic-translations-for-polylang'), '<strong>', '</strong>'); ?></li>
                            <li><?php
                            // translators: 1: strong tag, 2: strong tag
                            echo sprintf(esc_html__('Review the content, make any edits if needed, then click %1$sUpdate%2$s to save the translated page.', 'automatic-translations-for-polylang'), '<strong>', '</strong>'); ?></li>
                        </ul>
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
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-chrome-ai/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_chrome'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/chrome-built-in-ai-logo.png'); ?>" alt="<?php echo esc_attr__('Chrome Built-in AI', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container">
							<label class="atfp-provider-switch">
								<input type="checkbox" class="atfp-provider-toggle" data-provider="chrome-built-in-ai" <?php checked(in_array('chrome-built-in-ai', $active_providers), true); ?>/>
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('Chrome Built-in AI', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Fast AI Translations in Browser', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Bulk Translation (Pro)', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-chrome-ai/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_chrome'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

                <!-- Yandex Translate Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-yandex/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_yandex'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/yandex-translate-logo.png'); ?>" alt="<?php echo esc_attr__('Yandex Translate', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container">
							<label class="atfp-provider-switch">
								<input type="checkbox" class="atfp-provider-toggle" data-provider="yandex-translate" <?php checked(in_array('yandex-translate', $active_providers), true); ?>/>
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('Yandex Translate', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('No API & No Extra Cost', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-yandex/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_yandex'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- Google Translate Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-google/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_google'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/google-translate-logo.png'); ?>" alt="<?php echo esc_attr__('Google Translate', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="google">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('Google Translate', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Fast & No API Key Required', 'automatic-translations-for-polylang'); ?></li>
                        <li>✅ <?php echo esc_html__('Bulk Translation (Pro)', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/docs/automatic-translate-addon-for-translatepress-pro/how-to-translate-your-website-content-automatically-via-google/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_google'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- DeepL Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-deepl-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_deepl'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/deepl-logo.png'); ?>" alt="<?php echo esc_attr__('DeepL', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="deepl">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('DeepL', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-deepl-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_deepl'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- Gemini Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-google-gemini-ai-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_gemini'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/powered-by-google-gemini.png'); ?>" alt="<?php echo esc_attr__('Gemini', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="gemini">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('Gemini', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Use Translation Modals', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-google-gemini-ai-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_gemini'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

				<!-- OpenAI Provider Card -->
				<div class="atfp-dashboard-provider-card">
					<div class="atfp-dashboard-provider-header">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-open-ai-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_openai'); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url(ATFP_URL . 'assets/images/openai-translate-logo.png'); ?>" alt="<?php echo esc_attr__('OpenAI', 'automatic-translations-for-polylang'); ?>">
						</a>
						<div class="atfp-provider-switch-container" data-provider="openai">
							<label class="atfp-provider-switch atfp-pro-provider">
								<input type="checkbox" class="atfp-provider-toggle" disabled="disabled" />
								<span class="atfp-switch-slider"></span>
							</label>
						</div>
					</div>
					<h4><?php echo esc_html__('OpenAI', 'automatic-translations-for-polylang'); ?></h4>
					<ul>
						<li>✅ <?php echo esc_html__('Unlimited Free Translations', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Use Translation Modals', 'automatic-translations-for-polylang'); ?></li>
						<li>✅ <?php echo esc_html__('Bulk Translation', 'automatic-translations-for-polylang'); ?></li>
					</ul>
					<div class="atfp-dashboard-provider-buttons">
						<a href="<?php echo esc_url('https://docs.coolplugins.net/doc/generate-open-ai-api-key-translatepress/?utm_source=atfp_plugin&amp;utm_medium=inside&amp;utm_campaign=docs&amp;utm_content=dashboard_openai'); ?>" class="atfp-dashboard-btn" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
					</div>
				</div>

			</div>
		</div>
        <?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
    </div>

