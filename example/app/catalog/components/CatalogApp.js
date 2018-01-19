/* @flow */
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  Layout, LayoutItem,
  VerticalNavigation,VerticalNavigationSection, VerticalNavigationItem,
} from '../../../../src';
import ButtonExample from './ButtonExample';
import LayoutExample from './LayoutExample';
import ChatterExample from './ChatterExample';
import CustomComponentExample from './CustomComponentExample';

const EXAMPLES = [
  { label: 'Button', name: 'button' },
  { label: 'Chatter', name: 'chatter' },
  { label: 'Layout', name: 'layout' },
  { label: 'Custom Component', name: 'customComponent' },
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
      <LayoutItem size="3" class="slds-p-right--x-small">
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
      <LayoutItem size="9" class="slds-p-left--x-small">
        <ButtonExample className={ showOn(selected === 'button') } />
        <ChatterExample className={ showOn(selected === 'chatter') } />
        <LayoutExample className={ showOn(selected === 'layout') } />
        <CustomComponentExample className={ showOn(selected === 'customComponent') } />
      </LayoutItem>
    </Layout>
  );
});

export default CatalogApp;
