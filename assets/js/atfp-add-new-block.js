'use strict';

(() => {
    const { createBlock } = wp.blocks;
    const { dispatch, select } = wp.data;

    class atfpCreateNewBlock {
        constructor() {
            this.updateBlockStore = {};
            this.loaderRemove = null;
            this.loader = null;
            this.replaceAttributes = null;
            this.updateBlockId = new Array();
        }

        copyTranslateText = () => {
            // Get the current selection object
            const selection = window.getSelection();
            // Create a new range object
            const range = document.createRange();
            // Select the contents of the copy text element
            range.selectNodeContents(document.getElementById('atfp-copy-text'));
            // Remove any existing selections
            selection.removeAllRanges();
            // Add the new range to the selection
            selection.addRange(range);
            // Execute the copy command
            document.execCommand('copy');
            // Clear the selection
            selection.removeAllRanges();
        }

        noticeInitialize = () => {
            dispatch("core/notices").createNotice('info', 'To enable translation, please include the Make This Content Available for Translation text in your block content. For help, watch the video and click <b>"Copy Text"</b> to use. Then, paste it into the section of your block you want automatically translated', 
                {
                    isDismissible : false,
                    id: 'atfp-notice-id',
                    actions: [
                    {
                        label: 'Watch Video.',
                        url: `${atfpAddBlockVars.atfp_demo_page_url}#custom-block-translate`,
                    },
                ],
                __unstableHTML: true
            }).then(()=>{
                const targetAnchor=document.querySelector(`a[href^="${atfpAddBlockVars.atfp_demo_page_url}#custom-block-translate"]`);

                if(targetAnchor){
                    targetAnchor.addEventListener('click', (e)=>{
                        e.preventDefault();
                        window.open(targetAnchor.href, '_blank');
                    })
                }
            });
        }

        copyBtnInitialize = () => { // Initialize the copy button
            const copyBtn = document.createElement('div'); // Create a new div element for the copy button
            copyBtn.id = 'atfp-copy-btn'; // Set the ID of the copy button
            copyBtn.innerHTML = 'Copy Text'; // Set the inner HTML of the copy button
            copyBtn.addEventListener('click', this.copyTranslateText); // Add click event listener to copy text
            copyBtn.ariaLabel = 'Copy Text'; // Set the aria-label for accessibility
            copyBtn.title = 'Click to copy the text "Make This Content Available for Translation"'; // Tooltip message

            const copyText = document.createElement('div'); // Create a new div element for the copy text
            copyText.id = 'atfp-copy-text'; // Set the ID of the copy text div
            copyText.innerHTML = 'Make This Content Available for Translation'; // Set the inner HTML of the copy text div

            document.body.appendChild(copyBtn); // Append the copy button to the document body
            document.body.appendChild(copyText); // Append the copy text to the document body
        }

        addBlockInitialize = (newBlock) => {
            this.newBlock = newBlock;
            this.creteNewBlock();
            this.skeletonLoader();
        }

        removeLoader = () => {
            clearTimeout(this.loaderRemove);

            this.loaderRemove = setTimeout(() => {
                if (this.loader) {
                    this.loader.remove();
                }
            }, 2000);

        }

        creteNewBlock = () => {
            const newBlock = createBlock(this.newBlock);
            this.updateBlockData(newBlock);
        }

        updateBlockData = async (Block) => {
            await dispatch('core/block-editor').insertBlocks([Block]);

            setTimeout(() => {
                const blockWrp = document.getElementById(`block-${Block.clientId}`);
                if (blockWrp) {
                    blockWrp.appendChild(this.loader);
                }
            }, 100);

            setTimeout(() => {
                this.updateBlockContent(Block);
            }, 400);
        }

        updateBlockContent = (Block) => {
            const newBlock = document.getElementById(`block-${Block.clientId}`);

            if (newBlock) {
                this.updateContent(newBlock);
            }
            return;
        }

        updateContent = async (ele) => {
            const element = ele;
            let i = 1;
            this.removeLoader();

            if (element) {
                if (element.contentEditable == 'true' && element.children.length < 2) {
                    element.innerHTML = 'Make This Content Available for Translation';
                } else {
                    const innerElements = element.getElementsByTagName('*');

                    for (let innerElement of innerElements) {
                        if (i === innerElements.length) {
                            this.removeLoader();
                            setTimeout(() => {
                                this.updateBlockFromStore();
                            }, 500);
                        }

                        i++;
                        if (["SCRIPT", "STYLE", "META", "LINK", "TITLE", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT"].includes(innerElement.tagName)) {
                            continue;
                        }

                        if (innerElement.childNodes.length > 0) {
                            innerElement.childNodes.forEach((child) => {
                                if (child.nodeType === Node.TEXT_NODE) {
                                    this.updateBlockAttr(innerElement, child);
                                }
                            });
                        }
                    }
                }
            }
        }

        updateBlockAttr = (innerElement, child) => {
            let blockId = false;
            if (innerElement.classList.contains('wp-block')) {
                blockId = innerElement.dataset.block;
            } else {
                const parentBlock = innerElement.closest('.wp-block');
                if (parentBlock) {
                    blockId = parentBlock.dataset.block;
                }
            }

            const blockAttributes = select('core/block-editor').getBlockAttributes(blockId);

            let index = 0;

            if (!this.updateBlockStore[blockId]) {
                let attributes = JSON.parse(JSON.stringify(blockAttributes));
                this.updateBlockStore[blockId] = { attributes: attributes };
                this.updateBlockStore[blockId].updateBlockData = {};
            }

            const updateNestedAttributes = async (attributes, child) => {
                const updateAttributes = async (key) => {
                    index++;

                    if (typeof attributes[key] === 'string' && attributes[key].trim() !== '' && (attributes[key].trim() === child.textContent.trim() || attributes[key] === child.textContent.trim())) {
                        const originalValue = attributes[key];
                        const newValue = 'Make This Content Available for Translation ' + index;
                        this.updateBlockStore[blockId].updateBlockData[newValue.replace(/\s+/g, '-')] = originalValue;
                        attributes[key] = newValue;
                    }
                };

                if (typeof attributes === 'object' && attributes !== null) {
                    for (const key of Object.keys(attributes)) {
                        await updateAttributes(key);

                        if (typeof attributes[key] === 'object' && attributes[key] !== null) {
                            await updateNestedAttributes(attributes[key], child); // Recursively update nested objects
                        }
                    }
                }
            };

            const blockStoreAttributes = this.updateBlockStore[blockId].attributes;
            updateNestedAttributes(blockStoreAttributes, child);
        }

        updateBlockFromStore = () => {
            const blockStoreAttributes = this.updateBlockStore;

            Object.keys(blockStoreAttributes).forEach((blockId) => {
                const blockAttributes = blockStoreAttributes[blockId].attributes;
                this.removeLoader();
                dispatch('core/block-editor').updateBlockAttributes(blockId, blockAttributes).then(() => {
                    clearTimeout(this.replaceAttributes);
                    this.replaceAttributes = setTimeout(() => {
                        this.removeLoader();
                        const blockIds = Object.keys(this.updateBlockStore);
                        this.replaceBlockContent(blockIds[0]);
                    }, 500);
                });
            });
        }

        replaceBlockContent = (blockId) => {
            const blockStoreAttributes = this.updateBlockStore;
            const currentBlock=document.querySelector(`#block-${blockId}`)

            // if(currentBlock && currentBlock.classList.contains('has-warning')){
            //     const warningWrapper=currentBlock.querySelector('.block-editor-warning')

            //     if (warningWrapper) {
            //         const blockCrash = Array.from(warningWrapper.classList).filter(item => item.endsWith('block-crash-warning'));
                    
            //         if (blockCrash.length > 0) {
            //             dispatch('core/block-editor').removeBlock(blockId);
            //             createBlock(this.newBlock);

            //             return;
            //         }
            //     }
            // }

            const checkValidAttributes = (value = false, blockId) => {
                const blockElement = document.querySelector(`#block-${blockId}`);
                const regex = new RegExp(value, 'g'); // Create regex from the value parameter with global flag
                const matchFound = regex.test(blockElement.innerText); // Check if the regex matches
                return matchFound; // Return the result of the regex test directly
            };

            const blockAttributes = blockStoreAttributes[blockId].attributes;

            const upateNestedAttributes = async (attributes) => {
                const updateAttributes = async (key) => {

                    if (typeof attributes[key] === 'string' && attributes[key].includes('Make This Content Available for Translation')) {
                        try {
                            const keyWithDashes = attributes[key].replace(/\s+/g, '-');
                            const originalValue = this.updateBlockStore[blockId].updateBlockData[keyWithDashes];

                            const status = checkValidAttributes(attributes[key], blockId);

                            if (!status) {
                                attributes[key] = originalValue;
                            } else {
                                attributes[key] = 'Make This Content Available for Translation';
                            }
                        } catch (e) {
                            console.log(`${attributes[key]} is not valid JSON.`);
                        }
                    }
                };

                if (typeof attributes === 'object' && attributes !== null) {
                    for (const key of Object.keys(attributes)) {
                        await updateAttributes(key);

                        if (typeof attributes[key] === 'object' && attributes[key] !== null) {
                            await upateNestedAttributes(attributes[key]); // Recursively update nested objects
                        }
                    }
                }
            }

            upateNestedAttributes(blockAttributes);

            setTimeout(() => {
                dispatch('core/block-editor').updateBlockAttributes(blockId, blockAttributes).then(() => {
                    const blockIds = Object.keys(this.updateBlockStore);
                    if (blockIds.length > 0) {
                        this.updateBlockId.push(blockId);
                        dispatch('core/block-editor').selectBlock(null);
                        this.removeLoader();
                        const firstBlockId = blockIds.find(id => !this.updateBlockId.includes(id));
                        if (firstBlockId) {
                            this.replaceBlockContent(firstBlockId);
                        }
                    }
                });
            }, 500);
        }

        skeletonLoader = () => {
            const loader = document.createElement('div');

            const loaderContainer = () => {
                const container = '<style>.atfp-loader-wrapper{position:absolute;width:100%;height:100%;top:0;left:0;z-index:99999;}.atfp-loader-container{width:100%;height:100%;}.atfp-loader-skeleton{--skbg:hsl(227deg, 13%, 50%, 0.2);display:grid;gap:20px;width:100%;height:100%;background:#ffffff;padding:15px;border-radius:8px;box-shadow:0 4px 12px rgba(0, 0, 0, 0.1);transition:transform 0.3s ease;transform:scale(1.02);}.atfp-loader-shimmer{display:flex;aspect-ratio:2/1;width:100%;height:100%;background:var(--skbg);border-radius:4px;overflow:hidden;position:relative;}.atfp-loader-shimmer::before{content:"";position:absolute;width:100%;height:100%;background-image:linear-gradient(-90deg,transparent 8%,rgba(255,255,255,0.28) 18%,transparent 33%);background-size:200%;animation:shimerAnimate 1.5s ease-in-out infinite;}@keyframes shimerAnimate{0%{background-position:100% 0;}100%{background-position:-100% 0;}}</style>'

                return '<div class="atfp-loader-container">' + container + '<div class="atfp-loader-skeleton"><span class="atfp-loader-shimmer"></span></div></div>';
            }

            loader.className = 'atfp-loader-wrapper'; // Add the atfp class to the loader
            loader.innerHTML = loaderContainer();

            this.loader = loader;
        }
    }


    window.addEventListener('load', () => {
        const atfpCreateBlockObj = new atfpCreateNewBlock();

        atfpCreateBlockObj.copyBtnInitialize();
        atfpCreateBlockObj.noticeInitialize();

        const urlParams = new URLSearchParams(window.location.search);
        let newBlock = '';

        if (urlParams.has('atfp_new_block') && '' !== urlParams.get('atfp_new_block').trim()) {
            newBlock = urlParams.get('atfp_new_block');
            atfpCreateBlockObj.addBlockInitialize(newBlock);
        }
    });
})();
