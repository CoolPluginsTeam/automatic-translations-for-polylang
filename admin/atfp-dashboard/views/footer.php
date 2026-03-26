<?php
if(!defined('ABSPATH')){
    exit;
}
?>
<div class="atfp-dashboard-info">
    <div class="atfp-dashboard-info-links">
        <p>
            <?php esc_html_e('Made with ❤️ by', 'automatic-translations-for-polylang'); ?>
            <span class="logo">
                <a href="<?php echo esc_url('https://coolplugins.net/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=author_page&utm_content=dashboard_footer'); ?>" target="_blank">
                    <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/cool-plugins-logo-black.svg'); ?>" alt="<?php esc_attr_e('Cool Plugins Logo', 'automatic-translations-for-polylang'); ?>">
                </a>
            </span>
        </p>
    </div>
</div>
