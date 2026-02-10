import { useState, useEffect } from 'react';
import FormatNumberCount from '../format-number-count';

const ProVersionNotice = ({ characterCount = 0, url = '' }) => {
    const [showNotice, setShowNotice] = useState(false);
    const [activeClass, setActiveClass] = useState(false);
    const refrenceText = window.atfp_global_object.refrence_text;

    if(url !== ''){
        url = url+'?'+refrenceText+'&utm_medium=inside&utm_campaign=get_pro&utm_content=popup';
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
            <div id="atfp-pro-notice-wrapper" className={`${activeClass ? 'atfp-active' : ''}`}>
                <div className="atfp-pro-notice">
                    <div className="atfp-notice-header">
                        <h2>AutoPoly - AI Translation For Polylang</h2>
                        <span className="atfp-close-button" onClick={() => setShowNotice(false)} aria-label="Close Notice">×</span>
                    </div>
                    <div className="atfp-notice-content">
                        <p>You have reached the character limit of <strong><FormatNumberCount number={characterCount} /></strong> for your translations. To continue translating beyond this limit, please consider upgrading to <strong>AutoPoly - AI Translation For Polylang Pro</strong>.</p>
                    </div>
                    <div className="atfp-notice-footer">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="atfp-upgrade-button">Upgrade to Pro</a>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default ProVersionNotice;