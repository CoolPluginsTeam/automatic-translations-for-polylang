<?php
if(!defined('ABSPATH')){
    exit;
}

?>
<div class="atfp-dashboard-ai-translations">
    <div class="atfp-dashboard-ai-translations-container">
    <div class="header">
        <h1><?php esc_html_e('AI Translations', 'automatic-translations-for-polylang'); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php esc_html_e('Inactive', 'automatic-translations-for-polylang'); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=ai_translations'); ?>" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_html_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                <?php esc_html_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>
            </a>
        </div>
    </div>
    <p class="description">
        <?php esc_html_e('Experience the power of AI for faster, more accurate translations. Choose from multiple AI providers to translate your content efficiently.', 'automatic-translations-for-polylang'); ?>
    </p>
    <div class="atfp-dashboard-translations">
        <?php
        $atfp_ai_translations = [
            [
                'logo' => 'geminiai-logo.png',
                'alt' => 'Gemini AI',
                'title' => esc_html__('AI Translations', 'automatic-translations-for-polylang'),
                'description' => esc_html__('Leverage GeminiAI for seamless and context-aware translations.', 'automatic-translations-for-polylang'),
                'icon' => 'gemini-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_gemini'
            ],
            [
                'logo' => 'openai-translate-logo.png',
                'alt' => 'OpenAI',
                'title' => esc_html__('AI Translations', 'automatic-translations-for-polylang'),
                'description' => esc_html__('Leverage OpenAI for seamless and context-aware translations.', 'automatic-translations-for-polylang'),
                'icon' => 'open-ai-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_openai'
            ],
            [
                'logo' => 'chrome-built-in-ai-logo.png',
                'alt' => 'Chrome Built-in AI',
                'title' => esc_html__('Chrome Built-in AI', 'automatic-translations-for-polylang'),
                'description' => esc_html__('Utilize Chrome\'s built-in AI for seamless translation experience.', 'automatic-translations-for-polylang'),
                'icon' => 'chrome-ai-translate.png',
                'url' => 'https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_chrome'
            ],
            [
                'logo' => 'deepl-logo.png',
                'alt' => 'DeepL',
                'title' => esc_html__('DeepL', 'automatic-translations-for-polylang'),
                'description' => esc_html__('Harness DeepL\'s advanced AI for high-quality translations.', 'automatic-translations-for-polylang'),
                'icon' => 'deepl.png',
                'url' => 'https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=ai_translations_deepl'
            ]
        ];

        foreach ($atfp_ai_translations as $atfp_ai_translation) {
            ?>
            <div class="atfp-dashboard-translation-card">
                <div class="logo">
                    <img src="<?php echo esc_url(ATFP_URL . 'assets/images/' . $atfp_ai_translation['logo']); ?>" 
                         alt="<?php echo esc_attr($atfp_ai_translation['alt']); ?>">
                </div>
                <h3><?php echo esc_html($atfp_ai_translation['title']); ?></h3>
                <p><?php echo esc_html($atfp_ai_translation['description']); ?></p>
                <div class="play-btn-container">
                    <a href="<?php echo esc_url($atfp_ai_translation['url']); ?>" target="_blank">
                        <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/' . $atfp_ai_translation['icon']); ?>" alt="<?php echo esc_attr($atfp_ai_translation['alt']); ?>">
                    </a>
                </div>
            </div>
            <?php
        }
        ?>
    </div>
    </div>
</div>