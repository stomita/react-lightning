/* @flow */
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  Layout, LayoutItem,
  VerticalNavigation,VerticalNavigationSection, VerticalNavigationItem,
} from '../../../../src';
import ButtonExample from './ButtonExample';
import LayoutExample from './LayoutExample';

const EXAMPLES = [
  { label: 'Button', name: 'button' },
  { label: 'Layout', name: 'layout' },
];

const enhancer = compose(
  withStateHandlers({
    selected: 'button',
  }, {
    onChangeSelected: ({ selected }) => (e) => ({
      selected: e.getParam('name'),
    }),
  }),
);

const showOn = (bool: boolean) => bool ? 'slds-show' : 'slds-hide';

const CatalogApp = enhancer((props) => {
  const { selected, onChangeSelected } = props;
  return (
    <Layout horizontalAlign="spread">
      <LayoutItem size="3" padding="around-small">
        <VerticalNavigation selectedItem={ selected } onselect={ onChangeSelected }>
          <VerticalNavigationSection label="Examples">
            {
              EXAMPLES.map(({ label, name }) => (
                <VerticalNavigationItem key={ name } label={ label } name={ name } />
              ))
            }
          </VerticalNavigationSection>
        </VerticalNavigation>
      </LayoutItem>
      <LayoutItem size="9" padding="around-small">
        <LayoutExample className={ showOn(selected === 'layout') } />
        <ButtonExample className={ showOn(selected === 'button') } />
      </LayoutItem>
    </Layout>
  );
});

export default CatalogApp;
