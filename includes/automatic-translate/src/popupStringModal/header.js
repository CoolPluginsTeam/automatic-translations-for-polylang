import { __ } from "@wordpress/i18n";
import FormatNumberCount from "../component/FormateNumberCount";
const StringPopUpHeader = (props) => {

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    return (
        <div className="modal-header" key={props.modalRender}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="notranslate">{__("Step 2 - Start Automatic Translation Process", 'automatic-translations-for-polylang')}</h2>
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'automatic-translations-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpHeader;