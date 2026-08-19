import { __ } from "@wordpress/i18n";
import Providers from "./providers";
import TranslateService from "../components/translate-provider";

const SettingModalBody = (props) => {
    const { prefix, localAiModalError, edgeAiModalError, yandexDisabled } = props;
    const ServiceProviders = TranslateService({
        prefix,
        localAiTranslatorButtonDisabled: localAiModalError,
        edgeAiTranslatorButtonDisabled: edgeAiModalError,
        yandexButtonDisabled: yandexDisabled,
        openErrorModalHandler: props.openErrorModalHandler
    });
    const adminUrl = window.atfp_bulk_translate_object.admin_url;

    return (
        <div className={`${prefix}-setting-modal-body`}>
        <div className={`${prefix}-provider-cards`}>
            {Object.keys(ServiceProviders).length > 0 ? Object.keys(ServiceProviders).map((provider) => (
                <Providers
                    key={provider}
                    {...props}
                    openErrorModalHandler={props.errorModalHandler}
                    localAiTranslatorDisabled={localAiModalError}
                    localAiModalError={localAiModalError}
                    edgeAiTranslatorDisabled={edgeAiModalError}
                    edgeAiModalError={edgeAiModalError}
                    yandexDisabled={yandexDisabled}
                    Service={provider}
                />
            )) : <div className={`${prefix}-bulk-translate-empty ${prefix}-provider-empty`}>
            <strong>{__('No AI providers available', 'automatic-translations-for-polylang')}</strong>
            <br />
            {__('All providers are currently disabled.', 'automatic-translations-for-polylang')}
            <br />
            <span className={`${prefix}-provider-empty-actions`}>
                {__('Go to', 'automatic-translations-for-polylang')}{' '}
                <a
                    href={adminUrl + 'admin.php?page=polylang-atfp-dashboard'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {__('Dashboard', 'automatic-translations-for-polylang')}
                </a>{' '}
                {__('to enable Yandex, Chrome, or Edge built-in AI.', 'automatic-translations-for-polylang')}
            </span>
        </div>}
        </div>
    </div>
    );
}

export default SettingModalBody;
