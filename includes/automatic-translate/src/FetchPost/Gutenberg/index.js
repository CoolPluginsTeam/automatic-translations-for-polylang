import GutenbergBlockSaveSource from "../../storeSourceString/Gutenberg";
const GutenbergPostFetch = async (props) => {
    const { __ } = wp.i18n;
    const { parse } = wp.blocks;
    const { dispatch } = wp.data;

    const apiUrl = atfp_global_object.ajax_url;
    let blockRules = {};

    const blockRulesApiSendData = {
        atfp_nonce: atfp_global_object.ajax_nonce,
        action: atfp_global_object.action_block_rules
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(blockRulesApiSendData)
    })
        .then(response => response.json())
        .then(data => {
            blockRules = JSON.parse(data.data.blockRules);
            dispatch('block-atfp/translate').setBlockRules(blockRules);

        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });



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

    /**
     * useEffect hook to fetch post data from the specified API endpoint.
     * Parses the response data and updates the state accordingly.
     * Handles errors in fetching post content.
     */
    // useEffect(() => {
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/json',
        },
        body: new URLSearchParams(apiSendData)
    })
        .then(response => response.json())
        .then(data => {

            const post_data = data.data;

            if (post_data.content && post_data.content.trim() !== '') {
                post_data.content = parse(post_data.content);
            }

            GutenbergBlockSaveSource(post_data, blockRules);
            props.refPostData(post_data);
            props.updatePostDataFetch(true);
        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });
};

export default GutenbergPostFetch;