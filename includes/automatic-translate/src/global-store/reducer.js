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
    metaFields: {} // Initial state for meta field translations
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
            return { ...state, title: { ...state.title, target: action.text } };

        case AtfpActionTypes.sourceExcerpt: // Action to save the source excerpt
            // Check if the action text contains any letters or numbers
            if (/[\p{L}\p{N}]/gu.test(action.text)) {
                // Update the state with the new source excerpt
                return { ...state, excerpt: { ...state.excerpt, source: action.text } };
            }
            return state; // Return the current state if no valid text

        case AtfpActionTypes.traslatedExcerpt: // Action to save the translated excerpt
            // Update the state with the new target excerpt
            return { ...state, excerpt: { ...state.excerpt, target: action.text } };

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
                return { ...state, content: { ...state.content, [action.id]: { ...(state.content[action.id] || []), target: action.text } } };
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
            return { ...state, metaFields: { ...state.metaFields, [action.id]: { ...(state.metaFields[action.id] || []), target: action.text } } };

        default: // If the action type does not match any case
            return state; // Return the current state unchanged
    }
}

export default reducer; // Exporting the reducer as the default export