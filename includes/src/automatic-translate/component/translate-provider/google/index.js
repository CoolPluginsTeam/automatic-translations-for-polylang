import ModalStringScroll from "../../string-modal-scroll";

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

    const modalStringScrollHandler = () => {
        ModalStringScroll(translateStatusHandler,'google', modalRenderId);
    }

    data.destroyUpdateHandler(() => {
        widgetElement.removeEventListener('change', modalStringScrollHandler);
    });

    widgetElement.removeEventListener('change', modalStringScrollHandler);
    widgetElement.addEventListener('change', modalStringScrollHandler);

}

export default GoogleTranslater;
