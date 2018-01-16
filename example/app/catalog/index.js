/* @flow */
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { CatalogApp } from './components';
import reducer from './reducer';
import { render, handleEvent } from '../../../src';

const store = createStore(reducer);
/**
 *
 */
function init(cmp: any) {
  render(
    <Provider store={ store }>
      <CatalogApp />
    </Provider>,
    cmp
  );
}

export { init, handleEvent };
