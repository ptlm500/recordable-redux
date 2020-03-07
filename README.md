# recordable-redux

[Redux](https://redux.js.org/) reducer enhancer that records state history. Inspired by the [Implementing Undo History](https://redux.js.org/recipes/implementing-undo-history/) recipe.

![CI](https://github.com/ptlm500/recordable-redux/workflows/CI/badge.svg)

## Installation

Using npm: `npm install recordable-redux`

Using yarn: `yarn install recordable-redux`

## Getting started

recordable-redux provides an enhancer for Redux reducers that records state history. By dispatching actions you can traverse recorded history,toggle the recording of state history and clear recorded history.

### Wrap your reducer

In your reducer file import the enhancer, and pass your reducer to it. In this example we will wrap a simple reducer with actions to increment and decrement a count. The state shape in this case might look like this:

```js
{
  count: 10
}
```

Below is an example of how we can wrap the counter reducer with the recordable enhancer:

```js
import recordable from 'recordable-redux';

// The reducer to be wrapped
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// Pass the reducer to the recordable enhancer
const counterWithHistory = recordable(counter);

export default counterWithHistory;
```

Thats it!

The enhancer will modify the state shape as follows (when converted from an [Immutable collection](https://immutable-js.github.io/immutable-js/docs/#/Map) to a JavaScript Object with [`toJS()`](https://immutable-js.github.io/immutable-js/docs/#/Map/toJS)):

```js
{
  count: {
    past: [],
    present: 10,
    future: [],
    recordingEnabled: true
  }
}
```

### Traversing recorded history

recordable-redux provides some default action types for controlling the enhancer. Import the action types from recordable-redux and define the [action creators](https://redux.js.org/basics/actions#action-creators) you require for your usecase:

```js
import { actionTypes as recordableActionTypes } from 'recordable-redux';

/**
 * Action to set the state back
 */
export function back() {
  return {type: recordableActionTypes.BACK};
}

/**
 * Action to set the state forward
 */
export function forward() {
  return {type: recordableActionTypes.FORWARD};
}

/**
 * Action to toggle recording
 */
export function toggleRecording() {
  return {type: recordableActionTypes.TOGGLE_RECORDING};
}

/**
 * Action to clear recorded state
 */
export function clearRecording() {
  return {type: recordableActionTypes.CLEAR_RECORDING};
}

```

#### Going back

To go back one step in state, dispatch the `back` action, as defined in your action creators.

```js
dispatch(back());
```

Given the following initial state:

```js
{
  count: {
    past: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    present: 10,
    future: [],
    recordingEnabled: true
  }
}
```

dispatching the `back` action will update the state accordingly:

```js
{
  count: {
    past: [1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10],
    recordingEnabled: true
  }
}
```

> Note: If the `past` array is empty, dispatching `back` action will revert the state to its initial value.

#### Going forward

To go forward one step in state, dispatch the `forward` action, as defined in your action creators.

```js
dispatch(forward());
```

Given the following initial state:

```js
{
  count: {
    past: [1, 2, 3, 4, 5, 6, 7],
    present: 8,
    future: [9, 10],
    recordingEnabled: true
  }
}
```

dispatching the `forward` action will update the state accordingly:

```js
{
  count: {
    past: [1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10],
    recordingEnabled: true
  }
}
```

> Note: If the `future` List is empty, dispatching `future` action will have no effect on the state.

### Toggling recording

By default, the recording of state history is enabled. To switch it on/off, you can dispatch the `toggleRecording` action, as defined above:

```js
dispatch(toggleRecording());
```

This will invert the value of `recordingEnabled`.

### Clearing recorded state

To clear recorded state you can dispatch the `clearRecording` as defined above:

```js
dispatch(clearRecording());
```

This will reset `past` and `future` Lists to empty Lists:

Before:

```js
{
  count: {
    past: [1, 2, 3, 4, 5, 6, 7],
    present: 8,
    future: [9, 10],
    recordingEnabled: true
  }
}
```

After `clearRecording`:

```js
{
  count: {
    past: [],
    present: 8,
    future: [],
    recordingEnabled: true
  }
}
```
