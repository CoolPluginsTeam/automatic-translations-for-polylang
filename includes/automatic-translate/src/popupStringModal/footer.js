import translatePost from "../component/createTranslatedPost";
import StringPopUpNotice from "./notice";
const { sprintf, __ } = wp.i18n;

const StringPopUpFooter = (props) => {

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    /**
     * Function to create a translated post using the provided content, translation, block rules, and modal close function.
     */
    const createTranslatedPost = () => {
        const postContent = props.postContent;
        const blockRules = props.blockRules;
        const modalClose = closeModal;

        translatePost({ postContent: postContent, modalClose: modalClose, blockRules: blockRules });
        props.pageTranslate(true);
    }

    return (
        <div className="modal-footer" key={props.modalRender}>
            {!props.translateStatus && props.stringCount && <StringPopUpNotice className="atfp_string_count">{sprintf(__("Automated translation complete: %s words translated, saving valuable time and resources.", 'automatic-translations-for-polylang'), props.stringCount)}</StringPopUpNotice>}
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translateStatus} onClick={createTranslatedPost}>{__("Update Content", 'automatic-translations-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpFooter;