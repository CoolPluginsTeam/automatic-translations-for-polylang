import YandexTranslater from "./yandex";
import localAiTranslator from "./local-ai-translator";
import { sprintf, __ } from "@wordpress/i18n";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{} } = props;
    const adminUrl = window.atfp_global_object.admin_url;
    const assetsUrl = window.atfp_global_object.atfp_url+'assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';

    const Services = {
        yandex: {
            Provider: YandexTranslater,
            title: "Yandex Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Yandex Translate",
            Docs: "https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_yandex",
            heading: __("Choose Language", 'autopoly-ai-translation-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: props.yandexButtonDisabled,
            ErrorMessage: props.yandexButtonDisabled ? <div className="atfp-provider-error button button-primary" onClick={() => openErrorModalHandler("yandex")}><img src={errorIcon} alt="error" /> {__('View Error', 'autopoly-ai-translation-for-polylang')}</div> : <></>,
            Logo: 'yandex.png'
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", 'autopoly-ai-translation-for-polylang'), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome",
            BetaEnabled: true,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className="atfp-provider-error button button-primary" onClick={() => openErrorModalHandler("localAiTranslator")}><img src={errorIcon} alt="error" /> {__('View Error', 'autopoly-ai-translation-for-polylang')}</div> : <></>,
            Logo: 'chrome.png'
        },
        google: {
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_google",
            heading: __("Choose Language", 'autopoly-ai-translation-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className="atfp-provider-error button button-primary" href={(window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_google'} target="_blank">{__('Buy Pro', 'autopoly-ai-translation-for-polylang')}</a>,
            Logo: 'google.png'
        },
        openai_ai: {
            title: "OpenAI Model",
            SettingBtnText: "Translate",
            serviceLabel: "OpenAI",
            heading: sprintf(__("Translate Using %s Model", 'autopoly-ai-translation-for-polylang'), "OpenAI"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_openai",
            BetaEnabled: true,
            ButtonDisabled: true,
            ErrorMessage: <a className={`atfp-provider-error button button-primary`} href={(window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_openai'} target="_blank">{__('Buy Pro', 'autopoly-ai-translation-for-polylang')}</a>,
            Logo: 'openai.png',
            filterHtmlContent: true
        },
        google_ai: {
            title: "Gemini Model",
            SettingBtnText: "Translate",
            serviceLabel: "Gemini",
            heading: sprintf(__("Translate Using %s Model", 'autopoly-ai-translation-for-polylang'), "Gemini"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=docs&utm_content=popup_gemini",
            BetaEnabled: true,
            ButtonDisabled: true,
            ErrorMessage: <a className={`atfp-provider-error button button-primary`} href={(window.atfp_global_object.pro_version_url || '') + '?utm_source=atfp_plugin&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_gemini'} target="_blank">{__('Buy Pro', 'autopoly-ai-translation-for-polylang')}</a>,
            Logo: 'gemini.png',
            filterHtmlContent: true
        },
    };

    if (!Service) {
        return Services;
    }
    return Services[Service];
};
