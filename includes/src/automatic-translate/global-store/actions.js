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
 * @param {string} provider - The provider of the translated title.
 * @returns {Object} The action object containing the type, text, and provider.
 */
export const titleSaveTranslate = (data, provider) => {
    return {
        type: AtfpActionTypes.traslatedTitle, // Action type for saving the translated title
        text: data, // The translated title text
        provider: provider // The provider of the translated title
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
 * @param {string} provider - The provider of the translated excerpt.
 * @returns {Object} The action object containing the type, text, and provider.
 */
export const excerptSaveTranslate = (data, provider) => {
    return {
        type: AtfpActionTypes.traslatedExcerpt, // Action type for saving the translated excerpt
        text: data, // The translated excerpt text
        provider: provider // The provider of the translated excerpt
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
 * @param {string} provider - The provider of the translated content.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
export const contentSaveTranslate = (id, data, source, provider) => {
    return {
        type: AtfpActionTypes.traslatedContent, // Action type for saving the translated content
        text: data, // The translated content text
        id: id, // The identifier for the content
        source: source, // The source of the translated content
        provider: provider // The provider of the translated content
    }
};

/**
 * Action creator for saving the source meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The source meta fields to be saved.
 * @returns {Object} The action object containing the type, text, and id.
 */
export const metaFieldsSaveSource = (id, data) => {
    return {
        type: AtfpActionTypes.sourceMetaFields, // Action type for saving the source meta fields
        text: data, // The source meta fields text
        id: id, // The identifier for the meta fields
    }
};

/**
 * Action creator for saving the translated meta fields.
 * @param {string} id - The identifier for the meta fields.
 * @param {Object} data - The translated meta fields to be saved.
 * @param {string} source - The source of the translated meta fields.
 * @param {string} provider - The provider of the translated meta fields.
 * @returns {Object} The action object containing the type, text, id, source, and provider.
 */
export const metaFieldsSaveTranslate = (id, data, source, provider) => {
    return {
        type: AtfpActionTypes.traslatedMetaFields, // Action type for saving the translated meta fields
        text: data, // The translated meta fields text
        id: id, // The identifier for the meta fields
        source: source, // The source of the translated meta fields
        provider: provider // The provider of the translated meta fields
    }
};

/**
 * Action creator for saving the block rules.
 * @param {Object} data - The block rules to be saved.
 * @returns {Object} The action object containing the type and data.
 */
export const setBlockRules = (data) => {
    return {
        type: AtfpActionTypes.setBlockRules, // Action type for saving the block rules
        data: data // The block rules data
    }
};

/**
 * Action creator for saving the translation info.
 * @param {Object} data - The translation info to be saved.
 * @returns {Object} The action object containing the type and data.
 */
export const translationInfo = ({ sourceStringCount = null, sourceWordCount = null, sourceCharacterCount = null, timeTaken = null, provider = null, targetStringCount = null, targetWordCount = null, targetCharacterCount = null, translateStatus = null }) => {
    return {
        type: AtfpActionTypes.translationInfo, // Action type for saving the translation info
        sourceStringCount: sourceStringCount,
        sourceWordCount: sourceWordCount,
        sourceCharacterCount: sourceCharacterCount, // The character count
        timeTaken: timeTaken, // The time taken
        targetStringCount: targetStringCount,
        targetWordCount: targetWordCount,
        targetCharacterCount: targetCharacterCount,
        provider: provider, // The provider
        translateStatus: translateStatus // The translate status
    }
};

/**
 * Action creator for saving the allowed meta fields.
 * @param {Object} data - The allowed meta fields to be saved.
 * @returns {Object} The action object containing the type and data.
 */
export const allowedMetaFields = ({id, type}) => {
    return {
        type: AtfpActionTypes.allowedMetaFields,
        id: id,
        inputType: type
    }
}

/**
 * Action creator for saving the content fetch status.
 * @param {boolean} status - The content fetch status to be saved.
 * @returns {Object} The action object containing the type and status.
 */
export const contentFetchStatus = (status) => {
    return {
        type: AtfpActionTypes.contentFetchStatus,
        status: status
    }
}
