const { __, sprintf } = wp.i18n;

const atfpElementorConfirmBox = {
    init: function() {
        this.pageTitleEvent=false;
        if(window.atfpElementorConfirmBoxData){
            this.createConfirmBox();
        }
    },

    createConfirmBox: function() {
        const confirmBox = jQuery(`<div class="atfp-elementor-translate-confirm-box modal-container" style="display:flex">
            <div class="modal-content">
            <div class="modal-header">
                    <div class="atfp-modal-header-left">
                        <img src="${window.atfpElementorConfirmBoxData.maginc_wand_url}" style="width: 20px; height: 20px; margin-right: 5px; filter: brightness(0) invert(0);" alt="${__("AI")}">
                        <h3>${__("AI Translation", "autopoly-ai-translation-for-polylang-pro")}</h3>
                    </div>
                    <span class="atfp-modal-close dashicons dashicons-no-alt"></span>
            </div>
            <div class="atfp-modal-body">
                <div class="atfp-main-section">
                    <p>${__("Use AI to translate this page inside Elementor while keeping the same layout and design.", "autopoly-ai-translation-for-polylang-pro")}</p>
                    <button type="button" class="atfp-translate-button button" data-value="yes" id="atfp-translate-button">
                        <img src="${window.atfpElementorConfirmBoxData.maginc_wand_url}" style="width: 20px; height: 20px; margin-right: 5px; filter: brightness(0) invert(1);" alt="${__("AI")}">
                        ${__("Translate Now", "autopoly-ai-translation-for-polylang-pro")}
                    </button>
                </div>
                <div class="atfp-marketing-card">
                    <h4>Want Unlimited or Bulk Translation?</h4>                        
                    <div class="atfp-marketing-buttons">
                        <a href="${window.atfpElementorConfirmBoxData.buy_pro_url}" target="_blank" class="atfp-marketing-btn atfp-primary-btn">
                            <img src="${window.atfpElementorConfirmBoxData.maginc_wand_url}" style="width: 20px; height: 20px; margin-right: 5px; filter: brightness(0) invert(1);" alt="${__("AI")}"><span class="atfp-btn-text">Upgrade Pro</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="modal-footer-notice">
            <span class="dashicons dashicons-warning"></span>
            <p><em>${__("Note: close this popup if you do not want AI translation.", "autopoly-ai-translation-for-polylang-pro")}</em></p>
            </div>
            </div>
        </div>
        `);

        confirmBox.appendTo(jQuery('body'));

        confirmBox.find('button.atfp-translate-button').on('click', (e)=>{this.confirmTranslation(e)});
        confirmBox.find('span.atfp-modal-close').on('click', (e)=>{e.preventDefault();this.closeConfirmBox();});
    },

    closeConfirmBox: function() {
        this.setPageTitle();
        const confirmBox = jQuery('.atfp-elementor-translate-confirm-box.modal-container');
        confirmBox.remove();
    },

    confirmTranslation: function(e) {
        this.setPageTitle();
        e.preventDefault();
        const postId=window.atfpElementorConfirmBoxData.postId;
        const targetLangSlug=window.atfpElementorConfirmBoxData.targetLangSlug;

        if(postId && targetLangSlug) {
            let oldData=localStorage.getItem('atfpElementorConfirmBox');
            let data={[postId+'_'+targetLangSlug]: true};

            if(oldData && 'string' === typeof oldData && '' !== oldData) {
                oldData=JSON.parse(oldData);
                data={...oldData, ...data};
            }

            localStorage.setItem('atfpElementorConfirmBox', JSON.stringify(data));

            const elementorButton=document.getElementById('elementor-editor-button');
            const elementorEditModeButton=document.getElementById('elementor-edit-mode-button');

            const translateButton=document.querySelector('button.atfp-translate-button');

            if(translateButton){
                this.loadingText(translateButton);
            }


            if(elementorEditModeButton) {
                elementorEditModeButton.click();
            }else if(elementorButton) {
                elementorButton.click();
            }
        }
    },

    loadingText: function(ele){
        if(!ele){
            return;
        }

        ele.disabled = true;

        ele.classList.add('loading');

        const loadinText=__("Loading", 'autopoly-ai-translation-for-polylang-pro');
        ele.innerHTML = `${loadinText}<span class="dot" style="--i: 0"></span><span class="dot" style="--i: 1"></span><span class ="dot" style="--i: 2"></span>`;
    },

    setPageTitle: function() {

        if(window.atfpElementorConfirmBoxData.editorType !== 'classic') {
            return;
        }

        if(this.pageTitleEvent) {
            return;
        }

        this.pageTitleEvent=true;

        const elementorButtons=document.querySelectorAll('#elementor-editor-button, #elementor-edit-mode-button');

        elementorButtons.forEach(button=>{
            button.addEventListener('click', (e)=>{  
                e.preventDefault();              
                
                if(window.wp && window.elementorAdmin && window.elementorAdmin.getDefaultElements){
                    const defaultElements=window.elementorAdmin.getDefaultElements();

                    if(defaultElements) {
                        $goToEditLink=defaultElements.$goToEditLink;

                        if($goToEditLink) {
                            var $wpTitle = jQuery('#title');

                            if (!$wpTitle.val()) {
                              $wpTitle.val('Elementor #' + jQuery('#post_ID').val());
                            }

                            if (wp.autosave) {
                              wp.autosave.server.triggerSave();
                            }

                            jQuery(document).on('heartbeat-tick.autosave', function () {
                              window.elementorCommon.elements.$window.off('beforeunload.edit-post');
                              location.href = $goToEditLink.attr('href');
                            });
                        }
                    }
                }
            });
        });
    }
};

jQuery(document).ready(function($) {
    atfpElementorConfirmBox.init();
});