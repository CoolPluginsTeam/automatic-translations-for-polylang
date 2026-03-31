<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<!-- Right Sidebar -->
<div class="atfp-dashboard-sidebar">
    <div class="atfp-dashboard-status atfp-dashboard-card">
        <h3><?php esc_html_e('Auto Translation Status', 'automatic-translations-for-polylang'); ?></h3>
        <div class="atfp-dashboard-sts-top">
            <?php

            $atfp_all_translation_data = get_option('cpt_dashboard_data', array());
            $atfp_utm_parameters='utm_source=atfp_plugin';
            if(class_exists('ATFP_Helper')){
                $atfp_utm_parameters=ATFP_Helper::utm_source_text();
            }

            $atfp_buy_pro_url=esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=dashboard_translation_limit');

            if (!is_array($atfp_all_translation_data) || !isset($atfp_all_translation_data['atfp'])) {

                $atfp_all_translation_data['atfp'] = []; // Ensure $atfp_all_translation_data['atfp'] is an array

            }

            $atfp_provider_character_count = array();

            $totals = array(
                'string_count'      => 0,
                'character_count'   => 0,
                'time_taken'        => 0,
                'translation_count' => 0
            );

            if ( ! empty( $atfp_all_translation_data['atfp'] ) && is_array( $atfp_all_translation_data['atfp'] ) ) {
                foreach ( $atfp_all_translation_data['atfp'] as $atfp_translation ) {
                    $totals['string_count']    += intval( isset( $atfp_translation['string_count'] ) ? $atfp_translation['string_count'] : 0 );
                    $totals['character_count'] += intval( isset( $atfp_translation['character_count'] ) ? $atfp_translation['character_count'] : 0 );
                    $totals['time_taken']      += intval( isset( $atfp_translation['time_taken'] ) ? $atfp_translation['time_taken'] : 0 );

                    // Count total translations instead of unique post IDs.
                    if ( ! empty( $atfp_translation['post_id'] ) ) {
                        $totals['translation_count']++;
                    }
                }
            }
            // Update the time taken string using the new function
            $atfp_time_taken_str = atfp_format_time_taken($totals['time_taken']);
            ?>
              <span><?php echo esc_html(atfp_format_number($totals['character_count'])); ?></span>
            <span><?php esc_html_e('Total Characters Translated!', 'automatic-translations-for-polylang'); ?></span>
        </div>
        <ul class="atfp-dashboard-sts-btm">
            <li><span><?php esc_html_e('Total Strings', 'automatic-translations-for-polylang'); ?></span> <span><?php echo esc_html(atfp_format_number($totals['string_count'])); ?></span></li>
            <li><span><?php esc_html_e('Total Pages / Posts', 'automatic-translations-for-polylang'); ?></span> <span><?php echo esc_html($totals['translation_count']); ?></span></li>
            <li><span><?php esc_html_e('Time Taken', 'automatic-translations-for-polylang'); ?></span> <span><?php echo esc_html($atfp_time_taken_str); ?></span></li>
        </ul>
        <?php
            if($totals['character_count'] > 100000){ ?>
                <div class="atfp-bulk-translation-suggestion">
                    <p>
                        <?php printf(
                            // translators: 1: number of characters translated, 2: plugin name
                            esc_html__(
                                'Translated %1$s characters page by page. Save time — install %2$s and use Bulk Translation to translate multiple pages in one click.',
                                'automatic-translations-for-polylang'
                            ),
                            '<strong>' . esc_html(atfp_format_number( $totals['character_count'] )) . '</strong>',
                            '<strong>AutoPoly (Pro)</strong>'
                        ); ?>
                    </p>
                    <a href="<?php echo esc_url($atfp_buy_pro_url); ?>" class="atfp-dashboard-btn primary" target="_blank"><?php esc_html_e('Install Bulk Translation Pro', 'automatic-translations-for-polylang'); ?></a>
                </div>
            <?php } ?>
    </div>
    <div class="atfp-dashboard-translate-full atfp-dashboard-card">
        <h3><?php esc_html_e('Automatically Translate Plugins & Themes', 'automatic-translations-for-polylang'); ?></h3>
        <div class="atfp-dashboard-addon first">
            <div class="atfp-dashboard-addon-l">
                <strong><?php echo esc_html(atfp_get_plugin_display_name('automatic-translator-addon-for-loco-translate')); ?></strong>
                <span class="addon-desc"><?php esc_html_e('Loco addon to translate plugins and themes.', 'automatic-translations-for-polylang'); ?></span>
                <?php if (atfp_is_plugin_installed('automatic-translator-addon-for-loco-translate')): ?>
                    <span class="installed"><?php esc_html_e('Installed', 'automatic-translations-for-polylang'); ?></span>
                <?php else: ?>
                    <a href="<?php echo esc_url(admin_url('plugin-install.php?s=Automatic+translate+addon+for+loco+translate+by+coolplugins&tab=search&type=term')); ?>" class="atfp-dashboard-btn" target="_blank"><?php esc_html_e('Install', 'automatic-translations-for-polylang'); ?></a>
                <?php endif; ?>
            </div>
            <div class="atfp-dashboard-addon-r">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/atlt-logo.png'); ?>" alt="<?php esc_html_e('Loco Translate Addon', 'automatic-translations-for-polylang'); ?>">
            </div>
        </div>
    </div>
    <div class="atfp-dashboard-translate-support atfp-dashboard-card">
        <h3><?php esc_html_e('Need Help? 🤝', 'automatic-translations-for-polylang'); ?></h3>
        <p><?php esc_html_e('Facing any issue with AI translation? Create a support thread and our team will assist you.', 'automatic-translations-for-polylang'); ?></p>
        <a href="<?php echo esc_url('https://wordpress.org/support/plugin/automatic-translations-for-polylang/'); ?>" class="atfp-dashboard-btn primary" target="_blank"><?php esc_html_e('Get Support →', 'automatic-translations-for-polylang'); ?></a>
    </div>
    <div class="atfp-dashboard-rate-us atfp-dashboard-card">
        <h3><?php esc_html_e('Happy with AutoPoly? ✨', 'automatic-translations-for-polylang'); ?></h3>
        <p><?php esc_html_e('We\'d love your feedback! Hope this addon made auto-translations easier for you.', 'automatic-translations-for-polylang'); ?></p>
        <a href="https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post" class="atfp-dashboard-btn" target="_blank"><?php esc_html_e('Leave a Review ★★★★★', 'automatic-translations-for-polylang'); ?></a>
    </div>
</div>

<?php

function atfp_format_time_taken($time_taken) {
    if ($time_taken === 0) return esc_html__('0', 'automatic-translations-for-polylang');
    // translators: 1: Time taken in seconds in number format
    if ($time_taken < 60) return sprintf(esc_html__('%d sec', 'automatic-translations-for-polylang'), $time_taken);
    if ($time_taken < 3600) {
        $min = floor($time_taken / 60);
        $sec = $time_taken % 60;
        // translators: 1: Time taken in minutes in number format, 2: Time taken in seconds in number format
        return sprintf(esc_html__('%1$d min %2$d sec', 'automatic-translations-for-polylang'), $min, $sec);
    }
    $hours = floor($time_taken / 3600);
    $min = floor(($time_taken % 3600) / 60);
    // translators: 1: Time taken in hours in number format, 2: Time taken in minutes in number format
    return sprintf(esc_html__('%1$d hours %2$d min', 'automatic-translations-for-polylang'), $hours, $min);
}

function atfp_is_plugin_installed($plugin_slug) {
    $plugins = get_plugins();
    
    // Check if the plugin is installed
    if ($plugin_slug === 'automatic-translator-addon-for-loco-translate') {
        return isset($plugins['automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php']) || isset($plugins['loco-automatic-translate-addon-pro/loco-automatic-translate-addon-pro.php']);
    }
    return false; // Return false if no match found
}

function atfp_get_plugin_display_name($plugin_slug) {
    $plugins = get_plugins();

    // Define free and pro plugin paths
    $plugin_paths = [
        'automatic-translator-addon-for-loco-translate' => [
            'free' => 'automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php',
            'pro'  => 'loco-automatic-translate-addon-pro/loco-automatic-translate-addon-pro.php',
            'free_name' => esc_html__('LocoAI – Auto Translate For Loco Translate', 'automatic-translations-for-polylang'),
            'pro_name'  => esc_html__('LocoAI – Auto Translate for Loco Translate (Pro)', 'automatic-translations-for-polylang'),
        ],
    ];

    // Check if the provided plugin slug exists
    if (!isset($plugin_paths[$plugin_slug])) {
        return $plugin_slug['free_name'];
    }

    $free_installed = isset($plugins[$plugin_paths[$plugin_slug]['free']]);
    $pro_installed = isset($plugins[$plugin_paths[$plugin_slug]['pro']]);

    // Determine which version is installed
    if ($pro_installed) {
        return $plugin_paths[$plugin_slug]['pro_name'];
    } elseif ($free_installed) {
        return $plugin_paths[$plugin_slug]['free_name'];
    } else {
        return $plugin_paths[$plugin_slug]['free_name'];
    }
}

function atfp_format_number($number) {
    if ($number >= 1000000000) {
        return round($number / 1000000000, 1) . esc_html__('B', 'automatic-translations-for-polylang');
    } elseif ($number >= 1000000) {
        return round($number / 1000000, 1) . esc_html__('M', 'automatic-translations-for-polylang');
    } elseif ($number >= 1000) {
        return round($number / 1000, 1) . esc_html__('K', 'automatic-translations-for-polylang');
    }
    return $number;
}

