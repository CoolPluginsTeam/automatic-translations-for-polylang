import translatePost from "../component/createTranslatedPost";
const { __ } = wp.i18n;

const StringPopUpHeader = (props) => {

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    /**
     * Function to create a translated post using the provided content, translation settings, block rules, and modal close function.
     */
    const createTranslatedPost = () => {
        const postContent = props.postContent;
        const blockRules = props.blockRules;
        const modalClose = closeModal;

        translatePost({ postContent: postContent, modalClose: modalClose, blockRules: blockRules });

        props.pageTranslate(true);
    }

    return (
        <div className="modal-header" key={props.modalRender}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="notranslate">{__("Step 2 - Start Automatic Translation Process (Beta)", 'automatic-translation-for-polylang')}</h2>
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translateStatus} onClick={createTranslatedPost}>{__("Update Content", 'automatic-translation-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpHeader;