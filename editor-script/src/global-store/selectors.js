export const getTranslationEntry = (state) => {
    const translateEntry = new Array;

    translateEntry.push({ id: 'title', source: state.title.source, type: 'title', target: (state.title.target || '') });
    translateEntry.push({ id: 'excerpt', source: state.excerpt.source, type: 'excerpt', target: (state.excerpt.target || '') });

    Object.keys(state.content).map(key => {
        const newIndex = state.content[key].index + 2;
        translateEntry[newIndex] = { type: 'content', id: key, source: state.content[key].source, target: (state.content[key].target || '') };
    });

    return translateEntry;
};

export const getTranslatedString = (state, type, source, id = null) => {
    if (type !== 'content' && state[type].source === source) {
        return state[type].target;
    } else if (state[type] && state[type][id] && state[type][id].source === source) {
        return undefined !== state[type][id].target ? state[type][id].target : state[type][id].source;
    }
    return source;
}