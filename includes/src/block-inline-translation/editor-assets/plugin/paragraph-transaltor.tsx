import { registerFormatType, insert } from "@wordpress/rich-text";
import { RiTranslateAi2 } from "react-icons/ri";
import { BlockControls } from "@wordpress/block-editor";
import {
  ToolbarButton,
  ToolbarGroup
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import styles from "./paragraph-transaltor.module.css";
import isTranslatorApiAvailable from "../../../inline-translate-modal/is-translator-api-available";
import { createElement } from "@wordpress/element";

export const ToolbarButtonCompat = (props: any) =>
  createElement(ToolbarButton as any, props);

export const RiTranslateAi2Compat = (props: any) =>
  createElement(RiTranslateAi2 as any, props);

export const TranslatorModalCompat = (props: any) =>{
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const TranslatorModal = window?.atfpInlineTranslation?.TranslatorModal;
  
  if (!TranslatorModal) {
    return null;
  }

  return createElement(TranslatorModal as any, props);
}

const ParagraphRewriter = ({ value, onChange }) => {
  const activePageLanguage = (window as any).atfpInlineTranslation?.pageLanguage || 'en';

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [toolbarActive, setToolbarActive] = useState<boolean>(false);

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
    setSelectedText(text);
  }

  const HandlerCloseModal = () => {
    setIsModalOpen(false);
  }

  const HandlerReplaceText = (translatedContent: any) => {
    const updatedContent = insert(
      value,
      translatedContent,
      value.start,
      value.end
    );

    onChange(updatedContent);
    setIsModalOpen(false);
  }

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButtonCompat
            icon={() => (
              <RiTranslateAi2Compat size={20} />
            )}
            title="AI Paragraph Translate"
            className={!toolbarActive ? styles.disabledToolbarIcon : ""}
            onClick={HandlerOpenModal}
          />
        </ToolbarGroup>
      </BlockControls>
      {isModalOpen && (
        <TranslatorModalCompat 
          value={selectedText && '' !== selectedText ? selectedText : value.text.slice(value.start, value.end)} 
          onUpdate={HandlerReplaceText} 
          pageLanguage={activePageLanguage}
          onModalClose={HandlerCloseModal}
          modalOpen={isModalOpen}
        />
      )}
    </>
  );
};

registerFormatType("atfp/paragraph-rewriter", {
  object: false,
  title: "AI Paragraph Rewriter",
  name: "atfp/paragraph-rewriter",
  interactive: true,
  tagName: "atfp-paragraph-rewriter",
  className: null,
  edit: ParagraphRewriter,
});
