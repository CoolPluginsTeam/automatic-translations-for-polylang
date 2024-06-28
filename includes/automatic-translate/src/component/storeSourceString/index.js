const { dispatch } = wp.data;

let contentIndex = 0;
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

            const blockAttrContent = dynamicBlockAttr;

            if (undefined !== blockAttrContent && blockAttrContent.trim() !== '') {

                let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
                if (!/[^\p{L}\p{N}]/gu.test(blockAttrContent)) {
                    return false;
                }
                dispatch('block-atfp/translate').contentSaveSource(filterKey, blockAttrContent, contentIndex);
                contentIndex++;
            }
        }

        if (Object.getPrototypeOf(filterAttrObj) === Array.prototype) {
            childAttrArray(idArr, filterAttrObj);
        } else if (Object.getPrototypeOf(filterAttrObj) === Object.prototype) {
            childAttr(idArr, filterAttrObj);
        }
    }

    /**
     * Iterates over the keys of the filter object and calls saveTranslatedAttr for each key.
     * 
     * @param {Array} idArr - The array of IDs.
     * @param {Object} filterObj - The filter object to iterate over.
     */
    const childAttr = (idArr, filterObj) => {
        Object.keys(filterObj).map(key => {
            let filterObjType = filterObj;
            filterObjType = filterObjType[key];
            const newIdArr = new Array(...idArr, key);

            saveTranslatedAttr(newIdArr, filterObjType);
        });
    }

    /**
     * Handles the attributes that are arrays and objects by recursively calling saveTranslatedAttr.
     * 
     * @param {Array} idArr - The array of IDs.
     * @param {Array} attrFilter - The filter attribute array.
     */
    const childAttrArray = (idArr, attrFilter) => {
        const newIdArr = new Array(...idArr);
        let dynamicBlockAttr = blockAttr;

        newIdArr.forEach(key => {
            dynamicBlockAttr = dynamicBlockAttr[key];
        });

        if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
            childAttr(idArr, attrFilter[0]);
            return;
        }

        dynamicBlockAttr.forEach((_, index) => {
            const nestedId = new Array();
            newIdArr.forEach(key => {
                nestedId.push(key);
            });

            nestedId.push(index);
            saveTranslatedAttr(nestedId, attrFilter[0]);
        });
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
const saveTranslation = (block, blockRules) => {
    Object.keys(block).forEach(key => {
        if (key === 'content') {
            blockAttributeContent(block[key], blockRules);
        } else {
            const action = `${key}SaveSource`;
            dispatch('block-atfp/translate')[action](block[key]);
        }
    });
}

export default saveTranslation;