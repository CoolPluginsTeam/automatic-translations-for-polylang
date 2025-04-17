
    <div class="atfp-dashboard-left-section">
        
        <!-- Welcome Section -->
        <div class="atfp-dashboard-welcome">
            <div class="atfp-dashboard-welcome-text">
                <h2><?php echo esc_html__('Welcome To Polylang Addon', $text_domain); ?></h2>
                <p><?php echo esc_html__('Translate WordPress plugins or themes instantly with Loco Addon. One-click, thousands of strings - no extra cost!', $text_domain); ?></p>
                <div class="atfp-dashboard-btns-row">
                    <a href="<?php echo esc_url(admin_url('edit.php?post_type=page')); ?>" target="_blank" class="atfp-dashboard-btn primary"><?php echo esc_html__('Translate Pages', $text_domain); ?></a>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=atfp-supported-blocks')); ?>" target="_blank" class="atfp-dashboard-btn"><?php echo esc_html__('Supported Blocks', $text_domain); ?></a>
                </div>
                <a class="atfp-dashboard-docs" href="<?php echo esc_url('https://locoaddon.com/docs/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard'); ?>" target="_blank"><img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/document.svg'); ?>" alt="document"> <?php echo esc_html__('Read Plugin Docs', $text_domain); ?></a>
            </div>
            <div class="atfp-dashboard-welcome-video">
                <a href="https://locoaddon.com/docs/translate-plugin-theme-via-yandex-translate/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_video" target="_blank" class="atfp-dashboard-video-link">
                    <img decoding="async" src="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/video.svg'; ?>" class="play-icon" alt="play-icon">
                    <picture>
                        <source srcset="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-video.png'; ?>" type="image/webp">
                        <img src="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-video.png'; ?>" class="loco-video" alt="loco translate addon preview">
                    </picture>
                </a>
            </div>
        </div>

        <!-- Translation Providers -->  
        <div class="atfp-dashboard-translation-providers">
            <h3><?php _e('Translation Providers', $text_domain); ?></h3>
            <div class="atfp-dashboard-providers-grid">
                
                <?php

                $providers = [
                    ["Gemini AI", "geminiai-logo.png", "Pro", ["Unlimited Translations", "Fast Translations via AI", "Gemini API Key Required"], esc_url('https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_gemini'), esc_url('admin.php?page=polylang-atfp-dashboard&tab=settings')],
                    ["OpenAI", "openai-translate-logo.png", "Pro", ["Unlimited Translations", "Fast Translations via AI", "Gemini API Key Required"], esc_url('https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_gemini'), esc_url('admin.php?page=polylang-atfp-dashboard&tab=settings')],
                    ["Openrouter AI", "openrouter-translate-logo.png", "Pro", ["Unlimited Translations", "Fast Translations via AI", "Gemini API Key Required"], esc_url('https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_gemini'), esc_url('admin.php?page=polylang-atfp-dashboard&tab=settings')],
                    ["Google Translate", "google-translate-logo.png", "Pro", ["Unlimited Free Translations", "Fast & No API Key Required"], esc_url('https://locoaddon.com/docs/auto-translations-via-google-translate/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_google')],
                    ["Chrome Built-in AI", "chrome-built-in-ai-logo.png", "Free", ["Fast AI Translations in Browser", "Unlimited Free Translations", "Use Translation Modals"], esc_url('https://locoaddon.com/docs/how-to-use-chrome-ai-auto-translations/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_chrome')],
                    ["Yandex Translate", "yandex-translate-logo.png", "Free", ["Unlimited Free Translations", "No API & No Extra Cost"], esc_url('https://locoaddon.com/docs/translate-plugin-theme-via-yandex-translate/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_yandex')],
                ];

                foreach ($providers as $index => $provider) {
                    ?>
                    <div class="atfp-dashboard-provider-card">
                        <div class="atfp-dashboard-provider-header">
                            <a href="<?php echo esc_url($provider[4]); ?>" target="_blank"><img src="<?php echo esc_url(ATFP_URL . 'assets/images/' . $provider[1]); ?>" alt="<?php echo esc_html($provider[0]); ?>"></a>
                            <span class="atfp-dashboard-badge <?php echo strtolower($provider[2]); ?>"><?php echo $provider[2]; ?></span>
                        </div>
                        <h4><?php echo $provider[0]; ?></h4>
                        <ul>
                            <?php foreach ($provider[3] as $feature) { ?>
                                <li>✅ <?php echo $feature; ?></li>
                            <?php } ?>
                        </ul>
                        <div class="atfp-dashboard-provider-buttons">
                            <a href="<?php echo esc_url($provider[4]); ?>" class="atfp-dashboard-btn" target="_blank">Docs</a>
                            <?php if (isset($provider[5])) { ?>
                                <a href="<?php echo esc_url($provider[5]); ?>" class="atfp-dashboard-btn">Settings</a>
                            <?php } ?>
                        </div>
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
    </div>

