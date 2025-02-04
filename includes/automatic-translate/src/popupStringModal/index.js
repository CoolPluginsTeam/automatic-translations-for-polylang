import { useEffect, useState } from "@wordpress/element";
import StringPopUpHeader from "./header";
import StringPopUpBody from "./body";
import StringPopUpFooter from "./footer";

const popStringModal = (props) => {
    const [popupVisibility, setPopupVisibility] = useState(true);
    const [refPostData, setRefPostData] = useState('');
    const [translatePending, setTranslatePending] = useState(true);
    const [stringCount, setStringCount] = useState(false);
    const [characterCount, setCharacterCount] = useState(false);

    useEffect(() => {
        if (!props.postDataFetchStatus) {
            if (atfp_ajax_object.editor_type === 'gutenberg' && Object.keys(props.blockRules).length > 0) {
                props.fetchPostData({ blockRules: props.blockRules, postId: props.postId, sourceLang: props.sourceLang, targetLang: props.targetLang, updatePostDataFetch: props.updatePostDataFetch, refPostData: data => setRefPostData(data) });
            }
        }
    }, [props.postDataFetchStatus, props.blockRules, props.modalRender])

    const stringCountHandler = (number, characterCount) => {
        if (popupVisibility) {
            setStringCount(number);
            setCharacterCount(characterCount);
        }
    }

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

    const translateStatusHandler = () => {
        setTranslatePending(false);
    }

    const updatePostDataHandler = () => {
        const postContent = refPostData;
        const blockRules = props.blockRules;
        const modalClose = () => setPopupVisibility(false);
        
        props.translatePost({ postContent: postContent, modalClose: modalClose, blockRules: blockRules, service: props.service, blockRules: blockRules });

        props.pageTranslate(true);
    }

    useEffect(() => {
        setPopupVisibility(true);
        setTimeout(() => {
            const stringModal = document.querySelector('.atfp_string_container');
            if (stringModal) {
                stringModal.scrollTop = 0
            };
        })
    }, [props.modalRender])

    return (
        <> {popupVisibility &&
            <div id={`atfp-${props.service}-strings-modal`} className="modal-container" style={{ display: popupVisibility ? 'flex' : 'none' }}>
                <div className="modal-content">
                    <StringPopUpHeader
                        modalRender={props.modalRender}
                        setPopupVisibility={setPopupVisibilityHandler}
                        postContent={refPostData}
                        blockRules={props.blockRules}
                        translateStatus={translatePending}
                        pageTranslate={props.pageTranslate}
                        stringCount={stringCount}
                        characterCount={characterCount}
                        service={props.service}
                        updatePostData={updatePostDataHandler}
                    />
                    <StringPopUpBody {...props}
                        updatePostContent={updatePostContentHandler}
                        blockRules={props.blockRules}
                        stringCountHandler={stringCountHandler}
                        contentLoading={props.contentLoading}
                        postDataFetchStatus={props.postDataFetchStatus}
                        service={props.service}
                        sourceLang={props.sourceLang}
                        targetLang={props.targetLang}
                        translateStatusHandler={translateStatusHandler}
                        modalRender={props.modalRender}
                    />
                    <StringPopUpFooter
                        modalRender={props.modalRender}
                        setPopupVisibility={setPopupVisibilityHandler}
                        postContent={refPostData}
                        blockRules={props.blockRules}
                        translateStatus={translatePending}
                        pageTranslate={props.pageTranslate}
                        stringCount={stringCount}
                        characterCount={characterCount}
                        service={props.service}
                        updatePostData={updatePostDataHandler}
                    />
                </div>
            </div>
        }
        </>
    );
}

export default popStringModal;