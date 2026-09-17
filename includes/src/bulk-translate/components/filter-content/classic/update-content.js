import {selectTranslatedContent} from '../../../redux-store/features/selectors';
import {store} from '../../../redux-store/store';
import updateMetaFields from '../metaFields/update-meta-fields';


/**
 * @param {Object} source
 * @param {Object} translation
 * @returns {Object}
 */
const updateClassicContent=async ({source, lang, translatedContent, serviceProvider, postId})=>{

    const getTransaltedValue=(key)=>{
        const stateValue=selectTranslatedContent(store.getState(), postId, key, lang, serviceProvider);
        
        return stateValue;
    }

    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    function splitContentWithDynamicBreaks(content) {
        const result = [];
        const regex = /(\r\n|\r|\n)/g;

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Push the content before the line break
            if (match.index > lastIndex) {
                result.push(content.slice(lastIndex, match.index));
            }

            // Escape line break and wrap with marker
            const escapedBreak = match[0];

            result.push(`atfp_skip_${escapedBreak}_atfp`);

            lastIndex = regex.lastIndex;
        }

        // Push remaining content after the last match
        if (lastIndex < content.length) {
            result.push(content.slice(lastIndex));
        }

        return result;
    }

    /**
     * @param {Object} source
     * @param {string} value
     */
    const updateTitle=async (source, value)=>{
        if(value && '' !== value){
            source.title=await getTransaltedValue('title');
        }
    }

    const updateExcerpt=async (source, value)=>{
        if(value && '' !== value){
            source.excerpt=await getTransaltedValue('excerpt');
        }
    }

    // Extract content outside shortcode content
    // Extract content between open and close shortcode tags
    // Extra content before open shortcode or after close shortcode
    const updateShortcodeContent = (key, text) => {
        // Match WordPress style shortcodes
        const regex = /(\[\/?[a-zA-Z0-9_-]+(?:\s[^\]]+)?\])/g;
        const parts = text.split(regex);

        const translatedParts = parts.map((item, index) => {
            const trimmedContent=item.trim();
            const urlPattern = /^(https?:\/\/|www\.)[^\s]+$/i;
            if(!trimmedContent.startsWith('[') && !trimmedContent.endsWith(']') && !trimmedContent.includes('atfp_skip_') && trimmedContent !== '' && !urlPattern.test(trimmedContent)){
                const entity=(/^&[a-zA-Z0-9#]+;$/.test(item));
                const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(item);
                const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(item);
                const blockCommentTag = /<!--[\s\S]*?-->/g.test(item) && item.indexOf('<!--') < item.indexOf('-->');
                const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 
                
                if(plainText){
                    const translatedText = selectTranslatedContent(store.getState(), postId, key+'_'+index, lang, serviceProvider);
                    const startWhiteSpace=item.match(/^\s*/)[0];
                    const endWhiteSpace=item.match(/\s*$/)[0];

                    return startWhiteSpace + translatedText + endWhiteSpace;
                }
            }

            return item;
        });

        return translatedParts.join('');
    }

    /**
     * Updates the post content based on translation.
     */
    const updatePostContent = async ({content}) => {
        const arrContent = splitContentWithDynamicBreaks(content);

        const strings = [];

        const settingsItemsLoop=async(text,index)=>{
            const shortcodePattern = /\[[^\]]*\]/g;

            if(shortcodePattern.test(text)){
                const translatedText = updateShortcodeContent('content_classic_index_'+index, text);
                strings.push(translatedText);
                return;
            }

            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('atfp_skip_') && plainText){
                const uniqueKey = 'content_classic_index_' + index;
                const stateValue=selectTranslatedContent(store.getState(), postId, uniqueKey, lang, serviceProvider);

                strings.push(stateValue);
            } else if (text.includes('atfp_skip_')) {
                const escapedBreak = text.replace('atfp_skip_', '').replace('_atfp', '');
                strings.push(escapedBreak);
            } else {
                strings.push(text);
            }
        }

        if(arrContent.length > 0){
            await loopCallback(settingsItemsLoop, arrContent, 0);
        }

        source.content= strings.join('');
    }

    await updateTitle(source, source.title);
    await updateExcerpt(source, source.excerpt);
    
    if(source.content){
        await updatePostContent({content: source.content});
    }

    if("false" === atfp_bulk_translate_object.postMetaSync && source.metaFields && Object.keys(source.metaFields).length > 0){
        source.metaFields=updateMetaFields(source.metaFields, lang, serviceProvider, postId);
    }

    return source;
}

export default updateClassicContent;
