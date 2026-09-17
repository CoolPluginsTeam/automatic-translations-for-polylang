import CopyClipboard from "../copy-clipboard";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import DOMPurify from 'dompurify';

const ErrorModalBox = ({ message, onClose, Title, prefix, children }) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');
        const reloadButton = document.querySelector(`.${prefix}-error-reload-btn`);
        
        if(reloadButton){
            reloadButton.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {

                element.classList.add(`${prefix}-tooltip-element`);

                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector(`.${prefix}-tooltip`);
                    
                    if(toolTipExists){
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = `${prefix}-tooltip`;
                    element.appendChild(toolTipElement);

                    CopyClipboard({ text: element.getAttribute('data-clipboard-text'), startCopyStatus: () => {
                        toolTipElement.classList.add(`${prefix}-tooltip-active`);
                    }, endCopyStatus: () => {
                        setTimeout(() => {
                            toolTipElement.remove();
                        }, 800);
                    } });
                });
            });

        }
        return () => {
            if(clipboardElements.length > 0){
                clipboardElements.forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            }

            if(reloadButton){
                reloadButton.removeEventListener('click', () => {});
            }
        };
    }, []);

    return (
        <div className={`${prefix}-error-modal-box-container`}>
            <div className={`${prefix}-error-modal-box`}>
                <div className={`${prefix}-header`}>
                    <div className={`${prefix}-modal-header-inner`}>
                        {Title && <h2>{Title}</h2>}
                    </div>
                    <button
                        type="button"
                        className={`${prefix}-modal-close`}
                        onClick={onClose}
                        title={__('Close', 'automatic-translations-for-polylang')}
                        aria-label={__('Close', 'automatic-translations-for-polylang')}
                    >
                        &times;
                    </button>
                </div>

                <div className={`${prefix}-error-modal-box-body`}>
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(stringifiedMessage) }} />
                    {children}
                </div>

                <div className={`${prefix}-footer`}>
                    <button
                        type="button"
                        className={`${prefix}-footer-button button button-primary`}
                        onClick={onClose}
                    >
                        {__('Back', 'automatic-translations-for-polylang')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
