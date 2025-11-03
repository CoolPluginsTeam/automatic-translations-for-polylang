import SettingModal from './popup-setting-modal';
import './global-store';
import { useEffect, useState } from 'react';
import GutenbergPostFetch from './fetch-post/gutenberg';
import UpdateGutenbergPage from './create-translated-post/gutenberg';
import ProVersionNotice from './component/pro-version-notice';
import Notice from './component/notice';
import { select } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

// Elementor post fetch and update page
import ElementorPostFetch from './fetch-post/elementor';
import ElementorUpdatePage from './create-translated-post/elementor';

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

const StringModalBodyNotice = () => {

  const notices = [];

  if (editorType === 'gutenberg') {

    const postMetaSync = atfp_global_object.postMetaSync === 'true';

    if (postMetaSync) {
      notices.push({
        className: 'atfp-notice atfp-notice-error', message: <p>
          {__('For accurate custom field translations, please disable the Custom Fields synchronization in ', 'autopoly-ai-translation-for-polylang')}
          <a
            href={`${atfp_global_object.admin_url}admin.php?page=mlang_settings`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {__('Polylang settings', 'autopoly-ai-translation-for-polylang')}
          </a>
          {__('. This may affect linked posts or pages.', 'autopoly-ai-translation-for-polylang')}
        </p>
      });
    }

    const blockRules = select('block-atfp/translate').getBlockRules();

    if (!blockRules.AtfpBlockParseRules || Object.keys(blockRules.AtfpBlockParseRules).length === 0) {
      notices.push({ className: 'atfp-notice atfp-notice-error', message: <p>{__('No block rules were found. It appears that the block-rules.JSON file could not be fetched, possibly because it is blocked by your server settings. Please check your server configuration to resolve this issue.', 'autopoly-ai-translation-for-polylang')}</p> });
    }
  }

  const noticeLength = notices.length;

  if (notices.length > 0) {
    return notices.map((notice, index) => <Notice className={notice.className} key={index} lastNotice={index === noticeLength - 1}>{notice.message}</Notice>);
  }

  return;
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
  if (editorType === 'elementor') {
    translateWrpSelector = 'button.atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = ElementorUpdatePage;
    fetchPost = ElementorPostFetch;
  } else if (editorType === 'gutenberg') {
    translateWrpSelector = 'input#atfp-translate-button[name="atfp_meta_box_translate"]';
    translatePost = UpdateGutenbergPage;
    fetchPost = GutenbergPostFetch;
  }

  const [postDataFetchStatus, setPostDataFetchStatus] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchPostData = async (data) => {
    await fetchPost(data);

    const allEntries = wp.data.select('block-atfp/translate').getTranslationEntry();

    let totalStringCount = 0;
    let totalCharacterCount = 0;
    let totalWordCount = 0;

    allEntries.map(entries => {
      const source = entries.source ? entries.source : '';
      const stringCount = source.split(/(?<=[.!?]+)\s+/).length;
      const wordCount = source.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;
      const characterCount = source.length;

      totalStringCount += stringCount
      totalCharacterCount += characterCount;
      totalWordCount += wordCount;
    });

    wp.data.dispatch('block-atfp/translate').translationInfo({ sourceStringCount: totalStringCount, sourceWordCount: totalWordCount, sourceCharacterCount: totalCharacterCount });
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
        metaFieldBtn.value = __("Already Translated", 'autopoly-ai-translation-for-polylang');
      }
    }
  }, [pageTranslate]);

  if (!sourceLang || '' === sourceLang) {
    const metaFieldBtn = document.querySelector(translateWrpSelector);
    if (metaFieldBtn) {
      metaFieldBtn.title = `Parent ${window.atfp_global_object.post_type} may be deleted.`;
      metaFieldBtn.disabled = true;
    }
    return;
  }

  return (
    <>
      {!pageTranslate && sourceLang && '' !== sourceLang && <SettingModal contentLoading={loading} updatePostDataFetch={updatePostDataFetch} postDataFetchStatus={postDataFetchStatus} pageTranslate={handlePageTranslate} postId={postId} currentPostId={currentPostId} targetLang={targetLang} postType={postType} fetchPostData={fetchPostData} translatePost={translatePost} translateWrpSelector={translateWrpSelector} stringModalBodyNotice={StringModalBodyNotice} />}
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
  const targetLangName = atfp_global_object.languageObject[targetLang]['name'];

  const messagePopup = document.createElement('div');
  messagePopup.id = 'atfp-modal-open-warning-wrapper';
  messagePopup.innerHTML = `
    <div class="modal-container" style="display: flex">
      <div class="modal-content">
        <p>${sprintf(__("Would you like to duplicate your original %s content and have it automatically translated into %s?", 'autopoly-ai-translation-for-polylang'), postType, targetLangName)}</p>
        <div>
          <div data-value="yes">${__("Yes", 'autopoly-ai-translation-for-polylang')}</div>
          <div data-value="no">${__("No", 'autopoly-ai-translation-for-polylang')}</div>
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
  const buttonElement = jQuery(translateButtonGroup).find('.elementor-button.atfp-translate-button');
  if (translateButtonGroup.length > 0 && buttonElement.length === 0) {
    const buttonHtml = '<button class="elementor-button atfp-translate-button" name="atfp_meta_box_translate">Translate</button>';
    const buttonElement = jQuery(buttonHtml);
    let confirmBox = false;
    const postId = window.atfp_global_object.current_post_id;
    const targetLang = window.atfp_global_object.target_lang;
    const oldData = localStorage.getItem('atfpElementorConfirmBox');
    if (oldData && 'string' === typeof oldData && '' !== oldData) {
      confirmBox = JSON.parse(oldData);
    }

    translateButtonGroup.prepend(buttonElement);
    $e.internal('document/save/set-is-modified', { status: true });

    if (!window.atfp_global_object.translation_data || (!window.atfp_global_object.translation_data.total_string_count && 0 !== window.atfp_global_object.translation_data.total_string_count)) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }

    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if (characterCount > 500000) {
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = ReactDOM.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(<ProVersionNotice characterCount={characterCount} url={window.atfp_global_object.pro_version_url || ''} />);
      return;
    }

    if (!window.atfp_global_object.elementorData || '' === window.atfp_global_object.elementorData || window.atfp_global_object.elementorData.length < 1 || elementor.elements.length < 1) {

      if (confirmBox && confirmBox[postId + '_' + targetLang]) {
        delete confirmBox[postId + '_' + targetLang];
        if (Object.keys(confirmBox).length === 0) {
          localStorage.removeItem('atfpElementorConfirmBox');
        }
        else {
          localStorage.setItem('atfpElementorConfirmBox', JSON.stringify(confirmBox));
        }
      }

      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation is not available because there is no Elementor data.');
      return;
    }
    // Append app root wrapper in body
    init();

    const root = ReactDOM.createRoot(document.getElementById('atfp-setting-modal'));
    root.render(<App />);

    if (confirmBox && confirmBox[postId + '_' + targetLang]) {
      setTimeout(() => {
        buttonElement.click();

        delete confirmBox[postId + '_' + targetLang];

        if (Object.keys(confirmBox).length === 0) {
          localStorage.removeItem('atfpElementorConfirmBox');
        }
        else {
          localStorage.setItem('atfpElementorConfirmBox', JSON.stringify(confirmBox));
        }
      }, 100);
    }
  }

}

if (editorType === 'gutenberg') {
  // Render App
  window.addEventListener('load', () => {

    // Append app root wrapper in body
    init();

    const buttonElement = jQuery('input#atfp-translate-button[name="atfp_meta_box_translate"]');

    if (!window.atfp_global_object.translation_data || (!window.atfp_global_object.translation_data.total_string_count && 0 !== window.atfp_global_object.translation_data.total_string_count)) {
      buttonElement.attr('disabled', 'disabled');
      buttonElement.attr('title', 'Translation data not found.');
      return;
    }

    const characterCount = parseInt(window.atfp_global_object.translation_data.total_character_count);
    if (characterCount > 500000) {
      const elementorProNotice = document.createElement('div');
      elementorProNotice.id = 'atfp-pro-notice';
      document.body.appendChild(elementorProNotice);
      const root = ReactDOM.createRoot(document.getElementById('atfp-pro-notice'));
      root.render(<ProVersionNotice characterCount={characterCount} url={window.atfp_global_object.pro_version_url || ''} />);
      return;
    }

    const sourceLang = window.atfp_global_object.source_lang

    if (sourceLang && '' !== sourceLang) {
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
