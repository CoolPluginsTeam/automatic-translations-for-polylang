import { __ } from "@wordpress/i18n";

const SettingModalHeader = ({ setSettingVisibility, prefix }) => {
    
    return (
        <div className={`${prefix}-header`}>
        <div className={`${prefix}-modal-header-inner`}>
         <span className={`${prefix}-step-label`}>
           {__("STEP 2 OF 3", "automatic-translations-for-polylang")}
         </span>
         <h2>{__("Select Translation Engine", 'automatic-translations-for-polylang')}</h2>
         <p className={`${prefix}-modal-desc`}>{__("Select an AI provider to automatically translate your content.", 'automatic-translations-for-polylang')}</p>
        </div>
           <button type="button" aria-label={__('Close', 'automatic-translations-for-polylang')} className={`${prefix}-modal-close`} onClick={(e) => setSettingVisibility(e)}>&times;</button>
       </div>
    );
}

export default SettingModalHeader;
