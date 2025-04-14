<div class="atfp-dashboard-free-vs-pro">
    <div class="atfp-dashboard-free-vs-pro-container">
    <div class="header">
        <h1><?php _e('Free VS Pro', $text_domain); ?></h1>
        <div class="atfp-dashboard-status">
            <span class="status"><?php _e('Inactive', $text_domain); ?></span>
            <a href="<?php echo esc_url('https://locoaddon.com/pricing/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=freevspro'); ?>" class='atfp-dashboard-btn' target="_blank">
              <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php echo esc_attr(__('Upgrade Now', $text_domain)); ?>">
                <?php echo esc_html(__('Upgrade Now', $text_domain)); ?>
            </a>
        </div>
    </div>
    
    <p><?php echo esc_html(__('Compare the Free and Pro versions to choose the best option for your translation needs.', $text_domain)); ?></p>

    <table>
        <thead>
            <tr>
                <th><?php echo esc_html(__('Dynamic Content', $text_domain)); ?></th>
                <th><?php echo esc_html(__('Free', $text_domain)); ?></th>
                <th><?php echo esc_html(__('Pro', $text_domain)); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php
                $features = [
                    'Yandex Translate Widget Support' => [true, true],
                    'No API Key Required' => [true, true],
                    'Unlimited Translations' => [true, true],
                    'Google Translate Widget Support' => [false, true],
                    'Chrome Built-in AI Support' => [false, true],
                    'AI Translator (Gemini/OpenAI) Support' => [false, true],
                    'ChatGPT Translator Support' => [false, true],
                    'DeepL Doc Translator Support' => [false, true],
                    'Premium Support' => [false, true],
                ];
             foreach ($features as $feature => $availability): ?>
                <tr>
                    <td><?php echo esc_html($feature); ?></td>
                    <td class="<?php echo $availability[0] ? 'check' : 'cross'; ?>">
                        <?php echo $availability[0] ? '✓' : '✗'; ?>
                    </td>
                    <td class="<?php echo $availability[1] ? 'check' : 'cross'; ?>">
                        <?php echo $availability[1] ? '✓' : '✗'; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
</div>