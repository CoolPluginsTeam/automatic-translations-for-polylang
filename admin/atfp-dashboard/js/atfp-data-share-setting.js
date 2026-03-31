jQuery(function($) {
    const $termsLink = $('.atfp-see-terms');
    const $termsBox = $('#termsBox');

    $termsLink.on('click', function(e) {
        e.preventDefault();
        
        const isVisible = $termsBox.toggle().is(':visible');
        
        $(this).html(isVisible ? 'Hide Terms' : 'See terms');
        
        $(this).attr('aria-expanded', isVisible);
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