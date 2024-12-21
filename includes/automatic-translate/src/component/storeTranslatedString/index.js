const { dispatch } = wp.data;

/**
 * Saves the translation data by updating the translation content based on the provided translate object and data.
 * @param {Object} translateData - The data containing translation information.
 */
const SaveTranslation = ({type, key, translateContent, source}) => {
    if (['title', 'excerpt'].includes(type)) {
        const action = `${type}SaveTranslate`;
        dispatch('block-atfp/translate')[action](translateContent);
    } else {
        dispatch('block-atfp/translate').contentSaveTranslate(key, translateContent, source);
    }
}

export default SaveTranslation;