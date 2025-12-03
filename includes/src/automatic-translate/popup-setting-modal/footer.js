import { __, sprintf } from "@wordpress/i18n";

const SettingModalFooter = (props) => {

    const { targetLangName, postType, sourceLangName, setSettingVisibility } = props;

    return (
        <div className="modal-footer">
            <p className="atfp-error-message" style={{ marginBottom: '.5rem' }}>
                {sprintf(
                    __("This will replace your current %(postType)s with a %(target)s translation of the original %(source)s content.", 'autopoly-ai-translation-for-polylang'),
                    { postType: postType, source: sourceLangName, target: targetLangName }
                )}
            </p>
            <button className="atfp-setting-close button button-primary" onClick={() => setSettingVisibility(false)}>{__("Close", 'autopoly-ai-translation-for-polylang')}</button>
        </div>
    );
}

export default SettingModalFooter;
