<div class="atfp-dashboard-ai-translations">
    <div class="atfp-dashboard-ai-translations-container">
    <div class="header">
        <h1><?php _e('AI Translations', $text_domain); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php _e('Inactive', $text_domain); ?></span>
            <a href="<?php echo esc_url('https://locoaddon.com/pricing/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=ai_translations'); ?>" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php _e('Upgrade Now', $text_domain); ?>">
                <?php _e('Upgrade Now', $text_domain); ?>
            </a>
        </div>
    </div>
    <p class="description">
        <?php _e('Experience the power of AI for faster, more accurate translations. Choose from multiple AI providers to translate your content efficiently.', $text_domain); ?>
    </p>
    <div class="atfp-dashboard-translations">
        <?php
        $ai_translations = [
            [
                'logo' => 'geminiai-logo.png',
                'alt' => 'Gemini AI',
                'title' => __('AI Translations', $text_domain),
                'description' => __('Leverage GeminiAI for seamless and context-aware translations.', $text_domain),
                'icon' => 'gemini-translate.png',
                'url' => 'https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=gemini_ai_translations'
            ],
            [
                'logo' => 'openai-translate-logo.png',
                'alt' => 'OpenAI',
                'title' => __('AI Translations', $text_domain),
                'description' => __('Leverage OpenAI for seamless and context-aware translations.', $text_domain),
                'icon' => 'open-ai-translate.png',
                'url' => 'https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=gemini_ai_translations'
            ],
            [
                'logo' => 'openrouter-translate-logo.png',
                'alt' => 'Openrouter AI',
                'title' => __('AI Translations', $text_domain),
                'description' => __('Leverage Openrouter AI for seamless and context-aware translations.', $text_domain),
                'icon' => 'openrouter-ai-translate.png',
                'url' => 'https://locoaddon.com/docs/gemini-ai-translations-wordpress/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=gemini_ai_translations'
            ],
            [
                'logo' => 'chrome-built-in-ai-logo.png',
                'alt' => 'Chrome Built-in AI',
                'title' => __('Chrome Built-in AI', $text_domain),
                'description' => __('Utilize Chrome\'s built-in AI for seamless translation experience.', $text_domain),
                'icon' => 'chrome-ai-translate.png',
                'url' => 'https://locoaddon.com/docs/how-to-use-chrome-ai-auto-translations/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=docs&utm_content=chrome_ai_translations'
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