import { useState, useRef, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import styles from './style.modules.css';
import Translator from "../Translator";
import isTranslatorApiAvailable from "../isTranslatorApiAvailable";
import languages from "../Languages";
import isLanguageDetectorPaiAvailable from "../isLanguageDetectorPaiAvailable";
import LanguageDetector from "../LanguageDetector";
import Languages from "../Languages";
import Skeleton from 'react-loading-skeleton';
import skeletonStyles from 'react-loading-skeleton/dist/skeleton.css'
import ModalStyle from './modalStyle';
import ButtonGroup from './ButtonGroup';
import { svgIcons } from './svgIcons';
import ErrorModalBox from '../errorModal';

import {
  Modal,
  Button,
  SelectControl,
} from "@wordpress/components";

interface TranslateModalProps {
  value: string;
  onUpdate: (value: string) => void;
  pageLanguage: string;
  onModalClose?: () => void;
  modalOpen: boolean;
}

interface ButtonProps {
  label: string;
  className?: string;
  onClick: () => void;
}

const TranslatorModal: React.FC<TranslateModalProps> = ({value, onUpdate, pageLanguage, onModalClose, modalOpen}) => {
  let activeSourceLang = 'hi';
  let activeTargetLang = 'es';
  let notSupportedLang = {};

  if (pageLanguage) {
    const activePageLanguage = pageLanguage;

    if (activePageLanguage && '' !== activePageLanguage) {
      activeTargetLang = activePageLanguage;
      if (activePageLanguage === 'en') {
        activeSourceLang = 'es';
      }

      if(!Object.keys(languages).includes(activePageLanguage)){
        notSupportedLang[activePageLanguage] = pageLanguage + ' (Not Supported)';
      }
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(modalOpen);
  const [selectedText, setSelectedText] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>(activeSourceLang);
  const [targetLang, setTargetLang] = useState<string>(activeTargetLang);
  const [targetLanguages, setTargetLanguages] = useState<Array<string>>(Object.keys({...Languages,...notSupportedLang}).filter((lang) => lang !== activeSourceLang));
  const [apiError, setApiError] = useState<string>("");
  const [langError, setLangError] = useState<string>("");
  const [shortLangError, setShortLangError] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("Copy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorBtns, setErrorBtns] = useState<ButtonProps[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const safeBrowser = window.location.protocol === 'https:';
  const clipBoard=window?.navigator?.clipboard;

  useEffect(() => {
    setLangError("");
    setApiError("");

    if(value === ""){
      setApiError('<span style="color: #ff4646; display: inline-block;">Please enter text in your selected setting to translate.</span>');  
      return;
    }

    // Browser check
    if (!window.hasOwnProperty('chrome') || !navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg')) {
      setLangError(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <strong>Important Notice:</strong>
          <ol>
              <li>The Translator API, which leverages Chrome local AI models, is designed specifically for use with the Chrome browser.</li>
              <li>For comprehensive information about the Translator API, <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">click here</a>.</li>
          </ol>
          <p>Please ensure you are using the Chrome browser for optimal performance and compatibility.</p>
      </span>`);
      return;
    }

    if (!isTranslatorApiAvailable() && !safeBrowser && !clipBoard) {
      setLangError(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
                <strong>Important Notice:</strong>
                <ol>
                    <li>
                        The Translator API is not functioning due to an insecure connection.
                    </li>
                    <li>
                        Please switch to a secure connection (HTTPS) or add this URL to the list of insecure origins treated as secure by visiting 
                        <span data-clipboard-text="chrome://flags/#unsafely-treat-insecure-origin-as-secure" target="_blank" class="chrome-ai-translator-flags">
                            chrome://flags/#unsafely-treat-insecure-origin-as-secure ${svgIcons({iconName: 'copy'})}
                        </span>.
                        Click on the URL to copy it, then open a new window and paste this URL to access the settings.
                    </li>
                </ol>
            </span>`);
      return;
    }else if(!isTranslatorApiAvailable()){
      setLangError(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Steps to Enable the Translator AI Modal:</h4>
          <ol>
              <li>Open this URL in a new Chrome tab: <strong><span data-clipboard-text="chrome://flags/#translation-api" target="_blank" class="chrome-ai-translator-flags">chrome://flags/#translation-api ${svgIcons({iconName: 'copy'})}</span></strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
              <li>Ensure that the <strong>Experimental translation API</strong> option is set to <strong>Enabled</strong>.</li>
              <li>Click on the <strong>Save</strong> button to apply the changes.</li>
              <li>The Translator AI modal should now be enabled and ready for use.</li>
          </ol>
          <p>For more information, please refer to the <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">documentation</a>.</p>   
          <p>If the issue persists, please ensure that your browser is up to date and restart your browser.</p>
          <p>If you continue to experience issues after following the above steps, please <a href="https://my.coolplugins.net/account/support-tickets/" target="_blank" rel="noopener">open a support ticket</a> with our team. We are here to help you resolve any problems and ensure a smooth translation experience.</p>
      </span>`)

      return;
    } 

    if(!isLanguageDetectorPaiAvailable() && !safeBrowser && !clipBoard){
      setLangError(`<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Important Notice:</h4>
          <ol>
              <li>
                  The Language Detection API is not functioning due to an insecure connection.
              </li>
              <li>
                  Please switch to a secure connection (HTTPS) or add this URL to the list of insecure origins treated as secure by visiting 
                  <strong><span data-clipboard-text="chrome://flags/#unsafely-treat-insecure-origin-as-secure" target="_blank" class="chrome-ai-translator-flags">chrome://flags/#unsafely-treat-insecure-origin-as-secure ${svgIcons({iconName: 'copy'})}</span></strong>.
                  Copy the URL and open a new window and paste this URL to access the settings.
              </li>
          </ol>
      </span>`);

      setErrorBtns([
        {
          label: 'Continue Without Detection',
          className: styles.btnContinueStyle,
          onClick: () => {
            setSourceLang("not-selected");
            setLangError("");
            setErrorBtns([]);
            setIsErrorModalOpen(false);
            setIsModalOpen(true);
          }
        }
      ]);
      return;
    }else if (!isLanguageDetectorPaiAvailable()) {
      setLangError(`<span style="color: #ff4646; display: inline-block;">
        <h4>Language Detection API is not available:</h4>
        <ol>
              <li>
                Open a new Chrome tab and go to 
                <strong>
                  <span data-clipboard-text="chrome://flags/#language-detection-api" target="_blank" class="chrome-ai-translator-flags">
                    chrome://flags/#language-detection-api ${svgIcons({iconName: 'copy'})}
                  </span>
                </strong>. Click to copy, then paste it in the address bar.
              </li>
              <li>Enable the <strong>Experimental language detection API</strong> flag.</li>
              <li>
                For more details, see the 
                <a href="https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost" target="_blank">
                  official documentation
                </a>.
              </li>
              <li>
                You can also continue without detection by clicking the "Continue Without Detection" button and select the language manually.
              </li>
            </ol>
      </span>`);

      setErrorBtns([
        {
          label: 'Continue Without Detection',
          className: styles.btnContinueStyle,
          onClick: () => {
            setSourceLang("not-selected");
            setLangError("");
            setErrorBtns([]);
            setIsErrorModalOpen(false);
            setIsModalOpen(true);
          }
        }
      ]);
      return;
    }

    setSelectedText(value);

    if(isLanguageDetectorPaiAvailable()){
      DetectLanguage(value);
    }
  }, []);

  const HandlerCloseModal = () => {
    setIsModalOpen(false);
    setIsErrorModalOpen(false);
    setLangError("");
    setShortLangError("");
    setApiError("");
    setTranslatedContent("");
    setErrorBtns([]);
    onModalClose && onModalClose();
  }

  const DetectLanguage = async (text) => {
    const languageDetector = new LanguageDetector(Object.keys(Languages));
    const status = await languageDetector.Status();


    if (status) {
      const result = await languageDetector.Detect(text);

      if (result) {
        if (result === targetLang) {
          HandlerSourceLanguageChange(result);
        } else {
          HandlerSourceLanguageChange(result);
        }
      } else {
        HandlerTranslate(targetLang, sourceLang);
      }
    } else {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Language Detector AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Language Detector AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost" target="_blank">click here</a>.</span>');
      return;
    }
  }

  const HandlerSourceLanguageChange = async (value) => {
    setSourceLang(value);

    if(value === targetLang || Object.values(targetLanguages).includes(value)){
      const targetLanges=value !== targetLang ? {...Languages,...notSupportedLang} : Languages;
      setTargetLanguages(Object.keys(targetLanges).filter((lang) => lang !== value));
      value === targetLang && setTargetLang(Object.keys(targetLanges).filter((lang) => lang !== value)[0]);
    }

    let activeTargetLang = targetLang;

    if (targetLang === value) {
      activeTargetLang = Object.keys(Languages).filter((lang) => lang !== value)[0];
      setTargetLang(activeTargetLang);
    }

    HandlerTranslate(activeTargetLang, value);
  }

  const HandlerTargetLanguageChange = async (value) => {
    setTargetLang(value);

    if(Object.keys(notSupportedLang).length > 0 && Object.values(targetLanguages).includes(Object.keys(notSupportedLang)[0])){
      setTargetLanguages(Object.keys(Languages).filter((lang) => lang !== sourceLang));
    }

    if(sourceLang === "not-selected"){
      return;
    }

    HandlerTranslate(value, sourceLang);
  }

  const HandlerTranslate = async (targetLang: string, sourceLang: string) => {
    setTranslatedContent("");

    if(!Object.keys(languages).includes(targetLang)){
      setShortLangError(`<span style="color: #ff4646; display: inline-block;">Translation to ${notSupportedLang[targetLang].replace(' (Not Supported)', '')} (${targetLang}) is not available. Please select a supported target language from the dropdown menu.</span>`);
      return;
    }

    const text = selectedText && '' !== selectedText ? selectedText : value;


    const translatorObject = new Translator(sourceLang, targetLang, languages[targetLang], languages[sourceLang]);

    const status = await translatorObject.LanguagePairStatus();


    if (status !== true && status.hasOwnProperty('error') && status.error !== "") {
      setLangError(status.error);
      setShortLangError("");
      return;
    } else if (langError !== "") {
      setLangError("");
      setShortLangError("");
    }

    if (!translatorObject || !translatorObject.hasOwnProperty('startTranslation')) {
      return;
    }

    setIsLoading(true);

    let element: HTMLDivElement | null = document.createElement('div');
    element.innerHTML=text;

    const allNodes=element.childNodes;

    const translateOnlyText= async(allNodes: string | any[] | NodeListOf<ChildNode>, index: number)=>{
      if(index >= allNodes.length){
        return;
      }

      if(allNodes[index].nodeType===3){
        const translatedText = await translatorObject.startTranslation(allNodes[index].textContent);
        allNodes[index].textContent=translatedText;
      }else{
        const allChildNodes=allNodes[index].childNodes;
        await translateOnlyText(allChildNodes, 0);
      }

      await translateOnlyText(allNodes, index+1);
    }
    
    if(allNodes.length > 0){
      await translateOnlyText(allNodes, 0);
    }
    
    const translatedText=element.innerHTML;

    element = null;

    setTranslatedContent(translatedText);
    setIsLoading(false);
  };

  const HandlerReplaceText = () => {
    onUpdate(translatedContent);
    HandlerCloseModal();
  }

  const HandlerCopyText = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!translatedContent || translatedContent === "") return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(translatedContent);
      } else {
        // Fallback method if Clipboard API is not supported
        const textArea = document.createElement('textarea');
        textArea.value = translatedContent;
        document.body.appendChild(textArea);
        textArea.select();
        if (document.execCommand) {
          document.execCommand('copy');
        }
        document.body.removeChild(textArea);
      }

      setCopyStatus("Copied");
      setTimeout(() => setCopyStatus("Copy"), 1000); // Reset to "Copy" after 2 seconds
    } catch (err) {
      console.error('Error copying text to clipboard:', err);
    }
  }

  const HandlerLanguageError = () => {
    setIsErrorModalOpen(true);
    setIsModalOpen(false);
  }

  return (isErrorModalOpen ? <ErrorModalBox message={langError} onClose={() => {setIsErrorModalOpen(false); setIsModalOpen(true)}} Title={__("Chrome built-in translator AI", 'autopoly-ai-translation-for-polylang')}>
    {errorBtns.length > 0 && <ButtonGroup className={styles.errorBtnGroup} buttons={errorBtns} />}
  </ErrorModalBox> : isModalOpen ? (
    isModalOpen ? (
      <>
      <ModalStyle modalContainer={styles.modalContainer} />
      <Modal
        title="Chrome built-in translator AI"
        onRequestClose={HandlerCloseModal}
        className={styles.modalContainer}
        overlayClassName={styles.modalOverlay}
        isDismissible={false}
        bodyOpenClassName={'body-class'}
      >
        <div className={styles.modalCloseButton} onClick={HandlerCloseModal}>&times;</div>
        {apiError && apiError !== "" ? (
          <div className={styles.error}><p dangerouslySetInnerHTML={{ __html: apiError }} />{errorBtns.length > 0 && <ButtonGroup className={styles.errorBtnGroup} buttons={errorBtns} />}</div>
        ) : (
          <div className={styles.modal}>
  
            <div className={styles.controls}>
              <div className={styles.langWrapper}>
                <SelectControl
                  label="Source Language"
                  value={sourceLang}
                  options={[...sourceLang !== "not-selected" ? [] : [{
                    label: 'Select Language',
                    value: 'not-selected',
                  }], ...Object.keys(Languages).filter((lang) => lang !== notSupportedLang).map((lang) => ({
                    label: Languages[lang],
                    value: lang,
                  }))]}
                  onChange={(value) => HandlerSourceLanguageChange(value)}
                  className={styles.translatedContent}
                />
                <SelectControl
                  label="Target Language"
                  value={targetLang}
                  options={targetLanguages.map((lang) => ({
                    label: Languages[lang] || notSupportedLang[lang],
                    value: lang,
                  }))}
                  onChange={(value) => HandlerTargetLanguageChange(value)}
                  className={styles.translatedContent}
                />
              </div>
              {langError && langError !== "" && (
                <div className={styles.languageErrorButtonWrapper}>
                  <button className={styles.languageErrorButton} onClick={HandlerLanguageError}>
                    {__("Language Error Details", 'autopoly-ai-translation-for-polylang')}
                  </button>
                </div>
              )}
              {shortLangError && shortLangError !== "" && (
                <div className={styles.error}><p dangerouslySetInnerHTML={{ __html: shortLangError }} /></div>
              )}
              {isLoading && !langError && <Skeleton 
                count={1}
                height='70px'
                width="100%"
                className={skeletonStyles['react-loading-skeleton']}
              />}
              {translatedContent && (!langError || langError === "") && !isLoading && translatedContent !== "" &&
                <>
                  <div className={styles.translatedContent}><label>Translated Text</label><p>{translatedContent}</p></div>
                  <div className={styles.translatedButtonWrp}>
                    <Button
                      className={styles.replaceBtn + " " + styles.btnStyle}
                      onClick={HandlerReplaceText}
                    >
                      Replace
                    </Button>
                    <Button
                      className={styles.copyBtn + " " + styles.btnStyle}
                      onClick={HandlerCopyText}
                    >
                      {copyStatus}
                    </Button>
                    <Button
                      className={styles.closeBtn + " " + styles.btnStyle}
                      onClick={HandlerCloseModal}
                    >
                      Close
                    </Button>
                  </div>
                </>
              }
            </div>
          </div>
        )}
      </Modal>
      </>
    ) : null
  ) : null);
}

export default TranslatorModal;