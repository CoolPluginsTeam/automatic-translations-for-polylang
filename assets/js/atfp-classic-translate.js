(function($){
    /**
     * Create the Classic Editor Pro modal
     */
    function createClassicProModal() {

        const classicProModal=document.querySelector('#atfp-classic-pro-modal');

        if(classicProModal){
            return;
        }

        // Prepare URLs and strings
        var atfpUrl = window.atfpClassicTranslateData && window.atfpClassicTranslateData.atfp_url ? window.atfpClassicTranslateData.atfp_url : '';
        var magicWandUrl = atfpUrl + 'assets/images/magic-wand.svg';
        let refrenceText = window.atfpClassicTranslateData && window.atfpClassicTranslateData.refrence_text ? window.atfpClassicTranslateData.refrence_text : 'atfp_plugin';
        refrenceText =`?utm_source=${refrenceText}&utm_medium=atfp_plugin&utm_campaign=atfp_plugin`;
        var proUrl = window.atfpClassicTranslateData && window.atfpClassicTranslateData.pro_version_url ? window.atfpClassicTranslateData.pro_version_url+refrenceText : '#';

        // Compose modal HTML with display:none (initially hidden), show later with display:flex
        var modalHtml = `
        <div id="atfp-classic-pro-modal" tabindex="-1" aria-modal="true" role="dialog" style="display:none; align-items: center; justify-content: center;">
            <div class="atfp-classic-modal-container modal-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="atfp-modal-header-left">
                            <img src="${magicWandUrl}" style="width: 20px; height: 20px; margin-right: 5px; filter: brightness(0) invert(0);" alt="AI">
                            <h3>AI Translation</h3>
                        </div>
                        <button type="button" class="atfp-modal-close modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body atfp-modal-body">
                        <p>
                            If you want to translate classic editor content, you can try our pro version to unlock all advanced features.
                        </p>
                        <a href="${proUrl}" target="_blank" class="atfp-marketing-btn button">
                            <img src="${magicWandUrl}" style="width: 20px; height: 20px; margin-right: 5px; filter: brightness(0) invert(1);" alt="AI"><span class="atfp-btn-text">Get Pro for Classic Editor Translation</span>
                        </a>
                    </div>
                    <div class="modal-footer-notice">
                        <span class="dashicons dashicons-warning"></span>
                        <p><em>Note: close this popup if you do not want to upgrade.</em></p>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Close on close button
        $('#atfp-classic-pro-modal .atfp-modal-close').on('click', function(e) {
            e.preventDefault();
            closeClassicProModal();
        });

        $('body').append(modalHtml);

        // Close on close button
        $('#atfp-classic-pro-modal .atfp-modal-close').on('click', function(e) {
            e.preventDefault();
            closeClassicProModal();
        });
    }

    /**
     * Append and open the modal (without animation)
     */
    function openClassicProModal() {
        // Remove any old modals
        $('#atfp-classic-pro-modal').remove();

        // Append to body
        createClassicProModal();

        // Show overlay by setting display:flex (no animation)
        $('#atfp-classic-pro-modal').css({'display': 'flex'});

        // Focus modal for accessibility
        $('#atfp-classic-pro-modal').focus();

        // Close on overlay click (optional)
        $('#atfp-classic-pro-modal').on('click', function(e) {
            if (e.target === this) {
                closeClassicProModal();
            }
        });
    }

    /**
     * Close the modal and clean up (without animation)
     */
    function closeClassicProModal() {
        $('#atfp-classic-pro-modal').remove();
    }

    // Bind modal opening to the classic editor translate button
    $(document).ready(function(){
        createClassicProModal();
        $('#atfp-classic-pro-modal').css({'display': 'flex'});

        $(document).on('click', '#atfp-translate-button', function(e){
            e.preventDefault();
            openClassicProModal();
        });
    });

})(jQuery);