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

        </div>
    );
}

export default SettingModalBody;
