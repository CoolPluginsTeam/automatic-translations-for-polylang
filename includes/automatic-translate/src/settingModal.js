import ReactDOM from "react-dom/client";
import { useEffect, useState } from "@wordpress/element";
import PopStringModal from "./popupStringModal";
import yandexLanguage from "./component/TranslateProvider/yandex/yandex-language";
import ChromeLocalAiTranslator from "./component/TranslateProvider/local-ai-translator/local-ai-translator";
const { sprintf, __ } = wp.i18n;

const SettingModal = (props) => {
    const [targetBtn, setTargetBtn] = useState({});
    const [blockRules, setBlockRules] = useState({});
    const [modalRender, setModalRender] = useState(0);
    const [settingVisibility, setSettingVisibility] = useState(false);
    const sourceLang = atfp_ajax_object.source_lang;
    const targetLang = props.targetLang;
    const sourceLangName = atfp_ajax_object.languageObject[sourceLang];
    const targetLangName = atfp_ajax_object.languageObject[targetLang];
    const apiUrl = atfp_ajax_object.ajax_url;
    const imgFolder = atfp_ajax_object.atfp_url + 'assets/images/';
    const yandexSupport = yandexLanguage().includes(targetLang);

    /**
     * Prepare data to send in API request.
     */
    const apiSendData = {
        atfp_nonce: atfp_ajax_object.ajax_nonce,
        action: atfp_ajax_object.action_block_rules
    };

    const openModalOnLoadHandler = (e) => {
        e.preventDefault();
        const btnElement = e.target;
        const visibility = btnElement.dataset.value;

        if (visibility === 'yes') {
            setSettingVisibility(true);
        }

        btnElement.closest('#atfp-modal-open-warning-wrapper').remove();
    }

    /**
     * useEffect hook to set settingVisibility.
     * Triggers the setSettingVisibility only when user click on meta field Button.
    */
    useEffect(() => {
        const firstRenderBtns = document.querySelectorAll('#atfp-modal-open-warning-wrapper .modal-content button');
        const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');

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
            const localAiTranslatorSupport = await ChromeLocalAiTranslator.languageSupportedStatus(sourceLang, targetLang, targetLangName);
            const translateBtn = document.querySelector('.atfp-service-btn#local_ai_translator_btn');

            if (localAiTranslatorSupport !== true && typeof localAiTranslatorSupport === 'object' && translateBtn) {
                translateBtn.disabled = true;
                jQuery(translateBtn).after(localAiTranslatorSupport);
            }
        };
        languageSupportedStatus();
    }, [settingVisibility]);

    /**
     * Fetch block rules data from the server.
     */
    const fetchBlockRules = () => {
        if (Object.keys(blockRules).length > 0 || props.postDataFetchStatus) {
            return;
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(apiSendData)
        })
            .then(response => response.json())
            .then(data => {
                const blockRules = JSON.parse(data.data.blockRules);

                setBlockRules(blockRules);
            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }

    /**
     * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
     * Renders the modal only when blockRules is not empty and fetchStatus is true.
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
                    blockRules={blockRules}
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
                />);
            }
        }
    }, [props.postDataFetchStatus, blockRules, modalRender]);

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const fetchContent = async (e) => {
        let targetElement = !e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;
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
        fetchBlockRules();
    };

    return (
        <>
            {settingVisibility &&
                <div className="modal-container" style={{ display: settingVisibility ? 'flex' : 'none' }}>
                    <div className="atfp-settings modal-content">
                        <div className="modal-header">
                            <h2>{__("Step 1 - Select Translation Provider", 'automatic-translations-for-polylang')}</h2>
                            <h4>{sprintf(__("Translate %(postType)s content from %(source)s to %(target)s", 'automatic-translations-for-polylang'), { postType: props.postType, source: sourceLangName, target: targetLangName })}</h4>
                            <p className="atfp-error-message" style={{ marginBottom: '.5rem' }}>{sprintf(__("This translation widget replaces the current %(postType)s content with the original %(source)s %(postType)s and translates it into %(target)s", 'automatic-translations-for-polylang'), { postType: props.postType, source: sourceLangName, target: targetLangName })}</p>
                            <span className="close" onClick={() => setSettingVisibility(false)}>&times;</span>
                        </div>
                        <hr />
                        <strong className="atlt-heading">{__("Translate Using Yandex Page Translate Widget", 'automatic-translations-for-polylang')}</strong>
                        <div className="inputGroup">
                            {yandexSupport ?
                                <>
                                    <button className="atfp-service-btn translate button button-primary" data-service="yandex" data-service-label="Yandex Translate" onClick={fetchContent}>{__("Yandex Translate", 'automatic-translations-for-polylang')}</button>
                                    <br />
                                </>
                                :
                                <>
                                    <button className="atfp-service-btn translate button button-primary" disabled={true}>{__("Yandex Translate", 'automatic-translations-for-polylang')}</button><br />
                                    <span className="atfp-error-message">{targetLangName} {__('language is not supported by Yandex Translate', 'automatic-translations-for-polylang')}.</span>
                                </>
                            }
                            <a href="https://translate.yandex.com/" target="_blank"><img className="pro-features-img" src={`${imgFolder}powered-by-yandex.png`} alt="powered by Yandex Translate Widget" /></a>
                        </div>
                        <hr />
                        <ul style={{ margin: "0" }}>
                            <li><span style={{ color: "green" }}>✔</span> {__("Unlimited Translations with Yandex Translate", 'automatic-translations-for-polylang')}</li>
                            <li><span style={{ color: "green" }}>✔</span> {__("No API Key Required for Yandex Translate", 'automatic-translations-for-polylang')}</li>
                            <li><span style={{ color: "green" }}>✔</span> {__("Supports Multiple Languages", 'automatic-translations-for-polylang')} - <a href="https://yandex.com/support2/translate-desktop/en/supported-langs" target="_blank">{__("See Supported Languages", 'automatic-translations-for-polylang')}</a></li>
                        </ul>
                        <hr />
                        <strong className="atlt-heading">{__("Translate Using Chrome Built-in API", 'automatic-translations-for-polylang')}</strong>
                        <div className="inputGroup">
                            <button id="local_ai_translator_btn" className="atfp-service-btn button button-primary" data-service="localAiTranslator" data-service-label="Chrome Built-in API" onClick={fetchContent}>{__("Chrome AI Translator (Beta)", 'automatic-translations-for-polylang')}</button>
                            <br /><a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">Powered by <img className="pro-features-img" src={`${imgFolder}chrome-ai-translator.png`} alt="powered by Chrome built-in API" /> Built-in API</a>
                        </div>
                        <hr />
                        <div className="modal-footer">
                            <button className="atfp-setting-close" onClick={() => setSettingVisibility(false)}>{__("Close", 'automatic-translations-for-polylang')}</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default SettingModal;