import App from './App';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { store } from './redux-store/store';
import { Provider } from 'react-redux';
import LocalAITranslate from './components/translate-provider/local-ai/local-ai-translate';

/**
 * localAiTranslator is keyed to chrome-built-in-ai.
 * On Edge, map the Edge toggle onto that key so Chrome/Edge stay independent.
 * edgeAiTranslator is only shown on non-Chrome/Edge browsers.
 */
const normalizeEnabledProviders = (providers = [], browserType) => {
    let next = [...providers];
    const hasEdge = next.includes('edge-built-in-ai');

    if (browserType === 'Edge') {
        next = next.filter((provider) => provider !== 'chrome-built-in-ai');
        if (hasEdge) {
            next.push('chrome-built-in-ai');
        }
    }

    if (browserType !== 'Other') {
        next = next.filter((provider) => provider !== 'edge-built-in-ai');
    }

    return next;
};

(() => {
    const BulkTranslate = (props) => {
        const [modalVisible, setModalVisible] = useState(false);
        const [postIds, setPostIds] = useState([]);
        const prefix = props.prefix;
        let localAiCheckInProgres = false;

        if (!window.atfp_bulk_translate_object._activeProvidersNormalized) {
            window.atfp_bulk_translate_object.active_providers = normalizeEnabledProviders(
                window.atfp_bulk_translate_object.active_providers || [],
                LocalAITranslate.getBrowserType()
            );
            window.atfp_bulk_translate_object._activeProvidersNormalized = true;
        }

        const handleModalVisibility = (e) => {
            e.preventDefault();

            setModalVisible(prev => !prev);
            destroyGoogleWidget();

        }

        // 1️⃣ Clear old cached data on page load
        const clearOldTranslatorCacheOnLoad = () => {
            const loadKey = 'ATFPP_LOCAL_AI_PAGE_LOADED';

            if (sessionStorage.getItem(loadKey)) {
                return;
            }

            localStorage.removeItem('ATFPP_AVAILABLE_LOCAL_AI_TRANSLATOR_LANGUAGES');
            sessionStorage.setItem(loadKey, '1');
        };

        // 2️⃣ Language pack availability check (gesture-based)
        const checkLanguagePackAvailability = async () => {
            const languagesObj = { ...atfp_bulk_translate_object.languageObject };
            const supportedLanguages = LocalAITranslate.supportedLanguages || [];

            delete languagesObj.en;

            let savedLanguages = [];
            try {
                savedLanguages = JSON.parse(
                    localStorage.getItem('ATFPP_AVAILABLE_LOCAL_AI_TRANSLATOR_LANGUAGES')
                ) || [];
            } catch {
                savedLanguages = [];
            }

            savedLanguages.forEach(lang => delete languagesObj[lang]);

            if (!Object.keys(languagesObj).length) return;


            const processNextLanguage = async () => {
                if (localAiCheckInProgres || Object.keys(languagesObj).length === 0) return;

                localAiCheckInProgres = true;
                const targetLang = Object.keys(languagesObj)[0];

                if(supportedLanguages.includes(targetLang)){
                    try {
                        const status = await LocalAITranslate.languagePairAvality('en', targetLang);
    
                        if (['available', 'readily'].includes(status)) {
                            delete languagesObj[targetLang] ;
                            savedLanguages.push(targetLang);
                            localStorage.setItem(
                                'ATFPP_AVAILABLE_LOCAL_AI_TRANSLATOR_LANGUAGES',
                                JSON.stringify(savedLanguages)
                            );
                        }
                    } catch (err) {
                        console.error('Language availability check failed:', targetLang, err);
                    }
                }else{
                    delete languagesObj[targetLang];
                }

                localAiCheckInProgres = false;

                if (Object.keys(languagesObj).length === 0) {
                    document.removeEventListener('mousemove', onMouseMove);

                    const doActionsBtn = getTranslateTriggers();
                    doActionsBtn.forEach(btn => {
                        btn.removeEventListener('mousemove', checkLanguagePackAvailability);
                        btn.removeEventListener('mouseleave', checkLanguagePackAvailability);
                        btn.removeEventListener('mouseenter', checkLanguagePackAvailability);
                    });

                }
            };

            const onMouseMove = () => {
                processNextLanguage();
            };

            document.addEventListener('mousemove', onMouseMove);
        };

        const getTranslateTriggers = () => document.querySelectorAll(`.${prefix}-btn, .${prefix}-row-btn`);

        const destroyGoogleWidget = () => {
            const googleWidget = document.querySelector('.skiptranslate iframe[id=":1.container"]');
            document.body.classList.remove(prefix + '-google-translate');

            if (googleWidget) {
                const closeButton = googleWidget.contentDocument.querySelector('a[id=":1.close"][title="Close"] img');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }

        const bulkTranslationHandler = (e) => {
            const trigger = e.target.closest(`.${prefix}-btn, .${prefix}-row-btn`);

            if (!trigger) {
                return;
            }

            e.preventDefault();

            const rowPostId = trigger.getAttribute('data-post-id');
            let postIds = [];

            if (rowPostId) {
                postIds = [rowPostId];
            } else {
                const selectedPostIds = document.querySelectorAll('table.widefat input[name="post[]"]:checked');
                postIds = Array.from(selectedPostIds).map(postId => postId.value);
            }

            checkLanguagePackAvailability();

            setPostIds(postIds);
            handleModalVisibility(e);
        }

        useEffect(() => {
            clearOldTranslatorCacheOnLoad();

            document.addEventListener('click', bulkTranslationHandler);

            const doActionsBtn = getTranslateTriggers();
            doActionsBtn.forEach(btn => {
                btn.addEventListener('mousemove', checkLanguagePackAvailability);
                btn.addEventListener('mouseleave', checkLanguagePackAvailability);
                btn.addEventListener('mouseenter', checkLanguagePackAvailability);
            });

            return () => {
                document.removeEventListener('click', bulkTranslationHandler);
                doActionsBtn.forEach(btn => {
                    btn.removeEventListener('mousemove', checkLanguagePackAvailability);
                    btn.removeEventListener('mouseleave', checkLanguagePackAvailability);
                    btn.removeEventListener('mouseenter', checkLanguagePackAvailability);
                });
            };
        }, []);

        useEffect(() => {
            const mainWrapper = document.getElementById(`${prefix}-wrapper`);
            if (mainWrapper) {
                mainWrapper.classList.toggle(`${prefix}-active`, modalVisible);
            }
        }, [modalVisible]);

        return (
            modalVisible ? (
                <App onDestory={handleModalVisibility} prefix={prefix} postIds={postIds} />
            ) : null
        );
    }

    window.addEventListener('load', async () => {
        const prefix = 'atfp-bulk-translate';

        await new Promise(resolve => setTimeout(resolve, 500));

        ReactDOM.createRoot(document.getElementById(`${prefix}-wrapper`)).render(
            <Provider store={store}>
                <BulkTranslate prefix={prefix} />
            </Provider>
        );
    });
})();
