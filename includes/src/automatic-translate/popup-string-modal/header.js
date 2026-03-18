import { __ } from "@wordpress/i18n";
const StringPopUpHeader = (props) => {

    /**
     * Function to close the popup modal.
     */
    const closeModal = () => {
        props.setPopupVisibility(false);
    }

    return (
        <div className='modal-header'>
        <div className='modal-header-inner'>
         <span className='step-label'>
           {__("STEP 2 OF 2", "automlp-ai-translation-for-wpml")}
         </span>
         <h2>{__("Start Automatic Translation Process", 'autopoly-ai-translation-for-polylang')}</h2>
        </div>
           <button type="button" aria-label={__('Close', 'wpml-translation-check')} className='modal-close' onClick={closeModal}>&times;</button>
       </div>
    );
}

export default StringPopUpHeader;