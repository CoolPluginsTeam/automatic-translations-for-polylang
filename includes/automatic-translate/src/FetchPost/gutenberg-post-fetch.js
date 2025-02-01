import GutenbergBlockSaveSource from "../component/storeSourceString/GutenbergBlock";
const { __ } = wp.i18n;
const { parse } = wp.blocks;

const GutenbergPostFetch = async (props) => {
    const blockRules = props.blockRules;
    const apiUrl = atfp_ajax_object.ajax_url;

    /**
     * Prepare data to send in API request.
     */
    const apiSendData = {
        postId: parseInt(props.postId),
        local: props.targetLang,
        current_local: props.sourceLang,
        atfp_nonce: atfp_ajax_object.ajax_nonce,
        action: atfp_ajax_object.action_fetch
    };

    /**
     * useEffect hook to fetch post data from the specified API endpoint.
     * Parses the response data and updates the state accordingly.
     * Handles errors in fetching post content.
     */
    // useEffect(() => {
    fetch(apiUrl, {
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
            props.updatePostDataFetch(true);
        })
        .catch(error => {
            console.error('Error fetching post content:', error);
        });
};

export default GutenbergPostFetch;