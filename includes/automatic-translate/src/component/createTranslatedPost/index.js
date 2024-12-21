import createBlocks from './createBlock';
import { dispatch, select } from '@wordpress/data';

/**
 * Translates the post content and updates the post title, excerpt, and content.
 * 
 * @param {Object} props - The properties containing post content, translation function, and block rules.
 */
const translatePost = (props) => {
    const { editPost } = dispatch('core/editor');
    const { modalClose, postContent } = props;

    /**
     * Updates the post title and excerpt text based on translation.
     */
    const postDataUpdate = () => {
        const data = {};
        const editPostData = Object.keys(postContent).filter(key => ['title', 'excerpt'].includes(key));

        editPostData.forEach(key => {
            const sourceData = postContent[key];
            if (sourceData.trim() !== '') {
                const translateContent = select('block-atfp/translate').getTranslatedString(key, sourceData);
                data[key] = translateContent;
            }
        });

        editPost(data);
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
            createBlocks(block, props.blockRules);
        });
    }

    // Update post title and excerpt text
    postDataUpdate();
    // Update post content
    postContentUpdate();
    // Close string modal box
    modalClose();
}

export default translatePost;