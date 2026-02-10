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
        <a href="<?php echo esc_url('https://coolplugins.net/support/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=support&utm_content=dashboard_footer'); ?>" target="_blank"><?php esc_html_e('Support', 'automatic-translations-for-polylang'); ?></a> |
        <a href="<?php echo esc_url('https://docs.coolplugins.net/docs/ai-translation-for-polylang/?'.sanitize_text_field($atfp_utm_parameters).'&utm_medium=inside&utm_campaign=docs&utm_content=dashboard_footer'); ?>" target="_blank"><?php esc_html_e('Docs', 'automatic-translations-for-polylang'); ?></a>
        <div class="atfp-dashboard-social-icons">
            <?php
            $atfp_social_links = [
                ['https://www.facebook.com/coolplugins/', 'facebook.svg', esc_html__('Facebook', 'automatic-translations-for-polylang')],
                ['https://linkedin.com/company/coolplugins', 'linkedin.svg', esc_html__('Linkedin', 'automatic-translations-for-polylang')],
                ['https://x.com/cool_plugins', 'twitter.svg', esc_html__('Twitter', 'automatic-translations-for-polylang')],
                ['https://www.youtube.com/@cool_plugins', 'youtube.svg', esc_html__('YouTube Channel', 'automatic-translations-for-polylang')]
            ];
            foreach ($atfp_social_links as $atfp_link) {
                echo '<a href="' . esc_url($atfp_link[0]) . '" target="_blank">
                        <img src="' . esc_url(ATFP_URL . 'admin/atfp-dashboard/images/' . $atfp_link[1]) . '" alt="' . esc_attr($atfp_link[2]) . '">
                      </a>';
            }
            ?>
        </div>
    </div>
</div>
