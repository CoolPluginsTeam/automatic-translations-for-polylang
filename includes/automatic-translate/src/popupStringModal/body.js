import FetchPost from "../fetch-post";
const { __ } = wp.i18n;

const StringPopUpBody = (props) => {

    const { service: service, serviceLabel: serviceLabel } = props;
    let totalWordCount=0;
    /**
     * Updates the post content with the provided content.
     * @param {string} content - The content to update the post with.
     */
    const updatePostContent = (content) => {
        props.updatePostContent(content);
    }

    const updateTranslateContent=(entries)=>{
        if(Object.getPrototypeOf(entries) === Object.prototype && entries.stringRenderComplete === true){
            props.stringCountHandler(totalWordCount);
            return;
        }
        let entrie=entries.join(" ");

        if(undefined === entrie || entrie.trim() === ''){
            return;
        };

        entrie = entrie.replace(/#atfp_open_translate_span#(.*?)#atfp_close_translate_span#/g, '');

        const wordCount = entrie.trim().split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;

        totalWordCount+=wordCount;
    };

    return (
        <div className="modal-body">
            <div className="atfp_translate_progress">{__("Automatic translation is in progress....", 'automatic-translation-for-polylang')}<br />{__("It will take few minutes, enjoy ☕ coffee in this time!", 'automatic-translation-for-polylang')}<br /><br />{__("Please do not leave this window or browser tab while translation is in progress...", 'automatic-translation-for-polylang')}</div>
            <div className={`translator-widget ${service}`}>
                <h3 class="choose-lang">{__("Choose language", 'automatic-translation-for-polylang')} <span class="dashicons-before dashicons-translation"></span></h3>
                <div id="atfp_yandex_translate_element" style={{display: `${service === 'yandex' ? 'block' : 'none'}`}}></div>
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
        </div>
    );
}

export default StringPopUpBody;
