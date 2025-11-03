import { dispatch } from "@wordpress/data";
import AllowedMetaFields from "../../allowed-meta-fields";
import ElementorSaveSource from "../../store-source-string/elementor";

// Update allowed meta fields
const updateAllowedMetaFields = (data) => {
    dispatch('block-atfp/translate').allowedMetaFields(data);
}

const fetchPostContent = async (props) => {
    const elementorPostData = atfp_global_object.elementorData && typeof atfp_global_object.elementorData === 'string' ? JSON.parse(atfp_global_object.elementorData) : atfp_global_object.elementorData;

    const content={
        widgetsContent:elementorPostData,
        metaFields:atfp_global_object?.metaFields || {}
    }

    if(atfp_global_object.parent_post_title && '' !== atfp_global_object.parent_post_title){
        content.title=atfp_global_object.parent_post_title;
    }

    // Update allowed meta fields
    Object.keys(AllowedMetaFields).forEach(key => {
        updateAllowedMetaFields({id: key, type: AllowedMetaFields[key].type});
    });
    
    ElementorSaveSource(content);
    
    props.refPostData(content);
    props.updatePostDataFetch(true);
}

export default fetchPostContent;