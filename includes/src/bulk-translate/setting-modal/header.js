import { __ } from "@wordpress/i18n";

/**
 * Header of the translation setup screen.
 *
 * @since 1.1.0
 *
 * @param {Object}   props         Component props.
 * @param {string}   props.prefix  CSS class prefix.
 * @param {Function} props.onClose Callback invoked when the close button is clicked.
 *
 * @return {JSX.Element} Setup screen header.
 */
const SettingModalHeader = ({ prefix, onClose }) => {
    return (
        <div className={`${prefix}-header`}>
            <div className={`${prefix}-modal-header-inner`}>
                <span className={`${prefix}-step-label`}>
                    {__('STEP 1 OF 2', 'automatic-translations-for-polylang')}
                </span>
                <h2>{__('AI Translation Setup', 'automatic-translations-for-polylang')}</h2>
                <p className={`${prefix}-modal-desc`}>
                    {__('Configure your translation settings and start translating.', 'automatic-translations-for-polylang')}
                </p>
            </div>
            <button
                type="button"
                className={`${prefix}-modal-close`}
                onClick={onClose}
                title={__('Close', 'automatic-translations-for-polylang')}
                aria-label={__('Close', 'automatic-translations-for-polylang')}
            >
                &times;
            </button>
        </div>
    );
}

export default SettingModalHeader;
