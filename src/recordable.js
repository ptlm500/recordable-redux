import { List, fromJS, is } from 'immutable';
import defaultActionTypes from './defaultActionTypes';

/**
 * Action types
 * @typedef {Object} ActionTypes
 * @property {string} BACK The action to go back in recorded state
 * @property {string} FORWARD The action to go forward in recorded state
 * @property {string} TOGGLE_RECORDING The action to toggle the recording of state
 * @property {string} CLEAR_RECORDING  The action to clear the recorded state
 */

/**
 * Wraps a reducer with a recording of past and future state
 * @param {function} reducer The reducer to wrap
 * @param {ActionTypes} [actionTypes]
 * @returns {Object} Immutable Map containing past, present and future states
 *    with recordingEnabled to track current recording state
 */
export default function recordable(reducer, actionTypes = defaultActionTypes) {
  const initialState = fromJS({
    past: [],
    present: reducer(undefined, {}),
    future: [],
    recordingEnabled: true
  });

  return function(state = initialState, action) {
    const past = state.get('past');
    const present = state.get('present');
    const future = state.get('future');
    switch(action.type) {
    case actionTypes.BACK: {
      if (past.size !== 0) {
        const previousState = past.last();
        const newPast = past.pop();

        return state.withMutations(currentState =>
          currentState
            .set('past', newPast)
            .set('present', previousState)
            .update('future', previousFuture =>
              previousFuture.insert(0, present)
            )
        );
      }
      // There is no state in the past, set initial reducer state
      return state.set('present', reducer(undefined, {}));
    }
    case actionTypes.FORWARD: {
      if (future.size !== 0) {
        const nextState = future.first();
        const newFuture = future.shift();

        return state.withMutations(currentState =>
          currentState
            .update('past', previousPast => previousPast.push(present))
            .set('present', nextState)
            .set('future', newFuture)
        );
      }
      // There is no state in the future, we can't go there!
      return state;
    }
    case actionTypes.CLEAR_RECORDING: {
      return state.withMutations(currentState =>
        currentState
          .set('past', List())
          .set('future', List())
      );
    }
    case actionTypes.TOGGLE_RECORDING: {
      return state.set('recordingEnabled', !state.get('recordingEnabled'));
    }
    default: {
      // This action isn't a recording control action, pass to wrapper reducer
      const newPresent = reducer(present, action);

      if (is(newPresent, present)) {
        // If newPresent is equal to present it isn't necessary to update state
        return state;
      }

      let newState = state;

      if (state.get('recordingEnabled')) {
        newState = newState
          .update('past', previousPast => previousPast.push(present));
      }

      return newState.withMutations(currentstate =>
        currentstate
          .set('present', newPresent)
          .set('future', List())
      );
    }
    }
  };
}
