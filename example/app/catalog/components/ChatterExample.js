/* @flow */
import React from 'react';
import { Select } from '../../../../src';
import {
  Feed, FullFeed, Publisher,
} from '../../../../src/components/chatter';

const ChatterExample = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div className={ className }>
      <div className="slds-p-vertical--small">
        <h3>Publisher</h3>
        <Publisher context="GLOBAL" />
      </div>
      <div className="slds-p-vertical--small">
        <h3>Feed</h3>
        <Feed type="News" feedDesign="DEFAULT" />
      </div>
    </div>
  );
};

export default ChatterExample;
