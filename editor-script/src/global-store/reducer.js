import AtfpActionTypes from "./types";

const TranslateDefaultState = {
    title: {},
    excerpt: {},
    content: []
};

const reducer = (state = TranslateDefaultState, action) => {
    switch (action.type) {
        case AtfpActionTypes.sourceTitle:
            return { ...state, title: { ...state.title, source: action.text } };
        case AtfpActionTypes.traslatedTitle:
            return { ...state, title: { ...state.title, target: action.text } };
        case AtfpActionTypes.sourceExcerpt:
            return { ...state, excerpt: { ...state.excerpt, target: action.text } };
        case AtfpActionTypes.traslatedExcerpt:
            return { ...state, excerpt: { ...state.excerpt, target: action.text } };
        case AtfpActionTypes.sourceContent:
            return { ...state, content: { ...state.content, [action.id]: { ...(state.content[action.id] || []), source: action.text, index: action.index } } };
        case AtfpActionTypes.traslatedContent:
            if (state.content[action.id].source === action.source) {
                return { ...state, content: { ...state.content, [action.id]: { ...(state.content[action.id] || []), target: action.text } } };
            }
            return state;
        default:
            return state;
    }
}

export default reducer;