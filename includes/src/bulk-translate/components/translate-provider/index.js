import YandexTranslater from "./yandex";
import GoogleTranslater from "./google";
import localAiTranslator from "./local-ai";
import { sprintf, __ } from "@wordpress/i18n";
import ChromeAiTranslator from "./local-ai/local-ai-translate";

/**
 * Maps a service key to the provider key stored by the dashboard toggles.
 */
const freeProviders = Object.freeze({
    google: 'google-translate',
    localAiTranslator: 'chrome-built-in-ai',
    edgeAiTranslator: 'edge-built-in-ai',
    yandex: 'yandex-translate',
});

/**
 * Resolves the engine chosen as default in the plugin settings to the service
 * key used by this module.
 *
 * Returns null when no default is set, or when that engine is not currently
 * enabled, so the modal simply opens with nothing pre-selected.
 *
 * @since 1.5.0
 *
 * @return {?string} Service key, or null when there is nothing to pre-select.
 */
export const resolveDefaultService = () => {
    const settings = window.atfp_bulk_translate_object || {};
    const defaultProvider = settings.default_provider || '';

    if (!defaultProvider) {
        return null;
    }

    // On Edge the built-in engine is served by localAiTranslator, so both
    // browser AI provider keys resolve to it there.
    const browserType = ChromeAiTranslator.getBrowserType();
    const serviceKey = {
        'chrome-built-in-ai': 'localAiTranslator',
        'edge-built-in-ai': 'Edge' === browserType ? 'localAiTranslator' : 'edgeAiTranslator',
        'google-translate': 'google',
        'yandex-translate': 'yandex',
    }[defaultProvider];

    if (!serviceKey) {
        return null;
    }

    const activeProviders = settings.active_providers || [];

    return activeProviders.includes(freeProviders[serviceKey]) ? serviceKey : null;
};

/**
 * Provides the same translation services as automatic translation.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{}, prefix='' } = props;
    const activeProviders = window.atfp_bulk_translate_object.active_providers || [];
    const browserType = ChromeAiTranslator.getBrowserType();
    const refrenceText = window.atfp_bulk_translate_object.refrence_text;
    const proVersionUrl = window.atfp_bulk_translate_object.pro_version_url;

    const Services = {
        google: {
            Provider: GoogleTranslater,
            title: "Google Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Google Translate",
            Docs: "https://docs.coolplugins.net/doc/google-translate-for-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_google",
            heading: __("Choose Language", 'automatic-translations-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: props.googleButtonDisabled,
            ErrorMessage: props.googleButtonDisabled ? <div className={`${prefix}-provider-error`} onClick={() => openErrorModalHandler(props.googleButtonDisabled)}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: 'google.png',
            filterHtmlContent: true
        },
        localAiTranslator: {
            Provider: localAiTranslator,
            title: browserType === 'Edge' ? "Edge Built-in AI" : "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: browserType === 'Edge' ? "Edge AI Translator" : "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", "automatic-translations-for-polylang"), browserType === 'Edge' ? "Edge built-in API" : "Chrome built-in API"),
            Docs: browserType === 'Edge' ? "https://docs.coolplugins.net/doc/microsoft-edge-ai-polylang-translation/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_edge" : "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_chrome",
            BetaEnabled: false,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className={`${prefix}-provider-error`} onClick={() => openErrorModalHandler(props.localAiTranslatorButtonDisabled)}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: browserType === 'Edge' ? 'edge.png' : 'chrome.png',
            filterHtmlContent: true
        },
        edgeAiTranslator: {
            Provider: localAiTranslator,
            title: "Edge Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Edge AI Translator",
            heading: sprintf(
            __("Translate Using %s", "automatic-translations-for-polylang"),
            "Edge built-in API"
            ),
            Docs: "https://docs.coolplugins.net/doc/microsoft-edge-ai-polylang-translation/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_edge",
            BetaEnabled: true,
            ButtonDisabled: props.edgeAiTranslatorButtonDisabled,
            ErrorMessage: props.edgeAiTranslatorButtonDisabled ? <div className={`${prefix}-provider-error`} onClick={() => openErrorModalHandler(props.edgeAiTranslatorButtonDisabled)}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: "edge.png",
            filterHtmlContent: true
        },
        yandex: {
            Provider: YandexTranslater,
            title: "Yandex Translate",
            SettingBtnText: "Translate",
            serviceLabel: "Yandex Translate",
            Docs: "https://docs.coolplugins.net/doc/yandex-translate-for-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_yandex",
            heading: __("Choose Language", 'automatic-translations-for-polylang'),
            BetaEnabled: false,
            ButtonDisabled: props.yandexButtonDisabled,
            ErrorMessage: props.yandexButtonDisabled ? <div className={`${prefix}-provider-error`} onClick={() => openErrorModalHandler(props.yandexButtonDisabled)}>{__('View Error', 'automatic-translations-for-polylang')}</div> : <></>,
            Logo: 'yandex.png',
            filterHtmlContent: true
        },
        openai_ai: {
            title: "OpenAI Model",
            SettingBtnText: "Translate",
            serviceLabel: "OpenAI",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "OpenAI"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-open-ai-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_openai",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className={`${prefix}-provider-btn-pro`} href={`${proVersionUrl}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_openai`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'openai.png'
        },
        google_ai: {
            title: "Gemini Model",
            SettingBtnText: "Translate",
            serviceLabel: "Gemini",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "Gemini"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-gemini-ai-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_gemini",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className={`${prefix}-provider-btn-pro`} href={`${proVersionUrl}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_gemini`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'gemini.png'
        },
        deepl_ai: {
            title: "DeepL Model",
            SettingBtnText: "Translate",
            serviceLabel: "DeepL",
            heading: sprintf(__("Translate Using %s Model", 'automatic-translations-for-polylang'), "DeepL"),
            Docs: "https://docs.coolplugins.net/doc/translate-via-deepl-polylang/?"+refrenceText+"&utm_medium=inside&utm_campaign=docs&utm_content=bulk_deepl",
            BetaEnabled: false,
            ButtonDisabled: true,
            ErrorMessage: <a className={`${prefix}-provider-btn-pro`} href={`${proVersionUrl}?${refrenceText}&utm_medium=inside&utm_campaign=get_pro&utm_content=bulk_deepl`} target="_blank">{__('Buy Pro', 'automatic-translations-for-polylang')}</a>,
            Logo: 'deepl.png'
        },
    };

    if(browserType !== 'Other') {
        delete Services.edgeAiTranslator;
    }

    Object.keys(freeProviders).forEach(provider => {
        if (!activeProviders.includes(freeProviders[provider])) {
          delete Services[provider];
        }
    });

    if (!Service) {
        return Services;
    }
    return Services[Service];
};
