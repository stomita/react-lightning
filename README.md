# react-lightning-renderer

A React custom renderer implementation targeted to Salesforce Lightning Component development

## Install

```
$ npm install react-lightning-renderer
```

## Example

- JavaScript (should be bundled using webpack or other bundler, and added as a static resource)

```javascript
import React from 'react';
import { Button, render, handleEvent } from 'react-lightning-renderer';

class CounterApp extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  render() {
    const { count } = this.state;
    return (
      <div>
        <p>
          Count: { count }
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
  render(<CounterApp />, cmp);
}

export { init, handleEvent };
```

- Lightning Component (.cmp file)

```xml
<aura:component implements="flexipage:availableForAllPageTypes">
	<ltng:require scripts="{!$Resource.MyComponentApp + '/bundle.js'}"
		afterScriptsLoaded="{!c.doInit}"
	/>
	{!v.body}
</aura:component>
```

- Lightning Component Controller

```JavaScript
({
	doInit: function(cmp, event, helper) {
		window.MyComponentApp.init(cmp);
	},
	handleEvent: function(cmp, event) { // the controller method name always must be `handleEvent`
		window.MyComponentApp.handleEvent(cmp, event);
	}
})
```

### Deploying example components to your org

This repository includes example lightning components implemented with react-lightning-renderer.
To deploy the example components to your development org, do the following:

```
$ git clone https://github.com/stomita/react-lightning-renderer.git
$ cd react-lightning-renderer
$ npm install
$ SF_USERNAME=XXXX SF_PASSWORD=YYYY npm run deploy:example
```
