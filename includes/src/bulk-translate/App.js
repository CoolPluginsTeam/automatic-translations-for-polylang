import React, { useState, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import StatusModal from './status-modal';
import { useDispatch, useSelector } from 'react-redux';
import { resetStore, updateServiceProvider, updateCountInfo } from './redux-store/features/actions';
import { selectCountInfo } from './redux-store/features/selectors';
import ChromeAiTranslator from './components/translate-provider/local-ai/local-ai-translate';
import yandexLanguage from './components/translate-provider/yandex/yandex-language';
import googleLanguage from './components/translate-provider/google/google-language';
import SettingModal from './setting-modal';
import ProNotice from './components/pro-notice';
import BulkPageChoice from './components/pro-notice/bulk-choice';
import Notice from './components/Notice';

const App = ({ onDestory, prefix, postIds }) => {
    const dispatch = useDispatch();
    const { languageObject = {} } = atfp_bulk_translate_object || {};
    const emptyPostIdsErrorMessage = __('You need to select one page for translation.', 'automatic-translations-for-polylang');
    const targetLanguages = JSON.parse(JSON.stringify(languageObject));
    delete targetLanguages[
      atfp_bulk_translate_object.default_language_slug
    ];

    // Local copy so the Pro screen can narrow a multi row selection down to the
    // single post the free version will translate.
    const [activePostIds, setActivePostIds] = useState(postIds);
    const hasPosts = activePostIds.length > 0;
    const errorMessage = hasPosts ? '' : emptyPostIdsErrorMessage;

    const [selectedLanguages, setSelectedLanguages] = useState(Object.keys(targetLanguages));
    const [statusModalVisibility, setStatusModalVisibility] = useState(false);
    const translatePostsCount = useSelector(selectCountInfo).totalPosts;
    const [isLoading, setIsLoading] = useState(true);
    const [proRequiredReason, setProRequiredReason] = useState(postIds.length > 1 ? 'multiple' : false);
    const [localAiModalError, setLocalAiModalError] = useState(false);
    const [edgeAiModalError, setEdgeAiModalError] = useState(false);
    // With nothing selected there is no language to check support against, and
    // Array.some() on an empty array is false -- which would otherwise flag
    // every engine as unsupported before the user has picked anything.
    const hasSelectedLanguages = selectedLanguages.length > 0;
    const yandexSupport = !hasSelectedLanguages || selectedLanguages.some((language) => yandexLanguage().includes(language) || yandexLanguage().includes(language.replace('_', '-')));
    const yandexDisabled = !yandexSupport ? sprintf(__("Yandex Translate does not support the selected target language(s).", 'automatic-translations-for-polylang')) : false;
    const googleSupport = !hasSelectedLanguages || selectedLanguages.some((language) => {
        const googleLang = language === 'zh'
            ? (languageObject['zh']?.locale || '').replace('_', '-')
            : language;
        return googleLanguage().includes(googleLang) || googleLanguage().includes(language.replace('_', '-'));
    });
    const googleDisabled = !googleSupport ? sprintf(__("Google Translate does not support the selected target language(s).", 'automatic-translations-for-polylang')) : false;

    const destroyApp = (e) => {
        setStatusModalVisibility(false);
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
        if (!statusModalVisibility) {
            dispatch(resetStore());
        }
    }, [statusModalVisibility, dispatch]);

    /**
     * Adds or removes a single target language from the selection.
     *
     * @since 1.1.0
     *
     * @param {Event} e Change event of the language checkbox.
     *
     * @return {void}
     */
    const handleLanguageChange = (e) => {
        const { value } = e.target;
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages([...selectedLanguages, value]);
        } else {
            setSelectedLanguages(selectedLanguages.filter(language => language !== value));
        }
    }

    /**
     * Selects or clears every available target language.
     *
     * @since 1.1.0
     *
     * @param {Event} e Change event of the select-all checkbox.
     *
     * @return {void}
     */
    const handleSelectAllLanguages = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedLanguages(Object.keys(targetLanguages));
        } else {
            setSelectedLanguages([]);
        }
    }

    /**
     * Starts the translation with the selected languages and provider.
     *
     * @since 1.1.0
     *
     * @param {string} services Provider key picked on the setup screen.
     *
     * @return {void}
     */
    const startTranslationHandler = (services) => {
        if (!hasPosts || 0 === selectedLanguages.length || !services) {
            return;
        }

        dispatch(updateCountInfo({ startTime: new Date().getTime() }));
        dispatch(updateServiceProvider(services));
        setStatusModalVisibility(true);
        setIsLoading(true);
    }

    /**
     * Resolves which screen the modal currently shows.
     *
     * @since 1.1.0
     *
     * @return {string} One of pro, status, error or setup.
     */
    const activeScreen = () => {
        if (proRequiredReason) {
            return 'pro';
        }

        if (statusModalVisibility) {
            return 'status';
        }

        if (errorMessage) {
            return 'error';
        }

        return 'setup';
    }

    /**
     * Builds the container class list for the given screen.
     *
     * @since 1.1.0
     *
     * @param {string} screen Screen returned by activeScreen().
     *
     * @return {string} Space separated class list.
     */
    const containerCls = (screen) => {
        const cls = [];

        if ('status' === screen) {
            cls.push(`${prefix}-status-modal-active`);

            if (!translatePostsCount) {
                cls.push(`${prefix}-empty-posts`);
            }
        } else if ('setup' === screen) {
            cls.push(`${prefix}-setting-modal-active`);
            cls.push(`${prefix}-setup-modal-active`);
        } else if ('pro' === screen) {
            cls.push(`${prefix}-setting-modal-active`);
            cls.push(`${prefix}-pro-modal-active`);
        } else if ('error' === screen) {
            cls.push(`${prefix}-setting-modal-active`);
        }

        return cls.join(' ');
    }

    /**
     * Builds the notices shown above the language list.
     *
     * @since 1.1.0
     *
     * @return {?JSX.Element[]} Notices, or null when there is nothing to warn about.
     */
    const languageNotices = () => {
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

        if (0 === notices.length) {
            return null;
        }

        const noticeLength = notices.length;

        return notices.map((notice, index) => <Notice className={notice.className} key={index} lastNotice={index === noticeLength - 1}>{notice.message}</Notice>);
    }

    /**
     * Renders the screen shown when no post was selected for translation.
     *
     * @since 1.1.0
     *
     * @return {JSX.Element} Empty selection screen.
     */
    const ErrorMessageScreen = () => (
        <div id={`${prefix}-setting-modal-container`}>
            <div className={`${prefix}-setting-modal-content`}>
                <div className={`${prefix}-header`}>
                    <div className={`${prefix}-modal-header-inner`}>
                        <h2>{__('AI Translation', 'automatic-translations-for-polylang')}</h2>
                        <p className={`${prefix}-modal-desc`}>
                            {__('Nothing is ready to translate yet.', 'automatic-translations-for-polylang')}
                        </p>
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

                <div className={`${prefix}-setting-modal-body`}>
                    <div className={`${prefix}-empty-state`}>
                        <span className={`${prefix}-empty-state-art`} aria-hidden="true">
                            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="14" y="10" width="34" height="42" rx="4" stroke="currentColor" strokeWidth="2.5" />
                                <rect x="20" y="16" width="34" height="42" rx="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M27 27h20M27 35h20M27 43h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="55" cy="52" r="11" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M44 52h22M55 41c3 3.5 3 18 0 22-3-4-3-18.5 0-22z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M12 62L64 8" stroke="#d63638" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 6" />
                            </svg>
                        </span>
                        <h3>{__('No Page Selected', 'automatic-translations-for-polylang')}</h3>
                        <p>{errorMessage}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const screen = activeScreen();

    return <div
        id={`${prefix}-container`}
        className={containerCls(screen)}>
        {'pro' === screen && ('multiple' === proRequiredReason
            ? <BulkPageChoice
                prefix={prefix}
                postIds={activePostIds}
                onDestory={destroyApp}
                onReasonChange={setProRequiredReason}
                onTranslateSingle={(postId) => {
                    setActivePostIds([postId]);
                    setProRequiredReason(false);
                }}
            />
            : <ProNotice prefix={prefix} reason={proRequiredReason} onDestory={destroyApp} />)}

        {'error' === screen && <ErrorMessageScreen />}

        {'status' === screen && (isLoading ?
            <div
                className={`${prefix}-skeleton-loader`}></div> :
            <StatusModal
                postIds={activePostIds}
                selectedLanguages={selectedLanguages}
                prefix={prefix}
                onDestory={destroyApp}
                onProRequired={(reason) => {
                    setStatusModalVisibility(false);
                    setProRequiredReason(reason || 'retranslate');
                }}
            />)}

        {'setup' === screen &&
            <SettingModal
                prefix={prefix}
                onDestory={destroyApp}
                startTranslationHandler={startTranslationHandler}
                localAiModalError={localAiModalError}
                edgeAiModalError={edgeAiModalError}
                yandexDisabled={yandexDisabled}
                googleDisabled={googleDisabled}
                targetLanguages={targetLanguages}
                selectedLanguages={selectedLanguages}
                onLanguageChange={handleLanguageChange}
                onSelectAllLanguages={handleSelectAllLanguages}
                languageNotice={languageNotices()}
                languagesDisabled={!hasPosts}
                languagesDisabledReason={emptyPostIdsErrorMessage}
            />
        }
    </div>
}

export default App;
