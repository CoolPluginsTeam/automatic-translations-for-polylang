import { __ } from "@wordpress/i18n";

const SettingModalFooter = ({ setSettingVisibility }) => {
    return (
        <div className="modal-footer">
            <button className="atfp-setting-close" onClick={() => setSettingVisibility(false)}>{__("Close", 'automatic-translations-for-polylang')}</button>
        </div>
    );
}

export default SettingModalFooter;
