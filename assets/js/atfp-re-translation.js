(function($){
    const { __=(e)=>{return e} } = wp.i18n;

    class AtfpRetranslation {
        constructor() {
            this.editorType = window.atfpReTranslationData ? window.atfpReTranslationData.editor_type : false;
            this.atfpUrl = window.atfpReTranslationData ? window.atfpReTranslationData.atfp_url : '';
            this.proUrl = window.atfpReTranslationData ? window.atfpReTranslationData.pro_version_url : '#';
            this.magicWandUrl = this.atfpUrl + 'assets/images/magic-wand.svg';

            // Bind methods to always use class context
            this.appendModal = this.appendModal.bind(this);
            this.appendElementorButton = this.appendElementorButton.bind(this);
            this.handleNonElementor = this.handleNonElementor.bind(this);

            if(!this.editorType){
                return;
            }

            if(this.editorType === 'elementor'){
                jQuery(window).on('elementor:init', ()=>{
                    elementor.on('document:loaded', this.appendElementorButton);
                });
            } else {
                $(document).ready(this.handleNonElementor);
            }
        }

        appendModal() {
            if(document.querySelector('#atfp-retranslate-modal')) {
                document.getElementById('atfp-retranslate-modal').style.display='flex';
                return;
            }

            const modal = `
                <div id="atfp-retranslate-modal" style="display: flex;">
                    <div class="atfp-retranslate-modal-content">
                        <div class="atfp-modal-header">
                            <div class="atfp-modal-header-left">
                                <img src="${this.magicWandUrl}" style="width: 20px; height: 20px; margin-right: 8px; filter: brightness(0) invert(0);" alt="AI" />
                                <h2>
                                    ${__("AI Translation", "automatic-translations-for-polylang")}
                                </h2>
                            </div>
                            <button type="button" class="atfp-modal-close modal-close" title="Close" aria-label="Close" onclick="document.getElementById('atfp-retranslate-modal').style.display='none'; document.getElementById('atfp-retranslate-modal').style.display);">&times;</button>
                        </div>
                        <div class="atfp-modal-body">
                            <p>
                                ${__("Want to update your translated content to match the latest changes on your page? Try our Pro version to easily re-translate and unlock all advanced features.", "automatic-translations-for-polylang")}
                            </p>
                            <a href="${this.proUrl}" target="_blank" class="atfp-marketing-btn button">
                                <img src="${this.magicWandUrl}" style="width: 20px; height: 20px; margin-right: 8px; filter: brightness(0) invert(1);" alt="AI" />
                                <span>${__("Get Pro for Re-Translation", "automatic-translations-for-polylang")}</span>
                            </a>
                        </div>
                        <div class="modal-footer-notice">
                            <span class="dashicons dashicons-warning"></span>
                            <p><em>Note: close this popup if you do not want to upgrade.</em></p>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modal);
        }

        appendElementorButton() {
            const translateButtonGroup = jQuery('.MuiButtonGroup-root.MuiButtonGroup-contained').parent();
            let buttonElement = jQuery(translateButtonGroup).find('.elementor-button.atfp-retranslate-button');
            if (translateButtonGroup.length > 0 && buttonElement.length === 0) {
                const buttonHtml = '<button class="elementor-button atfp-retranslate-button" id="atfp-retranslate-button" name="atfp_meta_box_retranslate">' + __('Re-Translate', 'automatic-translations-for-polylang') + '</button>';
                buttonElement = jQuery(buttonHtml);
                translateButtonGroup.prepend(buttonElement);

                buttonElement.on('click', this.appendModal);
            }
        }

        handleNonElementor() {
            // Ensure button exists and is not duplicated
            if ($("#atfp-retranslate-button").length === 0) {
                // You might need to select a container to append the button. This example tries body.
                const buttonHtml = '<a href="#" class="atfp-retranslate-button button" id="atfp-retranslate-button" name="atfp_meta_box_retranslate">' + __('Re-Translate', 'automatic-translations-for-polylang') + '</a>';
                $("body").prepend(buttonHtml);
            }

            $("#atfp-retranslate-button").off('click.atfp-retranslate').on('click.atfp-retranslate', (e)=>{
                e.preventDefault();
                this.appendModal();
            });
        }
    }

    // Initialize the class when required
    new AtfpRetranslation();

})(jQuery);