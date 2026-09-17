import React, { useState, useEffect } from "react";
import SettingModalHeader from "./header";
import SettingModalBody from "./body";
import SettingModalFooter from "./footer";
import ErrorModalBox from "../components/error-modal-box";
import { resolveDefaultService } from "../components/translate-provider";

/**
 * Translation setup screen.
 *
 * Presents language selection and translation engine selection as a single
 * step and starts the translation once both have been chosen.
 *
 * @since 1.1.0
 *
 * @param {Object}   props                        Component props.
 * @param {string}   props.prefix                 CSS class prefix.
 * @param {Function} props.onDestory              Callback that closes the whole translation UI.
 * @param {Function} props.startTranslationHandler Callback invoked with the picked provider key.
 * @param {Object}   props.targetLanguages        Available target languages keyed by language slug.
 * @param {string[]} props.selectedLanguages      Slugs of the currently selected languages.
 * @param {Function} props.onLanguageChange       Callback for a single language checkbox change.
 * @param {Function} props.onSelectAllLanguages   Callback for the select-all checkbox change.
 * @param {*}        props.languageNotice         Optional notice rendered above the language list.
 * @param {boolean}  props.languagesDisabled      Whether the language inputs are disabled.
 * @param {string}   props.languagesDisabledReason Tooltip shown while the inputs are disabled.
 * @param {string|boolean} props.localAiModalError Chrome built-in AI setup error, false when usable.
 * @param {string|boolean} props.edgeAiModalError  Edge built-in AI setup error, false when usable.
 * @param {string|boolean} props.yandexDisabled    Yandex unsupported-language notice, false when usable.
 * @param {string|boolean} props.googleDisabled    Google unsupported-language notice, false when usable.
 *
 * @return {JSX.Element} Translation setup screen.
 */
const SettingModal = (props) => {
    const prefix = props.prefix || 'atfp-bulk-translate';
    const imgFolder = `${atfp_bulk_translate_object.atfp_url}assets/images/`;
    const [errorModal, setErrorModal] = useState(false);
    // Seed with the engine chosen in settings. The effect below clears it
    // again if that engine turns out to be unusable in this browser.
    const [activeProvider, setActiveProvider] = useState(resolveDefaultService);

    const { localAiModalError, edgeAiModalError, yandexDisabled, googleDisabled } = props;

    // Because languages and engines are picked on the same screen, an engine that
    // was already selected can become unusable, either when the browser support
    // check finishes or when the user picks a language the engine does not
    // support. Drop the selection so the translation cannot start with it.
    useEffect(() => {
        const disabledProviders = {
            localAiTranslator: localAiModalError,
            edgeAiTranslator: edgeAiModalError,
            yandex: yandexDisabled,
            google: googleDisabled,
        };

        if (activeProvider && disabledProviders[activeProvider]) {
            setActiveProvider(null);
        }
    }, [activeProvider, localAiModalError, edgeAiModalError, yandexDisabled, googleDisabled]);

    /**
     * Starts the translation with the currently selected provider.
     *
     * @return {void}
     */
    const startTranslationHandler = () => {
        props.startTranslationHandler(activeProvider);
    };

    /**
     * Stores the provider the user picked.
     *
     * @param {string} service Provider key.
     *
     * @return {void}
     */
    const updateActiveProviderHandler = (service) => {
        setActiveProvider(service);
    };

    /**
     * Opens the error modal with a provider setup message.
     *
     * @param {string} msg Message markup provided by the translation service.
     *
     * @return {void}
     */
    const errorModalHandler = (msg) => {
        setErrorModal(msg);
    };

    /**
     * Closes the error modal.
     *
     * @return {void}
     */
    const closeErrorModal = () => {
        setErrorModal(false);
    };

    if (errorModal) {
        return (
            <ErrorModalBox
                message={errorModal}
                onDestroy={props.onDestory}
                onClose={closeErrorModal}
                Title='AutoPoly - AI Translation For Polylang'
                prefix={prefix}
            />
        );
    }

    return (
        <div id={`${prefix}-setting-modal-container`}>
            <div className={`${prefix}-setting-modal-content`}>
                <SettingModalHeader
                    prefix={prefix}
                    onClose={props.onDestory}
                />
                <SettingModalBody
                    prefix={prefix}
                    imgFolder={imgFolder}
                    activeProvider={activeProvider}
                    onSelectProvider={updateActiveProviderHandler}
                    errorModalHandler={errorModalHandler}
                    localAiModalError={props.localAiModalError}
                    edgeAiModalError={props.edgeAiModalError}
                    yandexDisabled={props.yandexDisabled}
                    googleDisabled={props.googleDisabled}
                    targetLanguages={props.targetLanguages}
                    selectedLanguages={props.selectedLanguages}
                    onLanguageChange={props.onLanguageChange}
                    onSelectAllLanguages={props.onSelectAllLanguages}
                    languageNotice={props.languageNotice}
                    languagesDisabled={props.languagesDisabled}
                    languagesDisabledReason={props.languagesDisabledReason}
                />
                <SettingModalFooter
                    prefix={prefix}
                    selectedProvider={activeProvider}
                    selectedLanguages={props.selectedLanguages}
                    onStartTranslation={startTranslationHandler}
                />
            </div>
        </div>
    );
};

export default SettingModal;
