import StringPopUpNotice from "./notice";
import { sprintf, __ } from "@wordpress/i18n";
import FormatNumberCount from "../component/FormateNumberCount";

const StringPopUpFooter = (props) => {

    return (
        <div className="modal-footer" key={props.modalRender}>
            {!props.translatePendingStatus && <StringPopUpNotice className="atfp_string_count"><p>Wahooo! You have saved your valuable time via auto translating <strong><FormatNumberCount number={props.characterCount} /></strong> characters using <strong>{props.serviceLabel}</strong>.Please share your feedback — <a href="https://wordpress.org/support/plugin/automatic-translations-for-polylang/reviews/#new-post" target="_blank" rel="noopener" style={{color: 'yellow'}}><br/>leave a quick review</a>!</p></StringPopUpNotice>}
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'automatic-translations-for-polylang')}</button>
            </div>
        </div>
    );
}

export default StringPopUpFooter;