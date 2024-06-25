const { dispatch } = wp.data;
/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const saveTranslation = (translateData) => {
    Object.keys(translateData).map(key => {
        const data = translateData[key];

        if (data.type !== 'content') {
            const action = `${data.type}SaveTranslate`;
            dispatch('block-atfp/translate')[action](data.translateContent);
        } else {
            dispatch('block-atfp/translate').contentSaveTranslate(key, data.translateContent, data.source);
        }
    });
}
/**
 * Updates the translated content based on the provided translation object.
 */
const updateTranslatedContent = () => {
    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');
    const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]');

    const data = {};

    translatedData.forEach(ele => {
        const translatedText = ele.innerText;
        const key = ele.dataset.key;
        const type = ele.dataset.stringType;
        const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;

        data[key] = { type: type, translateContent: translatedText, source: sourceText };
    });

    saveTranslation(data);
}

/**
 * Automatically scrolls the container and triggers the completion callback when the bottom is reached or certain conditions are met.
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 */
const translationWaiting = (translateStatus) => {

    let translateComplete = false;

    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');

    stringContainer.scrollTop = 0;
    const scrollHeight = stringContainer.scrollHeight;
    const scrollSpeed = Math.min(10000, scrollHeight);
    let startTime = null;

    const animateScroll=()=>{
        const currentTime = performance.now();
        const duration = scrollSpeed; // 10 seconds
        const scrollTarget = scrollHeight + 2000;

        if (!startTime) {
            startTime = currentTime;
        }

        const progress = (currentTime - startTime) / duration;
        const scrollPosition = scrollTarget * progress;

        stringContainer.scrollTop = scrollPosition;

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    if (scrollHeight !== undefined && scrollHeight > 100) {
        container.querySelector(".atfp_translate_progress").style.display = "block";

        setTimeout(() => {
            animateScroll();
            // stringContainer.scrollBy({
            //     top: scrollHeight + 2000,
            //     behavior: 'smooth',
            // });
        }, 2000);

        stringContainer.addEventListener('scroll', () => {
            var isScrolledToBottom = (stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight);

            if (isScrolledToBottom && !translateComplete) {
                translateStatus();
                onCompleteTranslation(container);
                translateComplete = true;
            }
        });

        if (stringContainer.clientHeight + 10 >= scrollHeight) {
            setTimeout(() => {
                translateStatus();
                onCompleteTranslation(container);
            }, 1500);
        }
    } else {
        setTimeout(() => {
            translateStatus();
            onCompleteTranslation(container);
        }, 2000);
    }
}

/**
 * Handles the completion of translation by enabling save button, updating stats, and stopping translation progress.
 * @param {HTMLElement} container - The container element for translation.
 */
const onCompleteTranslation = (container) => {
    // container.querySelector(".atfp_save_strings").disabled = false;
    // container.querySelector(".atfp_stats").style.display = "block";
    container.querySelector(".atfp_translate_progress").style.display = "none";
    container.querySelector(".atfp_string_container").style.animation = "none";
    document.body.style.top = '0';

    const saveButton = container.querySelector('button.save_it');
    saveButton.removeAttribute('disabled');
    saveButton.classList.add('translated');
    saveButton.classList.remove('notranslate');
    updateTranslatedContent();
}

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
const GoogleTranslater = (data) => {
    // delete window.google;
    const bodyEle = document.querySelector('body');
    bodyEle.setAttribute('translate', 'no');

    const { sourceLang, targetLang, translateStatus } = data;
    
    new google.translate.TranslateElement({
        pageLanguage: sourceLang,
        includedLanguages: targetLang,
        defaultLanguage: sourceLang,
        multilanguagePage: true,
        autoDisplay: false,
    }, 'atfp_google_translate_element');

    document.querySelector("#atfp_google_translate_element").addEventListener('change', () => {
        translationWaiting(translateStatus);
    });

}

export default GoogleTranslater;