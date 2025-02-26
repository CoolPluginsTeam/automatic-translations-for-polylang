import SettingModal from './settingModal';
import './global-store';
import { useEffect, useState } from 'react';
import GutenbergPostFetch from './FetchPost/Gutenberg';
import UpdateGutenbergPage from './createTranslatedPost/Gutenberg';
import ProVersionNotice from './component/ProVersionNotice';

// Elementor post fetch and update page
import ElementorPostFetch from './FetchPost/Elementor';
import ElementorUpdatePage from './createTranslatedPost/Elementor';

import ReactDOM from "react-dom/client";

const editorType = window.atfp_global_object.editor_type;

const init = () => {
  let atfpModals = new Array();
  const atfpSettingModalWrp = '<!-- The Modal --><div id="atfp-setting-modal"></div>';
  const atfpStringModalWrp = '<div id="atfp_strings_model" class="modal atfp_custom_model"></div>';

  atfpModals.push(atfpSettingModalWrp, atfpStringModalWrp);

  atfpModals.forEach(modal => {
    document.body.insertAdjacentHTML('beforeend', modal);
  });
}

const App = () => {
  const [pageTranslate, setPageTranslate] = useState(false);
  const targetLang = window.atfp_global_object.target_lang;
  const postId = window.atfp_global_object.parent_post_id;
  const currentPostId = window.atfp_global_object.current_post_id;
  const postType = window.atfp_global_object.post_type;
  let translatePost, fetchPost, translateWrpSelector;
  const sourceLang = window.atfp_global_object.source_lang;

  // Elementor post fetch and update page
  if(editorType === 'elementor'){
    translateWrpSelector = 'button.atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = ElementorUpdatePage;
    fetchPost = ElementorPostFetch;
  }else if(editorType === 'gutenberg'){
    translateWrpSelector = 'input#atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = UpdateGutenbergPage;
    fetchPost = GutenbergPostFetch;
  }

  const [postDataFetchStatus, setPostDataFetchStatus] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchPostData = async (data) => {
    await fetchPost(data);

    const allEntries = wp.data.select('block-atfp/translate').getTranslationEntry();

    let totalCharacterCount = 0;
    let totalWordCount = 0;

    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;

      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });

    wp.data.dispatch('block-atfp/translate').translationInfo({ sourceWordCount: totalWordCount, sourceCharacterCount: totalCharacterCount });
  }

  const updatePostDataFetch = (status) => {
    setPostDataFetchStatus(status);
    setLoading(false);
  }

  const handlePageTranslate = (status) => {
    setPageTranslate(status);
  };

  useEffect(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector(translateWrpSelector);
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
      }
    }
  }, [pageTranslate]);

  if(!sourceLang || '' === sourceLang) {
    const metaFieldBtn = document.querySelector(translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.title = `Parent ${window.atfp_global_object.post_type} may be deleted.`;
      metaFieldBtn.disabled = true;
    }
    return;
  }

  return (
    <>
      {!pageTranslate && sourceLang && '' !== sourceLang && <SettingModal contentLoading={loading} updatePostDataFetch={updatePostDataFetch} postDataFetchStatus={postDataFetchStatus} pageTranslate={handlePageTranslate} postId={postId} currentPostId={currentPostId} targetLang={targetLang} postType={postType} fetchPostData={fetchPostData} translatePost={translatePost} translateWrpSelector={translateWrpSelector} />}
    </>
  );
};

/**
 * Creates a message popup based on the post type and target language.
 * @returns {HTMLElement} The created message popup element.
 */
const createMessagePopup = () => {
  const postType = window.atfp_global_object.post_type;
  const targetLang = window.atfp_global_object.target_lang;
  const targetLangName = atfp_global_object.languageObject[targetLang];

  const messagePopup = document.createElement('div');
  messagePopup.id = 'atfp-modal-open-warning-wrapper';
  messagePopup.innerHTML = `
    <div class="modal-container" style="display: flex">
      <div class="modal-content">
        <p>Would you like to duplicate your original ${postType} content and have it automatically translated into ${targetLangName}?</p>
        <div>
          <button data-value="yes">Yes</button>
          <button data-value="no">No</button>
        </div>
      </div>
    </div>`;
  return messagePopup;
};

/**
 * Inserts the message popup into the DOM.
 */
const insertMessagePopup = () => {
  const targetElement = document.getElementById('atfp-setting-modal');
  const messagePopup = createMessagePopup();
  document.body.insertBefore(messagePopup, targetElement);
};

/**
 * Elementor translate button append
 */
const appendElementorTranslateBtn = () => {
  const translateButtonGroup = jQuery('.MuiButtonGroup-root.MuiButtonGroup-contained').parent();
  const buttonElement=jQuery(translateButtonGroup).find('.elementor-button.atfp-translate-button');
  if(translateButtonGroup.length > 0 && buttonElement.length === 0){
    const buttonHtml = '<button class="elementor-button atfp-translate-button" name="atfp_meta_box_translate">Translate</button>';
    const buttonElement = jQuery(buttonHtml);

    translateButtonGroup.prepend(buttonElement);
    $e.internal('document/save/set-is-modified', { status: true });

    if(!window.atfp_global_object.translation_data || (!window.atfp_global_object.translation_data.total_string_count && 0 !== window.atfp_global_object.translation_data.total_string_count)  ){
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }

    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if(characterCount > 500000){
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = ReactDOM.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(<ProVersionNotice characterCount={characterCount} url={window.atfp_global_object.pro_version_url || ''} />);
      return;
    }

    if('' === window.atfp_global_object.elementorData || window.atfp_global_object.elementorData.length < 1 || elementor.elements.length < 1){
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation is not available because there is no Elementor data.');
      return;
    }
    // Append app root wrapper in body
    init();
  
    const root = ReactDOM.createRoot(document.getElementById('atfp-setting-modal'));
    root.render(<App />);
  }

}

if (editorType === 'gutenberg') {
  // Render App
  window.addEventListener('load', () => {

    // Append app root wrapper in body
    init();

    const buttonElement = jQuery('input#atfp-translate-button[name="atfp_meta_box_translate"]');

    if(!window.atfp_global_object.translation_data || !window.atfp_global_object.translation_data.total_string_count ){
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }

    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if(characterCount > 500000){
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = ReactDOM.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(<ProVersionNotice characterCount={characterCount} url={window.atfp_global_object.pro_version_url || ''} />);
      return;
    }

    const sourceLang = window.atfp_global_object.source_lang

    if(sourceLang && '' !== sourceLang){
      insertMessagePopup();
    }

    const root = ReactDOM.createRoot(document.getElementById('atfp-setting-modal'));
    root.render(<App />);
  });
}

// Elementor translate button append
if (editorType === 'elementor') {
  jQuery(window).on('elementor:init', function () {
    elementor.on('document:loaded', appendElementorTranslateBtn);
  });
}
