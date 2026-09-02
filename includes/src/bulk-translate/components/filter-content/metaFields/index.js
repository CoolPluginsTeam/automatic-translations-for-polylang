import filterContent from '../../filter-target-content';
import extractInnerContent from '../extarct-inner-content';
import saveSourceString from '../../store-source-string';

const filterMetaFields = async ({ metaFields, service, postId, storeDispatch, allowedMetaFields, filterHtmlContent, sourceLanguage }) => {

    const loopCallback = async (callback, loop, index) => {
        await callback(loop[index], index);

        index++;

        if (index < loop.length) {
            await loopCallback(callback, loop, index);
        }
    }

    const storeMetaFields = ({ key, originalValue, value, type, status, allowedMetaFields }) => {
        // Check if value is not a date or timestamp like 03/16/2023 6:02 AM
        // Simple regex to match MM/DD/YYYY and optional time
        const dateTimeRegex = /^\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?$/i;
        const digitsWithSymbols = /^[0-9.\- _#!$%^&*()+~`]+$/;

        if (dateTimeRegex.test(value)) {
            // If value is a date or timestamp, skip saving as translatable string
            return;
        }

        if (digitsWithSymbols.test(value)) {
            // If value is a number, skip saving as translatable string
            return;
        }

        saveSourceString(postId, key, originalValue, value, storeDispatch);
    }

    const metaFieldsLoop = async (key, index) => {
        if (allowedMetaFields && allowedMetaFields[key] && allowedMetaFields[key].status) {
            const undefinedKey = 'metaFields_atfp_' + key;
            if (typeof metaFields[key] === 'string') {
                const originalValue = metaFields[key];
                let value = originalValue;

                if (filterHtmlContent) {
                    let reactElement = filterContent({ content: value, service, contentKey: key, skipTags: [] });
                    value = await extractInnerContent(reactElement);

                    reactElement = null;
                }

                storeMetaFields({ key: undefinedKey, originalValue, value, type: allowedMetaFields[key].type, status: allowedMetaFields[key].status, allowedMetaFields });
            } else if (metaFields[key] && typeof metaFields[key] === 'object' && Object.keys(metaFields[key]).length > 0) {
                // Store object meta fields
               await storeObjectMetaFields([key], metaFields[key], allowedMetaFields);
            }
        }
    };

    const storeObjectMetaFields = async (keys, value, allowedMetaFields) => {
        const runLoopAsyncInner = async (key) => {
            if(typeof value[key] === 'string'){
                const uniqueKey = 'metaFields_atfp_' + keys.join('_atfp_')+'_atfp_'+key;
                const originalValue=value[key];
                let filterdValue = originalValue;

                if (filterHtmlContent) {
                    let reactElement = filterContent({ content: filterdValue, service, contentKey: key, skipTags: [] });
                    filterdValue = await extractInnerContent(reactElement);

                    reactElement = null;
                }

                storeMetaFields({key: uniqueKey, originalValue, value: filterdValue, type: 'string', status: allowedMetaFields[keys[0]].status, allowedMetaFields});
            }else if(value[key] && typeof value[key] === 'object' && Object.keys(value[key]).length > 0){
                // Store object meta fields
                await storeObjectMetaFields([...keys, key], value[key], allowedMetaFields);
            }
        }

        await loopCallback(runLoopAsyncInner, Object.keys(value), 0);
    }

    if (Object.keys(metaFields).length > 0) {
        await loopCallback(metaFieldsLoop, Object.keys(metaFields), 0);
    }

}

export default filterMetaFields;