import { useEffect, useState } from "@wordpress/element";
import saveTranslation from "./component/storeSourceString";
import FilterTargetContent from "./component/FilterTargetContent";
const { parse } = wp.blocks;
const { select } = wp.data;

const FetchPost = (props) => {
    const [translateContent, setTranslateContent] = useState([]);
    const blockRules = props.blockRules;
    const apiUrl = atfp_ajax_object.ajax_url;

    /**
     * Prepare data to send in API request.
     */
    const apiSendData = {
        postId: parseInt(props.postId),
        atfp_nonce: atfp_ajax_object.ajax_nonce,
        action: atfp_ajax_object.action_fetch
    };

    /**
     * useEffect hook to fetch post data from the specified API endpoint.
     * Parses the response data and updates the state accordingly.
     * Handles errors in fetching post content.
     */
    useEffect(() => {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: new URLSearchParams(apiSendData)
        })
            .then(response => response.json())
            .then(data => {

                const post_data = data.data;

                if (post_data.content.trim() !== '') {
                    post_data.content = parse(post_data.content);
                }
                saveTranslation(post_data, blockRules);
                props.setPostData(post_data);

                const translationEntry = select("block-atfp/translate").getTranslationEntry();
                setTranslateContent(translationEntry);
            })
            .catch(error => {
                console.error('Error fetching post content:', error);
            });
    }, [props.fetchKey]);

    let sNo = 0;

    const totalString=translateContent.filter(data=>undefined !== data.source && data.source.trim() !== '').length;

    return (
        <>
            {translateContent.map((data, index) => {
                return (
                    <>
                    {undefined !== data.source && data.source.trim() !== '' &&
                        <>
                            <tr key={index}>
                                <td>{++sNo}</td>
                                <td data-source="source_text">{data.source}</td>
                                <td class="translate" translate="yes" data-key={data.id} data-string-type={data.type}>
                                    <FilterTargetContent service={props.service} content={data.source} translateContent={props.translateContent} totalString={totalString} currentIndex={sNo}/>
                                </td>
                            </tr>
                        </>
                    }
                    </>
                );
            })}
        </>
    );
};

export default FetchPost;