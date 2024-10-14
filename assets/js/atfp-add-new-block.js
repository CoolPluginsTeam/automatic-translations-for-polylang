'use strict';

(() => {
    const { createBlock } = wp.blocks;
    const { dispatch, select } = wp.data;

    class atfpCreateNewBlock {
        constructor(newBlock) {
            this.newBlock = newBlock;
            this.init();
        }
        init = () => {
            this.creteNewBlock();
        }

        creteNewBlock = () => {
            const newBlock = createBlock(this.newBlock);
            this.updateBlockData(newBlock);
        }

        updateBlockData = async (Block) => {
            await dispatch('core/block-editor').insertBlocks([Block]);
            const loader = this.skeletonLoader();

            setTimeout(()=>{
                const blockWrp=document.getElementById(`block-${Block.clientId}`);
                blockWrp.appendChild(loader);
            },100);

            setTimeout(() => {
                this.updateBlockContent(Block, loader);
            }, 400);

            setTimeout(()=>{
                if(loader){
                    loader.remove();
                }
            },4000);
        }

        updateBlockContent = (Block, loader) => {
            const newBlock = document.getElementById(`block-${Block.clientId}`);

            if (newBlock) {
                this.updateContent(newBlock, loader);
            }
            return;
        }

        updateContent =async (ele, loader) => {
            const element = ele;
            let i=1;
            if (element) {
                if (element.contentEditable == 'true' && element.children.length < 2) {
                    element.innerHTML = 'Polylang Translate Content';
                    loader.remove();
                } else {
                    const innerElements = element.getElementsByTagName('*');
                  
                    for (let innerElement of innerElements) {
                        if(i=== innerElements.length){
                            setTimeout(()=>{
                                loader.remove();
                            },3000);
                        }

                        i++;
                        if (["SCRIPT", "STYLE", "META", "LINK", "TITLE", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT", "STYLE", "SCRIPT", "NOSCRIPT"].includes(innerElement.tagName)) {
                            continue;
                        }

                        if (innerElement.childNodes.length > 0) {
                            innerElement.childNodes.forEach((child)  => {
                                if (child.nodeType === Node.TEXT_NODE) {
                                    this.updateBlock(innerElement, child);
                                }
                            });
                        }
                    }
                }
            }
        }

        updateBlock = (innerElement, child) => {
            let blockId=false;
            if(innerElement.classList.contains('wp-block')){
                blockId=innerElement.dataset.block;
            }else{
                const parentBlock=innerElement.closest('.wp-block');
                if(parentBlock){
                    blockId=parentBlock.dataset.block;
                }
            }

            const blockAttributes = select('core/block-editor').getBlockAttributes(blockId);
            let updatedAttrs = JSON.parse(JSON.stringify(blockAttributes));
            let index=0;

            const checkValidAttributes = (value = false,blockId) => {
                const blockData = document.querySelector(`#block-${blockId}`).innerHTML;

                const regex = new RegExp(value); // Create regex from the value parameter

                return regex.test(blockData); // Return the result of the regex test directly
            }

            const updateNestedAttributes = async (attributes, child) => {
                const updateAttributes = async (key) => {
                    index++;

                    if (typeof attributes[key] === 'string' && (attributes[key].trim() === child.textContent.trim() || attributes[key] === child.textContent.trim())) {
                        const originalValue = attributes[key];
                        const updatedValue = 'Polylang Translate Content here ' + index;
                        attributes[key] = updatedValue;

                        await dispatch('core/block-editor').updateBlockAttributes(blockId, attributes).then(e=>{
                            setTimeout( async ()=>{
                                const valid = checkValidAttributes(updatedValue,blockId);
                                if (!valid) {
                                    attributes[key] = originalValue;
                                    await dispatch('core/block-editor').updateBlockAttributes(blockId, attributes);
                                } else {
                                    attributes[key] = 'Polylang Translate Content';
                                    await dispatch('core/block-editor').updateBlockAttributes(blockId, attributes);
                                }
                            },2000);
                        });
                      
                    }
                };

                for (const key of Object.keys(attributes)) {
                    await updateAttributes(key);

                    if (typeof attributes[key] === 'object' && attributes[key] !== null) {
                        await updateNestedAttributes(attributes[key], child); // Recursively update nested objects
                    }
                }
            };

            updateNestedAttributes(updatedAttrs, child);
            return;
        }

        skeletonLoader = () => {
            const loader = document.createElement('div');

            const loaderContainer=()=>{
                const container = '<style>.atfp-loader-wrapper{position:absolute;width:100%;height:100%;top:0;left:0;z-index:99999;}.atfp-loader-container{width:100%;height:100%;}.atfp-loader-skeleton{--skbg:hsl(227deg, 13%, 50%, 0.2);display:grid;gap:20px;width:100%;height:100%;background:#ffffff;padding:15px;border-radius:8px;box-shadow:0 4px 12px rgba(0, 0, 0, 0.1);transition:transform 0.3s ease;transform:scale(1.02);}.atfp-loader-shimmer{display:flex;aspect-ratio:2/1;width:100%;height:100%;background:var(--skbg);border-radius:4px;overflow:hidden;position:relative;}.atfp-loader-shimmer::before{content:"";position:absolute;width:100%;height:100%;background-image:linear-gradient(-90deg,transparent 8%,rgba(255,255,255,0.28) 18%,transparent 33%);background-size:200%;animation:shimerAnimate 1.5s ease-in-out infinite;}@keyframes shimerAnimate{0%{background-position:100% 0;}100%{background-position:-100% 0;}}</style>'

                return '<div class="atfp-loader-container">'+container+'<div class="atfp-loader-skeleton"><span class="atfp-loader-shimmer"></span></div></div>';
            }

            loader.className = 'atfp-loader-wrapper'; // Add the atfp class to the loader
            loader.innerHTML = loaderContainer();

            return loader;
        }
    }

    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        let newBlock = '';

        if (urlParams.has('atfp_new_block') && '' !== urlParams.get('atfp_new_block').trim()) {
            newBlock = urlParams.get('atfp_new_block');
            new atfpCreateNewBlock(newBlock);
        }
    });
})();
