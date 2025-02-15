import SaveTranslation from "../storeTranslatedString";

/**
 * Handles the scrolling animation of a specified element.
 * 
 * @param {Object} props - The properties for the scroll animation.
 * @param {HTMLElement} props.element - The element to be scrolled.
 * @param {number} props.scrollSpeed - The duration of the scroll animation in milliseconds.
 */
const ScrollAnimation = (props) => {
    const { element, scrollSpeed } = props;
    const scrollHeight = element.scrollHeight - element.offsetHeight + 100;

    let startTime = null;
    let startScrollTop = element.scrollTop;
    const animateScroll = () => {
        const currentTime = performance.now();
        const duration = scrollSpeed;
        const scrollTarget = scrollHeight + 2000;
        
        if (!startTime) {
            startTime = currentTime;
        }

        const progress = (currentTime - startTime) / duration;
        const scrollPosition = startScrollTop + (scrollTarget - startScrollTop) * progress;

        if(scrollPosition > scrollHeight){
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
const updateTranslatedContent = () => {
    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');
    const translatedData = stringContainer.querySelectorAll('td.translate[data-string-type]');

    translatedData.forEach(ele => {
        const translatedText = ele.innerText;
        const key = ele.dataset.key;
        const type = ele.dataset.stringType;
        const sourceText = ele.closest('tr').querySelector('td[data-source="source_text"]').innerText;

        SaveTranslation({ type: type, key: key, translateContent: translatedText, source: sourceText });
    });
}

/**
 * Handles the completion of the translation process by enabling the save button,
 * updating the UI, and stopping the translation progress.
 * 
 * @param {HTMLElement} container - The container element for translation.
 */
const onCompleteTranslation = (container) => {
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
 * Automatically scrolls the string container and triggers the completion callback
 * when the bottom is reached or certain conditions are met.
 * 
 * @param {Function} translateStatus - Callback function to execute when translation is deemed complete.
 */
const ModalStringScroll = (translateStatus) => {

    let translateComplete = false;

    const container = document.getElementById("atfp_strings_model");
    const stringContainer = container.querySelector('.atfp_string_container');

    stringContainer.scrollTop = 0;
    const scrollHeight = stringContainer.scrollHeight;

    if (scrollHeight !== undefined && scrollHeight > 100) {
        container.querySelector(".atfp_translate_progress").style.display = "block";

        setTimeout(() => {
            const scrollSpeed = Math.ceil((scrollHeight / stringContainer?.offsetHeight)) * 2000;

            ScrollAnimation({ element: stringContainer, scrollSpeed: scrollSpeed });
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

export default ModalStringScroll;