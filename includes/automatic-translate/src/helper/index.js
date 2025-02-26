import { select } from '@wordpress/data';

export const updateTranslateData = ({ provider, sourceLang, targetLang, postId }) => {
    const translateData = select('block-atfp/translate').getTranslationInfo();
    const totalWordCount = translateData.translateData?.[provider]?.targetWordCount || 0;
    const totalCharacterCount = translateData.translateData?.[provider]?.targetCharacterCount || 0;
    const timeTaken = translateData.translateData?.[provider]?.timeTaken || 0;
    const sourceWordCount = translateData?.sourceWordCount || 0;
    const sourceCharacterCount = translateData?.sourceCharacterCount || 0;
    const editorType = atfp_global_object.editor_type;
    const date = new Date().toISOString();

    const data = { provider, totalWordCount, totalCharacterCount, editorType, date, sourceWordCount, sourceCharacterCount, sourceLang, targetLang, timeTaken, action: atfp_global_object.update_translate_data, atfp_nonce: atfp_global_object.ajax_nonce, post_id: postId };

    fetch(atfp_global_object.ajax_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(data)
    }).then(response => response.json()).then(data => {
        console.log(data.data.message);
    }).catch(error => {
        console.error(error);
    });
}