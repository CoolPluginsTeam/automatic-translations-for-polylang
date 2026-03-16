import { useState, useEffect } from 'react';
import FormatNumberCount from '../format-number-count';
import { __ } from '@wordpress/i18n';

const ProVersionNotice = ({ characterCount = 0, url = '' }) => {
    const [showNotice, setShowNotice] = useState(false);
    const [activeClass, setActiveClass] = useState(false);
    const refrenceText = window.atfp_global_object.refrence_text;
    const atfpUrl = window.atfp_global_object.atfp_url;
    const magincWandUrl = atfpUrl + 'assets/images/magic-wand.svg';

    if (url !== '') {
        url = url + '?' + refrenceText + '&utm_medium=inside&utm_campaign=get_pro&utm_content=popup';
    }

    useEffect(() => {
        const translateButton = document.querySelector('button.atfp-translate-button[name="atfp_meta_box_translate"],input#atfp-translate-button[name="atfp_meta_box_translate"]');

        if (!translateButton) {
            return;
        }

        translateButton.addEventListener('click', () => {
            setShowNotice(true);
            setActiveClass(true);
        });

        return () => {
            translateButton.removeEventListener('click', () => { });
        };
    }, []);

    return (
        showNotice ? (
            <div id="atfp-pro-notice-wrapper">
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="atfp-modal-header-left">
                                <img src={magincWandUrl} style={{ width: '20px', height: '20px', marginRight: '5px', filter: 'brightness(0) invert(0)' }} alt="AI" />
                                <h3>{__("AI Translation", "autopoly-ai-translation-for-polylang")}</h3>
                            </div>
                            <span className="atfp-modal-close dashicons dashicons-no-alt" onClick={() => setShowNotice(false)} aria-label="Close Notice"></span>
                        </div>

                        <div className="atfp-modal-body">
                            <div className="atfp-main-section">
                                <p>You have already translated <strong><FormatNumberCount number={characterCount} /></strong> strings, and your free translation limit is used up. Upgrade to the Pro version to continue translating more content.</p>
                            </div>
                            <div className="atfp-marketing-card">
                                <h4>{__("Want Unlimited or Bulk Translation?", "autopoly-ai-translation-for-polylang")}</h4>
                                <div className="atfp-marketing-buttons">
                                    <a href={url} target="_blank" className="atfp-marketing-btn atfp-primary-btn">
                                        <img src={magincWandUrl} style={{ width: '20px', height: '20px', marginRight: '5px', filter: 'brightness(0) invert(1)' }} alt="AI" /><span className="atfp-btn-text">{__("Upgrade Pro", "autopoly-ai-translation-for-polylang")}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer-notice">
                            <span className="dashicons dashicons-warning"></span>
                            <p><em>{__("Note: close this popup if you do not want AI translation.", "autopoly-ai-translation-for-polylang")}</em></p>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default ProVersionNotice;