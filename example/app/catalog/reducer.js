/* @flow */
import type { State, Action } from './types';

const genid = () => Math.random().toString(16).substring(2);

const initState: State = {
  values: Array.from({ length: 0 }).map(() => ({
    id: genid(),
    value: '',
  }))
};

const reducer = (state: State = initState, action: Action): State => {
  const { values } = state;
  switch (action.type) {
    case 'CHANGE_VALUE':
      return {
        values: [
          ...values.slice(0, action.payload.index),
          Object.assign({}, values[action.payload.index], { value: action.payload.value }),
          ...values.slice(action.payload.index + 1),
        ],
      };
    case 'ADD_INPUT':
      const { index = values.length } = action.payload;
      return {
        values: [
          ...values.slice(0, index),
          { id: genid(), value: action.payload.value },
          ...values.slice(index),
        ],
      };
    case 'REMOVE_INPUT':
      return {
        values: [
          ...values.slice(0, action.payload.index),
          ...values.slice(action.payload.index + 1),
        ],
      };
    default:
      break;
  }
  return state;
};

export default reducer;
