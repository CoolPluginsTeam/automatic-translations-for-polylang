import AtfpActionTypes from "./types"; // Importing action types from the types module

/**
 * Action creator for saving the source title.
 * @param {string} data - The source title to be saved.
 * @returns {Object} The action object containing the type and text.
 */
export const titleSaveSource = (data) => {
    return {
        type: AtfpActionTypes.sourceTitle, // Action type for saving the source title
        text: data, // The source title text
    }
};

/**
 * Action creator for saving the translated title.
 * @param {string} data - The translated title to be saved.
 * @returns {Object} The action object containing the type and text.
 */
export const titleSaveTranslate = (data) => {
    return {
        type: AtfpActionTypes.traslatedTitle, // Action type for saving the translated title
        text: data, // The translated title text
    }
};

/**
 * Action creator for saving the source excerpt.
 * @param {string} data - The source excerpt to be saved.
 * @returns {Object} The action object containing the type and text.
 */
export const excerptSaveSource = (data) => {
    return {
        type: AtfpActionTypes.sourceExcerpt, // Action type for saving the source excerpt
        text: data, // The source excerpt text
    }
};

/**
 * Action creator for saving the translated excerpt.
 * @param {string} data - The translated excerpt to be saved.
 * @returns {Object} The action object containing the type and text.
 */
export const excerptSaveTranslate = (data) => {
    return {
        type: AtfpActionTypes.traslatedExcerpt, // Action type for saving the translated excerpt
        text: data, // The translated excerpt text
    }
};

/**
 * Action creator for saving the source content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The source content to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
export const contentSaveSource = (id, data) => {
    return {
        type: AtfpActionTypes.sourceContent, // Action type for saving the source content
        text: data, // The source content text
        id: id // The identifier for the content
    }
};

/**
 * Action creator for saving the translated content.
 * @param {string} id - The identifier for the content.
 * @param {string} data - The translated content to be saved.
 * @param {string} source - The source of the translated content.
 * @returns {Object} The action object containing the type, text, id, and source.
 */
export const contentSaveTranslate = (id, data, source) => {
    return {
        type: AtfpActionTypes.traslatedContent, // Action type for saving the translated content
        text: data, // The translated content text
        id: id, // The identifier for the content
        source: source // The source of the translated content
    }
};
