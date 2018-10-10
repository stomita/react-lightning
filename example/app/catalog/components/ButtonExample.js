/* @flow */
import React from 'react';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import {
  Button, ButtonStateful, ButtonIcon, ButtonGroup,
} from '../../../../src';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function genid() {
  return Math.random().toString(16).substring(2);
}

const enhancer = compose(
  withStateHandlers({
    follow: false,
    liked: false,
    messages: [],
  }, {
    onToggleFollow: ({ follow }) => () => ({
      follow: !follow,
    }),
    onToggleLiked: ({ liked }) => () => ({
      liked: !liked,
    }),
    onAddMessage: ({ messages }) => (id, message) => ({
      messages: [
        ...messages,
        { id, message }
      ],
    }),
    onDismissMessage: ({ messages }) => (id) => ({
      messages: messages.map((msg) => msg.id === id ? Object.assign({}, msg, { dismiss: true }) : msg),
    }),
    onRemoveMessage: ({ messages }) => (id) => ({
      messages: messages.filter((msg) => msg.id !== id),
    }),
  }),
  withHandlers({
    showMessage: ({ onAddMessage, onDismissMessage, onRemoveMessage }) => async (message) => {
      const id = genid();
      onAddMessage(id, message);
      await delay(2000);
      onDismissMessage(id);
      await delay(1000);
      onRemoveMessage(id);
    },
  }),
);

const ButtonExample = enhancer(props => {
  const {
    className, follow, liked, messages,
    onToggleFollow, onToggleLiked, showMessage,
  } = props;
  return (
    <div className={ className }>
      <div className="slds-p-vertical--small">
        <h3>Buttons</h3>
        <Button label="Base" variant="base" onclick={ () => showMessage('Base Clicked') }/>
        <Button label="Neutral" variant="neutral" onclick={ () => showMessage('Neutral Clicked') }/>
        <Button label="Brand" variant="brand" onclick={ () => showMessage('Brand Clicked') }/>
        <Button label="Destructive" variant="destructive" onclick={ () => showMessage('Destructive Clicked') }/>
      </div>
      <div className="slds-p-vertical--small">
        <h3>Button Icons</h3>
        <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="bare" onclick={ () => showMessage('Icon Bare Clicked') }/>
        <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="container" onclick={ () => showMessage('Icon Container Clicked') }/>
        <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="border" onclick={ () => showMessage('Icon Border Clicked') }/>
        <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="border-filled" onclick={ () => showMessage('Icon Border-Filled Clicked') }/>
      </div>
      <div className="slds-p-vertical--small">
        <h3>Buttons (inverse)</h3>
        <div className="slds-p-around--xx-small" style={ { backgroundColor: '#224' } }>
          <Button label="Inverse" variant="inverse" onclick={ () => showMessage('Inverse Clicked') }/>
          <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="bare-inverse" onclick={ () => showMessage('Icon Bare Inverse Clicked') }/>
          <ButtonIcon iconName="utility:settings" alternativeText="settings" variant="border-inverse" onclick={ () => showMessage('Icon Border Inverse Clicked') }/>
        </div>
      </div>
      <div className="slds-p-vertical--small">
        <h3>Stateful Buttons</h3>
        <ButtonStateful
          labelWhenOff="Follow"
          labelWhenOn="Following"
          labelWhenHover="Unfollow"
          iconNameWhenOff="utility:add"
          iconNameWhenOn="utility:check"
          iconNameWhenHover="utility:close"
          state={ follow }
          onclick={ onToggleFollow }
        />
      </div>
      <div className="slds-p-vertical--small">
        <h3>Button Group</h3>
        <ButtonGroup>
          <Button label="Refresh" onclick={ () => showMessage('Refresh clicked') }/>
          <Button label="Edit" onclick={ () => showMessage('Edit clicked') }/>
          <Button label="Save" onclick={ () => showMessage('Save clicked') }/>
        </ButtonGroup>
      </div>
      <div className="slds-p-top--large">
        {
          messages.map((msg) => (
            <p key={ msg.id } style={ msg.dismiss ? { opacity: .1, transition: 'opacity 1s' } : {} }>
              { msg.message }
            </p>
          ))
        }
      </div>
    </div>
  );
});

export default ButtonExample;
