import { select, dispatch } from "@wordpress/data";

const ElementorSaveSource = (content) => {

    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

    const storeMetaFields = (metaFields) => {
        Object.keys(metaFields).forEach(metaKey => {
            if(Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string'){
                if('' !== metaFields[metaKey][0] && undefined !== metaFields[metaKey][0]){
                    dispatch('block-atfp/translate').metaFieldsSaveSource(metaKey, metaFields[metaKey][0]);
                }
            }
        });
    }

    const loopCallback=(callback, loop, index)=>{
        callback(loop[index], index);

        index++;

        if(index < loop.length){
            loopCallback(callback, loop, index);
        }
    }

    const translateContent=(ids,value)=>{
        if(typeof value === 'string' && value.trim() !== '' && ids.length > 0){
            const uniqueKey = ids.join('_atfp_');

            if(value && '' !== value){  
                dispatch('block-atfp/translate').contentSaveSource(uniqueKey, value);
            }
        }
    }

    // Define a list of properties to exclude
    const cssProperties = [
        'content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align',
        'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow',
        'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'
    ];

    const substringsToCheck = ['title', 'description', 'editor', 'text', 'content', 'label'];

    const storeWidgetStrings = (element, index, ids=[]) => {
        const settings = element.settings;
        ids.push(index);

        // Check if settings is an object
        if (typeof settings === 'object' && settings !== null && Object.keys(settings).length > 0) {
            // Define the substrings to check for translatable content

            const keysLoop= (key, index)=>{
                if (cssProperties.some(substring => key.toLowerCase().includes(substring))) {
                    return; // Skip this property and continue to the next one
                }

                if (substringsToCheck.some(substring => key.toLowerCase().includes(substring)) &&
                    typeof settings[key] === 'string' && settings[key].trim() !== '') {
                    translateContent([...ids, 'settings', key],settings[key]);
                }

                if(Array.isArray(settings[key]) && settings[key].length > 0){
                    const settingsLoop=(item, index)=>{
                        if(typeof item === 'object' && item !== null){
                            const settingsItemsLoop= (repeaterKey)=>{

                                if (cssProperties.includes(repeaterKey.toLowerCase())) {
                                    return; // Skip this property
                                }

                                if(substringsToCheck.some(substring => repeaterKey.toLowerCase().includes(substring)) &&
                                    typeof item[repeaterKey] === 'string' && item[repeaterKey].trim() !== '') {
                                    translateContent([...ids, 'settings', key, index, repeaterKey],item[repeaterKey]);
                                }
                            }

                            loopCallback(settingsItemsLoop, Object.keys(item), 0);
                        }
                    }

                    loopCallback(settingsLoop, settings[key], 0);
                }
            }
    
            loopCallback(keysLoop, Object.keys(settings), 0);
        }

        // If there are nested elements, process them recursively
        if (element.elements && Array.isArray(element.elements) && element.elements.length > 0) {
            const runLoop=(childElement, index)=>{
                storeWidgetStrings(childElement, index, [...ids, 'elements']);
            }

            loopCallback(runLoop, element.elements, 0);
        }
    }

    if(content.widgetsContent && content.widgetsContent.length > 0){
        const runLoop= (element, index)=>{
            storeWidgetStrings(element, index, []);
        }

        loopCallback(runLoop, content.widgetsContent, 0);
    }

    storeMetaFields(content.metaFields);
}

export default ElementorSaveSource;