import localAiTranslator from "./local-ai-translator";
import { sprintf, __ } from "@wordpress/i18n";

/**
 * Provides translation services using local AI Translator.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{} } = props;
    const assetsUrl = window.atfp_global_object.atfp_url+'assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';

    const Services = {
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
        }
    };

    if (!Service) {
        return Services;
    }
    return Services[Service];
};
