<?php

if(!defined('ABSPATH')){
    exit;
}

if(!current_user_can('manage_options')){
    wp_die(esc_html__('You do not have sufficient permissions to access this page.', 'automatic-translations-for-polylang'));
}

    // Process form submission
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['atfp_optin_nonce'])) {

            check_admin_referer( 'atfp_save_optin_settings', 'atfp_optin_nonce' );

            // Handle feedback checkbox
            if (get_option('cpfm_opt_in_choice_cool_translations')) {
                $atfp_feedback_opt_in = isset($_POST['atfp-dashboard-feedback-checkbox']) ? 'yes' : 'no';
                update_option('atfp_feedback_opt_in', $atfp_feedback_opt_in);
            }

        // If user opted out, remove the cron job
        if ($atfp_feedback_opt_in === 'no' && wp_next_scheduled('atfp_extra_data_update') ){
                
            wp_clear_scheduled_hook('atfp_extra_data_update');
        
        }

        if ($atfp_feedback_opt_in === 'yes' && !wp_next_scheduled('atfp_extra_data_update')) {

                wp_schedule_event(time(), 'every_30_days', 'atfp_extra_data_update');   

                if (class_exists('ATFP_cronjob')) {

                    ATFP_cronjob::atfp_send_data();
                } 
        }
        
    }
?>
<div class="atfp-dashboard-settings">
    <div class="atfp-dashboard-settings-container">
    <div class="header">
        <h1><?php echo esc_html__('Settings', 'automatic-translations-for-polylang'); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php echo esc_html__('Inactive', 'automatic-translations-for-polylang'); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=settings'); ?>" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_attr_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                <?php echo esc_html__('Upgrade Now', 'automatic-translations-for-polylang'); ?>
            </a>
        </div>
    </div>

    <?php
        $atfp_enabled_providers = get_option('atfp_enabled_providers', array('chrome-built-in-ai', 'yandex-translate'));
        $atfp_polylang_supported_languages=ATFP_Helper::get_polylang_supported_languages();

        if(is_array($atfp_enabled_providers) && in_array('chrome-built-in-ai', $atfp_enabled_providers)){ ?>
            <h2 class="atfp-section-title atfp-section-title-with-icon">
                <span class="atfp-section-icon atfp-icon-sparkle" aria-hidden="true">
                    <img
                        src="<?php echo esc_url( ATFP_URL . 'assets/images/chrome.png' ); ?>"
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <?php esc_html_e('Chrome AI Configuration', 'automatic-translations-for-polylang'); ?>
            </h2>
            <p class="atfp-section-description">
                <?php esc_html_e('Use Chrome’s built-in AI to translate strings. Configure and test it here.', 'automatic-translations-for-polylang'); ?>
            </p>
            <div class="atfp-dashboard-chrome-ai-settings">
                <!-- Chrome Local AI Notice -->
                <div id="atfp-chrome-local-ai-notice" class="atfp-chrome-local-ai-notice atfp-dashboard-settings-card">
                <?php if(empty($atfp_polylang_supported_languages)){ ?>
                    <span class="atfp-chrome-no-languages-content"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" id="error"><g><rect fill="none"/></g><g><path d="M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm-.01-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-3h-2v-2h2v2z"></path></g></svg><?php
                        printf(
                            wp_kses_post(
                                // translators: %s is a link to the Polylang languages page.
                                __( 'Add at least %s to use the Chrome AI translation test', 'automatic-translations-for-polylang' )
                            ),
                            '<a href="' . esc_url( admin_url( 'admin.php?page=mlang' ) ) . '" target="_blank" rel="noopener noreferrer">' . esc_html__( 'one language in Polylang', 'automatic-translations-for-polylang' ) . '</a>'
                        );
                ?></span>
                <?php }else{ ?>
                    <div class="atfp-chrome-local-ai-notice-content">
                        <h3 id="atfp-chrome-notice-heading" class="atfp-chrome-notice-heading"></h3>
                        <div id="atfp-chrome-notice-message" class="atfp-chrome-notice-message"></div>
                    </div>

                    <!-- Test Translation Section -->
                    <div id="atfp-chrome-test-translation" class="atfp-chrome-test-translation">
                        <h3 class="atfp-chrome-test-translation-heading"><?php esc_html_e('Chrome AI Translation Test', 'automatic-translations-for-polylang'); ?></h3>
                        <p class="atfp-chrome-test-translation-description"><?php esc_html_e('Check whether Chrome AI Translation is properly configured by translating a sample text.', 'automatic-translations-for-polylang'); ?></p>

                        <div class="atfp-chrome-test-translation-language-pair">
                            <label class="atfp-chrome-test-translation-label"><?php esc_html_e('Language Pair:', 'automatic-translations-for-polylang'); ?></label>
                            <select id="atfp-test-translation-source" class="atfp-chrome-test-translation-source"></select>
                            <span class="atfp-chrome-test-translation-arrow">→</span>
                            <select id="atfp-test-translation-target" class="atfp-chrome-test-translation-target"></select>
                        </div>
                        
                        <input type="text" id="atfp-test-translation-text" class="atfp-chrome-test-translation-text" placeholder="<?php esc_attr_e('Enter text to translate', 'automatic-translations-for-polylang'); ?>" value="Hello, this is a test translation."><br>
                        <button id="atfp-test-translation-btn" class="atfp-dashboard-btn primary atfp-chrome-test-translation-btn">
                            <?php esc_html_e('Test Translation', 'automatic-translations-for-polylang'); ?>
                        </button>

                        <div id="atfp-test-translation-result" class="atfp-chrome-test-translation-result"></div>
                        <div id="atfp-test-translation-error" class="atfp-chrome-test-translation-error"></div>
                    </div>
                <?php } ?>
                </div>
            </div>
        <?php }
    ?>

    <form method="post">
        <div class="atfp-dashboard-api-settings-container">
            <?php wp_nonce_field('atfp_save_optin_settings', 'atfp_optin_nonce'); ?>
            <h2 class="atfp-section-title atfp-section-title-with-icon">
                <span class="atfp-section-icon atfp-icon-api" aria-hidden="true">
                    <img
                        src="<?php echo esc_url( ATFP_URL . 'assets/images/api-key.svg' ); ?>"
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <?php esc_html_e('AI API Keys & Models', 'automatic-translations-for-polylang'); ?>
            </h2>
            <p class="atfp-section-description">
                <?php esc_html_e('Configure your API keys and models for the AI translation providers.', 'automatic-translations-for-polylang'); ?>
            </p>
            <div class="atfp-dashboard-api-settings atfp-dashboard-settings-card">
            <?php
            // Define all API-related settings in a single configuration array
            $atfp_api_settings = [
                'gemini' => [
                    'name' => 'Gemini',
                    'doc_url' => 'https://docs.coolplugins.net/doc/generate-gemini-api-key/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=settings_gemini',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ],
                'openai' => [
                    'name' => 'OpenAI',
                    'doc_url' => 'https://docs.coolplugins.net/doc/generate-open-ai-api-key/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=settings_openai',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ],
                'deepl' => [
                    'name' => 'DeepL',
                    'doc_url' => 'https://docs.coolplugins.net/doc/generate-deepl-api-key/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=settings_deepl',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ]
            ];

            foreach ($atfp_api_settings as $atfp_api_key => $atfp_settings): ?>
                <label for="<?php echo esc_attr($atfp_api_key); ?>-api">
                    <?php
                    // translators: 1: API name
                    printf(esc_html__('Add %1$s API key', 'automatic-translations-for-polylang'), esc_html($atfp_settings['name'])); ?>
                </label>
                <div class="input-group">
                <input 
                    type="text" 
                    id="<?php echo esc_attr($atfp_api_key); ?>-api" 
                    placeholder="<?php echo esc_attr($atfp_settings['placeholder']); ?>" 
                    disabled
                >
                </div>
                <p class="api-settings-description">
                <?php
                printf(
                    // translators: 1: Click Here link, 2: API name
                    esc_html__('%1$s to See How to Generate %2$s API Key', 'automatic-translations-for-polylang'),
                    '<a href="' . esc_url($atfp_settings['doc_url']) . '" target="_blank">' . esc_html__('Click Here', 'automatic-translations-for-polylang') . '</a>',
                    esc_html($atfp_settings['name'])
                );
                ?></p>
            <?php endforeach; ?>
            </div>

            <h2 class="atfp-section-title atfp-section-title-with-icon">
                <span class="atfp-section-icon atfp-icon-translate" aria-hidden="true">
                    <img
                        src="<?php echo esc_url( ATFP_URL . 'assets/images/translate.svg' ); ?>"
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <?php esc_html_e('Translation Settings', 'automatic-translations-for-polylang'); ?>
            </h2>
            <p class="atfp-section-description">
                <?php esc_html_e('Configure the translation settings for AI translations.', 'automatic-translations-for-polylang'); ?>
            </p>
            <div class="atfp-dashboard-translation-settings atfp-dashboard-settings-card">
            <!-- Add Context Aware textarea -->
            <label for="context-aware">
                <?php echo esc_html__('Context Aware', 'automatic-translations-for-polylang'); ?>
            </label>
            <textarea 
                id="context-aware"
                placeholder="<?php esc_attr_e('Provide optional context about WordPress page or post to enhance translation accuracy (e.g. content purpose, target audience, SEO focus, tone)...', 'automatic-translations-for-polylang'); ?>"
                disabled
            ></textarea>
            <p class="api-settings-description">
                <?php echo esc_html__('This setting only works with Gemini AI and OpenAI.', 'automatic-translations-for-polylang'); ?>
            </p>
                                
            <!-- Add bulk translate post status -->
            <label for="bulk-translate-post-status">
                <?php echo esc_html__('Bulk Translation default Post Status', 'automatic-translations-for-polylang'); ?>
            </label>
            <div class="atfp-bulk-translation-post-status-options">
                <input type="radio" name="publish" id="publish" value="publish" disabled>
                <label for="publish"><?php echo esc_html__('Publish', 'automatic-translations-for-polylang'); ?></label>
                <input type="radio" name="draft" id="draft" value="draft" checked disabled>
                <label for="draft"><?php echo esc_html__('Draft', 'automatic-translations-for-polylang'); ?></label>
            </div>
            <!-- Add slug translation -->
            <label for="slug-translation-settings">
                <?php echo esc_html__('Slug Translation Settings', 'automatic-translations-for-polylang'); ?>
            </label>
            <div class="atfp-bulk-translation-post-status-options">
                <input type="radio" name="title_translate" id="title_translate" value="title_translate" disabled>
                <label for="title_translate"><?php echo esc_html__('Use Translated Title', 'automatic-translations-for-polylang'); ?></label>
                <input type="radio" name="slug_translate" id="slug_translate" value="slug_translate" checked disabled>
                <label for="slug_translate"><?php echo esc_html__('Translate Original Slug', 'automatic-translations-for-polylang'); ?></label>
                <input type="radio" name="slug_keep" id="slug_keep" value="slug_keep" checked disabled>
                <label for="slug_keep"><?php echo esc_html__('Keep Original Slug', 'automatic-translations-for-polylang'); ?></label>
            </div>
            </div>

            <h2 class="atfp-section-title atfp-section-title-with-icon">
                <span class="atfp-section-icon atfp-icon-performance" aria-hidden="true">
                    <img
                        src="<?php echo esc_url( ATFP_URL . 'assets/images/ai-performance.svg' ); ?>"
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <?php esc_html_e('AI Request Performance', 'automatic-translations-for-polylang'); ?>
            </h2>
            <p class="atfp-section-description">
                <?php esc_html_e('Adjust these settings to optimize the speed, stability, and processing performance of your AI requests.', 'automatic-translations-for-polylang'); ?>
            </p>
            <div class="atfp-dashboard-ai-request-container atfp-dashboard-settings-card">
                <div class="atfp-dashboard-ai-token-container">
                    <label for="atfp_ai_request_token_per_request-input" class="api-settings-label"><?php echo esc_html__('Token Limit', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-token-container-input">
                        <input type="number" min="100" max="10000" step="100" name="atfp_ai_request_token_per_request" id="atfp_ai_request_token_per_request-input" value="500" disabled>
                        <p class="api-settings-description"><?php 
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 500 tokens per request If model or network is slow, decrease this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        ?></p>
                    </div>
                </div>
                <div class="atfp-dashboard-ai-batch-size-container">
                    <label for="atfp_ai_request_batch_size-input" class="api-settings-label"><?php echo esc_html__('Batch Size', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-batch-container-input">
                        <input type="number" min="1" max="10" name="atfp_ai_request_batch_size" id="atfp_ai_request_batch_size-input" value="5" disabled>
                        <p class="api-settings-description"><?php
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 5 posts per batch Larger batch can take longer to process If model or network is slow, decrease this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                         ?></p>
                    </div>
                </div>
                <div class="atfp-dashboard-ai-timeout-container">
                    <label for="atfp-dashboard-ai-token-container-input" class="api-settings-label"><?php echo esc_html__('Timeout Duration', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-timeout-container-input">
                        <input type="number" min="10" max="1200" step="10" name="atfp_ai_request_timeout" id="atfp_ai_request_timeout-input" value="120" disabled>
                        <p class="api-settings-description"><?php
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 120 seconds minimum timeout can cause timeouts If model or network is slow, increase this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        ?></p>
                    </div>
                </div>
            </div>
            </div>

            <h3 class="atfp-section-title">
                <?php esc_html_e('Usage Data Sharing', 'automatic-translations-for-polylang'); ?>
            </h3>
            <?php if (get_option('cpfm_opt_in_choice_cool_translations')) : ?>
                <div class="atfp-dashboard-feedback-container">
                    <div class="atfp-dashboard-feedback-row">
                        <input type="checkbox" 
                            id="atfp-dashboard-feedback-checkbox" 
                            name="atfp-dashboard-feedback-checkbox"
                            <?php checked(get_option('atfp_feedback_opt_in'), 'yes'); ?>>
                        <p><?php echo esc_html__('Help us make this plugin more compatible with your site by sharing non-sensitive site data.', 'automatic-translations-for-polylang'); ?></p>
                        <a href="#" class="atfp-see-terms">[See terms]</a>
                    </div>
                    <div id="termsBox" style="display: none;padding-left: 20px; margin-top: 10px; font-size: 12px; color: #999;">
                            <p><?php echo esc_html__("Opt in to receive email updates about security improvements, new features, helpful tutorials, and occasional special offers. We'll collect:", 'automatic-translations-for-polylang'); ?> <a href="<?php echo esc_url('https://my.coolplugins.net/terms/usage-tracking/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=terms&utm_content=dashboard'); ?>" target="_blank"><?php echo esc_html__('Click Here', 'automatic-translations-for-polylang'); ?></a></p>
                            <ul style="list-style-type:auto;">
                                <li><?php esc_html_e('Your website home URL and WordPress admin email.', 'automatic-translations-for-polylang'); ?></li>
                                <li><?php esc_html_e('To check plugin compatibility, we will collect the following: list of active plugins and themes, server type, MySQL version, WordPress version, memory limit, site language and database prefix.', 'automatic-translations-for-polylang'); ?></li>
                            </ul>
                    </div>
                </div>
            <?php endif; ?>
            <div class="atfp-dashboard-save-btn-container ">
                <button <?php echo get_option('cpfm_opt_in_choice_cool_translations') ? '' : 'disabled'; ?> class="atfp-dashboard-btn primary"><?php echo esc_html__('Save Changes', 'automatic-translations-for-polylang'); ?></button>
            </div>
            </form>
    </div>
    <?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
</div>
