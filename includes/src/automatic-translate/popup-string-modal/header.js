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
           {__("STEP 2 OF 2", "automatic-translations-for-polylang")}
         </span>
         <h2>{__("Start Automatic Translation Process", 'automatic-translations-for-polylang')}</h2>
        </div>
           <button type="button" aria-label={__('close', 'automatic-translations-for-polylang')} className='modal-close' onClick={closeModal}>&times;</button>
       </div>
    );
}

export default StringPopUpHeader;