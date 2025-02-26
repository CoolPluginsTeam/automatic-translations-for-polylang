import { dispatch } from "@wordpress/data";

const YoastSeoFields = (props) => {
    if (!dispatch("yoast-seo/editor")) {
        return;
    }
    const {
        updateData,
        setFocusKeyword,
        setBreadcrumbsTitle,
        setFacebookPreviewTitle,
        setFacebookPreviewDescription,
        setTwitterPreviewTitle,
        setTwitterPreviewDescription,
    } = dispatch("yoast-seo/editor");
    
    const { key, value } = props;

    switch (key) {
        case "_yoast_wpseo_focuskw":
            if (setFocusKeyword) {
                setFocusKeyword(value);
            }
            break;
        case "_yoast_wpseo_title":
            if (updateData) {
                updateData({ title: value });
            }
            break;
        case "_yoast_wpseo_metadesc":
            if (updateData) {
                updateData({ description: value });
            }
            break;
        case "_yoast_wpseo_bctitle":
            if (setBreadcrumbsTitle) {
                setBreadcrumbsTitle(value);
            }
            break;
        case "_yoast_wpseo_opengraph-title":
            if (setFacebookPreviewTitle) {
                setFacebookPreviewTitle(value);
            }
            break;
        case "_yoast_wpseo_opengraph-description":
            if (setFacebookPreviewDescription) {
                setFacebookPreviewDescription(value);
            }
            break;
        case "_yoast_wpseo_twitter-title":
            if (setTwitterPreviewTitle) {
                setTwitterPreviewTitle(value);
            }
            break;
        case "_yoast_wpseo_twitter-description":
            if (setTwitterPreviewDescription) {
                setTwitterPreviewDescription(value);
            }
            break;
    }
};

export default YoastSeoFields;
