import { __ } from "@wordpress/i18n";
import Providers from "./providers";
import TranslateService from "../components/translate-provider";

/**
 * Translation engine column of the translation setup screen.
 *
 * Lists every available AI provider as a selectable card and falls back to a
 * dashboard link when all providers are disabled.
 *
 * @since 1.1.0
 *
 * @param {Object}   props                    Component props.
 * @param {string}   props.prefix             CSS class prefix.
 * @param {string}   props.imgFolder          Base URL of the plugin image folder.
 * @param {?string}  props.activeProvider     Currently selected provider key.
 * @param {Function} props.onSelectProvider   Callback invoked with the picked provider key.
 * @param {Function} props.errorModalHandler  Callback used to surface a provider setup error.
 * @param {string|boolean} props.localAiModalError Chrome built-in AI setup error, false when usable.
 * @param {string|boolean} props.edgeAiModalError  Edge built-in AI setup error, false when usable.
 * @param {string|boolean} props.yandexDisabled    Yandex unsupported-language notice, false when usable.
 * @param {string|boolean} props.googleDisabled    Google unsupported-language notice, false when usable.
 *
 * @return {JSX.Element} Translation engine column.
 */
const SettingModalEngines = ({
    prefix,
    imgFolder,
    activeProvider,
    onSelectProvider,
    errorModalHandler,
    localAiModalError,
    edgeAiModalError,
    yandexDisabled,
    googleDisabled,
}) => {
    const serviceProviders = TranslateService({
        prefix,
        localAiTranslatorButtonDisabled: localAiModalError,
        edgeAiTranslatorButtonDisabled: edgeAiModalError,
        yandexButtonDisabled: yandexDisabled,
        googleButtonDisabled: googleDisabled,
        openErrorModalHandler: errorModalHandler,
    });
    const providerKeys = Object.keys(serviceProviders);
    const dashboardUrl = `${atfp_bulk_translate_object.admin_url}admin.php?page=polylang-atfp-dashboard`;

    return (
        <section className={`${prefix}-setup-column ${prefix}-setup-engines`}>
            <div className={`${prefix}-setup-column-head`}>
                <span className={`${prefix}-setup-step-badge`} aria-hidden="true">2</span>
                <h3>{__('Select Translation Provider', 'automatic-translations-for-polylang')}</h3>
            </div>
            <p className={`${prefix}-setup-column-desc`}>
                {__('Select an AI provider to automatically translate your content.', 'automatic-translations-for-polylang')}
            </p>

            <div className={`${prefix}-provider-cards`}>
                {providerKeys.length > 0 ? providerKeys.map((provider) => (
                    <Providers
                        key={provider}
                        Service={provider}
                        prefix={prefix}
                        imgFolder={imgFolder}
                        activeProvider={activeProvider}
                        onSelectProvider={onSelectProvider}
                        openErrorModalHandler={errorModalHandler}
                        localAiTranslatorDisabled={localAiModalError}
                        localAiModalError={localAiModalError}
                        edgeAiTranslatorDisabled={edgeAiModalError}
                        edgeAiModalError={edgeAiModalError}
                        yandexDisabled={yandexDisabled}
                        googleDisabled={googleDisabled}
                    />
                )) : (
                    <div className={`${prefix}-bulk-translate-empty ${prefix}-provider-empty`}>
                        <strong>{__('No AI providers available', 'automatic-translations-for-polylang')}</strong>
                        <br />
                        {__('All providers are currently disabled.', 'automatic-translations-for-polylang')}
                        <br />
                        <span className={`${prefix}-provider-empty-actions`}>
                            {__('Go to', 'automatic-translations-for-polylang')}{' '}
                            <a href={dashboardUrl} target="_blank" rel="noopener noreferrer">
                                {__('Dashboard', 'automatic-translations-for-polylang')}
                            </a>{' '}
                            {__('to enable Yandex, Google, Chrome, or Edge built-in AI.', 'automatic-translations-for-polylang')}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default SettingModalEngines;
