/**
 * AtfpActionTypes is an object that defines the action types used in the 
 * automatic translation feature of the application. Each property in this 
 * object corresponds to a specific action that can be dispatched to the 
 * global store, allowing the application to manage the state related to 
 * source and translated content effectively.
 */
const AtfpActionTypes = {
    // Action type for saving the title of the source content
    sourceTitle: 'SAVE_SOURCE_TITLE',
    
    // Action type for saving the title of the translated content
    traslatedTitle: 'SAVE_TRANSLATE_TITLE',
    
    // Action type for saving the excerpt of the source content
    sourceExcerpt: 'SAVE_SOURCE_EXCERPT',
    
    // Action type for saving the excerpt of the translated content
    traslatedExcerpt: 'SAVE_TRANSLATE_EXCERPT',
    
    // Action type for saving the main content of the source
    sourceContent: 'SAVE_SOURCE_CONTENT',
    
    // Action type for saving the main content of the translated content
    traslatedContent: 'SAVE_TRANSLATE_CONTENT',
    
    // Action type for saving the meta fields of the source content
    sourceMetaFields: 'SAVE_SOURCE_META_FIELDS',
    
    // Action type for saving the meta fields of the translated content
    traslatedMetaFields: 'SAVE_TRANSLATE_META_FIELDS',

    // Action type for saving the block rules
    setBlockRules: 'SET_BLOCK_RULES',

    // Action type for saving the translatio info of the translated content
    translationInfo: 'SAVE_TRANSLATE_INFO',

    // Action type for saving the allowed meta fields
    allowedMetaFields: 'ALLOWED_META_FIELDS',
};

export default AtfpActionTypes;