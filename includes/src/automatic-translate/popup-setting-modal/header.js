import { __ } from "@wordpress/i18n";

const SettingModalHeader = ({ setSettingVisibility }) => {
    return (
        <div className='modal-header'>
         <div className='modal-header-inner'>
          <span className='step-label'>
            {__("STEP 1 OF 2", "automlp-ai-translation-for-wpml")}
          </span>
          <h2>{__("Select Translation Engine", 'automatic-translations-for-polylang')}</h2>
          <p className='modal-desc'>{__("Select an AI provider to automatically translate your content.", 'automatic-translations-for-polylang')}</p>
         </div>
            <button type="button" aria-label={__('Close', 'automatic-translations-for-polylang')} className='modal-close' onClick={() => setSettingVisibility(false)}>&times;</button>
        </div>
    );
}

export default SettingModalHeader;
