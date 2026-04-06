import YandexTranslater from "./yandex";
import localAiTranslator from "./local-ai-translator";
import { sprintf, __ } from "@wordpress/i18n";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{} } = props;
    const refrenceText = window.atfp_global_object.refrence_text;
    const activeProviders = window.atfp_global_object.active_providers;

    const freeProviders=Object.freeze({
        yandex: 'yandex-translate',
        localAiTranslator: 'chrome-built-in-ai',
    });

    const Services = {
        yandex: {
            Provider: YandexTranslater,
            title: "Yandex Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Yandex Translate",
            Docs: "https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_yandex",
            heading: __("Choose Language", 'automatic-translations-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: props.yandexButtonDisabled,
            ErrorMessage: props.yandexButtonDisabled ? <div className="atfp-provider-error" onClick={() => openErrorModalHandler("yandex")}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: 'yandex.png'
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", 'automatic-translations-for-polylang'), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_chrome",
            BetaEnabled: false,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className="atfp-provider-error" onClick={() => openErrorModalHandler("localAiTranslator")}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: 'chrome.png'
        },
        google: {
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_google",
            heading: __("Choose Language", 'automatic-translations-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className="atfp-provider-error" href={`${window.atfp_global_object.pro_version_url}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_google`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'google.png'
        },
        openai_ai: {
            title: "OpenAI Model",
            SettingBtnText: "Translate",
            serviceLabel: "OpenAI",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "OpenAI"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_openai",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className='atfp-provider-error' href={`${window.atfp_global_object.pro_version_url}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_openai`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'openai.png',
        },
        google_ai: {
            title: "Gemini Model",
            SettingBtnText: "Translate",
            serviceLabel: "Gemini",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "Gemini"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_gemini",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className='atfp-provider-error' href={`${window.atfp_global_object.pro_version_url}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_gemini`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'gemini.png',
        },
        deepl_ai: {
            title: "DeepL Model",
            SettingBtnText: "Translate",
            serviceLabel: "DeepL",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "DeepL"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=popup_deepl",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className='atfp-provider-error' href={`${window.atfp_global_object.pro_version_url}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=popup_deepl`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'deepl.png',
        }
    };

    Object.keys(freeProviders).forEach(provider => {
        if(!activeProviders.includes(freeProviders[provider])){
            delete Services[provider];
        }
    });

    if (!Service) {
        return Services;
    }
    
    return Services[Service];
};
