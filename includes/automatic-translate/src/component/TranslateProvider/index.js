import YandexTranslater from "./yandex";
import localAiTranslator from "./local-ai-translator";
import { __ } from "@wordpress/i18n";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};

    const { Service = false, openErrorModalHandler=()=>{} } = props;

    const Services = {
        yandex: {
            Provider: YandexTranslater,
            title: __("Translate Using Yandex Page Translate Widget", "automatic-translations-for-polylang"),
            SettingBtnText: __(
                "Yandex Translate",
                "automatic-translations-for-polylang"
            ),
            serviceLabel: "Yandex Translate",
            // Docs: "https://translate.yandex.com/developers/keys",
            ProviderLink: "https://translate.yandex.com/developers/keys",
            heading: __("Choose Language", "automatic-translations-for-polylang"),
            BetaEnabled: false,
            ButtonDisabled: props.yandexButtonDisabled,
            ErrorMessage: props.yandexButtonDisabled ? <p className="atfp-error-message">{__('language is not supported by Yandex Translate', 'automatic-translations-for-polylang')}</p> : <></>,
            Logo: 'yandex-translate-logo.png'
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: __("Translate Using Chrome built-in API", "automatic-translations-for-polylang"),
            SettingBtnText: __(
                "Chrome AI Translator",
                "automatic-translations-for-polylang"
            ),
            serviceLabel: "Chrome AI Translator",
            heading: __(
                "Translate Using Chrome built-in API",
                "automatic-translations-for-polylang"
            ),
            // Docs: "https://developer.chrome.com/docs/ai/translator-api#supported-languages",
            ProviderLink:
                "https://developer.chrome.com/docs/ai/translator-api#supported-languages",
            BetaEnabled: true,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <button className="atfp-localai-disabled-message" onClick={() => openErrorModalHandler("localAiTranslator")}>{__('Translator button is disabled. Click for details.', 'automatic-translations-for-polylang')}</button> : <></>,
            Logo: 'chrome-built-in-ai-logo.png'
        }
    };

    if (!Service) {
        return Services;
    }
    return Services[Service];
};
