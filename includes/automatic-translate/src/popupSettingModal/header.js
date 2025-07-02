import { __ } from "@wordpress/i18n";

const SettingModalHeader = ({ setSettingVisibility }) => {
    return (
        <div className="modal-header">
            <h2>{__("Step 1 - Select Translation Provider", 'autopoly-ai-translation-for-polylang')}</h2>
            <span className="close" onClick={() => setSettingVisibility(false)}>&times;</span>
        </div>
    );
}

export default SettingModalHeader;
