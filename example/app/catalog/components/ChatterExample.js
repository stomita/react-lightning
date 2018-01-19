/* @flow */
import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { Select } from '../../../../src';
import {
  Feed, FullFeed, Publisher,
} from '../../../../src/components/chatter';

const FEED_TYPES = [
  'Bookmarks', 'Company', 'DirectMessages', 'Feeds', 'Files', 'Filter',
  'Groups', 'Home', 'Moderation', 'Mute', 'News', 'PendingReview', 'Record',
  'Streams', 'To', 'Topics', 'UserProfile',
];

const FEED_DESIGNS = [
  'DEFAULT',
  'BROWSE',
];

const enhancer = compose(
  withStateHandlers({
    feedType: 'News',
    feedDesign: 'DEFAULT',
  }, {
    onChangeFeedType: () => (e) => ({
      feedType: e.getSource().get('v.value'),
    }),
    onChangeFeedDesign: () => (e) => ({
      feedDesign: e.getSource().get('v.value'),
    }),
  })

);

const ChatterExample = enhancer((props) => {
  const {
    className, feedType, feedDesign,
    onChangeFeedType, onChangeFeedDesign,
  } = props;
  return (
    <div className={ className }>
      <div className="slds-p-vertical--small">
        <h3>Publisher</h3>
        <Publisher context="GLOBAL" />
      </div>
      <div className="slds-p-vertical--small">
        <h3>Feed</h3>
        <Select label="Feed Type" value={ feedType } onchange={ onChangeFeedType }>
          { FEED_TYPES.map((v) => <option key={v} value={v}>{v}</option>) }
        </Select>
        <Select label="Feed Design" value={ feedDesign } onchange={ onChangeFeedDesign }>
          { FEED_DESIGNS.map((v) => <option key={v} value={v}>{v}</option>) }
        </Select>
        <div className="slds-p-top--medium">
          <Feed key={ `${feedType}:${feedDesign}` } type={ feedType } feedDesign={ feedDesign } />
        </div>
      </div>
    </div>
  );
});

export default ChatterExample;
