const { parse } = wp.blocks;
class blockDataReterive {
    constructor() {
        this.blockLists = [];
        this.customBlockTranslateData = {};
        this.customBlocksData = [];
        this.init();

        this.AtfpCoreAttrReplace = {
            "content_originalHTML": [
                "core/paragraph",
                "core/heading",
                "core/list-item",
                "core/preformatted",
                "core/table",
                "core/verse",
                "core/code"
            ],
            "citation_originalHTML": [
                "core/quote",
                "core/pullquote"
            ],
            "summary_originalHTML": [
                "core/details"
            ],
            "value_originalHTML": [
                "core/pullquote"
            ],
            "caption_originalHTML": [
                "core/table"
            ],
            "text_originalHTML": [
                "core/button"
            ]
        }

        this.AtfpCoreAttrReplaceBlocks = this.replaceAttrBlocks();
    }

    init = () => {
        this.fetchCustomBlocks();
    }

    replaceAttrBlocks = () => {
        let array = {};

        Object.keys(this.AtfpCoreAttrReplace).map((keys) => {
            this.AtfpCoreAttrReplace[keys].map((value) => {
                if (array.hasOwnProperty(value)) {
                    array[value].push(keys);
                } else {
                    array[value] = [keys];
                }
            });
        });

        return array;
    }

    getBlocks = (blocks) => {
        const innerBlocks = (block) => {
            const innerBlock = block.innerBlocks;
            if (innerBlock.length > 0) {
                innerBlock.forEach(innerBlock => {
                    this.customBlocksData.push(innerBlock);
                    innerBlocks(innerBlock);
                });
            }
        }

        const blockLists = blocks;

        blockLists.forEach(block => {
            innerBlocks(block);
        });


        this.customBlocksData = [...this.customBlocksData, ...blockLists];

        this.getBlockData();
    }

    fetchCustomBlocks = () => {
        /**
         * Prepare data to send in API request.
        */
        const apiSendData = {
            atfp_nonce: atfp_block_update_object.ajax_nonce,
            action: atfp_block_update_object.action_get_content
        };
        const apiUrl = atfp_block_update_object.ajax_url;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams(apiSendData)
        })
            .then(response => response.json())
            .then(data => {
                const customBlocks = parse(data.data.block_data);

                this.getBlocks(customBlocks);

                // Save new block translate data
                this.saveBlockData();
            })
            .catch(error => {
                console.error('Error fetching block rules:', error);
            });
    }

    saveBlockData=()=>{
        if(Object.keys(this.customBlockTranslateData).length < 1){
            return;
        }
        
         /**
         * Prepare data to send in API request & update latest translate block data.
        */
         const apiSendData = {
            atfp_nonce: atfp_block_update_object.ajax_nonce,
            action: atfp_block_update_object.action_update_content,
            save_block_data: JSON.stringify(this.customBlockTranslateData)
        };

        const apiUrl = atfp_block_update_object.ajax_url;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams(apiSendData)
        })
            .then(response => response.json())
            .then(data => {
                if(data.success && data.data.message){
                    console.log(data.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching block rules:', error);
            });
    }

    nestedAttrValue = (idsArr) => {
        const convertToArrays = (obj) => {
            // Check if obj is an object
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            // Process each key-value pair in the object
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // If the current value is an object and has the key 'atfp_array_key_replace'
                    if (typeof obj[key] === 'object' && obj[key] !== null && obj[key].hasOwnProperty('atfp_array_key_replace')) {
                        // Replace the value with 'true' directly in the array
                        obj[key] = Object.values(obj[key]);
                        obj[key] = convertToArrays(obj[key]);
                    } else {
                        // Recursively call convertToArrays for nested objects or arrays
                        obj[key] = convertToArrays(obj[key]);
                    }
                }
            }

            return obj;
        }

        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] instanceof Object && key in target) {
                    Object.assign(source[key], deepMerge(target[key], source[key]));
                }
            }
            Object.assign(target || {}, source);
            return target;
        };

        let currentElement = {};
        let tempObj = currentElement;
        let lastKey = idsArr[idsArr.length - 1];
        idsArr.slice(0, -1).forEach((key) => {
            tempObj[key] = tempObj[key] || {};
            tempObj = tempObj[key];
        });
        tempObj[lastKey] = true;

        const obj = convertToArrays(currentElement);
        deepMerge(this.customBlockTranslateData, obj);
    }

    filterAttr = (idsArray, value) => {
        if (null === value || undefined === value) {
            return;
        }

        if (Object.getPrototypeOf(value) === Array.prototype) {
            this.filterBlockArrayAttr(idsArray, value);
        } else if (Object.getPrototypeOf(value) === Object.prototype) {
            this.filterBlockObjectAttr(idsArray, value);
        } else if (![Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value)) && typeof value === 'object' && Object.keys(this.AtfpCoreAttrReplaceBlocks).includes(idsArray[0])) {
            const replaceAttrArr = this.AtfpCoreAttrReplaceBlocks[idsArray[0]];
            
            replaceAttrArr.map((key) => {
                const oringalAttr = key.split('_');
                
                if (idsArray[idsArray.length - 1] === oringalAttr[0] && value[oringalAttr[1]]) {
                    if (value[oringalAttr[1]] === 'Polylang translate content') {
                        idsArray.push(oringalAttr[1]);
                        this.nestedAttrValue(idsArray, value[oringalAttr[1]]);
                    }
                }
            })
        } else if (typeof value === 'string' && (value === 'Polylang Translate Content' || value.includes('Polylang Translate Content'))) {
            this.nestedAttrValue(idsArray, value);
        }

    }

    filterBlockArrayAttr = (idsArr, blockData) => {
        const newIdArr = new Array(...idsArr);
        newIdArr.push('atfp_array_key_replace');
        blockData.forEach((value, key) => {
            if ((typeof value === 'string' && value.includes('Polylang translate content')) || (![null, undefined].includes(value) && [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value)))) {
                this.filterAttr(newIdArr, value)
            };
        });
    }

    filterBlockObjectAttr = (idsArr, blockData) => {
        Object.keys(blockData).forEach(key => {
            const newIdArr = new Array(...idsArr);
            const value = blockData[key];
            if(value !== null && value !== undefined){
                if ( (typeof value === 'string' && value.includes('Polylang translate content')) || [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value))) {
                    newIdArr.push(key);
                    this.filterAttr(newIdArr, blockData[key]);
                };
            }
        })
    }

    filterBlockAttribute = (blockData) => {
        Object.keys(blockData).map(clientId => {
            const blockName = Object.keys(blockData[clientId])[0];
            const attributes = blockData[clientId][blockName];
            Object.keys(attributes).forEach(keytwo => {
                const value = attributes[keytwo];
                const idsArray = new Array(blockName, "attributes", keytwo);
                this.filterAttr(idsArray, value);
            });

        })
    }

    getBlockData = () => {
        if (typeof this.customBlocksData !== 'object' || Object.keys(this.customBlocksData).length === 0) {
            return;
        }

        const blockData = this.customBlocksData;
        const blockAttributes = {};
        Object.values(blockData).forEach(block => {
            if (Object.values(block.attributes).length > 0) {
                blockAttributes[block.clientId] = {};
                blockAttributes[block.clientId][block.name] = block.attributes;
            }
        });
        
        
        if (Object.values(blockAttributes).length > 0) {
            this.filterBlockAttribute(blockAttributes);
        }
    }
}



window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('post_type') && urlParams.has('from_post') && urlParams.has('new_lang')) {
        new blockDataReterive();
    }
});