import React from 'react';
import { FormattedText, FormattedNumber, Button, render, handleEvent } from '../../src';

class App extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  render() {
    const { count } = this.state;
    return (
      <div>
        <p>
          Count: <FormattedNumber value={ count } />
        </p>
        <Button
          iconName="utility:add"
          onclick={ () => this.setState({ count: this.state.count + 1 }) }
        />
        <Button
          iconName="utility:dash"
          onclick={ () => this.setState({ count: this.state.count - 1 }) }
        />
      </div>
    );
  }
}

function init(cmp) {
  render(<App />, cmp);
}

export { init, handleEvent };
