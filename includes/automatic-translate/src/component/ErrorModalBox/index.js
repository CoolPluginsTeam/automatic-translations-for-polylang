import CopyClipboard from "../CopyClipboard";
import { useEffect } from "@wordpress/element";

const ErrorModalBox = ({ message, onClose, Title }) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {

                element.classList.add('atfp-tooltip-element');

                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector('.atfp-tooltip');
                    
                    if(toolTipExists){
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = 'atfp-tooltip';
                    element.appendChild(toolTipElement);

                    CopyClipboard({ text: element.getAttribute('data-clipboard-text'), startCopyStatus: () => {
                        toolTipElement.classList.add('atfp-tooltip-active');
                    }, endCopyStatus: () => {
                        setTimeout(() => {
                            toolTipElement.remove();
                        }, 800);
                    } });
                });
            });

            return () => {
                clipboardElements.forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            };
        }
    }, []);

    return (
        <div className="atfp-error-modal-box-container">
            <div className="atfp-error-modal-box">
                <div className="atfp-error-modal-box-header">
                    <span className="atfp-error-modal-box-close" onClick={onClose}>×</span>
                    {Title && <h3>{Title}</h3>}
                </div>
                <div className="atfp-error-modal-box-body">
                    <p dangerouslySetInnerHTML={{ __html: stringifiedMessage }} />
                </div>
                <div className="atfp-error-modal-box-footer">
                    <button className="atfp-error-modal-box-close" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
