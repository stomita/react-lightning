/* @flow */
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { Layout, LayoutItem, Select, Input } from '../../../../src';

const enhancer = compose(
  withStateHandlers({
    horizontalAlign: 'space',
    verticalAlign: 'start',
    pullToBoundary: undefined,
    multipleRows: false,
  }, {
    onChangeHorizontalAlign: ({ horizontalAlign }) => (e) => ({
      horizontalAlign: e.getSource().get('v.value'),
    }),
    onChangeVerticalAlign: ({ verticalAlign }) => (e) => ({
      verticalAlign: e.getSource().get('v.value'),
    }),
    onChangePullToBoundary: ({ pullToBoundary }) => (e) => ({
      pullToBoundary: e.getSource().get('v.value'),
    }),
    onChangeMultipleRows: ({ multipleRows }) => (e) => ({
      multipleRows: !multipleRows,
    }),
  }),
);

const HORIZONTAL_ALIGNS = ['space', 'center', 'spread', 'end'];
const VERTICAL_ALIGNS = ['start', 'center', 'end', 'stretch'];
const PULL_TO_BOUNDARIES = ['small', 'medium', 'large'];

const LayoutExample = enhancer(props => {
  const {
    className,
    horizontalAlign,
    verticalAlign,
    pullToBoundary,
    multipleRows,
    onChangeHorizontalAlign,
    onChangeVerticalAlign,
    onChangePullToBoundary,
    onChangeMultipleRows,
  } = props;
  return (
    <div className={ className }>
      <Select label="Horizontal Align" onchange={ onChangeHorizontalAlign } value={ horizontalAlign }>
        { HORIZONTAL_ALIGNS.map(v => <option key={v} value={v}>{v}</option>) }
      </Select>
      <Select label="Vertical Align" onchange={ onChangeVerticalAlign }value={ verticalAlign }>
        { VERTICAL_ALIGNS.map(v => <option key={v} value={v}>{v}</option>) }
      </Select>
      <Select label="Pull to Boundary" onchange={ onChangePullToBoundary }value={ pullToBoundary }>
        { PULL_TO_BOUNDARIES.map(v => <option key={v} value={v}>{v}</option>) }
      </Select>
      <Input label="Multiple Rows" type="checkbox" checked={ multipleRows } onchange={ onChangeMultipleRows } />
      <hr />
      <Layout
        horizontalAlign={ horizontalAlign }
        verticalAlign={ verticalAlign }
        pullToBoundary={ pullToBoundary }
        multipleRows={ multipleRows }
      >
        <LayoutItem flexibility="auto" padding="around-small">
          <div style="width:150px; height: 100%; border: 1px dotted #999;">
            Lorem ipsum dolor sit amet, habeo fabellas cum an, habeo graeco tamquam usu no, pro omnes electram id.
            Eos cu quidam delicata, eum ne summo offendit. Ut est eius perpetua, pri cu dictas oblique.
          </div>
        </LayoutItem>
        <LayoutItem flexibility="auto" padding="around-small">
          <div style="width:200px; height: 100%; border: 1px dotted #999;">
            <p>
              Meliore adolescens definitiones an mei, at postea assentior duo. Quo ex simul laboramus instructior, eros illum per at,
              soluta dolorem incorrupte ad mea.
            </p>
            <p>
              Est ei solet meliore, sit scripta incorrupte cu. Id errem exerci praesent sed, nam ad odio iisque.
              At dicit mucius duo, mucius menandri sadipscing ad ius.
            </p>
          </div>
        </LayoutItem>
        <LayoutItem flexibility="auto" padding="around-small">
          <div style="width:100px; height: 100%; border: 1px dotted #999;">
            Est ei solet meliore, sit scripta incorrupte cu. Id errem exerci praesent sed, nam ad odio iisque.
            At dicit mucius duo, mucius menandri sadipscing ad ius.
          </div>
        </LayoutItem>
      </Layout>
    </div>
  );
});

export default LayoutExample;
