import GutenbergBlockSaveSource from "../../store-source-string/gutenberg";
import { dispatch, select } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import AllowedMetaFields from "../../allowed-meta-fields";

const GutenbergPostFetch = async (props) => {
    const apiUrl = atfp_global_object.ajax_url;
    let blockRules = wp.data.select('block-atfp/translate').getBlockRules() || {};
    const apiController = [];

    const destroyHandler = () => {
        apiController.forEach(controller => {
            controller.abort('Modal Closed');
        });
    }

    props.updateDestroyHandler(() => {
        destroyHandler();
    });
    
    // Update allowed meta fields
    const updateAllowedMetaFields = (data) => {
        dispatch('block-atfp/translate').allowedMetaFields(data);
    }

    // Update ACF fields allowed meta fields
    const AcfFields = () =>{
        const postMetaSync = atfp_global_object.postMetaSync === 'true';

        if(window.acf && !postMetaSync){
            const allowedTypes = ['text', 'textarea', 'wysiwyg'];
            acf.getFields().forEach(field => {
                const fieldData=JSON.parse(JSON.stringify({key: field.data.key, type: field.data.type, name: field.data.name}));
                // Update repeater fields
                if(field.$el && field.$el.closest('.acf-field.acf-field-repeater') && field.$el.closest('.acf-field.acf-field-repeater').length > 0){
                    const rowId=field.$el.closest('.acf-row').data('id');
                    const repeaterItemName=field.$el.closest('.acf-field.acf-field-repeater').data('name');

                    if(rowId && '' !== rowId){
                        const index=rowId.replace('row-', '');
                    
                        fieldData.name=repeaterItemName+'_'+index+'_'+fieldData.name;
                    }
                }

               if(fieldData && fieldData.key && allowedTypes.includes(fieldData.type)){
                   const fieldName = fieldData.name;
                   const inputType = fieldData.type;

                   updateAllowedMetaFields({id: fieldName, type: inputType});
               }
            });
        }
    }

    // Update allowed meta fields
    Object.keys(AllowedMetaFields).forEach(key => {
        updateAllowedMetaFields({id: key, type: AllowedMetaFields[key].type});
    });

    // Update ACF fields allowed meta fields
    AcfFields();

    const BlockParseFetch = async () => {

        if (blockRules && blockRules.AtfpBlockParseRules && Object.keys(blockRules.AtfpBlockParseRules).length > 0) {
            return;
        }

        const blockRulesApiSendData = {
            atfp_nonce: atfp_global_object.ajax_nonce,
            action: atfp_global_object.action_block_rules
        };


        const rulesController = new AbortController();
        apiController.push(rulesController);
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(blockRulesApiSendData),
            signal: rulesController.signal,
        })
            .then(response => response.json())
            .then(data => {
                blockRules = JSON.parse(data.data.blockRules);
                dispatch('block-atfp/translate').setBlockRules(blockRules);

            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }

    await BlockParseFetch();

    const ContentFetch = async () => {
        
        const contentFetchStatus = select('block-atfp/translate').contentFetchStatus();
        if (contentFetchStatus) {
            return;
        }

        /**
        * Prepare data to send in API request.
        */
        const apiSendData = {
            postId: parseInt(props.postId),
            local: props.targetLang,
            current_local: props.sourceLang,
            atfp_nonce: atfp_global_object.ajax_nonce,
            action: atfp_global_object.action_fetch
        };

        const contentController = new AbortController();
        apiController.push(contentController);

        /**
         * useEffect hook to fetch post data from the specified API endpoint.
         * Parses the response data and updates the state accordingly.
         * Handles errors in fetching post content.
         */
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json',
            },
            body: new URLSearchParams(apiSendData),
            signal: contentController.signal,
        })
            .then(response => response.json())
            .then(data => {

                const contentFetchStatus = select('block-atfp/translate').contentFetchStatus();
                
                if (contentFetchStatus) {
                    return;
                }

                const post_data = data.data;

                if (post_data.content && post_data.content.trim() !== '') {
                    post_data.content = parse(post_data.content);
                }

                GutenbergBlockSaveSource(post_data, blockRules);
                props.refPostData(post_data);
                props.updatePostDataFetch(true);
                dispatch('block-atfp/translate').contentFetchStatus(true);
            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }

    await ContentFetch();
};

export default GutenbergPostFetch;