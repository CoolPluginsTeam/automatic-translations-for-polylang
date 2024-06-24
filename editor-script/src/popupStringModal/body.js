import { useState } from "react";
import FetchPost from "../fetch-post";
import StringPopUpNotice from "./notice";
const { __ } = wp.i18n;

const StringPopUpBody = (props) => {

    const { service: service, serviceLabel: serviceLabel } = props;
    const [translateEntryCount, setTranslateEntryCount]=useState(0);

    /**
     * Updates the post content with the provided content.
     * @param {string} content - The content to update the post with.
     */
    const updatePostContent = (content) => {
        props.updatePostContent(content);
    }

    const updateTranslateContent=(entries)=>{
        let content='';
        entries.forEach(object=>{
            if(undefined !== object.source && object.source.trim() !== ''){
                content += ' '+object.source;
            };
        });

        const wordCount = content.trim().split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
        setTranslateEntryCount(wordCount);
    };

    return (
        <div className="modal-body">
            <div className="atfp_translate_progress">{__("Automatic translation is in progress....", 'automatic-translation-for-polylang')}<br />{__("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translation-for-polylang')}<br /><br />{__("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translation-for-polylang')}</div>
            <div className={`translator-widget ${service}`}>
                <h3 class="choose-lang">{__("Choose language", 'automatic-translation-for-polylang')} <span class="dashicons-before dashicons-translation"></span></h3>
                <div id="atfp_google_translate_element"></div>
            </div>

            <div className="atfp_string_container">
                <table className="scrolldown" id="stringTemplate">
                    <thead>
                        <tr>
                            <th className="notranslate">{__("S.No", 'automatic-translation-for-polylang')}</th>
                            <th className="notranslate">{__("Source Text", 'automatic-translation-for-polylang')}</th>
                            <th className="notranslate">{__("Translation", 'automatic-translation-for-polylang')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <FetchPost blockRules={props.blockRules} setPostData={updatePostContent} {...props} translateContent={updateTranslateContent}/>
                    </tbody>
                </table>
            </div>
            <StringPopUpNotice className="atfp_string_count">{__("Total Strings Translated:", 'automatic-translation-for-polylang')} {translateEntryCount}</StringPopUpNotice>
        </div>
    );
}

export default StringPopUpBody;
