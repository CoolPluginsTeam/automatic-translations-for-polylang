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

        let firstElementHtml = firstElement.innerHTML;

        firstElementHtml = firstElementHtml.replace(/^\s+|\s+$/g, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);

        firstElement.innerHTML = '';

        let openTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;
        let closeTag = '';
        let filterContent = '';

        if (closingTagMatch) {
            closeTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;
        }

        if ('' !== firstElementHtml) {
            if ('' !== openTag) {
                filterContent = openTag + firstElementHtml;
            }
            if ('' !== closeTag) {
                filterContent += closeTag;
            }
        } else {
            filterContent = openTag + closeTag;
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
     * Filters the SEO content.
     * @param {string} content - The SEO content to filter.
     * @returns {string} The filtered SEO content.
     */
    const filterSeoContent = (content) => {
        const regex = /(%{1,2}[a-zA-Z0-9_]+%{0,2})/g;

        // Replace placeholders with wrapped spans
        const output = content.replace(regex, (match) => {
            return `#atfp_open_translate_span#${match}#atfp_close_translate_span#`;
        });

        return output;
    }

    /**
     * Replaces the inner text of HTML elements with span elements for translation.
     * @param {string} string - The HTML content string to process.
     * @returns {Array} An array of strings after splitting based on the pattern.
     */
    const filterSourceData = (string) => {
        function replaceInnerTextWithSpan(doc) {
            let childElements = doc.childNodes;
            
            const childElementsReplace = (index) => {
                if (childElements.length > index) {
                    let element = childElements[index];
                    let textNode=null;

                    if(element.nodeType === 3){
                        const textContent = element.textContent.replace(/^\s+|\s+$/g, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);
                        textNode = document.createTextNode(textContent);
                    }else{
                        let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                        textNode = document.createTextNode(filterContent);
                    }
                    
                    element.replaceWith(textNode);
                    
                    index++;
                    childElementsReplace(index);
                }
            }
            
            childElementsReplace(0);
            return doc;
        }

        const tempElement = document.createElement('div');
        
        tempElement.innerHTML = string;
        replaceInnerTextWithSpan(tempElement);

        let content = tempElement.innerText;

        const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
        if (isSeoContent) {
            content= filterSeoContent(content);
        }

        // Filter shortcode content
        const shortcodePattern = /\[(.*?)\]/g;
        const shortcodeMatches = content.match(shortcodePattern);

        if (shortcodeMatches) {
            content = content.replace(shortcodePattern, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);
        }

        return splitContent(content);
    }

    /**
     * The content to be filtered based on the service type.
     * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
     */
    const content = 'yandex' === props.service || 'localAiTranslator' === props.service ? filterSourceData(props.content) : props.content;

    /**
     * Regular expression pattern to match the span elements that should not be translated.
     */
    const notTranslatePattern = /#atfp_open_translate_span#[\s\S]*?#atfp_close_translate_span#/;

    /**
     * Regular expression pattern to replace the placeholder span elements.
     */
    const replacePlaceholderPattern = /#atfp_open_translate_span#|#atfp_close_translate_span#/g;

    const filterContent = content => {
        const updatedContent = content.replace(replacePlaceholderPattern, '');
        return updatedContent;
    }

    return (
        <>
            {'yandex' === props.service || 'localAiTranslator' === props.service ?
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