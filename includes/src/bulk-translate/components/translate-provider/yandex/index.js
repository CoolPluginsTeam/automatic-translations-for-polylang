import ModalStringScroll from "../../string-modal-scroll";
import YandexLanguage from "./yandex-language";
import { selectProgressStatus, selectTargetContent, selectTranslatePostInfo } from "../../../redux-store/features/selectors";
import { store } from "../../../redux-store/store";
import { updateProgressStatus, updateTranslatePostInfo, unsetPendingPost } from "../../../redux-store/features/actions";
import { __, sprintf } from "@wordpress/i18n";

class YandexTranslater {
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

    isLanguageSupported = (lang) => {
        const languages = YandexLanguage();
        return languages.includes(lang) || languages.includes(lang.replace('_', '-'));
    }

    getYandexLangCode = (lang) => {
        if (!lang) {
            return lang;
        }

        const languages = YandexLanguage();
        const hyphen = lang.replace('_', '-');

        if (languages.includes(hyphen)) {
            return hyphen;
        }

        const short = hyphen.split('-')[0];
        if (languages.includes(short)) {
            return short;
        }

        return hyphen;
    }

    createYandexTranslator = async (targetLang, index) => {
        if (this.stopTranslation) return;

        const languageObject = atfp_bulk_translate_object.languageObject;
        this.completedPostStatus = selectProgressStatus(store.getState());

        if (!this.isLanguageSupported(targetLang)) {
            this.storeDispatch(unsetPendingPost(this.postId + '_' + targetLang));
            this.storeDispatch(updateProgressStatus(100 / this.totalPostsCount));
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + targetLang]: { status: 'error', messageClass: 'error', errorMessage: sprintf(__('Language %s(%s) is not supported by Yandex Translate', 'automatic-translations-for-polylang'), languageObject[targetLang]?.name, targetLang), errorHtml: false } }));
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
            await this.createYandexTranslator(this.targetLangs[index + 1], index + 1);
        }
    }

    loadYandexScript = () => {
        return new Promise((resolve, reject) => {
            if (window.yt && window.yt.PageTranslator) {
                resolve();
                return;
            }

            const existingScript = document.querySelector('script[data-atfp-yandex-widget="true"]');
            if (existingScript) {
                if (existingScript.getAttribute('data-loaded') === 'true') {
                    resolve();
                    return;
                }
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', reject);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://yastatic.net/s3/translate/v21.4.7/js/tr_page.js';
            script.setAttribute('data-atfp-yandex-widget', 'true');
            script.addEventListener('load', () => {
                script.setAttribute('data-loaded', 'true');
                resolve();
            });
            script.addEventListener('error', reject);

            const wrapper = document.getElementById(`${this.prefix}-yandex-translate-widget`);
            (wrapper || document.body).appendChild(script);
        });
    }

    appendStringTable = () => {
        const container = document.getElementById(`${this.prefix}-container`);
        let tableContainer = document.getElementById(`${this.prefix}-yandex-table-container`);

        const rows = Object.keys(this.textContentObject).map((key) =>
            `<div class="${this.prefix}-yandex-table-row"><div class="${this.prefix}-yandex-table-cell translate" data-key="${key}" lang="${this.sourceLang}" translate="yes">${this.textContentObject[key]}</div></div>`
        ).join('');

        document.documentElement.setAttribute('translate', 'no');
        document.body.classList.add('notranslate');

        if (tableContainer) {
            const stringsContainer = document.getElementById(`${this.prefix}-yandex-translate-strings-container`);
            if (stringsContainer) {
                stringsContainer.remove();
            }
            tableContainer.setAttribute('data-render-id', this.postId);
            tableContainer.setAttribute('translate', 'yes');
            tableContainer.classList.add('translate');
            tableContainer.insertAdjacentHTML('beforeend', `<div id="${this.prefix}-yandex-translate-strings-container" class="translate" translate="yes">${rows}</div>`);
        } else if (container) {
            container.insertAdjacentHTML('beforeend', `<div id="${this.prefix}-yandex-table-container" class="translate" translate="yes" data-render-id="${this.postId}"><div id="${this.prefix}-yandex-translate-widget"></div><div id="${this.prefix}-yandex-translate-strings-container" class="translate" translate="yes">${rows}</div></div>`);
        }
    }

    translateContent = async () => {
        try {
            await this.loadYandexScript();
        } catch (error) {
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + this.activeTargetLang]: { status: 'error', messageClass: 'error', errorMessage: __('Yandex translator script did not initialize. Please check network/CSP blocking yastatic.net.', 'automatic-translations-for-polylang'), errorHtml: false } }));
            return false;
        }

        const namespace = window.yt = window.yt || {};
        if (!namespace.PageTranslator) {
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + this.activeTargetLang]: { status: 'error', messageClass: 'error', errorMessage: __('Yandex translator script did not initialize. Please check network/CSP blocking yastatic.net.', 'automatic-translations-for-polylang'), errorHtml: false } }));
            return false;
        }

        const translator = new namespace.PageTranslator({
            srv: 'tr-url-widget',
            url: 'https://translate.yandex.net/api/v1/tr.json/translate',
            autoSync: false,
            maxPortionLength: 600
        });

        try {
            translator.translate(this.getYandexLangCode(this.sourceLang), this.getYandexLangCode(this.activeTargetLang));
        } catch (error) {
            this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + this.activeTargetLang]: { status: 'error', messageClass: 'error', errorMessage: __('Yandex translation failed. Please retry or check network blocking.', 'automatic-translations-for-polylang'), errorHtml: false } }));
            return false;
        }

        if (this.stopTranslation) return false;

        await ModalStringScroll({
            provider: 'yandex',
            prefix: this.prefix,
            postId: this.postId,
            lang: this.activeTargetLang,
            storeDispatch: this.storeDispatch,
            totalPosts: this.totalPostsCount,
            completedPostStatus: this.completedPostStatus
        });

        const endTime = new Date();
        const duration = endTime - this.startTime;
        const previousDuration = selectTranslatePostInfo(store.getState())?.[this.postId + '_' + this.activeTargetLang]?.duration || 0;
        this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + this.activeTargetLang]: { duration: previousDuration + duration } }));

        return true;
    }

    async initTranslation() {
        if (this.textContentObject && Object.keys(this.textContentObject).length > 0 && this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            await this.createYandexTranslator(this.targetLangs[0], 0);
        } else if (this.targetLangs && this.targetLangs.length > 0 && !this.stopTranslation) {
            this.targetLangs.forEach(lang => {
                this.storeDispatch(unsetPendingPost(this.postId + '_' + lang));
                this.storeDispatch(updateProgressStatus(100 / this.totalPostsCount));
                this.storeDispatch(updateTranslatePostInfo({ [this.postId + '_' + lang]: { status: 'error', messageClass: 'error', errorMessage: __('No content to translate', 'automatic-translations-for-polylang'), errorHtml: false } }));
            });
        }
    }
}

export default YandexTranslater;
