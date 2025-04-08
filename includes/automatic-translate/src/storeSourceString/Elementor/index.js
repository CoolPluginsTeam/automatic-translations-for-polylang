import { select, dispatch } from "@wordpress/data";

const ElementorSaveSource = (content) => {
    const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

    // Define a list of properties to exclude
    const cssProperties = [
        'content_width', 'title_size', 'font_size', 'margin', 'padding', 'background', 'border', 'color', 'text_align',
        'font_weight', 'font_family', 'line_height', 'letter_spacing', 'text_transform', 'border_radius', 'box_shadow',
        'opacity', 'width', 'height', 'display', 'position', 'z_index', 'visibility', 'align', 'max_width', 'content_typography_typography', 'flex_justify_content', 'title_color', 'description_color', 'email_content'
    ];

    const storeMetaFields = (metaFields) => {
        Object.keys(metaFields).forEach(metaKey => {
            if(Object.keys(AllowedMetaFields).includes(metaKey) && AllowedMetaFields[metaKey].inputType === 'string'){
                if('' !== metaFields[metaKey][0] && undefined !== metaFields[metaKey][0]){
                    dispatch('block-atfp/translate').metaFieldsSaveSource(metaKey, metaFields[metaKey][0]);
                }
            }
        });
    }

    const storeWidgetStrings = (element) => {
        const widgetId = element.id;
        const settings = element.settings;

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
                    const uniqueKey = key + '_atfp_' + widgetId;
                    dispatch('block-atfp/translate').contentSaveSource(uniqueKey, settings[key]);
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
                                    const uniqueKey = fieldKey + '_atfp_' + widgetId;
                                    dispatch('block-atfp/translate').contentSaveSource(uniqueKey, item[repeaterKey]);
                                }
                            });
                        }
                    });
                }
            });
        }

        // If there are nested elements, process them recursively
        if (element.elements && Array.isArray(element.elements)) {
            element.elements.forEach(nestedElement => {
                storeWidgetStrings(nestedElement);
            });
        }
    }

    content.widgetsContent.forEach(storeWidgetStrings);
    storeMetaFields(content.metaFields);
}

export default ElementorSaveSource;