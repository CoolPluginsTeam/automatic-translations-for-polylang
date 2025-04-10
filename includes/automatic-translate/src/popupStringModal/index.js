import { useEffect, useState } from "@wordpress/element";
import { updateTranslateData } from "../helper";
import { select } from "@wordpress/data";
import StringPopUpHeader from "./header";
import StringPopUpBody from "./body";
import StringPopUpFooter from "./footer";

const popStringModal = (props) => {

    let selectedService = props.service;

    const translateData = select('block-atfp/translate').getTranslationInfo().translateData[selectedService] || false;
    const translateStatus=translateData?.translateStatus || false;

    const [popupVisibility, setPopupVisibility] = useState(true);
    const [refPostData, setRefPostData] = useState('');
    const [translatePending, setTranslatePending] = useState(true);
    const [characterCount, setCharacterCount] = useState(translateData?.targetCharacterCount || 0);

    /**
     * Returns the label for the service provider.
     * @returns {string} The label for the service provider.
     */ 
    const serviceLabel = () => {
        const serviceProvider = props.service;

        if (serviceProvider === 'yandex') {
            return 'Yandex Translate';
        }else if (serviceProvider === 'localAiTranslator') {
            return 'Chrome AI Translator';
        }
        return serviceProvider;
    }

    /**
     * Fetches the post data.
     */
    useEffect(() => {
        if (!props.postDataFetchStatus) {
                props.fetchPostData({ postId: props.postId, sourceLang: props.sourceLang, targetLang: props.targetLang, updatePostDataFetch: props.updatePostDataFetch, refPostData: data => setRefPostData(data) });
        }
    }, [props.postDataFetchStatus, props.modalRender])

    /**
     * Updates the post content data.
     * @param {string} data - The data to set as the post content.
     */
    const updatePostContentHandler = (data) => {
        setRefPostData(data);
    }

    /**
     * Updates the fetch state.
     * @param {boolean} state - The state to update the fetch with.
     */
    const setPopupVisibilityHandler = (state) => {

        if (props.service === 'yandex') {
            document.querySelector('#atfp_yandex_translate_element #yt-widget .yt-button__icon.yt-button__icon_type_right')?.click();
        }

        setTranslatePending(true);
        setPopupVisibility(false);
    }

    const translateStatusHandler = (status) => {
        let service = props.service;

        const characterCount = select('block-atfp/translate').getTranslationInfo().translateData[service]?.targetCharacterCount || 0;
        setCharacterCount(characterCount);
        setTranslatePending(status);
    }

    const updatePostDataHandler = () => {
        const postContent = refPostData;
        const modalClose = () => setPopupVisibility(false);
        let service=props.service;

        props.translatePost({ postContent: postContent, modalClose: modalClose, service: service });
        props.pageTranslate(true);
        updateTranslateData({ provider: service, sourceLang: props.sourceLang, targetLang: props.targetLang, postId: props.currentPostId });
    }

    useEffect(() => {
        setPopupVisibility(true);

        if (translateStatus) {
            setCharacterCount(translateData?.targetCharacterCount || 0);
            setTranslatePending(false);
        }

        setTimeout(() => {
            const stringModal = document.querySelector('.atfp_string_container');
            if (stringModal) {
                stringModal.scrollTop = 0
            };
        })
    }, [props.modalRender])

    return (
        <> {popupVisibility &&
            <div id={`atfp-${props.service}-strings-modal`} className="modal-container" style={{ display: popupVisibility ? 'flex' : 'none' }} data-render-id={props.modalRender}>
                <div className="modal-content">
                    <StringPopUpHeader
                        modalRender={props.modalRender}
                        setPopupVisibility={setPopupVisibilityHandler}
                        postContent={refPostData}
                        translatePendingStatus={translatePending}
                        pageTranslate={props.pageTranslate}
                        service={props.service}
                        serviceLabel={serviceLabel()}
                        updatePostData={updatePostDataHandler}
                        characterCount={characterCount}
                    />
                    <StringPopUpBody {...props}
                        updatePostContent={updatePostContentHandler}
                        contentLoading={props.contentLoading}
                        postDataFetchStatus={props.postDataFetchStatus}
                        translatePendingStatus={translatePending}
                        service={props.service}
                        sourceLang={props.sourceLang}
                        targetLang={props.targetLang}
                        translateStatusHandler={translateStatusHandler}
                        modalRender={props.modalRender}
                        translateStatus={translateStatus}
                        stringModalBodyNotice={props.stringModalBodyNotice}
                    />
                    <StringPopUpFooter
                        modalRender={props.modalRender}
                        setPopupVisibility={setPopupVisibilityHandler}
                        postContent={refPostData}
                        translatePendingStatus={translatePending}
                        pageTranslate={props.pageTranslate}
                        service={props.service}
                        serviceLabel={serviceLabel()}
                        updatePostData={updatePostDataHandler}
                        characterCount={characterCount}
                    />
                </div>
            </div>
        }
        </>
    );
}

export default popStringModal;