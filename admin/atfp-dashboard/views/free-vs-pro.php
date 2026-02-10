<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<div class="atfp-dashboard-free-vs-pro">
    <div class="atfp-dashboard-free-vs-pro-container">
    <div class="header">
        <h1><?php esc_html_e('Free VS Pro', 'automatic-translations-for-polylang'); ?></h1>
        <div class="atfp-dashboard-status">
            <span class="status"><?php esc_html_e('Inactive', 'automatic-translations-for-polylang'); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=freevspro'); ?>" class='atfp-dashboard-btn' target="_blank">
              <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php echo esc_attr_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                <?php echo esc_html_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>
            </a>
        </div>
    </div>
    
    <p><?php echo esc_html(__('Compare the Free and Pro versions to choose the best option for your translation needs.', 'automatic-translations-for-polylang')); ?></p>

    <table>
        <thead>
            <tr>
                <th><?php echo esc_html(__('Dynamic Content', 'automatic-translations-for-polylang')); ?></th>
                <th><?php echo esc_html(__('Free', 'automatic-translations-for-polylang')); ?></th>
                <th><?php echo esc_html(__('Pro', 'automatic-translations-for-polylang')); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php
                $atfp_features = [
                    'Yandex Translate Widget Support' => [true, true],
                    'Chrome Built-in AI Support' => [true, true],
                    'No API Key Required' => [true, true],
                    'Unlimited Translations' => [false, true],
                    'Google Translate Widget Support' => [false, true],
                    'AI Translator (Gemini/OpenAI/DeepL) Support' => [false, true],
                    'Custom Fields Translation' => [false, true],
                    'Bulk Translation' => [false, true],
                    'Classic Editor Translation' => [false, true],
                    'Premium Support' => [false, true],
                ];
             foreach ($atfp_features as $atfp_feature => $atfp_availability): ?>
                <tr>
                    <td><?php echo esc_html($atfp_feature); ?></td>
                    <td class="<?php echo $atfp_availability[0] ? 'check' : 'cross'; ?>">
                        <?php echo $atfp_availability[0] ? '✓' : '✗'; ?>
                    </td>
                    <td class="<?php echo $atfp_availability[1] ? 'check' : 'cross'; ?>">
                        <?php echo $atfp_availability[1] ? '✓' : '✗'; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
</div>