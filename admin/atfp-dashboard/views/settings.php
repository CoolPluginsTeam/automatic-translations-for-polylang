<div class="atfp-dashboard-settings">
    <div class="atfp-dashboard-settings-container">
    <div class="header">
        <h1><?php _e('Polylang Addon Settings', $text_domain); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php _e('Inactive', $text_domain); ?></span>
            <a href="https://coolplugins.net/product/automatic-translations-for-polylang/?utm_source=atfp_plugin&utm_medium=dashboard&utm_campaign=get_pro&utm_content=buy_pro" class='atfp-dashboard-btn' target="_blank">
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
                    'doc_url' => 'https://coolplugins.net/product/automatic-translations-for-polylang/?utm_source=atfp_plugin&utm_medium=dashboard&utm_campaign=get_pro&utm_content=gemini_api',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ],
                'openai' => [
                    'name' => 'OpenAI',
                    'doc_url' => 'https://coolplugins.net/product/automatic-translations-for-polylang/?utm_source=atfp_plugin&utm_medium=dashboard&utm_campaign=get_pro&utm_content=openai_api',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ],
                'openrouter' => [
                    'name' => 'Openrouter',
                    'doc_url' => 'https://coolplugins.net/product/automatic-translations-for-polylang/?utm_source=atfp_plugin&utm_medium=dashboard&utm_campaign=get_pro&utm_content=openrouter_api',
                    'placeholder' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                ]
            ];

            foreach ($api_settings as $key => $settings): ?>
                <label for="<?php echo esc_attr($key); ?>-api">
                    <?php printf(__('Add %s API key', $text_domain), esc_html($settings['name'])); ?>
                </label>
                <input 
                    type="text" 
                    id="<?php echo esc_attr($key); ?>-api" 
                    placeholder="<?php echo esc_attr($settings['placeholder']); ?>" 
                    disabled
                >
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
                rows="3" 
                cols="50"
                placeholder="<?php esc_attr_e('Enter context information here...', $text_domain); ?>"
                disabled
            ></textarea>

            <div class="atfp-dashboard-save-btn-container">
                <button disabled class="button button-primary"><?php _e('Save', $text_domain); ?></button>
            </div>
        </div>
    </div>
    </div>
</div>
