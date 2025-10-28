<!-- Right Sidebar -->
<div class="atfp-dashboard-sidebar">
    <div class="atfp-dashboard-status">
        <h3><?php esc_html_e('Auto Translation Status', $text_domain); ?></h3>
        <div class="atfp-dashboard-sts-top">
            <?php

            $all_data = get_option('cpt_dashboard_data', array());

            if (!is_array($all_data) || !isset($all_data['atfp'])) {

                $all_data['atfp'] = []; // Ensure $all_data['atfp'] is an array

            }

            $totals = array_reduce($all_data['atfp'] ?? [], function($carry, $translation) {
                // Ensure $translation['string_count'] is numeric
                // Ensure all values are properly handled
                $carry['string_count'] += intval($translation['string_count'] ?? 0);
                $carry['character_count'] += intval($translation['character_count'] ?? 0);
                $carry['time_taken'] += intval($translation['time_taken'] ?? 0);
                
                // Count total translations instead of unique post IDs
                if (!empty($translation['post_id'])) {
                    $carry['translation_count']++;
                }
                return $carry;
            }, ['string_count' => 0, 'character_count' => 0, 'time_taken' => 0, 'translation_count' => 0]);
            // Update the time taken string using the new function
            $time_taken_str = atfp_format_time_taken($totals['time_taken'] ,$text_domain);
            ?>
              <span><?php echo esc_html(atfp_format_number($totals['character_count'], $text_domain)); ?></span>
            <span><?php esc_html_e('Total Characters Translated!', $text_domain); ?></span>
        </div>
        <ul class="atfp-dashboard-sts-btm">
            <li><span><?php esc_html_e('Total Strings', $text_domain); ?></span> <span><?php echo esc_html(atfp_format_number($totals['string_count'], $text_domain)); ?></span></li>
            <li><span><?php esc_html_e('Total Pages / Posts', $text_domain); ?></span> <span><?php echo esc_html($totals['translation_count']); ?></span></li>
            <li><span><?php esc_html_e('Time Taken', $text_domain); ?></span> <span><?php echo esc_html($time_taken_str); ?></span></li>
        </ul>
    </div>
    <div class="atfp-dashboard-translate-full">
        <h3><?php esc_html_e('Automatically Translate Plugins & Themes', $text_domain); ?></h3>
        <div class="atfp-dashboard-addon first">
            <div class="atfp-dashboard-addon-l">
                <strong><?php echo esc_html(atfp_get_plugin_display_name('automatic-translator-addon-for-loco-translate', $text_domain)); ?></strong>
                <span class="addon-desc"><?php esc_html_e('Loco addon to translate plugins and themes.', $text_domain); ?></span>
                <?php if (atfp_is_plugin_installed('automatic-translator-addon-for-loco-translate')): ?>
                    <span class="installed"><?php esc_html_e('Installed', $text_domain); ?></span>
                <?php else: ?>
                    <a href="<?php echo esc_url(admin_url('plugin-install.php?s=Automatic+translate+addon+for+loco+translate+by+coolplugins&tab=search&type=term')); ?>" class="atfp-dashboard-btn" target="_blank"><?php esc_html_e('Install', $text_domain); ?></a>
                <?php endif; ?>
            </div>
            <div class="atfp-dashboard-addon-r">
                <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/atlt-logo.png'); ?>" alt="<?php esc_html_e('TranslatePress Addon', $text_domain); ?>">
            </div>
        </div>
    </div>
    <div class="atfp-dashboard-rate-us">
        <h3><?php esc_html_e('Rate Us ⭐⭐⭐⭐⭐', $text_domain); ?></h3>
        <p><?php esc_html_e('We\'d love your feedback! Hope this addon made auto-translations easier for you.', $text_domain); ?></p>
        <a href="https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post" class="review-link" target="_blank"><?php esc_html_e('Submit a Review →', $text_domain); ?></a>
    </div>
</div>

<?php

function atfp_format_time_taken($time_taken, $text_domain) {
    if ($time_taken === 0) return esc_html__('0', $text_domain);
    if ($time_taken < 60) return sprintf(esc_html__('%d sec', $text_domain), $time_taken);
    if ($time_taken < 3600) {
        $min = floor($time_taken / 60);
        $sec = $time_taken % 60;
        return sprintf(esc_html__('%d min %d sec', $text_domain), $min, $sec);
    }
    $hours = floor($time_taken / 3600);
    $min = floor(($time_taken % 3600) / 60);
    return sprintf(esc_html__('%d hours %d min', $text_domain), $hours, $min);
}

function atfp_is_plugin_installed($plugin_slug) {
    $plugins = get_plugins();
    
    // Check if the plugin is installed
    if ($plugin_slug === 'automatic-translator-addon-for-loco-translate') {
        return isset($plugins['automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php']) || isset($plugins['loco-automatic-translate-addon-pro/loco-automatic-translate-addon-pro.php']);
    }
    return false; // Return false if no match found
}

function atfp_get_plugin_display_name($plugin_slug, $text_domain) {
    $plugins = get_plugins();

    // Define free and pro plugin paths
    $plugin_paths = [
        'automatic-translator-addon-for-loco-translate' => [
            'free' => 'automatic-translator-addon-for-loco-translate/automatic-translator-addon-for-loco-translate.php',
            'pro'  => 'loco-automatic-translate-addon-pro/loco-automatic-translate-addon-pro.php',
            'free_name' => esc_html__('LocoAI – Auto Translate For Loco Translate', $text_domain),
            'pro_name'  => esc_html__('LocoAI – Auto Translate for Loco Translate (Pro)', $text_domain),
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

function atfp_format_number($number, $text_domain) {
    if ($number >= 1000000000) {
        return round($number / 1000000000, 1) . esc_html__('B', $text_domain);
    } elseif ($number >= 1000000) {
        return round($number / 1000000, 1) . esc_html__('M', $text_domain);
    } elseif ($number >= 1000) {
        return round($number / 1000, 1) . esc_html__('K', $text_domain);
    }
    return $number;
}

