const FilterTargetContent = (props) => {

    /**
     * Wraps the first element and its matching closing tag with translation spans.
     * If no elements are found, returns the original HTML.
     * @param {string} html - The HTML string to process.
     * @returns {string} The modified HTML string with wrapped translation spans.
     */
    const wrapFirstAndMatchingClosingTag = (html) => {
        // Create a temporary element to parse the HTML string
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        // Get the first element
        const firstElement = tempElement.firstElementChild;

        if (!firstElement) {
            return html; // If no elements, return the original HTML
        }

        let childElements = firstElement.children;
        const length = childElements.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                let element = childElements[i];
                let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                element.outerHTML = filterContent;
            }
        }

        // Get the opening tag of the first element
        // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];

        // Check if the first element has a corresponding closing tag
        const openTagName = firstElement.tagName.toLowerCase();
        const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

        // Check if the inner HTML contains the corresponding closing tag
        const closingTagMatch = firstElement.outerHTML.match(closingTagName);

        // Wrap the style element
        if (firstElementOpeningTag === '<style>') {
            let wrappedFirstTag = `#atfp_open_translate_span#${firstElement.outerHTML}#atfp_close_translate_span#`;
            return wrappedFirstTag;
        }
        
        const firstElementHtml = firstElement.innerHTML;
        firstElement.innerHTML = '';

        let openTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;
        let closeTag = '';
        let filterContent='';

        if (closingTagMatch) {
            closeTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;
        }

        if ('' !== firstElementHtml) {
            if('' !== openTag){
                filterContent=openTag+firstElementHtml;
            }
            if('' !== closeTag){
                filterContent += closeTag;
            }
        }else{
            filterContent=openTag+closeTag;
        }

        firstElement.outerHTML = filterContent;

        // Return the modified HTML
        return tempElement.innerHTML;
    }

    /**
     * Splits the content string based on a specific pattern.
     * @param {string} string - The content string to split.
     * @returns {Array} An array of strings after splitting based on the pattern.
     */
    const splitContent = (string) => {
        const pattern = /(#atfp_open_translate_span#.*?#atfp_close_translate_span#)|'/;
        const matches = string.split(pattern).filter(Boolean);

        // Remove empty strings from the result
        const output = matches.filter(match => match.trim() !== '');

        return output;
    }

    /**
     * Replaces the inner text of HTML elements with span elements for translation.
     * @param {string} string - The HTML content string to process.
     * @returns {Array} An array of strings after splitting based on the pattern.
     */
    const filterSourceData = (string) => {
        function replaceInnerTextWithSpan(doc) {
            let childElements = doc.children;

            const childElementsReplace = () => {
                if (childElements.length > 0) {
                    let element = childElements[0];
                    let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                    const textNode = document.createTextNode(filterContent);
                    element.replaceWith(textNode);
                    childElementsReplace();
                }
            }
            childElementsReplace();
            return doc;
        }

        const tempElement = document.createElement('div');
        tempElement.innerHTML = string;
        replaceInnerTextWithSpan(tempElement);

        return splitContent(tempElement.innerText);
    }

    /**
     * The content to be filtered based on the service type.
     * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
     */
    const content = 'yandex' === props.service ? filterSourceData(props.content) : props.content;

    props.translateContent(content);

    if (props.currentIndex === props.totalString) {
        props.translateContent({ stringRenderComplete: true });
    }

    /**
     * Regular expression pattern to match the span elements that should not be translated.
     */
    const notTranslatePattern = /#atfp_open_translate_span#[\s\S]*?#atfp_close_translate_span#/;

    /**
     * Regular expression pattern to replace the placeholder span elements.
     */
    const replacePlaceholderPattern = /#atfp_open_translate_span#|#atfp_close_translate_span#/g;

    const filterContent=content=>{
        const updatedContent=content.replace(replacePlaceholderPattern, '');
        return updatedContent;
    }

    return (
        <>
            {'yandex' === props.service ?
                content.map((data, index) => {
                    const notTranslate = notTranslatePattern.test(data);
                    if (notTranslate) {
                        return <span key={index} className="notranslate atfp-notraslate-tag" translate="no">{filterContent(data)}</span>;
                    } else {
                        return data;
                    }
                })
                : content}
        </>
    );
}

export default FilterTargetContent;