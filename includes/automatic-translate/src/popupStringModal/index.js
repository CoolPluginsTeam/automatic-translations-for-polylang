import { useEffect, useState } from "@wordpress/element";
import StringPopUpHeader from "./header";
import StringPopUpBody from "./body";
import StringPopUpFooter from "./footer";
import TranslateService from "../component/TranslateProvider";

const popStringModal = (props) => {
    const [popupVisibility, setPopupVisibility] = useState(props.visibility);
    const [refPostData, setRefPostData] = useState('');
    const [translatePending, setTranslatePending] = useState(true);
    const [translateObj, setTranslateObj] = useState({});
    const [stringCount, setStringCount] = useState(false);

    const stringCountHandler = (number) => {
        if (popupVisibility) {
            setStringCount(number);
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
        props.updateFetch(state);
    }

    const translateStatusHandler = () => {
        setTranslatePending(false);
    }

    useEffect(() => {
        document.documentElement.setAttribute('translate', 'no');
        document.body.classList.add('notranslate');

        /**
         * Calls the translate service provider based on the service type.
         * For example, it can call services like yandex Translate.
        */
        const service = props.service;
        const id = `atfp_${service}_translate_element`;
        if (undefined === translateObj[service] && true !== translateObj[service] && refPostData && stringCount) {
            setTranslateObj(prev => { return { ...prev, [service]: true } });
            TranslateService[service]({ sourceLang: props.sourceLang, targetLang: props.targetLang, translateStatus: translateStatusHandler, ID: id });
        }
    }, [props.service, refPostData, stringCount]);

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
        <>
            <div id={`atfp-${props.service}-strings-modal`} class="modal-container" style={{ display: popupVisibility ? 'flex' : 'none' }}>
                <div class="modal-content">
                    <StringPopUpHeader modalRender={props.modalRender} setPopupVisibility={setPopupVisibilityHandler} postContent={refPostData} blockRules={props.blockRules} translateStatus={translatePending} pageTranslate={props.pageTranslate} />
                    <StringPopUpBody {...props} updatePostContent={updatePostContentHandler} blockRules={props.blockRules} stringCountHandler={stringCountHandler} />
                    <StringPopUpFooter modalRender={props.modalRender} setPopupVisibility={setPopupVisibilityHandler} postContent={refPostData} blockRules={props.blockRules} translateStatus={translatePending} pageTranslate={props.pageTranslate} stringCount={stringCount} />
                </div>
            </div>
        </>
    );
}

export default popStringModal;