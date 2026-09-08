import ModalStringScroll from "../../string-modal-scroll";

/**
 * Clears Google Translate persistence so a previously used target is not re-applied.
 */
const clearGoogleTranslateCookie = () => {
    const hostname = window.location.hostname;
    const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

    document.cookie = `googtrans=; path=/; ${expire}`;
    document.cookie = `googtrans=; path=/; domain=${hostname}; ${expire}`;
    document.cookie = `googtrans=; path=/; domain=.${hostname}; ${expire}`;
};

/**
 * Forces the widget dropdown back to "Select Language".
 *
 * @param {HTMLElement} widgetElement Widget root element.
 * @return {HTMLSelectElement|null} The language combo, or null when not injected yet.
 */
const resetGoogleLanguageCombo = (widgetElement) => {
    const combo = widgetElement.querySelector('.goog-te-combo');

    if (!combo) {
        return null;
    }

    if (combo.value !== '') {
        combo.selectedIndex = 0;
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    return combo;
};

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = (data) => {

    const { sourceLang, targetLang, ID, translateStatusHandler, modalRenderId } = data;

    let lang=targetLang;
    let srcLang=sourceLang;
    
    if(lang === 'zh'){
        lang=atfp_global_object.languageObject['zh']?.locale.replace('_', '-');
    }

    if(srcLang === 'zh'){
        srcLang=atfp_global_object.languageObject['zh']?.locale.replace('_', '-');
    }

    clearGoogleTranslateCookie();

    new google.translate.TranslateElement({
        pageLanguage: srcLang,
        includedLanguages: lang,
        defaultLanguage: srcLang,
        multilanguagePage: true,
        autoDisplay: false,
    }, ID);

    const element=document.querySelector(`#${ID}`);

    if(element){
        const translateElement=element.children;
        
        if(translateElement.length <= 0){
            Object.values(google?.translate?.TranslateElement()).map(item=>{
                if(item instanceof HTMLElement && item.id === 'atfp_google_translate_element'){
                    element.replaceWith(item);
                }
            });
        }
    }

    const widgetElement=document.querySelector(`#${ID}`);

    if(!widgetElement){
        return;
    }

    let readyForUserSelection = false;
    let translationStarted = false;

    const modalStringScrollHandler = (event) => {
        // Ignore the reset dispatched below; only a real user choice starts translation.
        if (!readyForUserSelection || translationStarted) {
            return;
        }

        const combo = widgetElement.querySelector('.goog-te-combo');
        const selectedLang = combo ? combo.value : (event?.target?.value || '');

        if (!selectedLang) {
            return;
        }

        translationStarted = true;
        ModalStringScroll(translateStatusHandler,'google', modalRenderId);
    }

    data.destroyUpdateHandler(() => {
        widgetElement.removeEventListener('change', modalStringScrollHandler);
    });

    widgetElement.removeEventListener('change', modalStringScrollHandler);
    widgetElement.addEventListener('change', modalStringScrollHandler);

    // The combo is injected asynchronously, so poll until it exists before clearing it.
    let attempts = 0;
    const ensureManualSelection = () => {
        attempts += 1;

        const combo = resetGoogleLanguageCombo(widgetElement);

        if (combo || attempts >= 30) {
            setTimeout(() => {
                resetGoogleLanguageCombo(widgetElement);
                readyForUserSelection = true;
            }, 300);
            return;
        }

        setTimeout(ensureManualSelection, 100);
    };

    ensureManualSelection();

}

export default GoogleTranslater;
