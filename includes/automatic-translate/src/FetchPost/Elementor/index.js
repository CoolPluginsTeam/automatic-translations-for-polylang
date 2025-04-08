import { dispatch } from "@wordpress/data";
import AllowedMetaFields from "../../AllowedMetafileds";
import ElementorSaveSource from "../../storeSourceString/Elementor";

// Update allowed meta fields
const updateAllowedMetaFields = (data) => {
    dispatch('block-atfp/translate').allowedMetaFields(data);
}

const fetchPostContent = async (props) => {
    const elementorPostData = atfp_global_object.elementorData && typeof atfp_global_object.elementorData === 'string' ? JSON.parse(atfp_global_object.elementorData) : atfp_global_object.elementorData;
    const metaFields=atfp_global_object?.metaFields;

    const content={
        widgetsContent:elementorPostData,
        metaFields:metaFields
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