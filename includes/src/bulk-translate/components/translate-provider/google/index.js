import ModalStringScroll from "../../string-modal-scroll";
import GoogleLanguage from "./google-language";
import { selectProgressStatus, selectTargetContent, selectTranslatePostInfo } from "../../../redux-store/features/selectors";
import { store } from "../../../redux-store/store";
import { updateProgressStatus, updateTranslatePostInfo, unsetPendingPost } from "../../../redux-store/features/actions";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Initializes Google Translate functionality on specific elements based on provided data.
 * @param {Object} data - The data containing source and target languages.
 */
class GoogleTranslater {
    constructor({ sourceLang = 'en', targetLangs = false, updateContent, totalPosts, storeDispatch, postId, prefix, updateDestoryHandler }) {
        this.sourceLang = sourceLang;
        this.targetLangs = targetLangs;
        this.updateContent = updateContent;
        this.totalPosts = totalPosts;
        this.storeDispatch = storeDispatch;
        this.postId = postId;
        this.prefix = prefix;
        this.stopTranslation = false;
        this.textContentObject = selectTargetContent(store.getState(), postId);
        this.totalPostsCount = Object.keys(selectTranslatePostInfo(store.getState())).length;
        this.appendStringTable();
        updateDestoryHandler(() => {
            this.destroy();
        });
    }

    destroy = () => {
        this.stopTranslation = true;
    }

    createGoogleTranslator = async (targetLang, index) => {
        this.completedTranslateIndex = 0;
        this.googleTranslator = null;

        if (this.stopTranslation) return;

        const languageObject = atfp_bulk_translate_object.languageObject;
        this.completedPostStatus = selectProgressStatus(store.getState());

        if (!GoogleLanguage().includes(this.filterLanguage(targetLang))) {
            this.storeDispatch(unsetPendingPost(this.postId + '_' + targetLang));
            this.storeDispatch(updateProgressStatus(100 / this.totalPostsCount));
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + targetLang]: { status: 'error', messageClass: 'error', errorMessage: sprintf(__('Language %s(%s) is not supported by Google Translate', 'automatic-translations-for-polylang'), languageObject[targetLang].name, targetLang), errorHtml: false } }));
        } else {
            this.activeTargetLang = targetLang;
            this.appendStringTable();
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + targetLang]: { status: 'running', messageClass: '' } }));
            this.startTime = new Date();
            const isTranslated = await this.translateContent();

            if (!this.stopTranslation) {
                this.storeDispatch(updateProgressStatus(100 / this.totalPostsCount));

                if (isTranslated) {
                    await this.updateContent(targetLang);

                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

        }

        this.startTime = null;

        if (index < this.targetLangs.length - 1 && !this.stopTranslation) {
            await this.createGoogleTranslator(this.targetLangs[index + 1], index + 1);
        }
    }

    appendTranslateWidget = async () => {

        this.googleTranslator = new google.translate.TranslateElement({
            pageLanguage: this.sourceLang,
            // multilanguagePage: true,
            autoDisplay: false,
        }, `${this.prefix}-google-translate-btn`);


        const element = document.querySelector(`#${this.prefix}-google-translate-btn`);

        if (element) {
            const translateElement = element.children;

            if (translateElement.length <= 0) {
                Object.values(google?.translate?.TranslateElement()).map(item => {
                    if (item instanceof HTMLElement && item.id === `${this.prefix}-google-translate-btn`) {
                        element.replaceWith(item);
                    }
                });
            }
        }
    }

    appendStringTable = () => {

        const tableContainer = jQuery(`#${this.prefix}-google-table-container`);
        const container = jQuery(`#${this.prefix}-container`);

        if (tableContainer && tableContainer.length > 0) {
            tableContainer.find(`#${this.prefix}-google-translate-strings-container`).remove();
            tableContainer.attr('data-render-id', this.postId);
            const stringHtml = `<div id="${this.prefix}-google-translate-strings-container">
            ${Object.keys(this.textContentObject).map(key => `<div class="${this.prefix}-google-table-row"><div class="${this.prefix}-google-table-cell" data-key="${key}">${this.textContentObject[key]}</div></div>`).join('')}</div>`;

            tableContainer.append(stringHtml);

        } else {
            const tableHtml = `<div id="${this.prefix}-google-table-container" class="translate" data-render-id="${this.postId}"><div id="${this.prefix}-google-translate-btn">Translate</div><div id="${this.prefix}-google-translate-strings-container">${Object.keys(this.textContentObject).map(key => `<div class="${this.prefix}-google-table-row"><div class="${this.prefix}-google-table-cell" data-key="${key}" lang="${this.sourceLang}">${this.textContentObject[key]}</div></div>`).join('')}</div></div>`

            container.append(tableHtml);
        }

        document.documentElement.setAttribute('translate', 'no');
        document.body.classList.add('notranslate');
    }

    translateContent = async () => {
        const languageSelector = document.querySelector(`#${this.prefix}-google-translate-btn .goog-te-combo`);
    
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        if (!languageSelector) return false;
    
        const langCode = this.filterLanguage(this.activeTargetLang);
        const languageExist = languageSelector.querySelector(`option[value="${langCode}"]`);
    
        if (!languageExist) {
            const languageObject = atfp_bulk_translate_object.languageObject;
    
            this.storeDispatch(updateTranslatePostInfo({
                [`${this.postId}_${this.activeTargetLang}`]: {
                    status: 'error',
                    messageClass: 'error',
                    errorMessage: sprintf(__('Language %s(%s) is not supported by Google Translate', 'automatic-translations-for-polylang'), languageObject[this.activeTargetLang]?.name, this.activeTargetLang),
                    errorHtml: false
                }
            }));
            return false;
        }
    
        document.body.classList.add(`${this.prefix}-google-translate`);
        languageSelector.value = langCode;

        languageSelector.dispatchEvent(new Event('change'));
    
        if (this.stopTranslation) return false;
    
        const container = document.querySelector(`#${this.prefix}-google-translate-strings-container`);
        if (!container) return false;

        let status=false;
        let mutationRun=false;
    
        // Wait for translated element using a promise
        await new Promise((resolve, reject) => {
            const mutationObserver = new MutationObserver(async (mutations, obs) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const nodes = Array.from(mutation.addedNodes);
                        for (const node of nodes) {
                            if (node.nodeType === 1 && node.tagName === 'FONT') {
                                const fontStyle = node.getAttribute('style');
                                if (!fontStyle) continue;
                                mutationRun=true;
                                mutationObserver.disconnect();
    
                                try {
                                    status = await this.startTranslate();
                                    resolve();
                                } catch (err) {
                                    console.error("Translation error:", err);
                                    reject(err);
                                }
    
                                return;
                            }
                        }
                    }
                }
            });

            setTimeout(async () => {
                mutationObserver.disconnect();
                if(!mutationRun){
                    status = await this.startTranslate();
                    resolve();
                }
            }, 6000);
    
            mutationObserver.observe(container, {
                childList: true,
                subtree: true
            });
        });
    
        return status;
    }    

    startTranslate = async () => {
        await ModalStringScroll({ provider: 'google', prefix: this.prefix, postId: this.postId, lang: this.activeTargetLang, storeDispatch: this.storeDispatch, totalPosts: this.totalPostsCount, completedPostStatus: this.completedPostStatus });

        const endTime = new Date();
        const duration = endTime - this.startTime;
        const previousDuration = selectTranslatePostInfo(store.getState())?.[this.postId + '_' + this.activeTargetLang]?.duration || 0;

        this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + this.activeTargetLang]: { duration: previousDuration + duration } }));

        return true;
    }

    filterLanguage = (lang) => {
        if (lang === 'zh') {
            return atfp_bulk_translate_object.languageObject['zh']?.locale.replace('_', '-');
        }

        return lang;
    }

    // Function to initialize translation if conditions are met
    async initTranslation() {
        if (this.textContentObject && Object.keys(this.textContentObject).length > 0 && this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            this.appendTranslateWidget();
            await this.createGoogleTranslator(this.targetLangs[0], 0);
        } else if (this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            this.targetLangs.forEach(lang => {
                this.storeDispatch(unsetPendingPost(this.postId + '_' + lang));
                this.storeDispatch(updateProgressStatus(100 / this.totalPostsCount));
                this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + lang]: { status: 'error', messageClass: 'error', errorMessage: __('No content to translate', 'automatic-translations-for-polylang'), errorHtml: false } }));
            });
        }
    }
}

export default GoogleTranslater;
