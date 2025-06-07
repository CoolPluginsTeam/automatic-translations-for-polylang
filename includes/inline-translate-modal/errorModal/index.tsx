import CopyClipboard from "../CopyClipboard/index";
import { useEffect, FC } from 'react';
import styles from '../modal/style.modules.css';
import { Modal } from '@wordpress/components';
import ModalStyle from "./modalStyle";

interface ErrorModalBoxProps {
    message: string;
    onClose: () => void;
    Title?: string;
    children?: React.ReactNode;
}

declare const jQuery: any;

const ErrorModalBox: FC<ErrorModalBoxProps> = ({ message, onClose, Title, children }) => {
    // Safely convert message to HTML string
    let dummyElement: any = jQuery('<div>').append(message);
    const stringifiedMessage: string = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll<HTMLElement>('.chrome-ai-translator-flags');

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {
                element.classList.add(styles.tooltipElement);

                const clickHandler = (e: Event) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector(`.${styles.tooltip}`);
                    if (toolTipExists) {
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = styles.tooltip;
                    element.appendChild(toolTipElement);

                    CopyClipboard({
                        text: element.getAttribute('data-clipboard-text') || '',
                        startCopyStatus: () => {
                            toolTipElement.classList.add(styles.tooltipActive);
                        },
                        endCopyStatus: () => {
                            setTimeout(() => {
                                toolTipElement.remove();
                            }, 800);
                        }
                    });
                };

                element.addEventListener('click', clickHandler);

                // Store handler for cleanup
                (element as any).__atfpClickHandler = clickHandler;
            });

            return () => {
                clipboardElements.forEach(element => {
                    const handler = (element as any).__atfpClickHandler;
                    if (handler) {
                        element.removeEventListener('click', handler);
                        delete (element as any).__atfpClickHandler;
                    }
                });
            };
        }
    }, []);

    return (
        <>
        <ModalStyle modalContainer={styles.ErrorModalContainer} />
        <Modal
          title={Title}
          onRequestClose={onClose}
          className={styles.errorModalBox}
          overlayClassName={styles.ErrorModalContainer}
          isDismissible={true}
          bodyOpenClassName={'body-class'}
          >
            <div className={styles.errorModalBoxBody}><p dangerouslySetInnerHTML={{ __html: stringifiedMessage }} />
            {children}
            </div>
            <div className={styles.errorModalBoxFooter}>
            <button className={styles.errorModalBoxClose} onClick={onClose}>Close</button>
            </div>
        </Modal>
        </>
    );
};

export default ErrorModalBox;
