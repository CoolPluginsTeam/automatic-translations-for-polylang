/**
 * This module sets up a Redux store for the automatic translation block.
 * It imports the necessary reducer, actions, and selectors, and then
 * creates and registers the Redux store with the WordPress data system.
 */

// Import the reducer function from the reducer module, which handles state changes.
import reducer from "./reducer";

// Import all action creators from the actions module, which define how to interact with the store.
import * as actions from './actions';

// Import all selector functions from the selectors module, which allow us to retrieve specific pieces of state.
import * as selectors from './selectors';

// Destructure the createReduxStore and register functions from the wp.data object provided by WordPress.
const { createReduxStore, register } = wp.data;

// Create a Redux store named 'block-atfp/translate' with the specified reducer, actions, and selectors.
const store = createReduxStore('block-atfp/translate', {
    reducer,   // The reducer function to manage state updates.
    actions,   // The action creators for dispatching actions to the store.
    selectors   // The selectors for accessing specific state values.
});

// Register the created store with the WordPress data system, making it available for use in the application.
register(store);