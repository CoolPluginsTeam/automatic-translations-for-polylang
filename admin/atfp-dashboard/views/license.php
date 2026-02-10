<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<div class="atfp-dashboard-license">
    <div class="atfp-dashboard-license-container">
    <div class="header">
        <h1><?php esc_html_e('License Key', 'automatic-translations-for-polylang'); ?></h1>
        <div class="atfp-dashboard-status">
            <span><?php esc_html_e('Free', 'automatic-translations-for-polylang'); ?></span>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=license'); ?>" class='atfp-dashboard-btn' target="_blank">
              <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/upgrade-now.svg'); ?>" alt="<?php esc_html_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>">
                <?php esc_html_e('Upgrade Now', 'automatic-translations-for-polylang'); ?>
            </a>
        </div>
    </div>
    <p><?php esc_html_e('Your license key provides access to pro version updates and support.', 'automatic-translations-for-polylang'); ?></p>
    
    <p>
        <?php
        // translators: 1: AutoPoly - AI Translation For Polylang (free) plugin name in strong tag
        echo sprintf(esc_html__('You\'re using %s - no license needed. Enjoy! 😊', 'automatic-translations-for-polylang'), '<strong>'.esc_html__('AutoPoly - AI Translation For Polylang (free)', 'automatic-translations-for-polylang').'</strong>'); ?>
    </p>

    <div class="atfp-dashboard-upgrade-box">
        <p>
            <?php esc_html_e('To unlock more features, consider', 'automatic-translations-for-polylang'); ?>
            <a href="<?php echo esc_url('https://coolplugins.net/product/autopoly-ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=get_pro&utm_content=license'); ?>" target="_blank"><?php esc_html_e('upgrading to Pro', 'automatic-translations-for-polylang'); ?></a>.
        </p>
        <em><?php esc_html_e('As a valued user, you automatically receive an exclusive discount on the Annual License and an even greater discount on the POPULAR Lifetime License at checkout!', 'automatic-translations-for-polylang'); ?></em>
    </div>
    </div>
</div>
