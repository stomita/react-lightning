import React from 'react';
import { Button, render, handleEvent, mapAttrToProps } from '../../src';

class CounterApp extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  render() {
    console.log('CounterApp.render()', this.props);
    const { incNum } = this.props;
    const { count } = this.state;
    return (
      <div>
        <p>
          Count: { count }
        </p>
        <Button
          iconName="utility:volume_high"
          label={ `+ ${incNum}` }
          onclick={ () => this.setState({ count: count + incNum }) }
        />
        <Button
          iconName="utility:volume_low"
          label={ `- ${incNum}` }
          onclick={ () => this.setState({ count: count - incNum }) }
        />
      </div>
    );
  }
}

function init(cmp) {
  const enhancer = mapAttrToProps(cmp, ['incNum']);
  const App = enhancer(CounterApp);
  render(<App />, cmp);
}

export { init, handleEvent };
