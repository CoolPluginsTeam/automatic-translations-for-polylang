import ModalStringScroll from "../../string-modal-scroll";
import { __ } from "@wordpress/i18n";

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

// Shows why the widget could not start, in its own container.
const showGoogleApiError = (ID, translateStatusHandler) => {
    const container = document.querySelector(`#${ID}`);

    if (container) {
        container.innerHTML = '';
        const notice = document.createElement('div');
        notice.className = 'notice inline notice-warning';
        notice.textContent = __('Google Translate could not load. This is usually caused by an ad blocker or privacy extension blocking translate.google.com - please disable it for this site and reload the page.', 'automatic-translations-for-polylang');
        container.appendChild(notice);
    }

    if (typeof translateStatusHandler === 'function') {
        translateStatusHandler(false);
    }
};

// Polls for window.google.translate since the script loads asynchronously (see backend-assets.php); onTimeout means it never showed up (blocked/failed).
const waitForGoogleTranslateApi = (onReady, onTimeout) => {
    const pollIntervalMs = 200;
    const maxAttempts = 40; // 8s total - generous for a slow connection, short enough to still feel responsive.
    let attempts = 0;

    const check = () => {
        if (typeof google !== 'undefined' && google?.translate?.TranslateElement) {
            onReady();
            return;
        }

        attempts += 1;

        if (attempts >= maxAttempts) {
            onTimeout();
            return;
        }

        setTimeout(check, pollIntervalMs);
    };

    check();
};

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = (data) => {

    const { sourceLang, targetLang, ID, translateStatusHandler, modalRenderId } = data;

    waitForGoogleTranslateApi(
        () => startGoogleTranslateWidget(data),
        () => showGoogleApiError(ID, translateStatusHandler)
    );
}

const startGoogleTranslateWidget = (data) => {

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
