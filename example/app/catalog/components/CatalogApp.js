/* @flow */
import React from 'react';
import { Input, Button } from '../../../../src';
import { connect, Provider } from 'react-redux';
import type { State } from '../types';

const enhancer = connect(
  (state: State) => state,
);

const CatalogApp = enhancer(({ values, dispatch }) => (
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

export default CatalogApp;
