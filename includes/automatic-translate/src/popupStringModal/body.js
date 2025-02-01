import { useState } from "react";
import FetchPost from "./fetch-post";
const { __ } = wp.i18n;
const { select } = wp.data;

const StringPopUpBody = (props) => {

    const { service: service, serviceLabel: serviceLabel } = props;
    const [stringAvality, setStringAvality] = useState(false);

    let totalWordCount = 0;
    /**
     * Updates the post content with the provided content.
     * @param {string} content - The content to update the post with.
     */
    const updatePostContent = (content) => {
        props.updatePostContent(content);
        const translationEntry = select("block-atfp/translate").getTranslationEntry();

        const totalString = Object.values(translationEntry).filter(data => data.source !== undefined && /[\p{L}\p{N}]/gu.test(data.source));

        if (Object.keys(totalString).length > 0) {
            setStringAvality(true);
        } else {
            setStringAvality(false);
        }
    }

    const updateTranslateContent = (entries) => {
        if (Object.getPrototypeOf(entries) === Object.prototype && entries.stringRenderComplete === true) {
            props.stringCountHandler(totalWordCount);
            return;
        }
        
        let entrie = entries.join(" ");

        if (undefined === entrie || entrie.trim() === '') {
            return;
        };

        entrie = entrie.replace(/#atfp_open_translate_span#(.*?)#atfp_close_translate_span#/g, '');

        const wordCount = entrie.trim().split(/\s+/).filter(word => /[^\p{L}\p{N}]/.test(word)).length;

        totalWordCount += wordCount;
    };

    return (
        <div className="modal-body">
            <div className="atfp_translate_progress" key={props.modalRender}>{__("Automatic translation is in progress....", 'automatic-translations-for-polylang')}<br />{__("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translations-for-polylang')}<br /><br />{__("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translations-for-polylang')}</div>
            <div className={`translator-widget ${service}`} style={{ display: `${stringAvality ? `${props.service === 'localAiTranslator' ? 'flex' : 'block'}` : 'none'}` }}>
                {props.service === 'localAiTranslator' ?
                    <h3 className="choose-lang">{__("Translate Using Chrome built-in API", 'automatic-translations-for-polylang')} <span className="dashicons-before dashicons-translation"></span></h3>
                    :
                    <h3 className="choose-lang">{__("Choose language", 'automatic-translations-for-polylang')} <span className="dashicons-before dashicons-translation"></span></h3>
                }
                <div className="atfp_translate_element_wrapper">
                    <div id="atfp_yandex_translate_element" style={{ display: `${service === 'yandex' ? 'block' : 'none'}` }}></div>
                    <div id="atfp_localAiTranslator_translate_element" style={{ display: `${service === 'localAiTranslator' ? 'block' : 'none'}` }}></div>
                </div>
            </div>

            <div className={`atfp_string_container${!stringAvality ? ' atfp_empty_string' : ''}`}>
                <table className="scrolldown" id="stringTemplate">
                    {stringAvality &&
                        <thead>
                            <tr>
                                <th className="notranslate">{__("S.No", 'automatic-translations-for-polylang')}</th>
                                <th className="notranslate">{__("Source Text", 'automatic-translations-for-polylang')}</th>
                                <th className="notranslate">{__("Translation", 'automatic-translations-for-polylang')}</th>
                            </tr>
                        </thead>
                    }
                    <tbody>
                        <FetchPost blockRules={props.blockRules} setPostData={updatePostContent} {...props} translateContent={updateTranslateContent} />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StringPopUpBody;
