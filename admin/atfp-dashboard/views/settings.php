<div class="atfp-dashboard-settings">
    <div class="atfp-dashboard-settings-container">
    <div class="header">
        <h1><?php _e('Polylang Addon Settings', $text_domain); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php _e('Inactive', $text_domain); ?></span>
            <a href="https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=settings" class='atfp-dashboard-btn' target="_blank">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_attr_e('Upgrade Now', $text_domain); ?>">
                <?php _e('Upgrade Now', $text_domain); ?>
            </a>
        </div>
    </div>
    
    <!-- Add the description here -->
    <p class="description">
        <?php _e('Configure your settings for the Polylang Addon to optimize your translation experience. Enter your API keys and manage your preferences for seamless integration.', $text_domain); ?>
    </p>

    <div class="atfp-dashboard-api-settings-container">
        <div class="atfp-dashboard-api-settings">
            <?php
            // Define all API-related settings in a single configuration array
            $api_settings = [
                'gemini' => [
                    'name' => 'Gemini',
                    'doc_url' => 'https://docs.coolplugins.net/doc/generate-gemini-api-key/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=api_key&utm_content=dashboard',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ],
                'openai' => [
                    'name' => 'OpenAI',
                    'doc_url' => 'https://docs.coolplugins.net/doc/generate-open-ai-api-key/?utm_source=atfpp_plugin&utm_medium=inside&utm_campaign=api_key&utm_content=dashboard',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ]
            ];

            foreach ($api_settings as $key => $settings): ?>
                <label for="<?php echo esc_attr($key); ?>-api">
                    <?php printf(__('Add %s API key', $text_domain), esc_html($settings['name'])); ?>
                </label>
                <div class="input-group">
                <input 
                    type="text" 
                    id="<?php echo esc_attr($key); ?>-api" 
                    placeholder="<?php echo esc_attr($settings['placeholder']); ?>" 
                    disabled
                >
                </div>
                <?php
                printf(
                    __('%s to See How to Generate %s API Key', $text_domain),
                    '<a href="' . esc_url($settings['doc_url']) . '" target="_blank">' . esc_html__('Click Here', $text_domain) . '</a>',
                    esc_html($settings['name'])
                );
            endforeach; ?>

            <!-- Add Context Aware textarea -->
            <label for="context-aware">
                <?php _e('Context Aware', $text_domain); ?>
            </label>
            <textarea 
                id="context-aware"
                placeholder="<?php esc_attr_e('Provide optional context about WordPress page or post to enhance translation accuracy (e.g. content purpose, target audience, SEO focus, tone)...', $text_domain); ?>"
                disabled
            ></textarea>
            <p class="api-settings-note" style="margin-block: 5px;">
                <?php _e('This setting only works with Gemini AI and OpenAI.', $text_domain); ?>
            </p>
                                
            <!-- Add bulk translate post status -->
            <label for="bulk-translate-post-status">
                <?php _e('Bulk Translate Post Status', $text_domain); ?>
            </label>
            <div class="atfp-bulk-translation-post-status-options">
                <input type="radio" name="publish" id="publish" value="publish" disabled>
                <label for="publish"><?php _e('Publish', $text_domain); ?></label>
                <input type="radio" name="draft" id="draft" value="draft" checked disabled>
                <label for="draft"><?php _e('Draft', $text_domain); ?></label>
            </div>

            <div class="atfp-dashboard-save-btn-container">
                <button disabled class="button button-primary"><?php _e('Save', $text_domain); ?></button>
            </div>
        </div>
    </div>
    </div>
</div>
