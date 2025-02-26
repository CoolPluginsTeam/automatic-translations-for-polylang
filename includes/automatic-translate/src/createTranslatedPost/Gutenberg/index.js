import createBlocks from './createBlock';
import { dispatch, select } from '@wordpress/data';
import YoastSeoFields from './SeoMetaFields/YoastSeoFields';
import AllowedMetaFields from '../../AllowedMetafileds';
import RankMathSeo from './SeoMetaFields/RankMathSeo';
import SeoPressFields from './SeoMetaFields/SeoPress';

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
        Object.keys(metaFieldsData).forEach(key => {
            // Update yoast seo meta fields
            if(Object.keys(AllowedMetaFields).includes(key) && AllowedMetaFields[key].type === 'string') {
                const translatedMetaFields = select('block-atfp/translate').getTranslatedString('metaFields', metaFieldsData[key][0], key, service);
                if(key.startsWith('_yoast_wpseo_')) {
                    YoastSeoFields({ key: key, value: translatedMetaFields });
                } else if(key.startsWith('rank_math_')) {
                    RankMathSeo({ key: key, value: translatedMetaFields });
                }else if(key.startsWith('_seopress_')){
                    SeoPressFields({ key: key, value: translatedMetaFields });
                }
                else{
                    editPost({ meta: { [key]: translatedMetaFields } });
                }
            };
        });
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
    // Update post content
    postContentUpdate();
    // Close string modal box
    modalClose();
}

export default translatePost;