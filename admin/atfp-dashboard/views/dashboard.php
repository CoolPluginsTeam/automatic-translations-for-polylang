
<div class="atfp-dashboard-left-section">
        
        <!-- Welcome Section -->
        <div class="atfp-dashboard-welcome">
            <div class="atfp-dashboard-welcome-text">
                <h2><?php echo esc_html__('Welcome To Polylang Addon', $text_domain); ?></h2>
                <p><?php echo esc_html__('Translate WordPress Pages & Posts instantly with Polylang Addon. One-click, thousands of strings - no extra cost!', $text_domain); ?></p>
                <div class="atfp-dashboard-btns-row">
                    <a href="<?php echo esc_url(admin_url('edit.php?post_type=page')); ?>" target="_blank" class="atfp-dashboard-btn primary"><?php echo esc_html__('Translate Pages', $text_domain); ?></a>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=polylang-atfp-dashboard&tab=support-blocks')); ?>" class="atfp-dashboard-btn"><?php echo esc_html__('Supported Blocks', $text_domain); ?></a>
                </div>
                <a class="atfp-dashboard-docs" href="<?php echo esc_url('https://docs.coolplugins.net/docs/ai-translation-for-polylang/'); ?>" target="_blank"><img src="<?php echo esc_url(ATFP_URL . 'admin/atfp-dashboard/images/document.svg'); ?>" alt="document"> <?php echo esc_html__('Read Plugin Docs', $text_domain); ?></a>
            </div>
            <div class="atfp-dashboard-welcome-video">
                <a href="https://coolplugins.net/product/automatic-translations-for-polylang/?utm_source=atfp_plugin&utm_medium=dashboard&utm_campaign=get_pro&utm_content=buy_pro" target="_blank" class="atfp-dashboard-video-link">
                    <img decoding="async" src="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/video.svg'; ?>" class="play-icon" alt="play-icon">
                    <picture>
                        <source srcset="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-video.png'; ?>" type="image/webp">
                        <img src="<?php echo ATFP_URL . 'admin/atfp-dashboard/images/polylang-addon-video.png'; ?>" class="loco-video" alt="loco translate addon preview">
                    </picture>
                </a>
            </div>
        </div>

        <div class="atfp-dashboard-get-started">
           <div class="atfp-dashboard-get-started-container">
                <h3><?php echo esc_html__('Get Started', $text_domain); ?></h3>
                <div class="atfp-dashboard-get-started-grid">
                    <div class="atfp-dashboard-get-started-grid-content">
                        <h2><?php echo esc_html__('Automate the Translation Process :-', $text_domain); ?></h2>

                        <ul>
                            <li><?php echo sprintf(esc_html__('Open %sPages &gt; All Pages%s and click the page you want to translate.', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Click the %s“+”%s icon next to the language you want.', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Choose a translation provider.', $text_domain)); ?></li>
                            <li><?php echo sprintf(esc_html__('Click %s“Translate”%s to auto-translate the page.', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Check the translation, edit if needed, then click %s“Update”%s to save.', $text_domain), '<strong>', '</strong>'); ?></li>
                        </ul>
                    </div>

                    <div>
                        <iframe title="Automate the Translation Process with AI Translation for Polylang"
                                src="https://www.youtube.com/embed/ecHsOyIL_J4?feature=oembed"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
                <div class="atfp-dashboard-get-started-grid">
                    <div class="atfp-dashboard-get-started-grid-content">
                        <h2><?php echo esc_html__('Elementor Page Translation :-', $text_domain); ?></h2>

                        <ul>
                            <li><?php echo sprintf(esc_html__('In %sPages &gt; All Pages%s, click the page and then the %s“+”%s icon for your target language.', $text_domain), '<strong>', '</strong>', '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Now, click on the %s“Edit with Elementor”%s option. ', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Click the %s“Translate”%s button in Elementor.', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Choose a translation provider.', $text_domain)); ?></li>
                            <li><?php echo sprintf(esc_html__('Click %s“Translate”%s to auto-translate the page.', $text_domain), '<strong>', '</strong>'); ?></li>
                            <li><?php echo sprintf(esc_html__('Check the translation, edit if needed, then click %s“Update”%s to save.', $text_domain), '<strong>', '</strong>'); ?></li>
                        </ul>
                    </div>

                    <div>
                        <iframe title="Elementor Page Translation with AI Translation for Polylang"
                                src="https://www.youtube.com/embed/bmmc-Ynwj8w?feature=oembed"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
           </div>
        </div>
    </div>

