import { __ } from "@wordpress/i18n";

/**
 * Footer of the translation setup screen.
 *
 * Translation can only start once at least one target language and one
 * translation engine have been picked.
 *
 * @since 1.1.0
 *
 * @param {Object}   props                    Component props.
 * @param {string}   props.prefix             CSS class prefix.
 * @param {?string}  props.selectedProvider   Currently selected provider key.
 * @param {string[]} props.selectedLanguages  Slugs of the currently selected languages.
 * @param {Function} props.onStartTranslation Callback invoked to start the translation.
 *
 * @return {JSX.Element} Setup screen footer.
 */
const SettingModalFooter = ({
    prefix,
    selectedProvider,
    selectedLanguages = [],
    onStartTranslation,
}) => {
    const canStart = Boolean(selectedProvider) && selectedLanguages.length > 0;

    let startTitle = '';
    if (0 === selectedLanguages.length) {
        startTitle = __('Please select at least one language.', 'automatic-translations-for-polylang');
    } else if (!selectedProvider) {
        startTitle = __('Please select a translation engine.', 'automatic-translations-for-polylang');
    }

    return (
        <div className={`${prefix}-footer`}>
            <button
                type="button"
                className={`${prefix}-footer-button button button-primary`}
                disabled={!canStart}
                title={startTitle}
                onClick={() => {
                    if (canStart && onStartTranslation) {
                        onStartTranslation();
                    }
                }}
            >
                {__('Start Translation', 'automatic-translations-for-polylang')} <span className={`${prefix}-next-arrow`}>&#8594;</span>
            </button>
        </div>
    );
}

export default SettingModalFooter;
