import { __, sprintf } from "@wordpress/i18n";

const SettingModalFooter = (props) => {

    const { selectedProvider, onStartTranslation, setSettingVisibility } = props;

    return (
        <div className='setting-modal-footer'>
            <button type="button" className='setting-close button' onClick={() => setSettingVisibility(false)}>{__("Back", 'wpml-translation-check')}</button>
            <button
                type="button"
                className='setting-start-translation button button-primary'
                disabled={!selectedProvider}
                onClick={() => {
                    if (selectedProvider && onStartTranslation) onStartTranslation();
                }}
            >
                {__("Start Translation", 'wpml-translation-check')} <span className='next-arrow'>&#8594;</span>
            </button>
        </div>
    );
}

export default SettingModalFooter;
