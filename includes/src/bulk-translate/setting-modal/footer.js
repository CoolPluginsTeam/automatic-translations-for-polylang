import { __ } from "@wordpress/i18n";

const SettingModalFooter = ({ setSettingVisibility, prefix, selectedProvider, onStartTranslation }) => {
    return (
        <div className={`${prefix}-footer`}>
        <button type="button" className={`${prefix}-footer-button button`} onClick={() => setSettingVisibility(false)}>&#8592; {__("Back", 'automatic-translations-for-polylang')}</button>
        <button
            type="button"
            className={`${prefix}-footer-button button button-primary`}
            disabled={!selectedProvider}
            onClick={() => {
                if (selectedProvider && onStartTranslation) onStartTranslation();
            }}
        >
            {__("Start Translation", 'automatic-translations-for-polylang')} <span className={`${prefix}-next-arrow`}>&#8594;</span>
        </button>
    </div>
    );
}

export default SettingModalFooter;
