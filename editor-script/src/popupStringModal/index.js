import { useEffect, useState } from "@wordpress/element";
import StringPopUpHeader from "./header";
import StringPopUpBody from "./body";
import StringPopUpFooter from "./footer";
import TranslateService from "../component/TranslateProvider";

const popStringModal = (props) => {
    const [popupVisibility, setPopupVisibility] = useState(props.visibility);
    const [refPostData, setRefPostData] = useState('');
    const [translatePending, setTranslatePending] = useState(true);

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
        if (props.service === 'google') {
            document.querySelector('div.skiptranslate iframe.skiptranslate')?.contentDocument?.querySelector('a[title="Close"] img[alt="Close"]')?.click();
        }

        setTranslatePending(true);
        setPopupVisibility(false);
        props.updateFetch(state);
    }

    const translateStatusHandler = () => {
        setTranslatePending(false);
    }

    useEffect(() => {
        /**
         * Calls the translate service provider based on the service type.
         * For example, it can call services like deepL or Google Translate.
        */
       const service = props.service;
       TranslateService[service]({ ...props, translateStatus: translateStatusHandler });
    }, []);
    
    useEffect(()=>{
        setPopupVisibility(true);
    },[props.modalRender])

    return (
        <>
            <div class="modal-container" style={{display: popupVisibility ? 'block' : 'none'}}>
                <div class="modal-content">
                    <StringPopUpHeader modalRender={props.modalRender} setPopupVisibility={setPopupVisibilityHandler} postContent={refPostData} blockRules={props.blockRules} translateStatus={translatePending} />
                    <StringPopUpBody {...props} updatePostContent={updatePostContentHandler} blockRules={props.blockRules} />
                    <StringPopUpFooter modalRender={props.modalRender} setPopupVisibility={setPopupVisibilityHandler} postContent={refPostData} blockRules={props.blockRules} translateStatus={translatePending} />
                </div>
            </div>
        </>
    );
}

export default popStringModal;