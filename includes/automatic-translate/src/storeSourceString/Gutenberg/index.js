import FilterBlockNestedAttr from "../../component/FilterNestedAttr";
import { dispatch, select } from "@wordpress/data";

/**
 * Filters and translates attributes of a block.
 * 
 * @param {string} blockId - The ID of the block.
 * @param {Object} blockAttr - The attributes of the block.
 * @param {Object} filterAttr - The attributes to filter.
 */
const filterTranslateAttr = (blockId, blockAttr, filterAttr) => {

    const filterAttrArr = Object.values(filterAttr);

    /**
     * Saves translated attributes based on the provided ID array and filter attribute object.
     * 
     * @param {Array} idArr - The array of IDs.
     * @param {Object} filterAttrObj - The filter attribute object.
     */
    const saveTranslatedAttr = (idArr, filterAttrObj) => {
       
        if (true === filterAttrObj) {
            const newIdArr = new Array(...idArr);
            const childIdArr = new Array();

            let dynamicBlockAttr = blockAttr;
            let uniqueId = blockId;

            newIdArr.forEach(key => {
                childIdArr.push(key);
                uniqueId += `atfp${key}`;
                dynamicBlockAttr = dynamicBlockAttr[key];
            });

            let blockAttrContent = dynamicBlockAttr;

            if(blockAttrContent instanceof wp.richText.RichTextData) {
                blockAttrContent=blockAttrContent.originalHTML;
            }
          
            if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {
                
                let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');

                if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
                    return false;
                }

                dispatch('block-atfp/translate').contentSaveSource(filterKey, blockAttrContent);
            }

            return;
        }

        FilterBlockNestedAttr(idArr,filterAttrObj,blockAttr,saveTranslatedAttr);
    }

    filterAttrArr.forEach(data => {
        Object.keys(data).forEach(key => {
            const idArr = new Array(key);
            saveTranslatedAttr(idArr, data[key]);
        });
    });
}
/**
 * Retrieves the translation string for a block based on block rules and applies translation.
 * 
 * @param {Object} block - The block to translate.
 * @param {Object} blockRules - The rules for translating the block.
 */
const getTranslateString = (block, blockRules) => {
    const blockTranslateName = Object.keys(blockRules.AtfpBlockParseRules);

    if (!blockTranslateName.includes(block.name)) {
        return;
    }

    filterTranslateAttr(block.clientId, block.attributes, blockRules['AtfpBlockParseRules'][block.name]);
}

/**
 * Recursively processes child block attributes for translation.
 * 
 * @param {Array} blocks - The array of blocks to translate.
 * @param {Object} blockRules - The rules for translating the blocks.
 */
const childBlockAttributesContent = (blocks, blockRules) => {
    blocks.forEach(block => {
        getTranslateString(block, blockRules);
        if (block.innerBlocks) {
            childBlockAttributesContent(block.innerBlocks, blockRules);
        }
    });
}

/**
 * Processes the attributes of a block for translation.
 * 
 * @param {Object} parseBlock - The block to parse for translation.
 * @param {Object} blockRules - The rules for translating the block.
 */
const blockAttributeContent = (parseBlock, blockRules) => {
    Object.values(parseBlock).forEach(block => {
        getTranslateString(block, blockRules);
        if (block.innerBlocks) {
            childBlockAttributesContent(block.innerBlocks, blockRules);
        }
    });
}

/**
 * Saves the translation for a block based on its attributes.
 * 
 * @param {Object} block - The block to save translation for.
 * @param {Object} blockRules - The rules for translating the block.
 */
const GutenbergBlockSaveSource = (block, blockRules) => {

    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

    Object.keys(block).forEach(key => {
        if (key === 'content') {
            blockAttributeContent(block[key], blockRules);
        }else if(key === 'metaFields'){
            Object.keys(block[key]).forEach(metaKey => {
                // Store meta fields
                if(Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string'){
                    if('' !== block[key][metaKey][0] && undefined !== block[key][metaKey][0]){
                        dispatch('block-atfp/translate').metaFieldsSaveSource(metaKey, block[key][metaKey][0]);
                    }
                }
            });

            // Store ACF fields
            if(window.acf){
                acf.getFields().forEach(field => {
                    if(field.data && AllowedMetaFields[field.data.key]){
                        const name = field.data.name;
                        const currentValue=acf.getField(field.data.key)?.val();

                        if(block[key] && block[key][name]){
                            if('' !== block[key][name] && undefined !== block[key][name]){
                                dispatch('block-atfp/translate').metaFieldsSaveSource(field.data.key, block[key][name][0]);
                            }
                        }else if(currentValue && '' !== currentValue && undefined !== currentValue){
                            dispatch('block-atfp/translate').metaFieldsSaveSource(field.data.key, currentValue);
                        }
                    }
                });
            }
        } else if(['title', 'excerpt'].includes(key)){
            if(block[key] && block[key].trim() !== ''){
                const action = `${key}SaveSource`;
                dispatch('block-atfp/translate')[action](block[key]);
            }
        }
    });
}

export default GutenbergBlockSaveSource;