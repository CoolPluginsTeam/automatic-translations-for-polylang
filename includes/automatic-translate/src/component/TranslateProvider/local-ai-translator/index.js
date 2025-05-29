import ChromeAiTranslator from "./local-ai-translator";
import { __ } from "@wordpress/i18n";
import { select, dispatch } from "@wordpress/data";
import SaveTranslation from "../../storeTranslatedString";
import StoreTimeTaken from "../../../component/StoreTimeTaken";

const localAiTranslator = async (props) => {
    const targetLangName = atfp_global_object.languageObject[props.targetLang];
    const sourceLangName = atfp_global_object.languageObject[props.sourceLang];
    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

    const { translateStatusHandler, translateStatus } = props;

    let startTime = 0;

    const startTranslation = () => {
        startTime = new Date().getTime();

        const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
        if (stringContainer[0].scrollHeight > 100) {
            jQuery("#atfp_strings_model .atfp_translate_progress").fadeIn("slow");
        }
    }

    const completeTranslation = () => {
        StoreTimeTaken({ prefix: 'localAiTranslator', start: startTime, end: new Date().getTime(), translateStatus: true });
        setTimeout(() => {
            translateStatusHandler(false);
            jQuery("#atfp_strings_model .atfp_translate_progress").fadeOut("slow");
        }, 4000);
    }

    const beforeTranslate = (ele) => {
        const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
        if (stringContainer.length < 1) {
            TranslateProvider.stopTranslation();
            StoreTimeTaken({ prefix: 'localAiTranslator', start: startTime, end: new Date().getTime() });
            startTime = 0;
            return;
        }

        const scrollStringContainer = (position) => {
            stringContainer.scrollTop(position);
        };

        const stringContainerPosition = stringContainer[0].getBoundingClientRect();

        const eleTopPosition = ele.closest("tr").offsetTop;
        const containerHeight = stringContainer.height();

        if (eleTopPosition > (containerHeight + stringContainerPosition.y)) {
            scrollStringContainer(eleTopPosition - containerHeight + ele.offsetHeight);
        }
    }

    const afterTranslate = (ele) => {
        const translatedText = ele.innerText;
        const type = ele.dataset.stringType;
        const key = ele.dataset.key;
        const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;

        SaveTranslation({ type: type, key: key, translateContent: translatedText, source: sourceText, provider: 'localAiTranslator', AllowedMetaFields });

        const translationEntry = select('block-atfp/translate').getTranslationInfo().translateData?.localAiTranslator;
        const previousTargetStringCount = translationEntry && translationEntry.targetStringCount ? translationEntry.targetStringCount : 0;
        const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
        const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;

        if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
            dispatch('block-atfp/translate').translationInfo({ targetStringCount: previousTargetStringCount + sourceText.trim().split(/(?<=[.!?]+)\s+/).length, targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length, targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length, provider: 'localAiTranslator' });
        }
    }

    const TranslateProvider = await ChromeAiTranslator.Object({
        mainWrapperSelector: "#atfp_strings_model",
        btnSelector: `#${props.ID}`,
        btnClass: "local_ai_translator_btn",
        btnText: __("Translate To", 'automatic-translations-for-polylang') + ' ' + targetLangName + ' (Beta)',
        stringSelector: ".atfp_string_container tbody tr td.translate:not([data-translate-status='translated'])",
        progressBarSelector: "#atfp_strings_model .atfp_translate_progress",
        sourceLanguage: props.sourceLang,
        targetLanguage: props.targetLang,
        targetLanguageLabel: targetLangName,
        sourceLanguageLabel: sourceLangName,
        onStartTranslationProcess: startTranslation,
        onComplete: completeTranslation,
        onBeforeTranslate: beforeTranslate,
        onAfterTranslate: afterTranslate
    });

    if (TranslateProvider.hasOwnProperty('init')) {
        TranslateProvider.init();
        const button = document.querySelector('#atfp_localAiTranslator_translate_element .local_ai_translator_btn');

        if (button && translateStatus) {
            button.disabled = translateStatus;
        }
    }
};

export default localAiTranslator;