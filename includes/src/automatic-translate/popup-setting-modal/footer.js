import { __, sprintf } from "@wordpress/i18n";

const SettingModalFooter = (props) => {

    const { selectedProvider, onStartTranslation } = props;

    return (
        <div className='setting-modal-footer'>
            <button
                type="button"
                className='setting-start-translation button button-primary'
                disabled={!selectedProvider}
                onClick={() => {
                    if (selectedProvider && onStartTranslation) onStartTranslation();
                }}
            >
                {__("Start Translation", 'automatic-translations-for-polylang')} <span className='next-arrow'>&#8594;</span>
            </button>
        </div>
    );
}

export default SettingModalFooter;
