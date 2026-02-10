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
        <h1><?php echo esc_html__('Polylang Addon Settings', 'automatic-translations-for-polylang'); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php echo esc_html__('Inactive', 'automatic-translations-for-polylang'); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=settings'); ?>" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_attr_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                <?php echo esc_html__('Upgrade Now', 'automatic-translations-for-polylang'); ?>
            </a>
        </div>
    </div>
    
    <!-- Add the description here -->
    <p class="description">
        <?php echo esc_html__('Configure your settings for the Polylang Addon to optimize your translation experience. Enter your API keys and manage your preferences for seamless integration.', 'automatic-translations-for-polylang'); ?>
    </p>

    <div class="atfp-dashboard-api-settings-container">
        <div class="atfp-dashboard-api-settings">
            <form method="post">
                <?php wp_nonce_field('atfp_save_optin_settings', 'atfp_optin_nonce'); ?>
                <div class="atfp-dashboard-api-settings-form">
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
                <?php
                printf(
                    // translators: 1: Click Here link, 2: API name
                    esc_html__('%1$s to See How to Generate %2$s API Key', 'automatic-translations-for-polylang'),
                    '<a href="' . esc_url($atfp_settings['doc_url']) . '" target="_blank">' . esc_html__('Click Here', 'automatic-translations-for-polylang') . '</a>',
                    esc_html($atfp_settings['name'])
                );
            endforeach; ?>

            <!-- Add Context Aware textarea -->
            <label for="context-aware">
                <?php echo esc_html__('Context Aware', 'automatic-translations-for-polylang'); ?>
            </label>
            <textarea 
                id="context-aware"
                placeholder="<?php esc_attr_e('Provide optional context about WordPress page or post to enhance translation accuracy (e.g. content purpose, target audience, SEO focus, tone)...', 'automatic-translations-for-polylang'); ?>"
                disabled
            ></textarea>
            <p class="api-settings-note" style="margin-block: 5px;">
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

            <hr style="margin: 2rem 0px;">
            <div class="atfp-dashboard-ai-request-container">
                <h2><?php echo esc_html__('AI Request Performance', 'automatic-translations-for-polylang'); ?></h2>
                <p><?php echo esc_html__('Adjust these settings to optimize the performance of your AI requests.', 'automatic-translations-for-polylang'); ?></p>
                <div class="atfp-dashboard-ai-token-container">
                    <label for="atfp_ai_request_token_per_request-input" class="api-settings-label"><?php echo esc_html__('Token Limit', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-token-container-input">
                        <input type="number" min="100" max="10000" step="100" name="atfp_ai_request_token_per_request" id="atfp_ai_request_token_per_request-input" value="500" disabled>
                        <p><?php 
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 500 tokens per request If model or network is slow, decrease this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        ?></p>
                    </div>
                </div>
                <div class="atfp-dashboard-ai-batch-size-container">
                    <label for="atfp_ai_request_batch_size-input" class="api-settings-label"><?php echo esc_html__('Batch Size', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-batch-container-input">
                        <input type="number" min="1" max="10" name="atfp_ai_request_batch_size" id="atfp_ai_request_batch_size-input" value="5" disabled>
                        <p><?php
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 5 posts per batch Larger batch can take longer to process If model or network is slow, decrease this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                         ?></p>
                    </div>
                </div>
                <div class="atfp-dashboard-ai-timeout-container">
                    <label for="atfp-dashboard-ai-token-container-input" class="api-settings-label"><?php echo esc_html__('Timeout Duration', 'automatic-translations-for-polylang'); ?></label>
                    <div class="atfp-dashboard-ai-timeout-container-input">
                        <input type="number" min="10" max="1200" step="10" name="atfp_ai_request_timeout" id="atfp_ai_request_timeout-input" value="120" disabled>
                        <p><?php
                        // translators: 1: span tag, 2: span tag
                        echo sprintf(__('%1$sRecommended%2$s 120 seconds minimum timeout can cause timeouts If model or network is slow, increase this value', 'automatic-translations-for-polylang'), '<span>', '</span>'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        ?></p>
                    </div>
                </div>
            </div>
            </div>
            <hr style="margin: 2rem 0px 20px;">
            
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
            <div class="atfp-dashboard-save-btn-container">
                <button <?php echo get_option('cpfm_opt_in_choice_cool_translations') ? '' : 'disabled'; ?> class="button button-primary"><?php echo esc_html__('Save', 'automatic-translations-for-polylang'); ?></button>
            </div>
            </form>
        </div>
    </div>
    </div>
</div>
