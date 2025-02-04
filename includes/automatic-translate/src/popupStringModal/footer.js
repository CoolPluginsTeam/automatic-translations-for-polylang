import StringPopUpNotice from "./notice";
const { sprintf, __ } = wp.i18n;

const StringPopUpFooter = (props) => {

    return (
        <div className="modal-footer" key={props.modalRender}>
            {!props.translatePendingStatus && props.stringCount && <StringPopUpNotice className="atfp_string_count">{sprintf(__("Automated translation complete: %s words translated, saving valuable time and resources.", 'automatic-translations-for-polylang'), props.stringCount)}</StringPopUpNotice>}
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'automatic-translations-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpFooter;