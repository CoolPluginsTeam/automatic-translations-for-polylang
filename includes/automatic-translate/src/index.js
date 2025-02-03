import PopupModal from './popmodel';
import './global-store';
import { useEffect, useState } from 'react';
import GutenbergPostFetch from './FetchPost/Gutenberg';
import UpdateGutenbergPage from './createTranslatedPost/Gutenberg';

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
  const urlParams = new URLSearchParams(window.location.search);
  const targetLang = urlParams.get('new_lang');
  const postId = urlParams.get('from_post');
  const postType = urlParams.get('post_type');
  const [postDataFetchStatus, setPostDataFetchStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchPostData = GutenbergPostFetch;
  const translatePost=UpdateGutenbergPage;

  const updatePostDataFetch = (status) => {
    setPostDataFetchStatus(status);
    setLoading(false);
  }

  const handlePageTranslate = (status) => {
    setPageTranslate(status);
  };

  useEffect(() => {
    if (pageTranslate) {
      const metaFieldBtn = document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
      if (metaFieldBtn) {
        metaFieldBtn.disabled = true;
      }
    }
  }, [pageTranslate]);

  return (
    <>
      {!pageTranslate && <PopupModal contentLoading={loading} updatePostDataFetch={updatePostDataFetch} postDataFetchStatus={postDataFetchStatus} pageTranslate={handlePageTranslate} postId={postId} targetLang={targetLang} postType={postType} fetchPostData={fetchPostData} translatePost={translatePost}/>}
    </>
  );
};

/**
 * Creates a message popup based on the post type and target language.
 * @returns {HTMLElement} The created message popup element.
 */
const createMessagePopup = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postType = urlParams.get('post_type');
  const targetLang = urlParams.get('new_lang');
  const targetLangName = atfp_ajax_object.languageObject[targetLang];

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

window.addEventListener('load', () => {

  // Append app root wrapper in body
  init();

  insertMessagePopup();

  wp.element.render(<App />, document.getElementById('atfp-setting-modal'));
});
