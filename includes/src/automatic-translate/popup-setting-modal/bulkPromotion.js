import FormatNumberCount from '../component/format-number-count';
import { __ } from '@wordpress/i18n';

const BulkPromotionModal = ({ onClick, characterCount }) => {
    const atfpUrl=window.atfp_global_object.atfp_url;
    const magincWandUrl=atfpUrl + 'assets/images/magic-wand.svg';
    return (
        <div id="atfp-limit-notice-wrapper">
            <div className="modal-container" style={{ display: 'flex' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="atfp-modal-header-left">
                        <img src={magincWandUrl} style={{width: '20px', height: '20px', marginRight: '5px', filter: 'brightness(0) invert(0)'}} alt={`${__("AI", "automatic-translations-for-polylang")}`}/>
                        <h3>{__("AI Translation", "automatic-translations-for-polylang")}</h3>
                        </div>
                        <button type="button" aria-label={__('Close', 'automatic-translations-for-polylang')} className='modal-close' onClick={() => onClick(false)}>&times;</button>
                    </div>

                    <div className="atfp-modal-body">
                        <p>
                            {__("You’ve already translated", "automatic-translations-for-polylang")} {" "}
                            <strong>
                                {FormatNumberCount({number: characterCount})}+
                            </strong> {__("characters manually.", "automatic-translations-for-polylang")}
                            <br />
                            {__("Save time by translating multiple posts and pages in multiple languages on one click with", "automatic-translations-for-polylang")} <strong>{__("Bulk Translation", "automatic-translations-for-polylang")}</strong>.
                        </p>
                        <div className="bulk-notice-buttons">
                            <a
                                href={window.atfp_global_object.pro_version_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button button-primary"
                            >
                                <img src={magincWandUrl} style={{width: '20px', height: '20px', marginRight: '5px', filter: 'brightness(0) invert(1)'}} alt={`${__("AI", "automatic-translations-for-polylang")}`}/>
                                {__("Bulk Translation", "automatic-translations-for-polylang")}
                            </a>
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={() => onClick(true)}
                            >
                                {__("Continue Translation", "automatic-translations-for-polylang")}
                            </button>
                        </div>
                    </div>
                    <div className="modal-footer-notice">
                    <span className="dashicons dashicons-warning"></span>
                    <p><em>{__("Note: Click to Continue Translation If you want manually translation.", "automatic-translations-for-polylang")}</em></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkPromotionModal;