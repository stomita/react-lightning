/* @flow */
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import {
  Layout, LayoutItem,
  VerticalNavigation,VerticalNavigationSection, VerticalNavigationItem,
} from '../../../../src';
import ButtonExample from './ButtonExample';
import LayoutExample from './LayoutExample';
import RecordEditFormExample from './RecordEditFormExample';
import ChatterExample from './ChatterExample';
import CustomComponentExample from './CustomComponentExample';

const EXAMPLES = [
  { label: 'Button', name: 'button' },
  { label: 'Chatter', name: 'chatter' },
  { label: 'Layout', name: 'layout' },
  { label: 'RecordEditForm', name: 'recordEditForm' },
  { label: 'Custom Component', name: 'customComponent' },
];

const enhancer = compose(
  withStateHandlers({
    selected: 'button',
    rendered: { button: true },
  }, {
    onChangeSelected: ({ selected, rendered }) => (e) => {
      const selected = e.getParam('name');
      return {
        selected,
        rendered: { ...rendered, [selected]: true },
      };
    },
  }),
);

const showOn = (bool: boolean) => bool ? 'slds-show' : 'slds-hide';

const CatalogApp = enhancer((props) => {
  const { selected, rendered, onChangeSelected } = props;
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
        {
          rendered.button ?
          <ButtonExample className={ showOn(selected === 'button') } /> :
          undefined
        }
        {
          rendered.chatter ?
          <ChatterExample className={ showOn(selected === 'chatter') } /> :
          undefined
        }
        {
          rendered.layout ?
          <LayoutExample className={ showOn(selected === 'layout') } /> :
          undefined
        }
        {
          rendered.recordEditForm ?
          <RecordEditFormExample className={ showOn(selected === 'recordEditForm') } /> :
          undefined
        }
        <CustomComponentExample className={ showOn(selected === 'customComponent') } />
      </LayoutItem>
    </Layout>
  );
});

export default CatalogApp;
