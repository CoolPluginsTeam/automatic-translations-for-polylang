import createBlocks from './createBlock';
import { dispatch, select } from '@wordpress/data';
import YoastSeoFields from '../../component/TranslateSeoFields/YoastSeoFields';
import RankMathSeo from '../../component/TranslateSeoFields/RankMathSeo';
import SeoPressFields from '../../component/TranslateSeoFields/SeoPress';

/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const translatePost = (props) => {
    const { editPost } = dispatch('core/editor');
    const { modalClose, postContent, service } = props;

    /**
     * Updates the post title and excerpt text based on translation.
     */
    const postDataUpdate = () => {
        const data = {};
        const editPostData = Object.keys(postContent).filter(key => ['title', 'excerpt'].includes(key));

        editPostData.forEach(key => {
            const sourceData = postContent[key];
            if (sourceData.trim() !== '') {
                const translateContent = select('block-atfp/translate').getTranslatedString(key, sourceData, null, service);

                data[key] = translateContent;
            }
        });

        editPost(data);
    }

    /**
     * Updates the post meta fields based on translation.
     */
    const postMetaFieldsUpdate = () => {
        const metaFieldsData = postContent.metaFields;
        const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();

        Object.keys(metaFieldsData).forEach(key => {
            // Update yoast seo meta fields
            if (Object.keys(AllowedMetaFields).includes(key)) {
                const translatedMetaFields = select('block-atfp/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
                if (key.startsWith('_yoast_wpseo_') && AllowedMetaFields[key].inputType === 'string') {
                    YoastSeoFields({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('rank_math_') && AllowedMetaFields[key].inputType === 'string') {
                    RankMathSeo({ key: key, value: translatedMetaFields });
                } else if (key.startsWith('_seopress_') && AllowedMetaFields[key].inputType === 'string') {
                    SeoPressFields({ key: key, value: translatedMetaFields });
                } else {
                    editPost({ meta: { [key]: translatedMetaFields } });
                }
            };
        });
    }

    /**
     * Updates the post ACF fields based on translation.
     */
    const postAcfFieldsUpdate = () => {
        const AllowedMetaFields = select('block-atfp/translate').getAllowedMetaFields();
        const metaFieldsData = postContent.metaFields;

        
        if (window.acf) {
            acf.getFields().forEach(field => {
               if(field.data && field.data.key && Object.keys(AllowedMetaFields).includes(field.data.key)){
                   const acfFieldObj = acf.getField(field.data.key);
                   const fieldKey = field.data.key;
                   const fieldName = field.data.name;
                   const inputType = acfFieldObj.data.type;

                   const sourceValue = metaFieldsData[fieldName]? metaFieldsData[fieldName][0] : acf.getField(fieldKey)?.val();

                    const translatedMetaFields = select('block-atfp/translate').getTranslatedString('metaFields', sourceValue, fieldKey, service);

                    if('wysiwyg' === inputType && tinymce){
                        const editorId = acfFieldObj.data.id;
                        tinymce.get(editorId)?.setContent(translatedMetaFields);
                    }else{
                        acf.getField(fieldKey)?.val(translatedMetaFields);
                    }
               }
            });
        }
    }

    /**
     * Updates the post content based on translation.
     */
    const postContentUpdate = () => {
        const postContentData = postContent.content;

        if (postContentData.length <= 0) {
            return;
        }

        Object.values(postContentData).forEach(block => {
            createBlocks(block, service);
        });
    }

    // Update post title and excerpt text
    postDataUpdate();
    // Update post meta fields
    postMetaFieldsUpdate();
    // Update post ACF fields
    postAcfFieldsUpdate();
    // Update post content
    postContentUpdate();
    // Close string modal box
    modalClose();
}

export default translatePost;