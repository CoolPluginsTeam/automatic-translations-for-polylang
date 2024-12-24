const SeoPressFields = async (props) => {


    const { key, value } = props;
    const inputId = key.replace(/^_/, '') + '_meta';

    if (!document.querySelector('#' + inputId)) {
        return;
    }

    switch (key) {
        case '_seopress_titles_title':
        case '_seopress_titles_desc':
        case '_seopress_social_fb_title':
        case '_seopress_social_fb_desc':
        case '_seopress_social_twitter_title':
        case '_seopress_social_twitter_desc':
            jQuery(`#${inputId}`).val(value);
            jQuery(`#${inputId}`).trigger('change');
            break;
        case '_seopress_analysis_target_kw':
            if (window.target_kw && window.target_kw instanceof window.Tagify && window.target_kw.DOM.originalInput.id === inputId) {
                window.target_kw.addTags(value);
            } else {
                jQuery('#' + inputId).val(value);
                jQuery('#' + inputId).trigger('change');
            }
            break;
        default:
            break;
    }
}

export default SeoPressFields;