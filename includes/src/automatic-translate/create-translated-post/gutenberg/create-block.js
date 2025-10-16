import FilterBlockNestedAttr from "../../component/filter-nested-attr";

/**
 * Filters and translates attributes of a block based on provided rules.
 * 
 * @param {Object} block - The block to filter and translate attributes for.
 * @param {Object} blockParseRules - The rules for parsing the block.
 * @returns {Object} The updated block with translated attributes.
 */
const filterTranslateAttr = (block, blockParseRules, service) => {
    
    const { select } = wp.data;

    const filterAttrArr = Object.values(blockParseRules);
    const blockAttr = block.attributes;
    const blockId = block.clientId;

    // Function to update a nested attribute in the block
    const updateNestedAttribute = (obj, path, value) => {

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

        if (current[path[path.length - 1]] instanceof wp.richText.RichTextData) {
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
                dynamicBlockAttr = dynamicBlockAttr ? dynamicBlockAttr[key] : dynamicBlockAttr;
            });

            let blockAttrContent = dynamicBlockAttr;

            if (blockAttrContent instanceof wp.richText.RichTextData) {
                blockAttrContent = blockAttrContent.originalHTML;
            }

            if (undefined !== blockAttrContent && typeof blockAttrContent === 'string' && blockAttrContent.trim() !== '') {
                let filterKey = uniqueId.replace(/[^\p{L}\p{N}]/gu, '');
                let translateContent = '';

                if (!/[\p{L}\p{N}]/gu.test(blockAttrContent)) {
                    translateContent = blockAttrContent;
                } else {
                    translateContent = select('block-atfp/translate').getTranslatedString('content', blockAttrContent, filterKey, service);
                }

                block.attributes = updateNestedAttribute(block.attributes, newIdArr, translateContent);
            }

            return;
        }

        FilterBlockNestedAttr(idArr, filterAttrObj, blockAttr, updateTranslatedAttr);
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
 * @param {String} service - The service to use for translation.
 * @returns {Object} The newly created translated block.
 */
const createTranslatedBlock = (block, childBlock, blockRules, service) => {
    const { createBlock } = wp.blocks;
    const { name: blockName, attributes } = block;
    const blockTranslateName = Object.keys(blockRules.AtfpBlockParseRules);

    let attribute = { ...attributes };
    let translatedBlock = block;
    let newBlock = '';

    if (blockTranslateName.includes(block.name)) {
        translatedBlock = filterTranslateAttr(block, blockRules['AtfpBlockParseRules'][block.name], service);

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
const cretaeChildBlock = (block, blockRules, service) => {
    let childBlock = block.innerBlocks.map(block => {
        if (block.name) {
            const childBlock = cretaeChildBlock(block, blockRules, service);
            return childBlock;
        }
    });

    const newBlock = createTranslatedBlock(block, childBlock, blockRules, service)

    return newBlock;
}

/**
 * Creates the main blocks based on the provided block, translate handler, and block rules.
 * If the block name exists, it creates the main block along with its child blocks and inserts it into the block editor.
 * 
 * @param {Object} block - The main block to create.
 * @param {Object} blockRules - The rules for translating blocks.
 */
const createBlocks = (block, service) => {
    const { select } = wp.data;
    const blockRules = select('block-atfp/translate').getBlockRules();

    const { dispatch } = wp.data;
    const { name: blockName } = block;
    // Create the main block
    if (blockName) {
        let childBlock = block.innerBlocks.map(block => {
            if (block.name) {
                return cretaeChildBlock(block, blockRules, service);
            }
        })
        const parentBlock = createTranslatedBlock(block, childBlock, blockRules, service);

        dispatch('core/block-editor').insertBlock(parentBlock);

    }
}

export default createBlocks;
