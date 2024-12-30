import { registerFormatType, insert } from "@wordpress/rich-text";
import { RiTranslateAi2 } from "react-icons/ri";
import { BlockControls } from "@wordpress/block-editor";
import { SelectControl } from "@wordpress/components";
import {
  ToolbarButton,
  ToolbarGroup,
  Modal,
  Button,
  TextareaControl,
} from "@wordpress/components";
import { useState, useRef, useEffect } from "@wordpress/element";
import styles from "./ParagraphTranslator.module.css";
import Translator from "../common/Translator";
import isTranslatorApiAvailable from "../common/isTranslatorApiAvailable";
import Languages from "../common/Languages";
import languages from "../common/Languages";
import isLanguageDetectorPaiAvailable from "../common/isLanguageDetectorPaiAvailable";
import LanguageDetector from "../common/LanguageDetector";

const ParagraphRewriter = ({ value, onChange }) => {
  let activeSourceLang = 'hi';
  let activeTargetLang = 'es';

  const atfpBlockTranslator = (window as any).atfpBlockTranslator; // Type assertion to bypass TypeScript error
  if (atfpBlockTranslator && typeof atfpBlockTranslator === 'object' && 'pageLanguage' in atfpBlockTranslator) {
    const activePageLanguage = atfpBlockTranslator.pageLanguage;

    if (activePageLanguage && '' !== activePageLanguage) {
      activeTargetLang = activePageLanguage;
      if (activePageLanguage === 'en') {
        activeSourceLang = 'es';
      }
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [toolbarActive, setToolbarActive] = useState<boolean>(false);
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sourceLang, setSourceLang] = useState<string>(activeSourceLang);
  const [targetLang, setTargetLang] = useState<string>(activeTargetLang);
  const [targetLanguages, setTargetLanguages] = useState<string[]>(Object.keys(Languages).filter((lang) => lang !== activeSourceLang));
  const [apiError, setApiError] = useState<string>("");
  const [langError, setLangError] = useState<string>("");


  useEffect(() => {
    if (
      value &&
      value.text.trim() !== "" &&
      value.start !== value.end &&
      !toolbarActive
    ) {
      setToolbarActive(true);
    } else if (toolbarActive && (!value || value.text.trim() === "" || value.start === value.end)) {
      setToolbarActive(false);
    }
  }, [value]);

  const HandlerOpenModal = () => {
    if (!toolbarActive) {
      return;
    }

    const text = value.text.slice(value.start, value.end);

    setIsModalOpen(true);
    setLangError("");
    setApiError("");

    // Browser check
    if (!window.hasOwnProperty('chrome') || !navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg')) {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Translator API, which uses local AI models, only works in the Chrome browser. For more details, <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank">click here</a>.</span>');
      return;
    }

    if (!isTranslatorApiAvailable()) {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>');
      return;
    }

    if(!isLanguageDetectorPaiAvailable()){
      setApiError('<span style="color: #ff4646; display: inline-block;">The Language Detector AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Language Detector AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost" target="_blank">click here</a>.</span>');
      return;
    }

    setSelectedText(text);
    window.setTimeout(() => textareaRef.current?.focus(), 100);

    DetectLanguage(text);
  }

  const HandlerCloseModal = () => {
    setIsModalOpen(false);
    setLangError("");
    setApiError("");
    setTranslatedContent("");
  }

  const DetectLanguage = async (text: string) => {
    const languageDetector = new LanguageDetector(Object.keys(Languages));
    const status = await languageDetector.Status();

    if (status) {
      const result = await languageDetector.Detect(text);

      if (result) {
        if (result === targetLang) {
          HandlerSourceLanguageChange(result);
        } else {
          HandlerSourceLanguageChange(result);
          HandlerTranslate(targetLang, result, text);
        }
      } else {
        HandlerTranslate(targetLang, sourceLang, text);
      }
    } else {
      setApiError('<span style="color: #ff4646; display: inline-block;">The Language Detector AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Language Detector AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/language-detection#add_support_to_localhost" target="_blank">click here</a>.</span>');
      return;
    }
  }

  const HandlerSourceLanguageChange = async (value: string) => {
    setSourceLang(value);
    setTargetLanguages(Object.keys(Languages).filter((lang) => lang !== value));
    HandlerTranslate(targetLang, value, selectedText);
  }

  const HandlerTargetLanguageChange = async (value: string) => {
    setTargetLang(value);
    HandlerTranslate(value, sourceLang, selectedText);
  }

  const HandlerTranslate = async (targetLang: string, sourceLang: string, text: string) => {
    setTranslatedContent("");

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

    const translatedText = await translatorObject.startTranslation(text);

    setTranslatedContent(translatedText);
  };

  const HandlerReplaceText = () => {
    const updatedContent = insert(
      value,
      translatedContent,
      value.start,
      value.end
    );

    onChange(updatedContent);
    setIsModalOpen(false);
  }

  const HandlerCopyText = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(translatedContent);
      } else {
        console.log('Clipboard API not supported');
      }
    } catch (err) {
      console.error('Error copying text to clipboard:', err);
    }
  }

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={() => (
              <RiTranslateAi2 size={20} />
            )}
            title="AI Paragraph Translate"
            className={!toolbarActive ? styles.disabledToolbarIcon : ""}
            onClick={HandlerOpenModal}
          />
        </ToolbarGroup>
      </BlockControls>
      {isModalOpen && (
        <Modal
          title="Chrome built-in translator AI"
          onRequestClose={HandlerCloseModal}
        >
          {apiError && apiError !== "" ? (
            <div className={styles.error} dangerouslySetInnerHTML={{ __html: apiError }}></div>
          ) : (
            <div className={styles.modal}>

              <div className={styles.controls}>
                <div className={styles.langWrapper}>
                  <SelectControl
                    label="Source Language"
                    value={sourceLang}
                    options={Object.keys(Languages).map((lang) => ({
                      label: Languages[lang],
                      value: lang,
                    }))}
                    onChange={(value) => HandlerSourceLanguageChange(value)}
                  />
                  <SelectControl
                    label="Target Language"
                    value={targetLang}
                    options={targetLanguages.map((lang) => ({
                      label: Languages[lang],
                      value: lang,
                    }))}
                    onChange={(value) => HandlerTargetLanguageChange(value)}
                  />
                </div>
                {langError && langError !== "" && <div className={styles.error} dangerouslySetInnerHTML={{ __html: langError }}></div>}
                {translatedContent && translatedContent !== "" &&
                  <>
                    <div className={styles.translatedContent}><label>Translated Text</label><p>{translatedContent}</p></div>
                    <div className={styles.translatedButtonWrp}>
                      <Button
                        className={styles.replaceBtn + " " + styles.btnStyle}
                        onClick={HandlerReplaceText}
                      >
                        Replace Text
                      </Button>
                      <Button
                        className={styles.copyBtn + " " + styles.btnStyle}
                        onClick={HandlerCopyText}
                      >
                        Copy Text
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
      )}
    </>
  );
};

if (isTranslatorApiAvailable()) {
  registerFormatType("atfp/paragraph-rewriter", {
    title: "AI Paragraph Rewriter",
    name: "atfp/paragraph-rewriter",
    interactive: true,
    tagName: "atfp-paragraph-rewriter",
    className: null,
    edit: ParagraphRewriter,
  });
}
