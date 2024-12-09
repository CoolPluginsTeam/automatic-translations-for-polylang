import ChromeAiTranslator from "./local-ai-translator";
import { __ } from "@wordpress/i18n";
const { dispatch } = wp.data;

const localAiTranslator = async (props)=>{
    const targetLangName = atfp_ajax_object.languageObject[props.targetLang];

    const startTranslation = () => {
        const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");
        if (stringContainer[0].scrollHeight > 100) {
            jQuery("#atfp_strings_model .atfp_translate_progress").fadeIn("slow");
        }
    }

    const completeTranslation = () => {
        setTimeout(() => {
            props.translateStatus();
            jQuery("#atfp_strings_model .atfp_translate_progress").fadeOut("slow");
        }, 4000);
    }

    const beforeTranslate = (ele) => {
        const stringContainer = jQuery("#atfp_strings_model .modal-content .atfp_string_container");

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
        const key = ele.dataset.key;
        const type = ele.dataset.stringType;
        const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;

        if (type !== 'content') {
            const action = `${type}SaveTranslate`;
            dispatch('block-atfp/translate')[action](translatedText);
        } else {
            dispatch('block-atfp/translate').contentSaveTranslate(key, translatedText, sourceText);
        }
    }

    const TranslateProvider = await ChromeAiTranslator.Object({
        mainWrapperSelector: "#atfp_strings_model",
        btnSelector: `#${props.ID}`,
        btnClass: "local_ai_translator_btn",
        btnText: __("Translate To", 'automatic-translations-for-polylang') + ' ' + targetLangName +' (Beta)',
        stringSelector: ".atfp_string_container tbody tr td.translate",
        progressBarSelector: "#atfp_strings_model .atfp_translate_progress",
        sourceLanguage: props.sourceLang,
        targetLanguage: props.targetLang,
        targetLanguageLabel: targetLangName,
        onStartTranslationProcess: startTranslation,
        onComplete: completeTranslation,
        onBeforeTranslate: beforeTranslate,
        onAfterTranslate: afterTranslate
    });

    if(TranslateProvider.hasOwnProperty('init')){
        TranslateProvider.init();
    }
};

export default localAiTranslator;