/* @flow */
import React from 'react';
import { compose, withStateHandlers, withProps } from 'recompose';
import { Input, CustomComponent } from '../../../../src';

const enhancer = compose(
  withStateHandlers({
    incValue: "1",
  }, {
    onChangeIncValue: () => (e) => ({
      incValue: e.getSource().get('v.value'),
    }),
  }),
  withProps(({ incValue }) => ({ incNum: Number(incValue) })),
);


const CustomComponentExample = enhancer(props => {
  const {
    className, incValue, incNum, onChangeIncValue,
  } = props;
  return (
    <div className={ className }>
      <div className="slds-p-vertical--small">
        <h3>Custom Component</h3>
        <Input type="number" label="Increment Num" value={ incValue } onchange={ onChangeIncValue } />
        <div className="slds-box slds-m-top--medium">
          <CustomComponent componentName="c:ReactLightningRendererDemoSimple" incNum={ incNum } />
        </div>
      </div>
    </div>
  );
});

export default CustomComponentExample;
