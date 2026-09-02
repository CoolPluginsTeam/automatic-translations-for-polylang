import {selectTranslatedContent, selectBlockParseRules, selectSourceEntries, selectSourceContent} from '../../../redux-store/features/selectors';
import {store} from '../../../redux-store/store';
import updateMetaFields from '../metaFields/update-meta-fields';


/**
 * @param {Object} source
 * @param {Object} translation
 * @returns {Object}
 */
const updateGutenbergContent=async ({source, lang, translatedContent, serviceProvider, postId})=>{
    const completedInnerContentKeys=[];
    const blockParseRules=selectBlockParseRules(store.getState());
    const sourceEntries=selectSourceEntries(store.getState(), postId);

    /**
     * @param {Object} Object
     * @param {string} key
     * @param {string} translateValue
     * @returns {boolean}
     */
    const replaceValue=(Object, key, translateValue)=>{
        if(Object && Object[key] && typeof Object[key] === 'string' && Object[key].trim() !== ''){
            Object[key]=translateValue;
            return true;
        }

        return false;
    }

    const loopCallback=async (callback, loop, index)=>{
        await callback(loop[index], index);

        index++;

        if(index < loop.length){
            await loopCallback(callback, loop, index);
        }
    }

    /**
     * @param {string} key
     */
    const updateInnerHtmlContent=(key)=>{
        const staticKey = key.replace(/(_atfp_\d+)$/, '');
       
        const duplicateKey=Object.keys(translatedContent).filter(item=>item.includes(staticKey));

        completedInnerContentKeys.push(...duplicateKey);

        const values=[];
        duplicateKey.forEach(key=>{
            let keyArray=key.split('_atfp_');
            let currentBlock = source.content;
            const translateValue = getTransaltedValue(key);
            let parentBlock = null;
            let parentKey = null;

            keyArray=keyArray.slice(1);

            keyArray.forEach(key => {
                parentBlock = currentBlock;
                parentKey = key;
                currentBlock = currentBlock[key];
            });

            if(parentBlock && parentKey && parentBlock[parentKey]){
               const status= replaceValue(parentBlock, parentKey, translateValue)
                if(status){
                    values.push(translateValue);
                }
            }
        });

        let parentBlock=null;
        let parentKey=null;
        let currentBlock = source.content;

        staticKey.split('_atfp_').slice(1).forEach(key=>{
            parentBlock = currentBlock;
            parentKey = key;
            currentBlock = currentBlock[key];
        });
        
        if(parentBlock && parentKey && parentBlock[parentKey] && parentKey === 'innerContent' && parentBlock.innerHTML && parentBlock.innerHTML.trim() !== ''){
            replaceValue(parentBlock, 'innerHTML', values.join(''));
        }
    }

    const getTransaltedValue=(key)=>{
        const stateValue=selectTranslatedContent(store.getState(), postId, key, lang, serviceProvider);
        return stateValue;
    }


    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateTitle=(source, value)=>{
        if(value && '' !== value){
            source.title=getTransaltedValue('title');
        }
    }

    /**
     * @param {Object} source
     * @param {string} value
     */
    const updateExcerpt=(source, value)=>{
        if(value && '' !== value){
            source.excerpt=getTransaltedValue('excerpt');
        }
    }

    /**
     * @param {Object} source
     * @param {Object} translation
     */
    const updateContent=(source, translation)=>{
        const customInnerBlockKeys=[];

        Object.keys(translation).forEach(key=>{
            const keys=key.split('_atfp_');
            if(keys[0] === 'title' && source.title){
                updateTitle(source, translation[keys[0]]);
            }else if(keys[0] === 'excerpt' && source.excerpt){
                updateExcerpt(source, translation[keys[0]]);
            }else if(keys[0] === 'content' && source.content){
                let keyArray=keys;

                let currentBlock = source.content;
                const translateValue = getTransaltedValue(key);
                let parentBlock = null;
                let parentKey = null;

                keyArray=keyArray.slice(1);

                if(keyArray.includes("attrs")){
                    const indexOfAttrs = keyArray.indexOf("attrs");
                    const blockKey = keyArray.slice(0, indexOfAttrs);
                    
                    let innerContentKey=null;
                    let innerContentCurrentBlock=source.content;

                    const joinBlockKey=blockKey.join('_atfp_');

                    
                    if(!customInnerBlockKeys.includes(joinBlockKey)){
                        blockKey.forEach(key => {
                            innerContentKey = key;
                            innerContentCurrentBlock = innerContentCurrentBlock[key];
                        });

                        if(innerContentCurrentBlock && innerContentCurrentBlock.blockName === 'core/more'){
                            customInnerBlockKeys.push(joinBlockKey);
                        }else if(innerContentCurrentBlock && !innerContentCurrentBlock.blockName.startsWith('core/')){
                            if(innerContentCurrentBlock.innerHTML && innerContentCurrentBlock.innerHTML.trim() !== ''){
                                customInnerBlockKeys.push(joinBlockKey);
                            }else if(innerContentCurrentBlock.originalContent && innerContentCurrentBlock.originalContent.trim() !== ''){
                                customInnerBlockKeys.push(joinBlockKey);
                            }
                        }
    
                    }
                }

                let imageBlock=null;
                let imageBlockRef=null;
                
                keyArray.forEach(key => {
                    parentBlock = currentBlock;
                    parentKey = key;
                    currentBlock = currentBlock[key];

                    if(currentBlock && typeof currentBlock === 'object' && currentBlock?.blockName === 'core/image'){
                        imageBlock=true;
                        imageBlockRef=currentBlock;
                    }
                });

                if (parentBlock && parentKey && key.includes('innerContent') && !completedInnerContentKeys.includes(key)) {
                    updateInnerHtmlContent(key);
                }else if(parentBlock && parentKey){
                    replaceValue(parentBlock, parentKey, translateValue)
                }

                if(imageBlock && key.includes('attrs') && key.includes('alt')){
                    const sourceString=selectSourceContent(store.getState(), postId, keys.join('_atfp_'));
                    const translatedString=selectTranslatedContent(store.getState(), postId, keys.join('_atfp_'), lang, serviceProvider);
                    
                    if(sourceString && translatedString && '' !== sourceString && '' !== translatedString && imageBlockRef?.innerHTML && imageBlockRef?.innerHTML?.trim() !== ''){
                        imageBlockRef.innerHTML=imageBlockRef.innerHTML.replace('alt="'+sourceString+'"', 'alt="'+translatedString+'"');

                        if(imageBlockRef?.innerContent && imageBlockRef?.innerContent?.length > 0){
                            imageBlockRef.innerContent.forEach((item, index)=>{
                                if(item && item && item.trim() !== ''){
                                    imageBlockRef.innerContent[index]=item.replace('alt="'+sourceString+'"', 'alt="'+translatedString+'"');
                                }
                            });
                        }
                    }
                }
            }
        });

        customInnerBlockKeys.forEach(key=>{
            updateCustomBlockInnerHtml(key);
        });
    }

    const updateCustomBlockInnerHtml=(key)=>{
        const existingKeys=Object.keys(sourceEntries).filter(item=>item.startsWith('content_atfp_'+key+'_atfp_innerContent'));

        if(existingKeys.length > 0) return;
        let currentBlockKeys=Object.keys(sourceEntries).filter(item=>item.startsWith('content_atfp_'+key+'_atfp_'+'attrs'));

        let translatedStrings={};
        
        currentBlockKeys.forEach(item=>{
            const sourceString=selectSourceContent(store.getState(), postId, item);
            const translatedString=selectTranslatedContent(store.getState(), postId, item, lang, serviceProvider);

            if(sourceString && translatedString && '' !== sourceString && '' !== translatedString){
                translatedStrings[sourceString]=translatedString;
            }
        });

        // Sort translatedStrings by key with more words (descending)
        let sortedTranslatedStrings = Object.entries(translatedStrings)
            .sort((a, b) => b[0].split(/\s+/).length - a[0].split(/\s+/).length)
            .reduce((acc, [k, v]) => { acc[k] = v; return acc; }, {});


        let blockKey=key.split('_atfp_');

        let currentBlock=source.content;
        let parentBlock=null;
        let parentKey=null;

        blockKey.forEach(key=>{
            parentBlock=currentBlock;
            parentKey=key;
            currentBlock=currentBlock[key];
        });

        updateCustomBlockInnerHtmlContent(currentBlock, sortedTranslatedStrings);

        currentBlockKeys=null;
        translatedStrings=null;
        sortedTranslatedStrings=null;
        blockKey=null;
        currentBlock=null;
        parentBlock=null;
        parentKey=null;
    }

    const updateCustomBlockInnerHtmlContent=(currentBlock, sortedTranslatedStrings)=>{
        if(currentBlock && currentBlock.innerHTML && currentBlock.innerHTML.trim() !== ''){

            if(currentBlock.blockName === 'core/more'){
                const key = Object.keys(sortedTranslatedStrings)[0];
                const value = sortedTranslatedStrings[key];
                
                const regex = new RegExp(`<!--more\\s+${key}`, 'g');
                currentBlock.innerHTML = currentBlock.innerHTML.replace(regex, `<!--more ${value}`);

                if(currentBlock.innerContent && currentBlock.innerContent.length > 0){
                    currentBlock.innerContent.forEach((item, index)=>{
                        const regex = new RegExp(`<!--more\\s+${key}`, 'g');
                        currentBlock.innerContent[index] = item.replace(regex, `<!--more ${value}`);
                    });
                }

                return;
            }

            let translatedInnerHtml=currentBlock.innerHTML;

            Object.keys(sortedTranslatedStrings).forEach(key=>{
                const keyRegex = new RegExp(`(?<!<[^>]*)${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![^<]*>)`, 'g');
                translatedInnerHtml = translatedInnerHtml.replace(keyRegex, sortedTranslatedStrings[key]);
            });

            currentBlock.innerHTML=translatedInnerHtml;
            translatedInnerHtml=null;
            

            if(currentBlock.innerContent && currentBlock.innerContent.length > 0){
                currentBlock.innerContent.forEach((item, index)=>{
                    if(item && item && item.trim() !== ''){
                        let translatedInnerHtml=item;

                        Object.keys(sortedTranslatedStrings).forEach(key=>{
                            const keyRegex = new RegExp(`(?<!<[^>]*)${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![^<]*>)`, 'g');
                            translatedInnerHtml = translatedInnerHtml.replace(keyRegex, sortedTranslatedStrings[key]);
                        });

                        currentBlock.innerContent[index]=translatedInnerHtml;
                        translatedInnerHtml=null;
                    }
                });
            }
        }
    }

    updateContent(source, translatedContent);

    if("false" === atfp_bulk_translate_object.postMetaSync && source.metaFields && Object.keys(source.metaFields).length > 0){
        source.metaFields=updateMetaFields(source.metaFields, lang, serviceProvider, postId);
    }

    return source;
}

export default updateGutenbergContent;
