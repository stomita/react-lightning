/* @flow */
import React from 'react';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { Input, Button, render, handleEvent } from '../../src';

type State = {
  values: Array<{
    id: string,
    value: string,
  }>,
};

type Action =
  | { type: 'CHANGE_VALUE', payload: { index: number, value: string } }
  | { type: 'ADD_INPUT', payload: { index?: number, value: string } }
  | { type: 'REMOVE_INPUT', payload: { index: number } }

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

const store = createStore(reducer);

const enhancer = connect(
  (state: State) => state,
);

const App = enhancer(({ values, dispatch }) => (
  <div>
    {
      values.map(({ id, value }, index) => (
        <div key={ id }>
          <Button variant="base" iconName="utility:ban"
            onclick={ () => {
              dispatch({ type: 'REMOVE_INPUT', payload: { index } });
            } }
          />
          <Input
            label={ `Input Text: ${value}` }
            value={ value }
            onchange={ (e) => {
              const value = e.getSource().get('v.value');
              dispatch({ type: 'CHANGE_VALUE', payload: { index, value } });
            } }
          />
        </div>
      ))
    }
    <Button
      label="Add Entry"
      onclick={ () => {
        dispatch({ type: 'ADD_INPUT', payload: { value: '' } });
      } }
    />
  </div>
));

/**
 *
 */
function init(cmp: any) {
  render(
    <Provider store={ store }>
      <App />
    </Provider>,
    cmp
  );
}

export { init, handleEvent };
