jQuery(function($) {
    const $termsLink = $('.atfp-see-terms');
    const $termsBox = $('#termsBox');

    $termsLink.on('click', function(e) {
        e.preventDefault();
        
        const isVisible = $termsBox.toggle().is(':visible');
        
        $(this).html(isVisible ? 'Hide Terms' : 'See terms');
        
        $(this).attr('aria-expanded', isVisible);
    });
});