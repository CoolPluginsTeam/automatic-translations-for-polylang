import SaveTranslationHandler from "../../storeTranslatedString";

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = (data) => {

    const { sourceLang, targetLang, translateStatus, ID } = data;
    
    new google.translate.TranslateElement({
        pageLanguage: sourceLang,
        includedLanguages: targetLang,
        defaultLanguage: sourceLang,
        multilanguagePage: true,
        autoDisplay: false,
    }, ID);

    document.querySelector(`#${ID}`).addEventListener('change', () => {
        SaveTranslationHandler(translateStatus);
    });

}

export default GoogleTranslater;