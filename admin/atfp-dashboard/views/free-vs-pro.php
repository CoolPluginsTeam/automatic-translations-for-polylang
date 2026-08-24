<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<div class="atfp-dashboard-free-vs-pro">
    <div class="atfp-dashboard-free-vs-pro-container">
    <div class="header">
        <h1><?php esc_html_e('Free VS Pro', 'automatic-translations-for-polylang'); ?></h1>
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
                    'Edge Built-in AI Support' => [true, true],
                    'No API Key Required' => [true, true],
                    'Unlimited Translations' => [true, true],
                    'Google Translate Widget Support' => [false, true],
                    'AI Translator (Gemini/OpenAI/DeepL) Support' => [false, true],
                    'Custom Fields Translation' => [false, true],
                    'Taxonomy Translation' => [false, true],
                    'Bulk Translation' => [false, true],
                    'Re Translation' => [false, true],
                    'Classic Editor Translation' => [false, true],
                    'Divi 5 Translation' => [false, true],
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
    <?php require_once ATFP_DIR_PATH . $file_prefix . 'footer.php'; ?>
</div>