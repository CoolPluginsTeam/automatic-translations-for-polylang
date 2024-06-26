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
  const [pageTranslate,setPageTranslate]=useState(false);

  const pageTranslateHandler=(status)=>{
    setPageTranslate(status);
  };

  useEffect(()=>{
    if(pageTranslate){
      const metaFieldBtn=document.querySelector('input#atfp-translate-button[name="atfp_meta_box_translate"]');
      if(metaFieldBtn){
        metaFieldBtn.disabled = true;
      }
    }
  },[pageTranslate])
  
  return (
    <>
      { !pageTranslate &&
        <PopupModal pageTranslate={pageTranslateHandler}/>
      }
    </>
  );
};

// Append app root wrapper in body
init();
// Render the main App component
document.addEventListener('DOMContentLoaded', () => {
  wp.element.render(<App />, document.getElementById('atfp-setting-modal'));
});
