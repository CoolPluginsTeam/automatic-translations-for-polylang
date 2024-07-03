import PopupModal from './popmodel';
import './global-store';
import { useEffect, useState } from 'react';

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
  const targetLangName = atfp_ajax_object.languageObject[targetLang];

  const createMessagePopup = () => {
    const messagePopup = document.createElement('div');
    messagePopup.id = 'atfp-modal-open-warning-wrapper';
    messagePopup.innerHTML = `
      <div class="modal-container" style="display: flex">
        <div class="modal-content">
          <p>Would you like to duplicate your original post content and have it automatically translated into ${targetLangName}?</p>
          <div>
            <button data-value="yes">Yes</button>
            <button data-value="no">No</button>
          </div>
        </div>
      </div>`;
    return messagePopup;
  };

  const insertMessagePopup = () => {
    const targetElement = document.getElementById('atfp-setting-modal');
    const messagePopup = createMessagePopup();
    document.body.insertBefore(messagePopup, targetElement);
  };

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
      {insertMessagePopup()}
      {!pageTranslate && <PopupModal pageTranslate={handlePageTranslate} postId={postId} targetLang={targetLang} postType={postType} />}
    </>
  );
};

// Append app root wrapper in body
init();
// Render the main App component
window.addEventListener('load', () => {
  wp.element.render(<App />, document.getElementById('atfp-setting-modal'));
});
