<div class="atfp-dashboard-ai-translations">
    <div class="atfp-dashboard-ai-translations-container">
    <div class="header">
        <h1><?php esc_html_e('AI Translations', $text_domain); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php esc_html_e('Inactive', $text_domain); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=ai_translations'); ?>" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_html_e('Upgrade Now', $text_domain); ?>">
                <?php esc_html_e('Upgrade Now', $text_domain); ?>
            </a>
        </div>
    </div>
    <p class="description">
        <?php esc_html_e('Experience the power of AI for faster, more accurate translations. Choose from multiple AI providers to translate your content efficiently.', $text_domain); ?>
    </p>
    <div class="atfp-dashboard-translations">
        <?php
        $ai_translations = [
            [
                'logo' => 'geminiai-logo.png',
                'alt' => 'Gemini AI',
                'title' => esc_html__('AI Translations', $text_domain),
                'description' => esc_html__('Leverage GeminiAI for seamless and context-aware translations.', $text_domain),
                'icon' => 'gemini-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_gemini'
            ],
            [
                'logo' => 'openai-translate-logo.png',
                'alt' => 'OpenAI',
                'title' => esc_html__('AI Translations', $text_domain),
                'description' => esc_html__('Leverage OpenAI for seamless and context-aware translations.', $text_domain),
                'icon' => 'open-ai-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_openai'
            ],
            [
                'logo' => 'chrome-built-in-ai-logo.png',
                'alt' => 'Chrome Built-in AI',
                'title' => esc_html__('Chrome Built-in AI', $text_domain),
                'description' => esc_html__('Utilize Chrome\'s built-in AI for seamless translation experience.', $text_domain),
                'icon' => 'chrome-ai-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_chrome'
            ],
            [
                'logo' => 'deepl-logo.png',
                'alt' => 'DeepL',
                'title' => esc_html__('DeepL', $text_domain),
                'description' => esc_html__('Harness DeepL\'s advanced AI for high-quality translations.', $text_domain),
                'icon' => 'deepl.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_deepl'
            ]
        ];

        foreach ($ai_translations as $translation) {
            ?>
            <div class="atfp-dashboard-translation-card">
                <div class="logo">
                    <img src="<?php echo esc_url(ATFP_URL . 'assets/images/' . $translation['logo']); ?>" 
                         alt="<?php echo esc_attr($translation['alt']); ?>">
                </div>
                <h3><?php echo esc_html($translation['title']); ?></h3>
                <p><?php echo esc_html($translation['description']); ?></p>
                <div class="play-btn-container">
                    <a href="<?php echo esc_url($translation['url']); ?>" target="_blank">
                        <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/' . $translation['icon']); ?>" alt="<?php echo esc_attr($translation['alt']); ?>">
                    </a>
                </div>
            </div>
            <?php
        }
        ?>
    </div>
    </div>
</div>