const { dispatch } = wp.data;
import AllowedMetaFields from "../../AllowedMetafileds";

/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({type, key, translateContent, source}) => {
    if (['title', 'excerpt'].includes(type)) {
        const action = `${type}SaveTranslate`;
        dispatch('block-atfp/translate')[action](translateContent);
    } else if (['metaFields'].includes(type)) {
        if(Object.keys(AllowedMetaFields).includes(key)){
            dispatch('block-atfp/translate').metaFieldsSaveTranslate(key, translateContent, source);
        }
    } else {
        dispatch('block-atfp/translate').contentSaveTranslate(key, translateContent, source);
    }
}

export default SaveTranslation;