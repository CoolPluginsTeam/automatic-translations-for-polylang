import ReactDOM from "react-dom/client";
import { useEffect, useState } from "@wordpress/element";
import PopStringModal from "../popupStringModal";
import yandexLanguage from "../component/TranslateProvider/yandex/yandex-language";
import ChromeLocalAiTranslator from "../component/TranslateProvider/local-ai-translator/local-ai-translator";
import SettingModalHeader from "./header";
import SettingModalBody from "./body";
import SettingModalFooter from "./footer";
import { __ } from "@wordpress/i18n";
import ErrorModalBox from "../component/ErrorModalBox";

const SettingModal = (props) => {
    const [targetBtn, setTargetBtn] = useState({});
    const [modalRender, setModalRender] = useState(0);
    const [settingVisibility, setSettingVisibility] = useState(false);
    const sourceLang = atfp_global_object.source_lang;
    const targetLang = props.targetLang;
    const sourceLangName = atfp_global_object.languageObject[sourceLang];
    const targetLangName = atfp_global_object.languageObject[targetLang];
    const imgFolder = atfp_global_object.atfp_url + 'assets/images/';
    const yandexSupport = yandexLanguage().includes(targetLang);
    const [serviceModalErrors, setServiceModalErrors] = useState({});
    const [errorModalVisibility, setErrorModalVisibility] = useState(false);
    const [chromeAiBtnDisabled, setChromeAiBtnDisabled] = useState(false);

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
    }

    const openErrorModalHandler = (service) => {
        setSettingVisibility(false);
        setErrorModalVisibility(service);
    }

    /**
     * useEffect hook to set settingVisibility.
     * Triggers the setSettingVisibility only when user click on meta field Button.
    */
    useEffect(() => {
        const firstRenderBtns = document.querySelectorAll('#atfp-modal-open-warning-wrapper .modal-content button');
        const metaFieldBtn = document.querySelector(props.translateWrpSelector);

        if (metaFieldBtn) {
            metaFieldBtn.addEventListener('click', () => {
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
        const languageSupportedStatus = async () => {
            const localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName, sourceLangName);
            const translateBtn = document.querySelector('.atfp-service-btn#atfp-local-ai-translator-btn');

            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object' && translateBtn) {
                setChromeAiBtnDisabled(true);
    
                setServiceModalErrors(prev => ({ ...prev, localAiTranslator: {message: localAiTranslatorSupport, Title: __("Chrome AI Translator", 'automatic-translations-for-polylang')} }));
            }
        };
        languageSupportedStatus();
    }, [settingVisibility]);

    /**
     * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
     */
    useEffect(() => {
        const btn = targetBtn;
        const service = btn.dataset && btn.dataset.service;
        const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
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
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const fetchContent = async (e) => {
        let targetElement = !e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;

        if (!targetElement) {
            return;
        }

        const dataService = targetElement.dataset && targetElement.dataset.service;
        setSettingVisibility(false);

        if (dataService === 'localAiTranslator') {
            const localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName);
            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object') {
                return;
            }
        }
        
        setModalRender(prev => prev + 1);
        setTargetBtn(targetElement);
    };

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
                            fetchContent={fetchContent}
                            imgFolder={imgFolder}
                            targetLangName={targetLangName}
                            postType={props.postType}
                            sourceLangName={sourceLangName}
                            localAiTranslatorDisabled={chromeAiBtnDisabled}
                            openErrorModalHandler={openErrorModalHandler}
                        />
                        <SettingModalFooter
                            setSettingVisibility={handleSettingVisibility}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default SettingModal;