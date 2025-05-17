import { select } from '@wordpress/data';
import YoastSeoFields from '../../component/TranslateSeoFields/YoastSeoFields';
import RankMathSeo from '../../component/TranslateSeoFields/RankMathSeo';

// Update widget content with translations
const atfpUpdateWidgetContent = (translations) => {

    translations.forEach(translation => {
        // Find the model by ID using the atfpFindModelById function
        const model = atfpFindModelById(elementor.elements.models, translation.ID);
        if (model) {
            const settings = model.get('settings');

            // Check for normal fields (title, text, editor, etc.)
            if (settings.get(translation.key)) {
                settings.set(translation.key, translation.translatedContent);  // Set the translated content
            }

            // Handle repeater fields (if any)
            const repeaterMatch = translation.key.match(/(.+)\[(\d+)\]\.(.+)/);
            if (repeaterMatch) {

                const [_, repeaterKey, index, subKey] = repeaterMatch;
                const repeaterArray = settings.get(repeaterKey);
                if (Array.isArray(repeaterArray.models) && repeaterArray.models[index]) {
                    let repeaterModel = repeaterArray.models[index]
                    let repeaterAttribute = repeaterModel.attributes
                    repeaterAttribute[subKey] = translation.translatedContent;

                    settings.set(repeaterKey, repeaterArray); // Set the updated array back to settings
                }
            }
        }
    });

    // After updating content, ensure that the changes are saved or published
    $e.internal('document/save/set-is-modified', { status: true });
}

const atfpUpdateMetaFields = (metaFields, service) => {
    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

        Object.keys(metaFields).forEach(key => {
            // Update yoast seo meta fields
            if (Object.keys(AllowedMetaFields).includes(key)) {
                const translatedMetaFields = select('block-atfp/translate').getTranslatedString('metaFields', metaFields[key][0], key, service);
                if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
                    YoastSeoFields({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
                    RankMathSeo({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
                    elementor?.settings?.page?.model?.setExternalChange(key, translatedMetaFields);
                }
            };
        });
}

// Find Elementor model by ID
const atfpFindModelById = (elements, id) => {
    for (const model of elements) {
        if (model.get('id') === id) {
            return model;
        }
        const nestedElements = model.get('elements').models;
        const foundModel = atfpFindModelById(nestedElements, id);
        if (foundModel) {
            return foundModel;
        }
    }
    return null;
}

const updateElementorPage = ({ postContent, modalClose, service }) => {
    const postID = elementor.config.document.id;

    // Collect translated content
    const translations = [];

    // Define a list of properties to exclude
    const cssProperties = [
        'content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align',
        'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow',
        'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'
    ];

    const storeSourceStrings = (element,index, ids=[]) => {
        const widgetId = element.id;
        const settings = element.settings;
        ids.push(index)

        // Check if settings is an object
        if (typeof settings === 'object' && settings !== null) {
            // Define the substrings to check for translatable content
            const substringsToCheck = ['title', 'description', 'editor', 'text', 'content', 'label'];

            // Iterate through the keys in settings
            Object.keys(settings).forEach(key => {
                // Skip keys that are CSS properties
                if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
                    return; // Skip this property and continue to the next one
                }

                // Check if the key includes any of the specified substrings
                if (substringsToCheck.some(substring => key.toLowerCase().includes(substring)) &&
                    typeof settings[key] === 'string' && settings[key].trim() !== '') {
                    const uniqueKey = ids.join('_atfp_') + '_atfp_settings_atfp_' + key;

                    const translatedData = select('block-atfp/translate').getTranslatedString('content', settings[key], uniqueKey, service);

                    translations.push({
                        ID: widgetId,
                        key: key,
                        translatedContent: translatedData
                    })
                }

                // Check for arrays (possible repeater fields) within settings
                if (Array.isArray(settings[key])) {
                    settings[key].forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            // Check for translatable content in repeater fields
                            Object.keys(item).forEach(repeaterKey => {
                                // Skip if it's a CSS-related property
                                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                                    return; // Skip this property
                                }

                                if (substringsToCheck.some(substring => repeaterKey.toLowerCase().includes(substring)) &&
                                    typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {

                                    const fieldKey = `${key}[${index}].${repeaterKey}`
                                    const uniqueKey = ids.join('_atfp_') + '_atfp_settings_atfp_' + key + '_atfp_' + index + '_atfp_' + repeaterKey;

                                    const translatedData = select('block-atfp/translate').getTranslatedString('content', item[repeaterKey], uniqueKey, service);

                                    translations.push({
                                        ID: widgetId,
                                        key: fieldKey,
                                        translatedContent: translatedData
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }

        // If there are nested elements, process them recursively
        if (element.elements && Array.isArray(element.elements)) {
            element.elements.forEach((nestedElement,index) => {
                storeSourceStrings(nestedElement,index, [...ids, 'elements']);
            });
        }
    }

    postContent.widgetsContent.map((widget,index) => storeSourceStrings(widget,index,[]));

    // Update widget content with translations
    atfpUpdateWidgetContent(translations);
    
    // Update Meta Fields
    atfpUpdateMetaFields(postContent.metaFields, service);

    const replaceSourceString=()=>{
        const elementorData = atfp_global_object.elementorData;
        const translateStrings=wp.data.select('block-atfp/translate').getTranslationEntry();

        translateStrings.forEach(translation => {
            const sourceString = translation.source;
            const ids = translation.id;
            const translatedContent = translation.translatedData;
            const type=translation.type;

            if(!sourceString || '' === sourceString && 'content' !== type){
                return;
            }
            
            const keyArray = ids.split('_atfp_');
            
            const translateValue = translatedContent[service];
            let parentElement = null;
            let parentKey = null;

            let currentElement = elementorData;
               
            keyArray.forEach(key => {
                parentElement = currentElement;
                parentKey = key;
                currentElement = currentElement[key];
            });

            if(parentElement && parentKey && parentElement[parentKey] && parentElement[parentKey] === sourceString){
                parentElement[parentKey] = translateValue;
            }
        });

        return elementorData;
    }

    
    const elementorData = replaceSourceString();

    fetch(atfp_global_object.ajax_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(
            {
                action: atfp_global_object.update_elementor_data,
                post_id: postID,
                elementor_data: JSON.stringify(elementorData),
                atfp_nonce: atfp_global_object.ajax_nonce
            }
        )
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const translateButton = document.querySelector('.atfp-translate-button[name="atfp_meta_box_translate"]');
                if(translateButton){
                    translateButton.setAttribute('title', 'Translation process completed successfully.');
                }
                elementor.reloadPreview();
            } else {
                console.error('Failed to update Elementor data:', data.data);
            }

            modalClose();
        })
        .catch(error => {
            modalClose();
            console.error('Error updating Elementor data:', error);
        });
}

export default updateElementorPage;
