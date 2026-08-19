import React, { useState } from "react";
import SettingModalHeader from "./header";
import SettingModalBody from "./body";
import SettingModalFooter from "./footer";
import ErrorModalBox from "../components/error-modal-box";

const SettingModal = (props) => {
    const prefix=props.prefix || 'atfp-bulk-translate';
    const imgFolder = atfp_bulk_translate_object.atfp_url + 'assets/images/';
    const [errorModal, setErrorModal] = useState(false);
    const [activeProvider, setActiveProvider] = useState(null);

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const startTranslationHandler = async () => {
        props.startTranslationHandler(activeProvider);
    };

    /**
     * Function to handle fetching content based on the target button clicked.
     * Sets the target button and updates the fetch status to true.
     * @param {Event} e - The event object representing the button click.
     */
    const updateActiveProviderHandler = async (service) => {
        setActiveProvider(service );
    };

    const errorModalHandler = (msg) => {
        setErrorModal(msg);
    }

    const closeErrorModal = () => {
        setErrorModal(false);
    }

    return (
        <>
            {errorModal ? <ErrorModalBox message={errorModal} onDestroy={props.onDestory} onClose={closeErrorModal} Title='AutoPoly - AI Translation For Polylang' prefix={prefix} /> :
            <div id={`${prefix}-setting-modal-container`}>
                <div className={`${prefix}-setting-modal-content`}>
                    <SettingModalHeader
                        setSettingVisibility={props.onDestory}
                        prefix={prefix}
                    />
                    <SettingModalBody
                        onSelectProvider={updateActiveProviderHandler}
                        activeProvider={activeProvider}
                        imgFolder={imgFolder}
                        prefix={prefix}
                        localAiModalError={props.localAiModalError}
                        errorModalHandler={errorModalHandler}
                        edgeAiModalError={props.edgeAiModalError}
                        yandexDisabled={props.yandexDisabled}
                    />
                    <SettingModalFooter
                        setSettingVisibility={props.onCloseHandler}
                        prefix={prefix}
                        selectedProvider={activeProvider}
                        onStartTranslation={startTranslationHandler}
                    />
                </div>
            </div>}
        </>
    );
};

export default SettingModal;