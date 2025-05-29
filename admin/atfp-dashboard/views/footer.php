<div class="atfp-dashboard-info">
    <div class="atfp-dashboard-info-links">
        <p>
            <?php _e('Made with ❤️ by', $text_domain); ?>
            <span class="logo">
                <a href="https://coolplugins.net/?utm_source=atlt_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=dashboard_logo" target="_blank">
                    <img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/cool-plugins-logo-black.svg'); ?>" alt="<?php esc_attr_e('Cool Plugins Logo', $text_domain); ?>">
                </a>
            </span>
        </p>
        <a href="https://coolplugins.net/support/?utm_source=tpa_plugin&utm_medium=inside&utm_campaign=support&utm_content=dashboard_header" target="_blank"><?php _e('Support', $text_domain); ?></a> |
        <a href="https://docs.coolplugins.net/docs/ai-translation-for-polylang/" target="_blank"><?php _e('Docs', $text_domain); ?></a>
        <div class="atfp-dashboard-social-icons">
            <?php
            $social_links = [
                ['https://www.facebook.com/coolplugins/', 'facebook.svg', __('Facebook', $text_domain)],
                ['https://linkedin.com/company/coolplugins', 'linkedin.svg', __('Linkedin', $text_domain)],
                ['https://x.com/cool_plugins', 'twitter.svg', __('Twitter', $text_domain)],
                ['https://www.youtube.com/@cool_plugins', 'youtube.svg', __('YouTube Channel', $text_domain)]
            ];
            foreach ($social_links as $link) {
                echo '<a href="' . esc_url($link[0]) . '" target="_blank">
                        <img src="' . esc_url(ATFP_URL . 'admin/atfp-dashboard/images/' . $link[1]) . '" alt="' . esc_attr($link[2]) . '">
                      </a>';
            }
            ?>
        </div>
    </div>
</div>
