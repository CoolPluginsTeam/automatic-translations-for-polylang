import { __ } from "@wordpress/i18n";
import Providers from "./providers";

const SettingModalBody = ({ yandexSupport, imgFolder, targetLangName, postType, sourceLangName, fetchContent, chromeAiBtnDisabled, openErrorModalHandler }) => {
    const providers = [
        {
            Service: "yandex",
            Title: __("Translate Using Yandex Page Translate Widget", 'automatic-translations-for-polylang'),
            Logo: `${imgFolder}yandex-translate-logo.png`,
            ServiceLabel: "Yandex Translate",
            ButtonText: __("Yandex Translate", 'automatic-translations-for-polylang'),
            ProviderLink: "https://translate.yandex.com/",
            // Docs: "https://translate.yandex.com/",
            ButtonDisabled: !yandexSupport,
            ErrorMessage: !yandexSupport ? <p className="atfp-error-message">{__('language is not supported by Yandex Translate', 'automatic-translations-for-polylang')}</p> : <></>,
            ButtonAction: fetchContent,
        },
        {
            Service: "localAiTranslator",
            ServiceLabel: "Chrome Built-in API",
            Title: __("Translate Using Chrome Built-in API", 'automatic-translations-for-polylang'),
            Logo: `${imgFolder}chrome-built-in-ai-logo.png`,
            ButtonText: __("Chrome AI Translator", 'automatic-translations-for-polylang'),
            ProviderLink: "https://developer.chrome.com/docs/ai/translator-api",
            // Docs: "https://developer.chrome.com/docs/ai/translator-api",
            ButtonDisabled: chromeAiBtnDisabled,
            ErrorMessage: chromeAiBtnDisabled ? <button className="atfp-localai-disabled-message" onClick={() => openErrorModalHandler("localAiTranslator")}>{__('Translator button is disabled. Click for details.', 'automatic-translations-for-polylang')}</button> : <></>,
            BetaEnabled: true,
            ButtonAction: fetchContent,
        }
    ]
    return (
        <div className="atfp-setting-modal-body">
            <div className="atfp-setting-modal-notice-wrapper">
                <h4>{sprintf(__("Translate page content from %(source)s to %(target)s", 'automatic-translations-for-polylang'), { source: sourceLangName, target: targetLangName })}</h4>
                <p className="atfp-error-message" style={{ marginBottom: '.5rem' }}>{sprintf(__("The page content will be saved as a draft after translating it into %(target)s. You can publish it after reviewing the translation.", 'automatic-translations-for-polylang'), { target: targetLangName })}</p>
            </div>
            <div className="atfp-translator-row">
                {providers.map((provider) => (
                    <Providers key={provider.Service} {...provider} />
                ))}
            </div>
            {/* <hr />
            <strong className="atlt-heading">{__("Translate Using Yandex Page Translate Widget", 'automatic-translations-for-polylang')}</strong>
            <div className="inputGroup">
                {yandexSupport ?
                    <>
                        <button className="atfp-service-btn translate button button-primary" data-service="yandex" data-service-label="Yandex Translate" onClick={fetchContent}>{__("Yandex Translate", 'automatic-translations-for-polylang')}</button>
                        <br />
                    </>
                    :
                    <>
                        <button className="atfp-service-btn translate button button-primary" disabled={true}>{__("Yandex Translate", 'automatic-translations-for-polylang')}</button><br />
                        <span className="atfp-error-message">{targetLangName} {__('language is not supported by Yandex Translate', 'automatic-translations-for-polylang')}.</span>
                    </>
                }
                <a href="https://translate.yandex.com/" target="_blank"><img className="pro-features-img" src={`${imgFolder}powered-by-yandex.png`} alt="powered by Yandex Translate Widget" /></a>
            </div>
            <hr />
            <ul style={{ margin: "0" }}>
                <li><span style={{ color: "green" }}>✔</span> {__("Unlimited Translations with Yandex Translate", 'automatic-translations-for-polylang')}</li>
                <li><span style={{ color: "green" }}>✔</span> {__("No API Key Required for Yandex Translate", 'automatic-translations-for-polylang')}</li>
                <li><span style={{ color: "green" }}>✔</span> {__("Supports Multiple Languages", 'automatic-translations-for-polylang')} - <a href="https://yandex.com/support2/translate-desktop/en/supported-langs" target="_blank">{__("See Supported Languages", 'automatic-translations-for-polylang')}</a></li>
            </ul>
            <hr />
            <strong className="atlt-heading">{__("Translate Using Chrome Built-in API", 'automatic-translations-for-polylang')}</strong>
            <div className="inputGroup">
                <button id="local_ai_translator_btn" className="atfp-service-btn button button-primary" data-service="localAiTranslator" data-service-label="Chrome Built-in API" onClick={fetchContent}>{__("Chrome AI Translator (Beta)", 'automatic-translations-for-polylang')}</button>
                <br /><a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">Powered by <img className="pro-features-img" src={`${imgFolder}chrome-ai-translator.png`} alt="powered by Chrome built-in API" /> Built-in API</a>
            </div>
            <hr /> */}
        </div>
    );
}

export default SettingModalBody;
