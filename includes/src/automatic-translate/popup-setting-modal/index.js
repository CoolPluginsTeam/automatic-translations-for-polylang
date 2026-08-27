import ReactDOM from "react-dom/client";
import { useEffect, useState } from "@wordpress/element";
import PopStringModal from "../popup-string-modal";
import yandexLanguage from "../component/translate-provider/yandex/yandex-language";
import googleLanguage from "../component/translate-provider/google/google-language";
import ChromeLocalAiTranslator from "../component/translate-provider/local-ai-translator/local-ai-translator";
import SettingModalHeader from "./header";
import SettingModalBody from "./body";
import SettingModalFooter from "./footer";
import { __ , sprintf } from "@wordpress/i18n";
import ErrorModalBox from "../component/error-modal-box";

const SettingModal = (props) => {
    const [activeProvider, setActiveProvider] = useState({});
    const [modalRender, setModalRender] = useState(0);
    const [settingVisibility, setSettingVisibility] = useState(false);
    const sourceLang = atfp_global_object.source_lang;
    const targetLang = props.targetLang;
    const sourceLangName = atfp_global_object.languageObject[sourceLang]['name'];
    const targetLangName = atfp_global_object.languageObject[targetLang]['name'];
    const imgFolder = atfp_global_object.atfp_url + 'assets/images/';
    const yandexSupport = yandexLanguage().includes(targetLang);
    const googleSupport = googleLanguage().includes(targetLang === 'zh' ? atfp_global_object.languageObject['zh']?.locale.replace('_', '-') : targetLang);
    const [serviceModalErrors, setServiceModalErrors] = useState({});
    const [errorModalVisibility, setErrorModalVisibility] = useState(false);
    const [chromeAiBtnDisabled, setChromeAiBtnDisabled] = useState(false);
    const [edgeAiBtnDisabled, setEdgeAiBtnDisabled] = useState(false);

    const openModalOnLoadHandler = (e) => {
        e.preventDefault();
        const btnElement = e.target;
        const visibility = btnElement.dataset.value;

        if (visibility === 'yes') {
            setSettingVisibility(true);
        }

        btnElement.closest('#atfp-modal-open-warning-wrapper').remove();
    }

    const closeErrorModal = () => {
        setErrorModalVisibility(false);
        setSettingVisibility(true);
    }

    const openErrorModalHandler = (service) => {
        setSettingVisibility(false);
        setErrorModalVisibility(service);
    }

    const localAiUpdateStatus =  (status,progressElements={}, cardElement, actionElement) => {
        const prefix='atfp';
        
        if(cardElement){
            cardElement.classList.add(prefix+'-provider-card-disabled')
        }

        if(!progressElements.hasOwnProperty('initialized')){
            const progressElement=document.createElement('div');
            progressElement.classList.add(prefix+'-provider-card-loading');

            progressElements.initialized = true;
            actionElement.appendChild(progressElement);
            progressElements.progressElement = progressElement;

            const progressStatusElement=document.createElement('span');
            progressStatusElement.classList.add(prefix+'-provider-loading-spinner');
            progressElements.progressStatusElement = progressStatusElement;
            progressElement.appendChild(progressStatusElement);

            const progressTextElement=document.createElement('p');
            progressTextElement.textContent = 'Loading... ';
            progressElement.appendChild(progressTextElement);
        }

        // Progress reaching 100% only means the bytes arrived. The engine is
        // usable only once the support check answers, and create() can still
        // fail after a full download -- clearing the loading state here handed
        // the user a card they could pick before that answer existed. The
        // caller clears it instead, once it knows.

        return progressElements;
    }

    /**
     * useEffect hook to set settingVisibility.
     * Triggers the setSettingVisibility only when user click on meta field Button.
    */
    useEffect(() => {
        const atfpModalOpenWarningContainer = document.querySelector('#atfp-modal-open-warning-wrapper .modal-container');
        
        if(atfpModalOpenWarningContainer){
            atfpModalOpenWarningContainer.style.display = 'flex';
        }

        const firstRenderBtns = document.querySelectorAll('#atfp-modal-open-warning-wrapper .modal-content button.atfp-translate-button[data-value="yes"]');
        const metaFieldBtn = document.querySelector(props.translateWrpSelector);

        if (metaFieldBtn) {
            metaFieldBtn.addEventListener('click', (e) => {
                e.preventDefault();
                setSettingVisibility(prev => !prev);
            });
        }

        firstRenderBtns.forEach(ele => {
            if (ele) {
                ele.addEventListener('click', openModalOnLoadHandler);
            }
        })
    }, [])

    /**
     * useEffect hook to check if the local AI translator is supported.
     */
    useEffect(() => {
        const localAiCardElement=document.querySelector('#atfp-provider-card-localAiTranslator');
        const actionElement=localAiCardElement?.querySelector('.atfp-provider-card-actions');
        let progressButton={};
        
        const localAiUpdateStatusHandler = (status) => {
            progressButton = localAiUpdateStatus(status, progressButton, localAiCardElement, actionElement);
        }

        // Takes the loading state back down once the support check has answered.
        // Whether the engine turned out usable is then decided by the state below,
        // so the card is never pickable while the answer is still unknown.
        const clearLocalAiProgress = () => {
            if (localAiCardElement) {
                localAiCardElement.classList.remove('atfp-provider-card-disabled');
            }

            const progressElement = progressButton.progressElement;

            if (actionElement && progressElement && progressElement.parentNode === actionElement) {
                actionElement.removeChild(progressElement);
            }

            progressButton = {};
        }

        const languageSupportedStatus = async () => {
            let errors = {};
            const browserType = ChromeLocalAiTranslator.getBrowserType();
            let localAiTranslatorSupport;

            try {
                localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName, sourceLangName, localAiUpdateStatusHandler);
            } finally {
                clearLocalAiProgress();
            }

            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object') {
                setChromeAiBtnDisabled(true);

                errors.localAiTranslator = { message: localAiTranslatorSupport.chrome ? localAiTranslatorSupport.chrome : localAiTranslatorSupport, Title: sprintf(__("%s AI Translator", 'automatic-translations-for-polylang'), browserType === 'Edge' ? "Edge" : "Chrome") };

                setServiceModalErrors(prev => ({ ...prev, localAiTranslator: errors.localAiTranslator }));

                if (['Other','Edge'].includes(browserType)) {
                    setEdgeAiBtnDisabled(true);
    
                    errors.edgeAiTranslator = { message: localAiTranslatorSupport.edge ? localAiTranslatorSupport.edge : localAiTranslatorSupport, Title: __("Edge AI Translator", 'automatic-translations-for-polylang') };
    
                    setServiceModalErrors(prev => ({ ...prev, edgeAiTranslator: errors.edgeAiTranslator }));
                }
            }
        };

        if(settingVisibility){
            if(!yandexSupport){
                setServiceModalErrors(prev => ({
                    ...prev,
                    yandex: {
                        message: "<p style={{ fontSize: '1rem', color: '#ff4646' }}>"+sprintf(
                            __("Yandex Translate does not support the target language: %s.", 'automatic-translations-for-polylang'),
                            "<strong>"+targetLangName + " ("+targetLang+")</strong>"
                        )+"</p>",
                        Title: __("Yandex Translate", 'automatic-translations-for-polylang')
                    }
                }));
            };

            if (!googleSupport) {
                setServiceModalErrors(prev => ({
                    ...prev,
                    google: {
                        message: "<p style={{ fontSize: '1rem', color: '#ff4646' }}>" + sprintf(
                            __("Google Translate does not support the target language: %s.", 'automatic-translations-for-polylang'),
                            "<strong>" + targetLangName + "</strong>"
                        ) + "</p>",
                        Title: __("Google Translate", 'automatic-translations-for-polylang')
                    }
                }));
            };

            languageSupportedStatus();
        }
    }, [settingVisibility]);

    /**
     * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
     */
    useEffect(() => {
        const service = activeProvider.service;
        const serviceLabel = activeProvider.serviceLabel;
        const postId = props.postId;

        const parentWrp = document.getElementById("atfp_strings_model");

        if (parentWrp) {
            // Store root instance in a ref to avoid recreating it
            if (!parentWrp._reactRoot) {
                parentWrp._reactRoot = ReactDOM.createRoot(parentWrp);
            }

            if (modalRender) {
                parentWrp._reactRoot.render(<PopStringModal
                    currentPostId={props.currentPostId}
                    postId={postId}
                    service={service}
                    serviceLabel={serviceLabel}
                    sourceLang={sourceLang}
                    targetLang={targetLang}
                    modalRender={modalRender}
                    pageTranslate={props.pageTranslate}
                    postDataFetchStatus={props.postDataFetchStatus}
                    fetchPostData={props.fetchPostData}
                    translatePost={props.translatePost}
                    contentLoading={props.contentLoading}
                    updatePostDataFetch={props.updatePostDataFetch}
                    stringModalBodyNotice={props.stringModalBodyNotice}
                />);
            }
        }
    }, [props.postDataFetchStatus, modalRender]);

    /**
     * Marks the picked engine as the active one.
     *
     * Selection stays synchronous on purpose. This used to await a support check
     * before accepting the click, so the card only lit up once the browser had
     * answered -- and on a browser that answers slowly, or not at all, the click
     * looked like it had done nothing. The check the effect above runs when the
     * modal opens already disables an engine that cannot be used, so a card the
     * user can still click is a card they are allowed to pick.
     *
     * @param {string} service      Engine key that was clicked.
     * @param {string} serviceLabel Human readable name of that engine.
     *
     * @return {void}
     */
    const updateActiveProviderHandler = (service, serviceLabel) => {
        setActiveProvider({ service, serviceLabel });
    };
    
    const fetchContent = async () => {
        const activeService = activeProvider.service;
        
        if(!activeService){
            return;
        }
        
        setSettingVisibility(false);
        setModalRender(prev => prev + 1);
    }

    const handleSettingVisibility = (visibility) => {
        setSettingVisibility(visibility);
    }

    return (
        <>
            {errorModalVisibility && serviceModalErrors[errorModalVisibility] &&
                <ErrorModalBox onClose={closeErrorModal} {...serviceModalErrors[errorModalVisibility]}/>
            }
            {settingVisibility &&
                <div className="modal-container" style={{ display: settingVisibility ? 'flex' : 'none' }}>
                    <div className="atfp-settings modal-content">
                        <SettingModalHeader
                            setSettingVisibility={handleSettingVisibility}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            targetLangName={targetLangName}
                        />
                        <SettingModalBody
                            yandexDisabled={!yandexSupport}
                            googleDisabled={!googleSupport}
                            imgFolder={imgFolder}
                            targetLangName={targetLangName}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            localAiTranslatorDisabled={chromeAiBtnDisabled}
                            edgeAiTranslatorDisabled={edgeAiBtnDisabled}
                            openErrorModalHandler={openErrorModalHandler}
                            onSelectProvider={updateActiveProviderHandler}
                            activeProvider={activeProvider.service}
                            />
                        <SettingModalFooter
                            selectedProvider={activeProvider.service}
                            onStartTranslation={fetchContent}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default SettingModal;