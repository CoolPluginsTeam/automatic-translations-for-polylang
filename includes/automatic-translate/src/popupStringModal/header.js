const { __ } = wp.i18n;

const StringPopUpHeader = (props) => {

    const serviceProviderName = () => {
        const serviceProvider = props.service;
        if (serviceProvider === 'yandex') {
            return 'Yandex Translate';
        } else if (serviceProvider === 'google') {
            return 'Google Translate';
        } else if (serviceProvider === 'local-ai-translator') {
            return 'Local AI Translator';
        }
        return serviceProvider;
    }

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    return (
        <div className="modal-header" key={props.modalRender}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="notranslate">{__("Step 2 - Start Automatic Translation Process", 'automatic-translations-for-polylang')}</h2>
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{__("Update Content", 'automatic-translations-for-polylang')}</button>
            </div>
            {!props.translatePendingStatus &&
                <div className="atfp-character-count-container">
                    <p>Wahooo! You have saved your valuable time via auto translating <strong>{props.characterCount}</strong> characters using <strong>{serviceProviderName()}</strong>.</p>
                </div>
            }
        </div>
    );
}

export default StringPopUpHeader;