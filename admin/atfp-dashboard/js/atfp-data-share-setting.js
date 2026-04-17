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

    $('.atfp-provider-toggle').on('change', function() {
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

    $('.atfp-provider-switch-container[data-provider]').on('click', function(e) {
        const provider = $(this).data('provider');
        const utm_link=atfpSettingsScriptData.buy_pro_url + '&utm_campaign=get_pro&utm_content=dashboard_'+provider;
        window.open(utm_link, '_blank');
        e.preventDefault();
    });
});