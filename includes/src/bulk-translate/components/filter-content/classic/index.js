import React from 'react';
import filterContent from '../../filter-target-content';
import extractInnerContent from '../extarct-inner-content';
import storeSourceString from '../../store-source-string';

/**
 * @param {Object} content
 * @param {string} service
 * @returns {string}
 */
const FilterClassicContent = async ({content, service, postId, storeDispatch, filterHtmlContent, sourceLanguage}) => {
    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    const splitContentWithDynamicBreaks = (content) => {
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

    // Extract content outside shortcode content
    // Extract content between open and close shortcode tags
    // Extra content before open shortcode or after close shortcode
    const saveShortcodeContent = async (key, text) => {
        // Match WordPress style shortcodes
        const regex = /(\[\/?[a-zA-Z0-9_-]+(?:\s[^\]]+)?\])/g;
        const parts = text.split(regex);

        const innerContentLoopItems=async(item,index)=>{
            const trimmedContent=item.trim();
            const urlPattern = /^(https?:\/\/|www\.)[^\s]+$/i;
            if(!trimmedContent.startsWith('[') && !trimmedContent.endsWith(']') && !trimmedContent.includes('atfp_skip_') && trimmedContent !== '' && !urlPattern.test(trimmedContent)){
                const entity=(/^&[a-zA-Z0-9#]+;$/.test(item));
                const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(item);
                const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(item);
                const blockCommentTag = /<!--[\s\S]*?-->/g.test(item) && item.indexOf('<!--') < item.indexOf('-->');
                const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

                if(plainText){
                    let stringContent=trimmedContent;

                    if(filterHtmlContent){
                        let reactElement=filterContent({content: trimmedContent, service, contentKey: key+'_'+index, skipTags:[]});
                        stringContent=await extractInnerContent(reactElement);

                        reactElement=null;
                    }

                    storeSourceString(postId, key+'_'+index, trimmedContent, stringContent, storeDispatch);
                }
            }
        }

        if(parts.length > 0){
            await loopCallback(innerContentLoopItems, parts, 0);
        }
    }

    const fitlerWysiwygContent = async ({content, service}) => {
        const arrContent = splitContentWithDynamicBreaks(content);

        const innerContentLoopItems=async(text,index)=>{
            const shortcodePattern = /\[[^\]]*\]/g;
            
            if(shortcodePattern.test(text)){
                await saveShortcodeContent('content_classic_index_'+index, text);
                return;
            }

            const entity=(/^&[a-zA-Z0-9#]+;$/.test(text));
            const htmlTag = /^<\/?\s*[a-zA-Z0-9#]+\s*\/?>$/.test(text);
            const isEmptyHtmlTag = /^<\s*\/?\s*[a-zA-Z0-9#]+\s*><\/\s*\/?\s*[a-zA-Z0-9#]+\s*>$/.test(text);
            const blockCommentTag = /<!--[\s\S]*?-->/g.test(text) && text.indexOf('<!--') < text.indexOf('-->');

            const plainText=!entity && !htmlTag && !isEmptyHtmlTag && !blockCommentTag; 

            if(text !== '' && !text.includes('atfp_skip_') && plainText){
                let stringContent=text;

                if(filterHtmlContent){
                    let reactElement=filterContent({content: text, service, contentKey: 'content_classic_index_'+index, skipTags:[]});
                    stringContent=await extractInnerContent(reactElement);

                    reactElement=null;
                }

                storeSourceString(postId, 'content_classic_index_'+index, text, stringContent, storeDispatch);
            }
        }

        if(arrContent.length > 0){
            await loopCallback(innerContentLoopItems, arrContent, 0);
        }
    }

    await fitlerWysiwygContent({content, service});
}

export default FilterClassicContent;
