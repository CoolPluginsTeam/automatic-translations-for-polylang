import { __ } from "@wordpress/i18n";
import SettingModalLanguages from "./languages";
import SettingModalEngines from "./engines";

/**
 * Body of the translation setup screen.
 *
 * Combines language selection and translation engine selection into a single
 * step so the user can configure both before starting a translation.
 *
 * @since 1.1.0
 *
 * @param {Object} props Component props. See SettingModalLanguages and SettingModalEngines.
 *
 * @return {JSX.Element} Setup screen body.
 */
const SettingModalBody = (props) => {
    const { prefix } = props;

    return (
        <div className={`${prefix}-setting-modal-body`}>
            <div className={`${prefix}-setup-layout`}>
                <SettingModalLanguages
                    prefix={prefix}
                    targetLanguages={props.targetLanguages}
                    selectedLanguages={props.selectedLanguages}
                    onLanguageChange={props.onLanguageChange}
                    onSelectAllLanguages={props.onSelectAllLanguages}
                    notice={props.languageNotice}
                    disabled={props.languagesDisabled}
                    disabledReason={props.languagesDisabledReason}
                />

                <div className={`${prefix}-setup-divider`} aria-hidden="true">
                    <span className={`${prefix}-setup-divider-arrow`}>&#8594;</span>
                </div>

                <SettingModalEngines
                    prefix={prefix}
                    imgFolder={props.imgFolder}
                    activeProvider={props.activeProvider}
                    onSelectProvider={props.onSelectProvider}
                    errorModalHandler={props.errorModalHandler}
                    localAiModalError={props.localAiModalError}
                    edgeAiModalError={props.edgeAiModalError}
                    yandexDisabled={props.yandexDisabled}
                    googleDisabled={props.googleDisabled}
                />
            </div>

            <div className={`${prefix}-setup-info`} role="note">
                <span className={`${prefix}-setup-info-icon`} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="8" r="1.1" fill="currentColor" />
                    </svg>
                </span>
                <div className={`${prefix}-setup-info-text`}>
                    <strong>{__('Not sure which engine to choose?', 'automatic-translations-for-polylang')}</strong>
                    <p>{__('You can select a different engine the next time you translate.', 'automatic-translations-for-polylang')}</p>
                </div>
            </div>
        </div>
    );
}

export default SettingModalBody;
