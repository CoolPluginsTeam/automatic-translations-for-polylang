import SaveTranslation from "../storeTranslatedString";
import { select, dispatch } from "@wordpress/data";
import StoreTimeTaken from "../StoreTimeTaken";
import AddProgressBar from "../ProgressBar";
import ShowStringCount from "../ProgressBar/showStringCount";

/**
 * Handles the scrolling animation of a specified element.
 * 
 * @param {Object} props - The properties for the scroll animation.
 * @param {HTMLElement} props.element - The element to be scrolled.
 * @param {number} props.scrollSpeed - The duration of the scroll animation in milliseconds.
 */
const ScrollAnimation = (props) => {
    const { element, scrollSpeed, provider } = props;

    if(element.scrollHeight - element.offsetHeight <= 0){
        return;
    }

    const progressBar = jQuery(`.${provider}-translator_progress_bar`);
    
    let startTime = null;
    let startScrollTop = element.scrollTop;
    const animateScroll = () => {
        const scrollHeight = element.scrollHeight - element.offsetHeight + 100;
        const currentTime = performance.now();
        const duration = scrollSpeed;
        const scrollTarget = scrollHeight + 2000;

        if (!startTime) {
            startTime = currentTime;
        }

        const progress = (currentTime - startTime) / duration;
        const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;

        var scrollTop = element.scrollTop;
        var currentScrollHeight = element.scrollHeight;
        var clientHeight = element.clientHeight;
        var scrollPercentage = (scrollTop / (currentScrollHeight - clientHeight)) * 100;
        progressBar.find(`.${provider}-translator_progress`).css('width', scrollPercentage + '%');

        let percentage=(Math.round(scrollPercentage * 10) / 10).toFixed(1);
        percentage = Math.min(percentage, 100).toString();

        progressBar.find(`.${provider}-translator_progress`).text(percentage + '%');

        if (scrollPosition > scrollHeight) {
            ShowStringCount(provider, 'block');
            return; // Stop animate scroll
        }

        element.scrollTop = scrollPosition;

        if (scrollPosition < scrollHeight) {
            setTimeout(animateScroll, 16);
        }
    }
    animateScroll();
};

/**
 * Updates the translated content in the string container based on the provided translation object.
 */
const updateTranslatedContent = ({provider, startTime, endTime}) => {
    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');
    const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]:not([data-translate-status="translated"])');
    const totalTranslatedData = translatedData.length;
    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

    translatedData.forEach((ele, index) => {
        const translatedText = ele.innerText;
        const key = ele.dataset.key;
        const type = ele.dataset.stringType;
        const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;

        SaveTranslation({ type: type, key: key, translateContent: translatedText, source: sourceText, provider: provider, AllowedMetaFields });

        const translationEntry = select('block-atfp/translate').getTranslationInfo().translateData[provider];
        const previousTargetStringCount = translationEntry && translationEntry.targetStringCount ? translationEntry.targetStringCount : 0;
        const previousTargetWordCount = translationEntry && translationEntry.targetWordCount ? translationEntry.targetWordCount : 0;
        const previousTargetCharacterCount = translationEntry && translationEntry.targetCharacterCount ? translationEntry.targetCharacterCount : 0;

        if (translatedText.trim() !== '' && translatedText.trim().length > 0) {
            dispatch('block-atfp/translate').translationInfo({ targetStringCount: previousTargetStringCount + sourceText.trim().split(/(?<=[.!?]+)\s+/).length, targetWordCount: previousTargetWordCount + sourceText.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length, targetCharacterCount: previousTargetCharacterCount + sourceText.trim().length, provider: provider });
        }

        if(index === totalTranslatedData - 1){
            jQuery(`.${provider}-translator_progress`).css('width', '100%');
            ShowStringCount(provider, 'block');

            StoreTimeTaken({ prefix: provider, start: startTime, end: endTime, translateStatus: true });
        }
    });
}

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
 * @param {HTMLElement} container - The container element for translation.
 * @param {number} startTime - The start time of the translation.
 * @param {number} endTime - The end time of the translation.
 * @param {Function} translateStatus - The function to call when the translation is complete.
 */
const onCompleteTranslation = ({container,provider, startTime, endTime, translateStatus, modalRenderId}) => {
    const conainer=document.querySelector(`#atfp-${provider}-strings-modal.modal-container[data-render-id="${modalRenderId}"]`);


    if(!conainer){
        return;
    }

    container.querySelector(".atfp_translate_progress").style.display = "none";
    container.querySelector(".atfp_string_container").style.animation = "none";
    document.body.style.top = '0';

    const saveButton = container.querySelector('button.save_it');
    saveButton.removeAttribute('disabled');
    saveButton.classList.add('translated');
    saveButton.classList.remove('notranslate');

    updateTranslatedContent({provider, startTime, endTime});

    translateStatus(false);
}

/**
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 * @param {string} provider - The provider of the translation.
 */
const ModalStringScroll = (translateStatus,provider,modalRenderId) => {
    const startTime = new Date().getTime();

    let translateComplete = false;
    AddProgressBar(provider);

    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');

    stringContainer.scrollTop = 0;
    const scrollHeight = stringContainer.scrollHeight;

    if (scrollHeight !== undefined && scrollHeight > 100) {
        document.querySelector(".atfp_translate_progress").style.display = "block";

        setTimeout(() => {
            const scrollSpeed = Math.ceil((scrollHeight / stringContainer?.offsetHeight)) * 2000;
            ScrollAnimation({ element: stringContainer, scrollSpeed: scrollSpeed, provider: provider });
        }, 2000);

        stringContainer.addEventListener('scroll', () => {
            var isScrolledToBottom = (stringContainer.scrollTop + stringContainer.clientHeight + 50 >= stringContainer.scrollHeight);

            if (isScrolledToBottom && !translateComplete) {
                const endTime = new Date().getTime();
                setTimeout(() => {
                    onCompleteTranslation({container,provider, startTime, endTime, translateStatus, modalRenderId});
                }, 4000);
                translateComplete = true;
            }
        });

        if (stringContainer.clientHeight + 10 >= scrollHeight) {
            jQuery(`.${provider}-translator_progress`).css('width', '100%');
            jQuery(`.${provider}-translator_progress`).text('100%');
            ShowStringCount(provider, 'block');
            const endTime = new Date().getTime();
            
            setTimeout(() => {
                onCompleteTranslation({container,provider, startTime, endTime, translateStatus, modalRenderId});
            }, 4000);
        }
    } else {
        jQuery(`.${provider}-translator_progress`).css('width', '100%');
        jQuery(`.${provider}-translator_progress`).text('100%');
        ShowStringCount(provider, 'block');
        const endTime = new Date().getTime();
   
        setTimeout(() => {
            onCompleteTranslation({container,provider, startTime, endTime, translateStatus, modalRenderId});
        }, 4000);
    }
}

export default ModalStringScroll;