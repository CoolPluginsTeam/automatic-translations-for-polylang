import FilterBlockNestedAttr from "../../component/filter-nested-attr";
import { dispatch, select } from "@wordpress/data";

/**
 * Filters and translates attributes of a block.
 * 
 * @param {string} blockId - The ID of the block.
 * @param {Object} blockAttr - The attributes of the block.
 * @param {Object} filterAttr - The attributes to filter.
 */
const filterTranslateAttr = (blockId, blockAttr, filterAttr, blockFullObject) => {


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
                dynamicBlockAttr = dynamicBlockAttr ? dynamicBlockAttr[key] : dynamicBlockAttr;
            });

            let blockAttrContent = dynamicBlockAttr;

            if(blockAttrContent instanceof wp.richText.RichTextData) {
                blockAttrContent=blockAttrContent.originalHTML;
            }

          
            if (undefined !== blockAttrContent && typeof blockAttrContent === 'string' && blockAttrContent.trim() !== '') {

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

    if (Array.isArray(filterAttr)) {
        filterAttr.forEach(data => {
            if (typeof data === 'object' && data !== null) {
                Object.keys(data).forEach(key => {
                    const idArr = new Array(key);
                    saveTranslatedAttr(idArr, data[key]);
                });
            }
        });
    } else if (typeof filterAttr === 'object' && filterAttr !== null) {
        Object.keys(filterAttr).forEach(key => {
            const idArr = new Array(key);
            saveTranslatedAttr(idArr, filterAttr[key]);
        });
    }

    if (filterAttr && filterAttr['xpaths'] && blockFullObject && wp && wp.blocks) {
        try {
            const htmlString = wp.blocks.serialize(blockFullObject);
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const findAttributePathByValue = (obj, targetValue, currentPath = []) => {
                let foundPath = null;
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let val = obj[key];
                        if (val && val.originalHTML !== undefined) {
                            val = val.originalHTML;
                        }
                        
                        if (typeof val === 'string' && val.trim() !== '') {
                            const div = document.createElement('div');
                            div.innerHTML = val;
                            if (div.textContent.trim() === targetValue.trim()) {
                                return [...currentPath, key];
                            }
                        } else if (typeof val === 'object' && val !== null) {
                            foundPath = findAttributePathByValue(val, targetValue, [...currentPath, key]);
                            if (foundPath) return foundPath;
                        }
                    }
                }
                return null;
            };

            filterAttr['xpaths'].forEach(xpath => {
                try {
                    const result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
                    let node = result.iterateNext();
                    while (node) {
                        let sourceString = (node.nodeType === Node.ATTRIBUTE_NODE) ? node.value : node.textContent;
                        sourceString = sourceString.trim();

                        if (sourceString && sourceString !== '') {
                            const attrPath = findAttributePathByValue(blockAttr, sourceString);
                            if (attrPath) {
                                saveTranslatedAttr(attrPath, true);
                            }
                        }
                        node = result.iterateNext();
                    }
                } catch (e) {}
            });
        } catch (err) {}
    }
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

    filterTranslateAttr(block.clientId, block.attributes, blockRules['AtfpBlockParseRules'][block.name], block);
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
                    const metaValue = block[key][metaKey][0];
                    if(typeof metaValue === 'string' && metaValue.trim() !== ''){
                        dispatch('block-atfp/translate').metaFieldsSaveSource(metaKey, metaValue);
                    }
                }
            });

            // Store ACF fields
            if(window.acf){
                acf.getFields().forEach(field => {
                    const fieldData=JSON.parse(JSON.stringify({key: field.data.key, type: field.data.type, name: field.data.name}));
                    // Update repeater fields
                    if(field.$el && field.$el.closest('.acf-field.acf-field-repeater') && field.$el.closest('.acf-field.acf-field-repeater').length > 0){
                        const rowId=field.$el.closest('.acf-row').data('id');
                        const repeaterItemName=field.$el.closest('.acf-field.acf-field-repeater').data('name');
    
                        if(rowId && '' !== rowId){
                            const index=rowId.replace('row-', '');
                        
                            fieldData.name=repeaterItemName+'_'+index+'_'+fieldData.name;
                        }
                    }
    
                   if(fieldData && fieldData.key && Object.keys(AllowedMetaFields).includes(fieldData.name)){
                        const fieldName = fieldData.name;
                        let value = field?.val();

                        if('wysiwyg' === fieldData.type && block[key] && block[key][fieldName] && block[key][fieldName][0] && '' !== block[key][fieldName][0]){
                            value = block[key][fieldName][0];
                        }
    
                       if(typeof value === 'string' && value.trim() !== ''){
                           dispatch('block-atfp/translate').metaFieldsSaveSource(fieldName, value);
                       }
                   }
                });
            }
        }else if(['title', 'excerpt'].includes(key)){
            if(block[key] && block[key].trim() !== ''){
                const action = `${key}SaveSource`;
                dispatch('block-atfp/translate')[action](block[key]);
            }
        }
    });
}

export default GutenbergBlockSaveSource;