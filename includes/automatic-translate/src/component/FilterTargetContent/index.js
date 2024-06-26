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

        // Get the opening tag of the first element
        // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];

        // Check if the first element has a corresponding closing tag
        const openTagName = firstElement.tagName.toLowerCase();
        const closingTagName = new RegExp(`<\/${openTagName}>`, 'i');

        // Check if the inner HTML contains the corresponding closing tag
        const closingTagMatch = firstElement.outerHTML.match(closingTagName);

        // Wrap the first opening tag
        const wrappedFirstTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;

        // Wrap the first element's outerHTML with the wrapped first tag
        let filterContent = firstElement.outerHTML.replace(firstElementOpeningTag, wrappedFirstTag);

        if (closingTagMatch) {
            const wrappedClosingTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;

            filterContent = filterContent.replace(closingTagName, wrappedClosingTag);
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
            let elements = doc.querySelector('body').querySelectorAll('*');
            elements.forEach(element => {
                let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                const textNode = document.createTextNode(filterContent);
                element.parentNode.replaceChild(textNode, element);
            });
            return doc;
        }

        let parser = new DOMParser();
        let doc = parser.parseFromString(string, 'text/html');

        replaceInnerTextWithSpan(doc);
        return splitContent(doc.body.innerText);
    }

    /**
     * The content to be filtered based on the service type.
     * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
     */
    const content = 'yandex' === props.service ? filterSourceData(props.content) : props.content;

    /**
     * Regular expression pattern to match the span elements that should not be translated.
     */
    const notTranslatePattern = /#atfp_open_translate_span#[\s\S]*?#atfp_close_translate_span#/;

    /**
     * Regular expression pattern to replace the placeholder span elements.
     */
    const replacePlaceholderPattern = /#atfp_open_translate_span#|#atfp_close_translate_span#/g;

    return (
        <>
            {'yandex' === props.service ?
                content.map((data, index) => {
                    const notTranslate = notTranslatePattern.test(data);
                    if (notTranslate) {
                        return <span key={index} className="notranslate atfp-notraslate-tag" translate="yes">{data.replace(replacePlaceholderPattern, '')}</span>;
                    } else {
                        return data;
                    }
                })
                : content}
        </>
    );
}

export default FilterTargetContent;