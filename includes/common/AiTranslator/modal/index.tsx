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
  const [copyStatus, setCopyStatus] = useState<string>("Copy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safeBrowserError, setSafeBrowserError] = useState<boolean>(false);
  const [errorBtns, setErrorBtns] = useState<ButtonProps[]>([]);
  const safeBrowser = window.location.protocol === 'https:';

  useEffect(() => {
    setLangError("");
    setApiError("");

    if(value === ""){
      setApiError('<span style="color: #ff4646; display: inline-block;">Please enter text in your selected setting to translate.</span>');  
      return;
    }

    // Browser check
    if (!window.hasOwnProperty('chrome') || !navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg')) {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Translator API, which uses local AI models, only works in the Chrome browser. For more details, <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">click here</a>.</span>');
      return;
    }

    if (!isTranslatorApiAvailable()) {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>');
      return;
    }

    if(!isLanguageDetectorPaiAvailable() && !safeBrowser && !safeBrowserError){
      setApiError('<span style="color: #ff4646; display: inline-block;">The Language Detector API is not functioning due to an insecure connection. Please switch to a secure connection or add this URL to the list of insecure origins treated as secure by visiting <strong>chrome://flags/#unsafely-treat-insecure-origin-as-secure</strong>. Or you can continue without detection by clicking on the "Continue Without Detection" button and select the language manually.</span>');
      setSafeBrowserError(true);
      setErrorBtns([
        {
          label: 'Continue Without Detection',
          className: styles.btnContinueStyle,
          onClick: () => {
            setSourceLang("not-selected");
            setApiError("");
            setErrorBtns([]);
            setSafeBrowserError(true);
          }
        },
        {
          label: 'Close',
          className: styles.btnCloseStyle,
          onClick: () => {
            HandlerCloseModal();
          }
        },
      ]);
      return;
    }else if (!isLanguageDetectorPaiAvailable() && !safeBrowserError) {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Language Detector AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Language Detector AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost" target="_blank">click here</a>. Or you can continue without detection by clicking on the "Continue Without Detection" button and select the language manually.</span>');

      setErrorBtns([
        {
          label: 'Continue Without Detection',
          className: styles.btnContinueStyle,
          onClick: () => {
            setSourceLang("not-selected");
            setApiError("");
            setErrorBtns([]);
            setSafeBrowserError(true);
          }
        },
        {
          label: 'Close',
          className: styles.btnCloseStyle,
          onClick: () => {
            HandlerCloseModal();
          }
        },
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
    setLangError("");
    setApiError("");
    setTranslatedContent("");
    setErrorBtns([]);
    setSafeBrowserError(false);
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

  const HandlerTranslate = async (targetLang, sourceLang) => {
    setTranslatedContent("");

    if(!Object.keys(languages).includes(targetLang)){
      setLangError(`<span style="color: #ff4646; display: inline-block;">Translation to ${notSupportedLang[targetLang].replace(' (Not Supported)', '')} (${targetLang}) is not available. Please select a supported target language from the dropdown menu.</span>`);
      return;
    }
    const text = selectedText && '' !== selectedText ? selectedText : value;


    const translatorObject = new Translator(sourceLang, targetLang, languages[targetLang]);

    const status = await translatorObject.LanguagePairStatus();


    if (status !== true && status.hasOwnProperty('error') && status.error !== "") {
      setLangError(status.error);
      return;
    } else if (langError !== "") {
      setLangError("");
    }

    if (!translatorObject || !translatorObject.hasOwnProperty('startTranslation')) {
      return;
    }

    setIsLoading(true);

    let element: HTMLDivElement | null = document.createElement('div');
    element.innerHTML=text;

    const allNodes=element.childNodes;

    const translateOnlyText= async(allNodes, index)=>{
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

  const HandlerCopyText = async (e) => {
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

  return (isModalOpen ? (
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
            {langError && langError !== "" && <div className={styles.error} dangerouslySetInnerHTML={{ __html: langError }}></div>}
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
  ) : null);
}

export default TranslatorModal;