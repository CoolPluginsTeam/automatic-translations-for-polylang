const { createBlock } = wp.blocks;
const { dispatch, select } = wp.data;

/**
 * Filters and translates attributes of a block based on provided rules.
 * 
 * @param {Object} block - The block to filter and translate attributes for.
 * @param {Object} blockParseRules - The rules for parsing the block.
 * @param {Object} replaceAttrRules - The rules for replacing attributes.
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, replaceAttrRules) => {
    const filterAttrArr = Object.values(blockParseRules);
    const blockAttr = block.attributes;
    const blockId = block.clientId;

    // Function to update a nested attribute in the block
    const updateNestedAttribute = (obj, path, value) => {
        const attrReplaceKey = Object.keys(replaceAttrRules);
        const attrKeyJoin = path.slice(-2).join('_');
        let attrReplace = false;

        if (attrReplaceKey.includes(attrKeyJoin)) {
            const filterReplaceBlockName = replaceAttrRules[attrKeyJoin];
            if (filterReplaceBlockName.includes(block.name)) {
                path.pop()
                attrReplace = true;
            }
        }
        const newObj = { ...obj };
        let current = newObj;
        for (let i = 0; i < path.length - 1; i++) {
            if (Object.getPrototypeOf(current[path[i]]) === Array.prototype) {
                current[path[i]] = [...current[path[i]]];
            } else {
                current[path[i]] = { ...current[path[i]] }; // Create a shallow copy
            }
            current = current[path[i]];
        }

        if (attrReplace) {
            current[path[path.length - 1]] = value.replace(/(?<!\\)"|\\"/g, "'");
        } else {
            current[path[path.length - 1]] = value;
        }
        return newObj;
    };

    /**
     * Updates translated attributes based on provided ID array and filter attribute object.
     * 
     * @param {Array} idArr - The array of IDs to update attributes for.
     * @param {Object|Array} filterAttrObj - The filter attribute object to apply.
     */
    const updateTranslatedAttr = (idArr, filterAttrObj) => {

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
                let filterKey = uniqueId.replace(/[^a-zA-Z0-9]/g, '');
                let translateContent = '';

                if (!/[a-zA-Z]/.test(blockAttrContent)) {
                    translateContent = blockAttrContent;
                } else {
                    translateContent = select('block-atfp/translate').getTranslatedString('content', blockAttrContent, filterKey);
                }

                block.attributes = updateNestedAttribute(block.attributes, newIdArr, translateContent);
            }
        }

        if (Object.getPrototypeOf(filterAttrObj) === Array.prototype) {
            childAttrArray(idArr, filterAttrObj);
        } else if (Object.getPrototypeOf(filterAttrObj) === Object.prototype) {
            childAttr(idArr, filterAttrObj);
        }
    }

    /**
     * Function to handle updating translated attributes for a single level object.
     * 
     * @param {Array} idArr - The array of IDs to update attributes for.
     * @param {Object} filterObj - The filter object containing attributes to update.
     */
    const childAttr = (idArr, filterObj) => {
        Object.keys(filterObj).map(key => {
            let filterObjType = filterObj;
            filterObjType = filterObjType[key];
            const newIdArr = new Array(...idArr, key);

            updateTranslatedAttr(newIdArr, filterObjType);
        });
    }

    /**
     * Function to handle updating translated attributes for an array of objects.
     * 
     * @param {Array} idArr - The array of IDs to update attributes for.
     * @param {Array} attrFilter - The filter array containing attributes to update.
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
            updateTranslatedAttr(nestedId, attrFilter[0]);
        });
    }

    filterAttrArr.forEach(data => {
        Object.keys(data).forEach(key => {
            const idArr = new Array(key);
            updateTranslatedAttr(idArr, data[key]);
        });
    });

    return block;
}

/**
 * Creates a translated block based on the provided block, child block, translate handler, and block rules.
 * If the block name is included in the block rules, it filters and translates the attributes accordingly.
 * 
 * @param {Object} block - The block to create a translated version of.
 * @param {Array} childBlock - The child blocks associated with the main block.
 * @param {Object} blockRules - The rules for translating blocks.
 * @returns {Object} The newly created translated block.
 */
const createTranslatedBlock = (block, childBlock, blockRules) => {
    const { name: blockName, attributes } = block;
    const blockTranslateName = Object.keys(blockRules.AtfpBlockParseRules);

    let attribute = { ...attributes };
    let translatedBlock = block;
    let newBlock = '';

    if (blockTranslateName.includes(block.name)) {
        translatedBlock = filterTranslateAttr(block, blockRules['AtfpBlockParseRules'][block.name], blockRules.AtfpCoreAttrReplace);
        attribute = translatedBlock.attributes;
    }

    newBlock = createBlock(blockName, attribute, childBlock);

    return newBlock;
}

/**
 * Creates a child block recursively by translating each inner block based on the provided block, translate handler, and block rules.
 * 
 * @param {Object} block - The block to create a child block for.
 * @param {Object} blockRules - The rules for translating blocks.
 * @returns {Object} The newly created translated child block.
 */
const cretaeChildBlock = (block, blockRules) => {
    let childBlock = block.innerBlocks.map(block => {
        if (block.name) {
            const childBlock = cretaeChildBlock(block, blockRules);
            return childBlock;
        }
    });

    const newBlock = createTranslatedBlock(block, childBlock, blockRules)

    return newBlock;
}

/**
 * Creates the main blocks based on the provided block, translate handler, and block rules.
 * If the block name exists, it creates the main block along with its child blocks and inserts it into the block editor.
 * 
 * @param {Object} block - The main block to create.
 * @param {Object} blockRules - The rules for translating blocks.
 */
const createBlocks = (block, blockRules) => {
    const { name: blockName } = block;
    // Create the main block
    if (blockName) {
        let childBlock = block.innerBlocks.map(block => {
            if (block.name) {
                return cretaeChildBlock(block, blockRules);
            }
        })
        const parentBlock = createTranslatedBlock(block, childBlock, blockRules);

        dispatch('core/block-editor').insertBlock(parentBlock);

    }
}

export default createBlocks;
