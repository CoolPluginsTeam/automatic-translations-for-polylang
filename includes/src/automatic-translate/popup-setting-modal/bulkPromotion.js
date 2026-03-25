import FormatNumberCount from '../component/format-number-count';
import { __ } from '@wordpress/i18n';

const BulkPromotionModal = ({ onClick, characterCount }) => {
    return (
        <div id="atfp-limit-notice-wrapper">
            <div className="modal-container" style={{ display: 'flex' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="atfp-modal-header-left">
                            <h3>{__("Upgrade Your Translation Workflow", "automatic-translations-for-polylang")}</h3>
                        </div>
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
                                Try Bulk Translation
                            </a>
                            <button
                                type="button"
                                className="button button-secondary"
                                onClick={onClick}
                            >
                                Continue Manually
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