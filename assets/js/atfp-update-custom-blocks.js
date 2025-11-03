const { parse } = wp.blocks;
const { select, subscribe } = wp.data;

class blockDataReterive {
    constructor() {
        if(document.querySelector('.atfp-overlay')) {
            return;
        }
        
        this.blockLists = [];
        this.customBlockTranslateData = {};
        this.customBlocksData = [];
        this.loaderContainer = null;
        this.init();
    }

    init = () => {
        this.fetchCustomBlocks();

        // Create full-page overlay and append to <body>
        this.loaderContainer = document.createElement('div');
        this.loaderContainer.className = 'atfp-overlay';
        this.loaderContainer.setAttribute('role', 'status');
        this.loaderContainer.setAttribute('aria-live', 'polite');
        this.loaderContainer.innerHTML = this.getOverlayTemplate(); // see section 2
        document.body.appendChild(this.loaderContainer);
        document.body.classList.add('atfp-overlay-open');
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
                if (data.message === 'No custom blocks found.') {
                    this.loaderContainer && this.loaderContainer.remove();
                    return;
                }
                
                const customBlocks = parse(data.data.block_data);

                this.getBlocks(customBlocks);

                // Save new block translate data
                this.saveBlockData();
            })
            .catch(error => {
                this.loaderContainer && this.loaderContainer.remove();
                console.error('Error fetching block rules:', error);
            });
    }

    saveBlockData = () => {
        if (Object.keys(this.customBlockTranslateData).length < 1) {
            this.loaderContainer && this.loaderContainer.remove();
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
                this.setOverlayState('success');
                this.teardownOverlay();
                if (data.success && data.data.message) {
                    console.log(data.data.message);
                }
            })
            .catch(error => {
                this.setOverlayState('error');
                this.teardownOverlay();
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
        } else if (typeof value === 'string' && /Make This Content Available for Translation/i.test(value)) {
            this.nestedAttrValue(idsArray, value);
        } else if (value instanceof wp.richText.RichTextData && /Make This Content Available for Translation/i.test(value.originalHTML)) {
            this.nestedAttrValue(idsArray, value.originalHTML);
        }
    }

    filterBlockArrayAttr = (idsArr, blockData) => {
        const newIdArr = new Array(...idsArr);
        newIdArr.push('atfp_array_key_replace');
        blockData.forEach((value, key) => {
            if ((typeof value === 'string' && /Make This Content Available for Translation/i.test(value)) || (![null, undefined].includes(value) && [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value)))) {
                this.filterAttr(newIdArr, value)
            };
        });
    }

    filterBlockObjectAttr = (idsArr, blockData) => {
        Object.keys(blockData).forEach(key => {
            const newIdArr = new Array(...idsArr);
            const value = blockData[key];
            if (value !== null && value !== undefined) {
                if ((typeof value === 'string' && /Make This Content Available for Translation/i.test(value)) || [Array.prototype, Object.prototype].includes(Object.getPrototypeOf(value))) {
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

    setOverlayState = (state /* 'loading' | 'success' | 'error' */) => {
        if (!this.loaderContainer) return;
        const panel = this.loaderContainer.querySelector('.atfp-overlay .atfp-box');
        if (panel) panel.setAttribute('data-state', state);
    };
    
    teardownOverlay = (delayMs = 3000) => {
        if (!this.loaderContainer) return;
        setTimeout(() => {
            this.loaderContainer.classList.add('atfp-overlay--closing');
            setTimeout(() => {
                this.loaderContainer.remove();
                this.loaderContainer = null;
                document.body.classList.remove('atfp-overlay-open');
            }, 300);
        }, delayMs);
    };

    getOverlayTemplate = () => {
        return `
    <div class="atfp-overlay" role="status" aria-live="polite">
    <div class="atfp-backdrop"></div>
    <div class="atfp-box" data-state="loading">
      <div class="atfp-row">
        <span class="atfp-spinner" aria-hidden="true"></span>
        <span class="atfp-icon atfp-icon--ok" aria-hidden="true">✓</span>
        <span class="atfp-icon atfp-icon--err" aria-hidden="true">!</span>

        <div class="atfp-text">
          <div class="atfp-title" data-label="loading">Saving block content</div>
          <div class="atfp-title" data-label="success">Supported block content has been updated</div>
          <div class="atfp-title" data-label="error">Update failed</div>

          <div class="atfp-desc" data-label="loading">
            Please don’t close or refresh this window until the update is complete.
          </div>
          <div class="atfp-desc" data-label="success">
            Supported block content has been updated. You may continue.
          </div>
          <div class="atfp-desc" data-label="error">
            Something went wrong. You can retry without closing this window.
          </div>
        </div>
      </div>

      <div class="atfp-bar"><span></span></div>
    </div>
  </div>
    `;
    }

}

const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

let isBlockContentUpdating = false;
const saveBlockContent = debounce(() => {
    new blockDataReterive();
    isBlockContentUpdating = false;
}, 500);

if (select && select('core/editor') && subscribe) {
    subscribe(() => {
        const {
            isCurrentPostPublished,
            isSavingPost,
            isPublishingPost,
            isAutosavingPost,
        } = select('core/editor');

        const isAutoSaving = isAutosavingPost();
        const isPublishing = isPublishingPost();
        const isSaving = isSavingPost();
        const postPublished = isCurrentPostPublished();

        if ((isPublishing || (postPublished && isSaving)) && !isAutoSaving && !isBlockContentUpdating) {
            isBlockContentUpdating = true;
            saveBlockContent();
        }

    })
}