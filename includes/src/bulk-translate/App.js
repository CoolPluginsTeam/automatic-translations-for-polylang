import React, { useState, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import StatusModal from './status-modal';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore, updateServiceProvider, updateCountInfo } from './redux-store/features/actions';
import { selectCountInfo } from './redux-store/features/selectors';
import ChromeAiTranslator from './components/translate-provider/local-ai/local-ai-translate';
import yandexLanguage from './components/translate-provider/yandex/yandex-language';
import ErrorModalBox from './components/error-modal-box';
import SettingModal from './setting-modal';
import DOMPurify from 'dompurify';
import Notice from './components/notice';

const App = ({ onDestory, prefix, postIds }) => {
    const dispatch = useDispatch();
    const { languageObject = {} } = atfp_bulk_translate_object || {};
    const emptyPostIdsErrorMessage = sprintf(__('Please select at least one %s for translation.', 'automatic-translations-for-polylang'), atfp_bulk_translate_object.post_label);
    const targetLanguages = JSON.parse(JSON.stringify(languageObject));
    delete targetLanguages[
      atfp_bulk_translate_object.default_language_slug
    ];

    const [selectedLanguages, setSelectedLanguages] = useState(Object.keys(targetLanguages));
    const [errorMessage, setErrorMessage] = useState(postIds.length === 0 ? emptyPostIdsErrorMessage : '');
    const [settingModalVisibility, setSettingModalVisibility] = useState(false);
    const [statusModalVisibility, setStatusModalVisibility] = useState(false);
    const translatePostsCount = useSelector(selectCountInfo).totalPosts;
    const [isLoading, setIsLoading] = useState(true);
    const [errorModal, setErrorModal] = useState(false);
    const [localAiModalError, setLocalAiModalError] = useState(false);
    const [edgeAiModalError, setEdgeAiModalError] = useState(false);
    const yandexSupport = selectedLanguages.some((language) => yandexLanguage().includes(language) || yandexLanguage().includes(language.replace('_', '-')));
    const yandexDisabled = !yandexSupport ? sprintf(__("Yandex Translate does not support the selected target language(s).", 'automatic-translations-for-polylang')) : false;

    const destroyApp = (e) => {
        setStatusModalVisibility(false);
        setSettingModalVisibility(false);
        onDestory(e);
    }


    useEffect(() => {
        const checkStatus = async () => {
            const status = await ChromeAiTranslator.languageSupportedStatus('en', 'hi', 'English', 'Hindi');
            const browserType = ChromeAiTranslator.getBrowserType();
            if (status.type === 'browser-not-supported' || status.type === 'translation-api-not-available' || status.type === 'browser-not-supported') {
                if(browserType === 'Other'){
                    const chromeMesage= status.html && status.html.chrome ? status.html.chrome[0] : status.html[0];
                    setLocalAiModalError(chromeMesage.outerHTML);

                    const edgeMessage= status.html && status.html.edge ? status.html.edge[0] : status.html[0];
                    setEdgeAiModalError(edgeMessage.outerHTML);
                }else{
                    setLocalAiModalError(status.html[0].outerHTML);
                }
            }

            setIsLoading(false);
        }

        checkStatus();
    }, [statusModalVisibility]);

    useEffect(() => {
        if (!statusModalVisibility && !settingModalVisibility) {
            dispatch(resetStore());
        }
    }, [statusModalVisibility, settingModalVisibility, dispatch]);

    const settingModalVisibilityHandler = async () => {
        if (selectedLanguages.length === 0 && !settingModalVisibility) {
            setErrorMessage(__('Please select at least one language', 'automatic-translations-for-polylang'));
            setErrorModal(true);
            return;
        }

        if (false === settingModalVisibility) {
            dispatch(updateCountInfo({ startTime: new Date().getTime() }));
        }

        setSettingModalVisibility((prev) => !prev);
    }

    const handleLanguageChange = (e) => {
        const { value } = e.target;
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages([...selectedLanguages, value]);
        } else {
            setSelectedLanguages(selectedLanguages.filter(language => language !== value));
        }
    }

    const closeErrorModal = (e) => {
        setErrorModal(false);
    }

    const handleSelectAllLanguages = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages(Object.keys(targetLanguages));
        } else {
            setSelectedLanguages([]);
        }
    }

    const startTranslationHandler = (services) => {
        dispatch(updateServiceProvider(services));
        setSettingModalVisibility(false);
        setStatusModalVisibility(true);
        setIsLoading(true);
    }

    const containerCls = () => {
        let cls = [];
        if (statusModalVisibility) {
            cls.push(`${prefix}-status-modal-active`);
        }

        if (settingModalVisibility) {
            cls.push(`${prefix}-setting-modal-active`);
        }

        if (!translatePostsCount && !settingModalVisibility && statusModalVisibility) {
            cls.push(`${prefix}-empty-posts`);
        }

        return cls.join(' ');
    }

    const SelectLanguageNotice = () => {

        const notices = [];

        const postMetaSync = atfp_bulk_translate_object.postMetaSync === 'true';

        if (postMetaSync) {
            notices.push({
                className: `${prefix}-notice ${prefix}-notice-error`, message: <p>
                    {__('For accurate custom field translations, please disable the Custom Fields synchronization in ', 'automatic-translations-for-polylang')}
                    <a
                        href={`${atfp_bulk_translate_object.admin_url}admin.php?page=mlang_settings`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {__('Polylang settings', 'automatic-translations-for-polylang')}
                    </a>
                    {sprintf(__('. This may affect linked %s.', 'automatic-translations-for-polylang'), atfp_bulk_translate_object.post_label)}
                </p>
            });
        }

        const noticeLength = notices.length;

        if (notices.length > 0) {
            return notices.map((notice, index) => <Notice className={notice.className} key={index} lastNotice={index === noticeLength - 1}>{notice.message}</Notice>);
        }

        return;
    }

    const [isProRequired, setIsProRequired] = useState(false);

    useEffect(() => {
        let hasRetranslate = false;
        postIds.forEach(id => {
            if (atfp_bulk_translate_object.posts && atfp_bulk_translate_object.posts[id] && atfp_bulk_translate_object.posts[id].ReTranslatePosts && Object.keys(atfp_bulk_translate_object.posts[id].ReTranslatePosts).length > 0) {
                hasRetranslate = true;
            }
        });
        if (postIds.length > 1 || hasRetranslate) {
            setIsProRequired(true);
        }
    }, [postIds]);

    const ProMarketingMessage = () => {
        return (
            <div id={`${prefix}-setting-modal-container`}>
                <div className={`${prefix}-setting-modal-content`}>
                    
                    <div className={`${prefix}-header`}>
                        <div className={`${prefix}-modal-header-inner`}>
                            <h2>{__("AutoPoly Pro Feature", 'autopoly-ai-translation-for-polylang')}</h2>
                            <p className={`${prefix}-modal-desc`}>{__("Upgrade to Pro to unlock advanced AI translation capabilities.", 'autopoly-ai-translation-for-polylang')}</p>
                        </div>
                        <button type="button" aria-label={__('Close', 'autopoly-ai-translation-for-polylang')} className={`${prefix}-modal-close`} onClick={destroyApp}>&times;</button>
                    </div>

                    <div className={`${prefix}-setting-modal-body`}>
                        <div className={`${prefix}-provider-cards`}>
                            <div className={`${prefix}-bulk-translate-empty ${prefix}-provider-empty`}>
                                <strong>{__('Unlock AutoPoly Pro', 'autopoly-ai-translation-for-polylang')}</strong>
                                <br />
                                {__('Bulk translation of multiple pages and re-translating existing content are Pro features.', 'autopoly-ai-translation-for-polylang')}
                                <br />
                                <span className={`${prefix}-provider-empty-actions`}>
                                    <a
                                        href={`https://autopoly.ai/pricing/?utm_source=free-plugin&utm_medium=bulk-translate&utm_campaign=${postIds.length > 1 ? 'multiple-pages' : 'retranslate'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                                    >
                                        {__('Upgrade to Pro', 'autopoly-ai-translation-for-polylang')}
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${prefix}-footer`}>
                        <button type="button" className={`${prefix}-footer-button button`} onClick={destroyApp}>&#8592; {__("Back", 'autopoly-ai-translation-for-polylang')}</button>
                        <button
                            type="button"
                            className={`${prefix}-footer-button button button-primary`}
                            disabled={true}
                        >
                            {__("Start Translation", 'autopoly-ai-translation-for-polylang')} <span className={`${prefix}-next-arrow`}>&#8594;</span>
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    if (isProRequired) {
        return (
            <div id={`${prefix}-container`} className={containerCls()}>
                <ProMarketingMessage />
            </div>
        );
    }

    return <div
        id={`${prefix}-container`}
        className={containerCls()}>
        {settingModalVisibility && <SettingModal
            prefix={prefix}
            onDestory={destroyApp}
            onCloseHandler={settingModalVisibilityHandler}
            startTranslationHandler={startTranslationHandler}
            localAiModalError={localAiModalError}
            edgeAiModalError={edgeAiModalError}
            yandexDisabled={yandexDisabled}
        />}

        {statusModalVisibility && !settingModalVisibility && (isLoading ?
            <div
                className={`${prefix}-skeleton-loader`}></div> :
            <StatusModal
                postIds={postIds}
                selectedLanguages={selectedLanguages}
                prefix={prefix}
                onDestory={destroyApp}
                onRetranslateRequired={() => {
                    setStatusModalVisibility(false);
                    setIsProRequired(true);
                }}
            />)}
        {!statusModalVisibility && !settingModalVisibility &&
            <div
                className={`${prefix}-language-container`}>
                <div
                    className={`${prefix}-header`}>
                    <div className={`${prefix}-modal-header-inner`}>
                        {errorMessage && errorMessage !== '' ?
                        <div className={`${prefix}-modal-header-left`}>
                        <img src={atfp_bulk_translate_object.atfp_url + 'assets/images/magic-wand.svg'} style={{width: '20px', height: '20px', marginRight: '5px', filter: 'brightness(0) invert(0)'}} alt={__("AI", "autopoly-ai-translation-for-polylang")}/>
                        <h3>{__("AI Translation", "autopoly-ai-translation-for-polylang")}</h3>
                        </div>:
                        <>
                            <span className={`${prefix}-step-label`}>{__('STEP 1 OF 3', 'automatic-translations-for-polylang')}</span>
                            <h2>{__('Select Languages', 'automatic-translations-for-polylang')}</h2>
                        </>
                        }
                    </div>
                    <button
                        type="button"
                        className={`${prefix}-modal-close`}
                        onClick={destroyApp}
                        title={__('Close', 'automatic-translations-for-polylang')}
                        aria-label={__('Close', 'automatic-translations-for-polylang')}
                    >
                        &times;
                    </button>
                </div>
                {errorMessage && errorMessage !== '' ? (errorModal ? <ErrorModalBox
                    message={errorMessage}
                    onClose={closeErrorModal}
                /> : <div
                    className={`${prefix}-error-message`}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(errorMessage) }}
                />) :
                    <>
                        <div
                            className={`${prefix}-body`}>
                            <SelectLanguageNotice />
                            <div
                                className={`${prefix}-languages`}>
                                {Object.keys(targetLanguages).map((language) => {
                                    return (atfp_bulk_translate_object.default_language_slug && atfp_bulk_translate_object.default_language_slug === language ? null : <label htmlFor={language} key={language} className={`${prefix}-language${selectedLanguages.includes(language) ? ' language-selected' : ''}`}>
                                        <div
                                            className={`${prefix}-language-item`}
                                            title={!postIds.length ? emptyPostIdsErrorMessage : targetLanguages[language].name}>
                                            <input
                                                type="checkbox"
                                                name="languages"
                                                id={language}
                                                value={language}
                                                onChange={(e) => handleLanguageChange(e)}
                                                disabled={!postIds.length}
                                                checked={selectedLanguages.includes(language)} />
                                            <span className={`${prefix}-language-check-visual`}></span>
                                            <div>
                                            <span
                                                className={`${prefix}-language-label`}
                                                title={targetLanguages[language].name}
                                            >
                                                <img
                                                    src={targetLanguages[language].flag}
                                                    alt={targetLanguages[language].name} />
                                                &nbsp; {targetLanguages[language].name}
                                            </span>
                                            </div>
                                        </div>
                                    </label>)
                                })}
                            </div>
                            <div className={`${prefix}-select-all-languages ${selectedLanguages.length === Object.keys(targetLanguages).length ? 'all-languages-selected' : ''}`}>
                            <label htmlFor="select-all-languages">
                                <div className={`${prefix}-select-all-languages-inner`}>
                                <input
                                    type="checkbox"
                                    name="select-all-languages"
                                    id="select-all-languages"
                                    onChange={(e) => handleSelectAllLanguages(e)}
                                    checked={selectedLanguages.length === Object.keys(targetLanguages).length} />
                                <span className={`${prefix}-select-all-languages-check-visual`}></span>
                                <span
                                    htmlFor="select-all-languages"
                                >
                                    {selectedLanguages.length === Object.keys(targetLanguages).length ? __('Unselect All', 'automatic-translations-for-polylang') : __('Select All', 'automatic-translations-for-polylang')}
                                </span>
                                </div>
                            </label>
                            </div>
                        </div>
                        <div
                            className={`${prefix}-footer`}>
                            <button
                                className={`${prefix}-footer-button-next button button-primary`}
                                onClick={settingModalVisibilityHandler}
                                disabled={!postIds.length || !selectedLanguages.length}
                                title={!postIds.length ? emptyPostIdsErrorMessage : (!selectedLanguages.length ? __('Please select at least one language', 'automatic-translations-for-polylang') : '')}
                                style={{ marginLeft: 'auto' }}>
                                {__('Next', 'automatic-translations-for-polylang')}<span> &#8594;</span>
                            </button>
                        </div>
                    </>}
            </div>
        }
    </div>
}

export default App;
