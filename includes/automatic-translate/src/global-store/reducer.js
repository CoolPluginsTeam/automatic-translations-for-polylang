import AtfpActionTypes from "./types"; // Importing action types from the types module

/**
 * The default state for the translation reducer.
 * This state holds the initial values for title, excerpt, content, and metaFields.
 * 
 * @type {Object}
 * @property {Object} title - Contains source and target translations for the title.
 * @property {Object} excerpt - Contains source and target translations for the excerpt.
 * @property {Array} content - An array holding content translations.
 * @property {Object} metaFields - Contains source and target translations for meta fields.
 */
const TranslateDefaultState = {
    title: {}, // Initial state for title translations
    excerpt: {}, // Initial state for excerpt translations
    content: [], // Initial state for content translations
    metaFields: {}, // Initial state for meta field translations
    allowedMetaFields: {} // Initial state for allowed meta fields
};

/**
 * The reducer function for handling translation actions.
 * This function updates the state based on the action type received.
 * 
 * @param {Object} state - The current state of the reducer.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} The new state after applying the action.
 */
const reducer = (state = TranslateDefaultState, action) => {
    switch (action.type) {
        case AtfpActionTypes.sourceTitle: // Action to save the source title
            // Check if the action text contains any letters or numbers
            if (/[\p{L}\p{N}]/gu.test(action.text)) {
                // Update the state with the new source title
                return { ...state, title: { ...state.title, source: action.text } };
            }
            return state; // Return the current state if no valid text

        case AtfpActionTypes.traslatedTitle: // Action to save the translated title
            // Update the state with the new target title
            return { ...state, title: { ...state.title, translatedData: { ...(state.title.translatedData || []), [action.provider]: action.text } } };

        case AtfpActionTypes.sourceExcerpt: // Action to save the source excerpt
            // Check if the action text contains any letters or numbers
            if (/[\p{L}\p{N}]/gu.test(action.text)) {
                // Update the state with the new source excerpt
                return { ...state, excerpt: { ...state.excerpt, source: action.text } };
            }
            return state; // Return the current state if no valid text

        case AtfpActionTypes.traslatedExcerpt: // Action to save the translated excerpt
            // Update the state with the new target excerpt
            return { ...state, excerpt: { ...state.excerpt, translatedData: { ...(state.excerpt.translatedData || []), [action.provider]: action.text } } };

        case AtfpActionTypes.sourceContent: // Action to save the source content
            // Check if the action text contains any letters or numbers
            if (/[\p{L}\p{N}]/gu.test(action.text)) {
                // Update the state with the new source content for the specific ID
                return { ...state, content: { ...state.content, [action.id]: { ...(state.content[action.id] || []), source: action.text } } };
            }
            return state; // Return the current state if no valid text

        case AtfpActionTypes.traslatedContent: // Action to save the translated content
            // Check if the source of the content matches the action source
            if (state.content[action.id].source === action.source) {
                // Update the state with the new target content for the specific ID
                return { ...state, content: { ...state.content, [action.id]: { ...(state.content[action.id] || []), translatedData: { ...(state.content[action.id].translatedData || []), [action.provider]: action.text } } } };
            }
            return state; // Return the current state if no match

        case AtfpActionTypes.sourceMetaFields: // Action to save the source meta fields
            // Check if the action text contains any letters or numbers
            if (/[\p{L}\p{N}]/gu.test(action.text)) {
                // Update the state with the new source meta field for the specific ID
                return { ...state, metaFields: { ...state.metaFields, [action.id]: { ...(state.metaFields[action.id] || []), source: action.text } } };
            }
            return state; // Return the current state if no valid text

        case AtfpActionTypes.traslatedMetaFields: // Action to save the translated meta fields
            // Update the state with the new target meta field for the specific ID
            return { ...state, metaFields: { ...state.metaFields, [action.id]: { ...(state.metaFields[action.id] || []), translatedData: { ...(state.metaFields[action.id].translatedData || []), [action.provider]: action.text } } } };

        case AtfpActionTypes.setBlockRules: // Action to save the block rules
            // Update the state with the new block rules
            return { ...state, blockRules: action.data };

        case AtfpActionTypes.translationInfo: // Action to save the translation info
            // Update the state with the new translation info
            const data = {}

            // Source Word Count
            action.sourceWordCount && (data.sourceWordCount = action.sourceWordCount);
            // Source Character Count
            action.sourceCharacterCount && (data.sourceCharacterCount = action.sourceCharacterCount);

            // Save the translation info like target word count, target character count, translate status, time taken
            if ((action.targetWordCount || action.targetCharacterCount || action.translateStatus || action.timeTaken) && action.provider) {
                data.translateData = {
                    ...(state.translationInfo?.translateData || {}),
                    [action.provider]: {
                        // If the provider already exists, update the existing provider data    
                        ...(state.translationInfo?.translateData?.[action.provider] || {}),
                        // Update the target word count, target character count, translate status, time taken
                        ...(action.targetWordCount && { targetWordCount: action.targetWordCount }),
                        // Update the target character count
                        ...(action.targetCharacterCount && { targetCharacterCount: action.targetCharacterCount }),
                        // Update the translate status
                        ...(action.translateStatus && { translateStatus: action.translateStatus }),
                        // Update the time taken
                        ...(action.timeTaken && { timeTaken: action.timeTaken })
                    }
                };
            }

            return { ...state, translationInfo: { ...state.translationInfo, ...data } };

        case AtfpActionTypes.allowedMetaFields: // Action to save the allowed meta fields
            // Update the state with the new allowed meta fields
            return { ...state, allowedMetaFields: { ...state.allowedMetaFields, [action.id]: { ...(state.allowedMetaFields[action.id] || []), inputType: action.inputType } } };

        default: // If the action type does not match any case
            return state; // Return the current state unchanged
    }
}

export default reducer; // Exporting the reducer as the default export