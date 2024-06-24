import AtfpActionTypes from "./types";

export const titleSaveSource = (data) => {
    return {
        type: AtfpActionTypes.sourceTitle,
        text: data,
    }
};

export const titleSaveTranslate = (data) => {
    return {
        type: AtfpActionTypes.traslatedTitle,
        text: data,
    }
};

export const excerptSaveSource = (data) => {
    return {
        type: AtfpActionTypes.sourceExcerpt,
        text: data,
    }
};

export const excerptSaveTranslate = (data) => {
    return {
        type: AtfpActionTypes.traslatedExcerpt,
        text: data,
    }
};

export const contentSaveSource = (id, data, index) => {
    return {
        type: AtfpActionTypes.sourceContent,
        text: data,
        id: id,
        index: index
    }
};

export const contentSaveTranslate = (id, data, source) => {
    return {
        type: AtfpActionTypes.traslatedContent,
        text: data,
        id: id,
        source: source
    }
};
