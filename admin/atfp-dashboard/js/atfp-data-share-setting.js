jQuery(function($) {
    const $termsLink = $('.atfp-see-terms');
    const $termsBox = $('#termsBox');

    $termsLink.on('click', function(e) {
        e.preventDefault();
        
        const isVisible = $termsBox.toggle().is(':visible');
        
        $(this).html(isVisible ? 'Hide Terms' : 'See terms');
        
        $(this).attr('aria-expanded', isVisible);
    });

    /* =========================
     * Plugin install button
     * ========================= */
    $(document).on('click', '.atfp-install-plugin', function (e) {

        e.preventDefault();
    
        let button   = $(this);
        let $wrapper = button.closest('.atfp-dashboard-addon-l');
        let slug     = button.data('slug');
        let nonce    = button.data('nonce');
        const originalText = button.text().trim();

        if(slug !== 'automatic-translator-addon-for-loco-translate'){
            return;
        }
        
        // Determine action based on button text
        let action = 'install';
        if (originalText.toLowerCase() === 'activate' || originalText.toLowerCase().includes('activate')) {
            action = 'activate';
        }
    
        $wrapper.find('.atfp-install-message').empty();
    
        if (!slug || !nonce || typeof ajaxurl === 'undefined') {
            $wrapper.find('.atfp-install-message')
                .text('Missing required data. Please reload the page.');
            return;
        }
    
        // Show appropriate loading text based on action
        button.text(action === 'activate' ? 'Activating...' : 'Installing...');
        $('.atfp-install-plugin').prop('disabled', true);
    
        $.post(ajaxurl, {
            action: 'atfp_install_plugin',
            slug: slug,
            plugin_action: action,
            _wpnonce: nonce
        }, function (response) {
            if (response && response.success) {
    
                const $container = button.closest('.atfp-dashboard-addon-l');
                if (response.data && response.data.activated === true) {
                    button.remove();
                    $container.find('.atfp-install-message').remove();
        
                    $container.append(`
                        <span class="installed">Activated</span>
                    `);
                } else {
                    // Not activated yet (e.g. Loco Translate missing)
                    let message = 'Installed successfully.';
                    if (response.data && response.data.message) {
                        message = response.data.message;
                    }
                    $container.find('.atfp-install-message').text(message);
                    button.text('Activate').prop('disabled', false);
                }
    
            }else {
                let errorMessage = 'Activation failed. Please try again.';
                    // Normal case: try to get message from response
                    if (response && response.data) {
                        if (typeof response.data === 'string') {
                            errorMessage = response.data;
                        } else if (response.data.message) {
                            errorMessage = response.data.message;
                        }
                    }
                // Show the notice and re-enable the button
                $wrapper.find('.atfp-install-message').text(errorMessage);
                button.text(originalText).prop('disabled', false);
            }
                        
    
            $('.atfp-install-plugin').not(button).prop('disabled', false);
        });
    });

    $('.atfp-provider-switch-container .atfp-provider-toggle').on('change', function() {
        const checkedProviders = $('.atfp-provider-toggle:checked');
        const enabledProviders={};

        checkedProviders.each(function() {
            enabledProviders[$(this).data('provider')] = true;
        });

        $.ajax({
            url: atfpSettingsScriptData.ajax_url,
            type: 'POST',
            data: {
                action: 'atfp_update_enabled_providers',
                enabled_providers: JSON.stringify(enabledProviders),
                update_providers_key: atfpSettingsScriptData.nonce
            },
            success: function(response) {
                if(response.success === true && response.data.providers){
                    const updatedProviders = response.data.providers;
                    checkedProviders.each(function() {
                        if(updatedProviders.includes($(this).data('provider'))){
                            $(this).prop('checked', true);
                        }else{
                            $(this).prop('checked', false);
                        }
                    });
                }else{
                    console.log(response.data.message);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    /**
     * Persist the provider that should be pre-selected in the translation modal.
     */
    $(document).on('change', '.atfp-engine-default-input', function () {
        const $input = $(this);
        const provider = $input.val();
        const $list = $input.closest('.atfp-engine-list');
        const $message = $('.atfp-engine-default-message');

        $message.text('').removeClass('is-error');

        $.ajax({
            url: atfpSettingsScriptData.ajax_url,
            type: 'POST',
            data: {
                action: 'atfp_update_default_provider',
                default_provider: provider,
                update_providers_key: $list.data('nonce')
            },
            success: function (response) {
                if (response.success === true) {
                    const $row = $input.closest('.atfp-engine-row');

                    // Only one row can carry the default, so move the marker and
                    // the toggle lock that keeps the default provider enabled.
                    $('.atfp-engine-row').removeClass('is-default');
                    $('.atfp-engine-row .atfp-provider-toggle').prop('disabled', false).attr('title', '');

                    $row.addClass('is-default');
                    $row.find('.atfp-provider-toggle').prop('disabled', true);
                    return;
                }

                // Re-check whichever row the server still considers the default.
                $input.prop('checked', false);
                $message
                    .addClass('is-error')
                    .text(response.data && response.data.message ? response.data.message : response.data);
            },
            error: function () {
                $input.prop('checked', false);
                $message.addClass('is-error').text('Could not save the default translation provider.');
            }
        });
    });

    /**
     * Load the walkthrough embed only once the viewer asks for it, so the
     * dashboard makes no third-party request on page load.
     */
    $(document).on('click', '.atfp-dashboard-video-frame', function () {
        const $frame = $(this);
        const $video = $frame.closest('.atfp-dashboard-video');
        const videoId = $video.data('video-id');

        // Already swapped for the embed, so let the player handle the click.
        if ($frame.find('iframe').length) {
            return;
        }

        if (!videoId || !$frame.length) {
            return;
        }

        const $iframe = $('<iframe></iframe>', {
            src: 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1',
            title: $video.data('video-title') || '',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowfullscreen: 'allowfullscreen',
            referrerpolicy: 'strict-origin-when-cross-origin'
        });

        $frame.empty().append($iframe);
    });

    if (typeof ChromeAINoticeFramework !== 'undefined' && typeof caisNoticeData !== 'undefined') {
        new ChromeAINoticeFramework({
            container: '#cais-chrome-setup-container',
            dataVar: 'caisNoticeData',
            providerTypes: ['chrome', 'edge'],
            cardSelectorPattern: '.atfp-card-{type}-built-in-ai',
            toggleSelectorPattern: '.atfp-card-{type}-built-in-ai .atfp-provider-toggle',
            configureBtnSelectorPattern: '.atfp-{type}-configure-button',
            noticeClassPattern: 'atfp-{type}-configure-notice'
        });
    }
});