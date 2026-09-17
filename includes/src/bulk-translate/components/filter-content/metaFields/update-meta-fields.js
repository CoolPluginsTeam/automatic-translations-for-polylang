import {selectAllowedMetaFields, selectTranslatedContent} from '../../../redux-store/features/selectors';
import {store} from '../../../redux-store/store';

const updateMetaFields = (source, lang, serviceProvider, postId) => {
    const AllowedMetaFields=selectAllowedMetaFields(store.getState());

    const metaFields = source;
    const translateObjectMetaFields = (keys, value) => {
        Object.keys(value).forEach(key => {
            const keyArr = [...keys, key];
            const uniqueKey = 'metaFields_atfp_' + keyArr.join('_atfp_');
            if(typeof value[key] === 'string'){
                const translatedValue = selectTranslatedContent(store.getState(), postId, uniqueKey, lang, serviceProvider);
                let currentObject = metaFields;
                if(translatedValue && '' !== translatedValue){
                    keyArr.forEach((key, index) => {

                        if(index === keyArr.length - 1){
                            currentObject[key] = translatedValue;
                            return;
                        }

                        if(currentObject.hasOwnProperty(key)){
                            currentObject = currentObject[key];
                        }else{
                            currentObject[key] = {};
                            currentObject = currentObject[key];
                        }
                    });
                }
            }
            if(value[key] && typeof value[key] === 'object' && Object.keys(value[key]).length > 0){
                translateObjectMetaFields(keyArr, value[key]);
            }
        });
    }

    if (source && Object.keys(source).length > 0) {
        Object.keys(source).forEach(key => {
            if (AllowedMetaFields && AllowedMetaFields[key] && source[key] && typeof source[key] === 'object' && Object.keys(source[key]).length > 0) {
                translateObjectMetaFields([key], source[key]);
            } else if(typeof source[key] === 'string'){
                if (AllowedMetaFields && AllowedMetaFields[key] && AllowedMetaFields[key].status) {
                    const uniqueKey = 'metaFields_atfp_' + key;
                    const translatedValue=selectTranslatedContent(store.getState(), postId, uniqueKey, lang, serviceProvider);

                    if (translatedValue && '' !== translatedValue) {
                        metaFields[key] = translatedValue;
                    }
                }
            }
        });
    }

    return metaFields;
}

export default updateMetaFields;