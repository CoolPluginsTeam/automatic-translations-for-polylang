import ReactDOM from "react-dom";
import { useEffect, useState } from "@wordpress/element";
import PopStringModal from "./popupStringModal";
const { __ } = wp.i18n;

const PopupModal = (props) => {
    const [fetchStatus, setFetchStatus] = useState(false);
    const [targetBtn, setTargetBtn] = useState({});
    const [blockRules, setBlockRules] = useState({});
    const [modalRender, setModalRender] = useState({});
    const [settingVisibility, setSettingVisibility]=useState(false);
    const apiUrl = atfp_ajax_object.ajax_url;
    const imgFolder=atfp_ajax_object.atfp_url + 'assets/images/';
    /**
     * Prepare data to send in API request.
     */
    const apiSendData = {
        atfp_nonce: atfp_ajax_object.ajax_nonce,
        action: atfp_ajax_object.action_block_rules
    };


    /**
     * Update the fetch status state.
     * @param {boolean} state - The state to update the fetch status with.
     */
    const updateFetch = (state) => {
        setFetchStatus(state);
    }

    useEffect(()=>{
        const metaFieldBtn=document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');

        if(metaFieldBtn){
            metaFieldBtn.addEventListener('click',()=>{
                setSettingVisibility(prev=>!prev);
            });
        }
    },[])

    /**
     * useEffect hook to fetch block rules data from the server.
     * Triggers the fetch only when fetchStatus is true and blockRules is empty.
     */
    useEffect(() => {
        if (Object.keys(blockRules).length > 0 || !fetchStatus) {
            return;
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
    }, [fetchStatus])

    /**
     * useEffect hook to handle displaying the modal and rendering the PopStringModal component.
     * Renders the modal only when blockRules is not empty and fetchStatus is true.
     */
    useEffect(() => {

        if (Object.keys(blockRules).length <= 0) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const btn = targetBtn;
        const service = btn.dataset && btn.dataset.service;
        const serviceLabel = btn.dataset && btn.dataset.serviceLabel;
        const sourceLang = atfp_ajax_object.source_lang;
        const targetLang = urlParams.get('new_lang');
        const postId = urlParams.get('from_post');

        const parentWrp = document.getElementById("atfp_strings_model");

        if (fetchStatus && Object.keys(blockRules).length > 0) {
            ReactDOM.render(<PopStringModal
                blockRules={blockRules}
                visibility={fetchStatus}
                updateFetch={updateFetch}
                postId={postId}
                service={service}
                serviceLabel={serviceLabel}
                sourceLang={sourceLang}
                targetLang={targetLang}
                modalRender={modalRender}
                pageTranslate={props.pageTranslate}
            />, parentWrp);
            setSettingVisibility(prev=>!prev);
        }
    }, [fetchStatus, blockRules]);

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const fetchContent = (e) => {
        let targetElement=!e.target.classList.contains('atfp-service-btn') ? e.target.closest('.atfp-service-btn') : e.target;
        setModalRender(prev => prev + 1);
        setTargetBtn(targetElement);
        setFetchStatus(true);
    };

    return (
        <>
            {settingVisibility &&
                <div className="modal-container" style={{display: settingVisibility ? 'block' : 'none'}}>
                <div className="atfp-settings modal-content">
                    <div className="modal-header">
                    <h2>{__("Step 1 - Select Translation Provider (Beta)", 'automatic-translation-for-polylang')}</h2>
                    <span className="close" onClick={()=>setSettingVisibility(false)}>&times;</span>
                    </div>
                    <hr />
                    <strong className="atlt-heading">{__("Translate Using Yandex Page Translate Widget", 'automatic-translation-for-polylang')}</strong>
                    <div className="inputGroup">
                        <button className="atfp-service-btn translate button button-primary" data-service="yandex" data-service-label="Yandex Translate" onClick={fetchContent}>{__("Yandex Translate", 'automatic-translation-for-polylang')}</button>
                        <br/><a href="https://translate.yandex.com/" target="_blank"><img className="pro-features-img" src={`${imgFolder}powered-by-yandex.png`} alt="powered by Yandex Translate Widget"/></a>
                    </div>
                    <hr/>
                    <strong className="atfp-heading">{__("Translate Using Google Page Translate Widget", 'automatic-translation-for-polylang')}</strong>
                    <div className="inputGroup">
                        <button className="atfp-service-btn translate button button-primary" data-service="google" data-service-label="Google Translate" onClick={fetchContent}>{__("Google Translate (Beta)", 'automatic-translation-for-polylang')}</button>
                        <span className="proonly-button alsofree">✔ {__("Available", 'automatic-translation-for-polylang')}</span>
                        <br /><a href="https://translate.google.com/" target="_blank"><img style={{ marginTop: "5px" }} src={`${imgFolder}powered-by-google.png`} alt={__("powered by Google Translate Widget", 'automatic-translation-for-polylang')}></img></a>
                    </div>
                    <hr />
                   <ul style={{ margin: "0" }}>
                        <li><span style={{ color: "green" }}>✔</span> {__("Unlimited Translations with Google Translate", 'automatic-translation-for-polylang')}</li>
                        <li><span style={{ color: "green" }}>✔</span> {__("No API Key Required for Google Translate", 'automatic-translation-for-polylang')}</li>
                        <li><span style={{ color: "green" }}>✔</span> {__("Supports Multiple Languages", 'automatic-translation-for-polylang')} - <a href="https://en.wikipedia.org/wiki/Google_Translate#Supported_languages" target="_blank">{__("See Supported Languages", 'automatic-translation-for-polylang')}</a></li>
                    </ul>
                    <hr/>
                    <div className="modal-footer">
                    <button className="atfp-setting-close" onClick={()=>setSettingVisibility(false)}>{__("Close", 'automatic-translation-for-polylang')}</button>
                    </div>
                </div>
                </div> 
            }
        </>
    );
};

export default PopupModal;