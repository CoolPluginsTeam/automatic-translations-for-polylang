import { useState, useEffect } from 'react';
import FormatNumberCount from '../FormateNumberCount';

const ProVersionNotice = ({ characterCount = 0, url = '' }) => {
    const [showNotice, setShowNotice] = useState(false);
    const [activeClass, setActiveClass] = useState(false);

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
                        <h2>AI Translation for Polylang Pro Notice</h2>
                        <button className="atfp-close-button" onClick={() => setShowNotice(false)} aria-label="Close Notice">✖</button>
                    </div>
                    <div className="atfp-notice-content">
                        <p>You have reached the character limit of <strong><FormatNumberCount number={characterCount} /></strong> for your translations. To continue translating beyond this limit, please consider upgrading to AI Translation for Polylang Pro.</p>
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