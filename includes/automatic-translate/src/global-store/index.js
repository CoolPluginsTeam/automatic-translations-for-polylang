import reducer from "./reducer";
import * as actions from './actions';
import * as selectors from './selectors';

const { createReduxStore, register } = wp.data;

const store = createReduxStore('block-atfp/translate', {
    reducer,
    actions,
    selectors
});

register(store);