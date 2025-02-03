import { dispatch } from '@wordpress/data';

const RankMathSeo = (props) => {
    if (!dispatch("rank-math")) {
        return;
    }
    const { updateKeywords,
        updateTitle,
        updateDescription,
        updateBreadcrumbTitle,
        updateFacebookTitle,
        updateFacebookDescription,
        updateTwitterTitle,
        updateTwitterDescription
    } = dispatch("rank-math");

    const { key, value } = props;

    switch (key) {
        case 'rank_math_focus_keyword':
            if (updateKeywords) {
                updateKeywords(value);
            }
            break;
        case 'rank_math_title':
            if (updateTitle) {
                updateTitle(value);
            }
            break;
        case 'rank_math_description':
            if (updateDescription) {
                updateDescription(value);
            }
            break;
        case 'rank_math_breadcrumb_title':
            if (updateBreadcrumbTitle) {
                updateBreadcrumbTitle(value);
            }
            break;
        case 'rank_math_facebook_title':
            if (updateFacebookTitle) {
                updateFacebookTitle(value);
            }
            break;
        case 'rank_math_facebook_description':
            if (updateFacebookDescription) {
                updateFacebookDescription(value);
            }
            break;
        case 'rank_math_twitter_title':
            if (updateTwitterTitle) {
                updateTwitterTitle(value);
            }
            break;
        case 'rank_math_twitter_description':
            if (updateTwitterDescription) {
                updateTwitterDescription(value);
            }
            break;
    }
}

export default RankMathSeo;