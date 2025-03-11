import { sprintf, __ } from "@wordpress/i18n";

const SettingModalHeader = ({ setSettingVisibility, postType, sourceLangName, targetLangName }) => {
    return (
        <div className="modal-header">
            <h2>{__("Step 1 - Select Translation Provider", 'automatic-translations-for-polylang')}</h2>
            <h4>{sprintf(__("Translate %(postType)s content from %(source)s to %(target)s", 'automatic-translations-for-polylang'), { postType: postType, source: sourceLangName, target: targetLangName })}</h4>
            <p className="atfp-error-message" style={{ marginBottom: '.5rem' }}>{sprintf(__("This translation widget replaces the current %(postType)s content with the original %(source)s %(postType)s and translates it into %(target)s", 'automatic-translations-for-polylang'), { postType: postType, source: sourceLangName, target: targetLangName })}</p>
            <span className="close" onClick={() => setSettingVisibility(false)}>&times;</span>
        </div>
    );
}

export default SettingModalHeader;
