import FilterClassicContent from './classic';
import FilterElementorContent from './elementor';
import FilterGutenbergContent from './gutenberg';
import FilterMetaFields from './metaFields';

import updateClassicContent from './classic/update-content';
import updateElementorContent from './elementor/update-content';
import updateGutenbergContent from './gutenberg/update-content';
import Provider from '../translate-provider';

import {selectSourceEntries, selectServiceProvider} from '../../redux-store/features/selectors';

import {store} from '../../redux-store/store';

/**
 * @param {Object} content The content to filter
 * @param {string} editorType The editor type
 * @param {string} service The service provider
 * @param {string} postId The post ID
 * @param {Object} storeDispatch The store dispatch
 * @param {Object} blockParseRules The block parse rules
 * @param {Object} metaFields The meta fields
 * @param {Object} allowedMetaFields The allowed meta fields
 * @returns {Object} The filtered content
 */
const filterContent =async ({content, editorType, service, postId, storeDispatch, blockParseRules=null, metaFields=null, allowedMetaFields=null, sourceLanguage=null}) => {

    const filters={     
        'classic':FilterClassicContent,
        'elementor':FilterElementorContent,
        'block':FilterGutenbergContent,
    }

    const data={content, service, postId, storeDispatch, sourceLanguage};
    data.filterHtmlContent=Provider({Service: service}).filterHtmlContent;

    if(blockParseRules){
        data.blockParseRules=blockParseRules;
    }

    if(metaFields && Object.keys(metaFields).length > 0){
        await FilterMetaFields({service, postId, storeDispatch, metaFields, allowedMetaFields, filterHtmlContent: data.filterHtmlContent, sourceLanguage});
    }

    if(filters[editorType] && data.content && data.content !== ''){
        return await filters[editorType](data);
    }

    return content;
}

const updateFilterContent=async ({source, postId, lang, editorType})=>{
    const updateContens={
        'classic':updateClassicContent,
        'elementor':updateElementorContent,
        'block':updateGutenbergContent,
    }

    const serviceProvider=selectServiceProvider(store.getState());

    const translatedContent=selectSourceEntries(store.getState(), postId);

    return await updateContens[editorType]({source, lang, translatedContent, serviceProvider, postId});
}

export {filterContent, updateFilterContent};
