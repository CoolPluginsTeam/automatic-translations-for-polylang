const { select } = wp.data;
class blockDataReterive {
    constructor() {
        this.init();
        this.blockLists = [];
        this.blockTrasnaltedData = {};
    }

    init = () => {
        jQuery('#atfp_reterive_block_translate_attr').on('click', () => {
            this.getBlocks();
            this.fetchBlockRules();
        })
    }

    getBlocks = () => {
        const innerBlocks = (block) => {
            const innerBlock = block.innerBlocks;
            if (innerBlock.length > 0) {
                innerBlock.forEach(innerBlock => {
                    this.blockLists.push(innerBlock);
                    innerBlocks(innerBlock);
                });
            }
        }

        const blockLists = select("core/block-editor").getBlocks();

        blockLists.forEach(block => {
            innerBlocks(block);
        });

        this.blockLists = [...this.blockLists, ...blockLists];
    }

    fetchBlockRules = () => {
        /**
         * Prepare data to send in API request.
        */
       const apiSendData = {
           atfp_nonce: atfp_temp_ajax_object.ajax_nonce,
           action: atfp_temp_ajax_object.action_block_rules
       };
        const apiUrl = atfp_temp_ajax_object.ajax_url;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams(apiSendData)
        })
            .then(response => response.json())
            .then(data => {
                const blockRules = JSON.parse(data.data.blockRules);
                this.blockTrasnaltedData = { ...this.blockTrasnaltedData, ...blockRules.AtfpBlockParseRules };
                this.reteriveData();
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

        deepMerge(this.blockTrasnaltedData, obj);
    }

    filterAttr = (idsArray, value) => {
        if (null === value || undefined === value) {
            return;
        }
        if (Object.getPrototypeOf(value) === Array.prototype) {
            this.filterBlockArrayAttr(idsArray, value);
        }

        if (Object.getPrototypeOf(value) === Object.prototype) {
            this.filterBlockObjectAttr(idsArray, value);
        }

        if (typeof value === 'string' && value.includes('Atfp Translation translate content here')) {
            this.nestedAttrValue(idsArray, value);
        }

    }

    filterBlockArrayAttr = (idsArr, blockData) => {
        const newIdArr = new Array(...idsArr);
        newIdArr.push('atfp_array_key_replace');
        blockData.forEach((value, key) => {
            if ((typeof value === 'string' && value.includes('Atfp Translation translate content here')) || (![null, undefined].includes(value) && [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value)))) {
                this.filterAttr(newIdArr, value)
            };
        });
    }

    filterBlockObjectAttr = (idsArr, blockData) => {
        Object.keys(blockData).forEach(key => {
            const newIdArr = new Array(...idsArr);
            const value = blockData[key];
            if ((typeof value === 'string' && value.includes('Atfp Translation translate content here')) || [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value))) {
                newIdArr.push(key);
                this.filterAttr(newIdArr, blockData[key]);
            };
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
        const blockData = this.blockLists;
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

    reteriveData = () => {
        this.getBlockData();
        this.popUpModal();
    }

    popUpModal = () => {
        const modalWrp = document.createElement('section');
        modalWrp.style.position = "absolute";
        modalWrp.style.left = "0px";
        modalWrp.style.top = "0px";
        modalWrp.style.width = '100%';
        modalWrp.style.height = '100%';
        modalWrp.style.backgroundColor = '#000000c7';

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #000';
        modal.style.zIndex = '9999';
        modal.style.maxHeight = '80%';
        modal.style.maxWidth = '60%';
        modal.style.overflow = 'auto';
        modal.style.padding = '1rem';

        const jsonData = JSON.stringify(this.blockTrasnaltedData);
        const jsonContent = document.createElement('pre');
        jsonContent.style.textWrap = "wrap";
        jsonContent.textContent = jsonData;
        modal.appendChild(jsonContent);

        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select';
        selectBtn.addEventListener('click', () => {
            const range = document.createRange();
            range.selectNode(jsonContent);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        });
        modal.insertBefore(selectBtn, jsonContent);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(jsonData);
            } else {
                console.error('Clipboard API not supported');
            }
        });
        modal.insertBefore(copyBtn, jsonContent);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
            modalWrp.remove();
        });
        modal.insertBefore(closeBtn, jsonContent);

        modalWrp.appendChild(modal);

        document.body.appendChild(modalWrp);
    }
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('post') && urlParams.has('action')) {
        const postEditorPanel = jQuery('.edit-post-header__settings');
        postEditorPanel.prepend('<button id="atfp_reterive_block_translate_attr" class="components-button is-primary">Atfp</button>')
        new blockDataReterive();
    }
});