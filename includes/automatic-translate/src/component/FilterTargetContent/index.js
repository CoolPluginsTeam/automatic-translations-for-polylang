const FilterTargetContent = (props) => {
    const skipTags=props.skipTags || [];

    function fixHtmlTags(content) {
        if (typeof content !== 'string' || !content.trim()) return content;
    
        const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
        const stack = [];
        let result = '';
        let lastIndex = 0;
        let match;
    
        while ((match = tagRegex.exec(content)) !== null) {
            const [fullMatch, tagName] = match;
            const isClosingTag = fullMatch.startsWith('</');
            const currentIndex = match.index;
    
            // Append content before this tag
            if (currentIndex > lastIndex) {
                result += content.slice(lastIndex, currentIndex);
            }
    
            if (!isClosingTag) {
                // Opening tag: push to stack
                stack.push({ tag: tagName });
                result += fullMatch;
            } else {
                // Closing tag
                const openIndex = stack.findIndex(t => t.tag === tagName);
                if (openIndex !== -1) {
                    // Match found: remove opening from stack
                    stack.splice(openIndex, 1);
                    result += fullMatch;
                } else {
                    // No opening tag: insert missing opening tag before closing
                    result += `#atfp_temp_tag_open#<${tagName}>#atfp_temp_tag_close#` + fullMatch;
                }
            }
    
            lastIndex = tagRegex.lastIndex;
        }
    
        // Append any remaining content after last tag
        if (lastIndex < content.length) {
            result += content.slice(lastIndex);
        }
    
        // Add missing closing tags at the end
        for (let i = stack.length - 1; i >= 0; i--) {
            const { tag } = stack[i];
            result += `#atfp_temp_tag_open#</${tag}>#atfp_temp_tag_close#`;
        }
    
        // Clear references to free memory (optional in GC-based engines, but helpful)
        match = null;
        stack.length = 0;
        content = null;
    
        return result;
    }

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


        let childNodes = firstElement.childNodes;
        let childNodesLength = childNodes.length;
        if (childNodesLength > 0) {
            // Sort so that nodeType 3 (Text nodes) come first
            childNodes = Array.from(childNodes).sort((a, b) => (a.nodeType === 3 ? -1 : b.nodeType === 3 ? 1 : 0));
            for (let i = 0; i < childNodesLength; i++) {
                let element = childNodes[i];

                if(element.nodeType === 3){
                    let textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);

                    element.textContent = textContent;
                }
                else if(element.nodeType === 8){
                    let textContent = `<!--${element.textContent}-->`;
                    element.textContent = textContent;
                }
                else{
                    let filterContent = wrapFirstAndMatchingClosingTag(element.outerHTML);
                    element.outerHTML = filterContent;
                }
            }
        }

        // Get the opening tag of the first element
        // const firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        let firstElementOpeningTag = firstElement.outerHTML.match(/^<[^>]+>/)[0];
        firstElementOpeningTag = firstElementOpeningTag.replace(/#atfp_open_translate_span#|#atfp_close_translate_span#/g, '');

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

        firstElementHtml = firstElementHtml.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);

        firstElement.innerHTML = '';
        let closeTag = '';
        let openTag='';
        let filterContent = '';

        openTag = `#atfp_open_translate_span#${firstElementOpeningTag}#atfp_close_translate_span#`;
        if (closingTagMatch) {
            closeTag = `#atfp_open_translate_span#</${openTagName}>#atfp_close_translate_span#`;
        }

        if(skipTags.includes(openTagName)){
            // Remove the custom span markers from the HTML if the tag is in skipTags
            firstElementHtml = firstElementHtml.replace(/#atfp_open_translate_span#|#atfp_close_translate_span#/g, '');
            firstElementHtml = "#atfp_open_translate_span#"+firstElementHtml+"#atfp_close_translate_span#";
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

        const isSeoContent = /^(_yoast_wpseo_|rank_math_|_seopress_)/.test(props.contentKey.trim());
        if (isSeoContent) {
            string= filterSeoContent(string);
        }

        // Filter shortcode content
        const shortcodePattern = /\[(.*?)\]/g;
        const shortcodeMatches = string.match(shortcodePattern);

        if (shortcodeMatches) {
            string = string.replace(shortcodePattern, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);
        }

        function replaceInnerTextWithSpan(doc) {
            let childElements = doc.childNodes;
            
            const childElementsReplace = (index) => {
                if (childElements.length > index) {
                    let element = childElements[index];
                    let textNode=null;

                    if(element.nodeType === 3){
                        const textContent = element.textContent.replace(/^\s+|^\.\s+|^\s.|\s+$|\.\s+$|\s.\+$/g, (match) => `#atfp_open_translate_span#${match}#atfp_close_translate_span#`);

                        textNode = document.createTextNode(textContent);
                    }else if(element.nodeType === 8){
                        textNode = document.createTextNode(`<!--${element.textContent}-->`);
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
        tempElement.innerHTML = fixHtmlTags(string);
        replaceInnerTextWithSpan(tempElement);

        let content = tempElement.innerText;

        // remoove all the #atfp_temp_tag_open# and #atfp_open_translate_span#
        content = content.replace(/#atfp_temp_tag_open#([\s\S]*?)#atfp_temp_tag_close#/g, '');

        return splitContent(content);
    }

    /**
     * The content to be filtered based on the service type.
     * If the service is 'yandex', the content is filtered using filterSourceData function, otherwise, the content remains unchanged.
     */
    const content = ['yandex', 'localAiTranslator', 'google'].includes(props.service) ? filterSourceData(props.content) : props.content;

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
            {['yandex', 'localAiTranslator', 'google'].includes(props.service) ?
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