import Renderer from './LightningRenderer';


/**
 *
 */
function findInstance(inst, id) {
  if (!inst) {
    return null;
  }
  if (inst.id === id) {
    return inst;
  }
  for (const cinst of inst.children) {
    if (typeof cinst !== 'string') {
      const ret = findInstance(cinst, id);
      if (ret) {
        return ret;
      }
    }
  }
  return null;
}

function findHandlerFunc(inst, eventName) {
  let propName;
  if (inst.type === 'lightning:input' && eventName === 'input') {
    propName = 'onchange';
  } else {
    propName = `on${eventName}`;
  }
  return inst.props[propName];
}

function createEventHandler(container) {
  return (cmp, event) => {
    const srcCmp = event.getSource();
    const eventName = event.getName();
    console.log('handleEvent', srcCmp, eventName);
    const inst = findInstance(container.root, srcCmp.getLocalId());
    if (!inst) {
      return;
    }
    const fn = findHandlerFunc(inst, eventName);
    if (!fn) {
      return;
    }
    fn(event);
  };
}

const _eventHandlers = {};

function createContainer(cmp) {
  const container = {
    cmp,
    auraRun: $A.getCallback(fn => {
      if (cmp.isValid()) fn();
    })
  };
  const gid = cmp.getGlobalId();
  _eventHandlers[gid] = createEventHandler(container);
  return container;
};

export function handleEvent(component, event) {
  const gid = component.getGlobalId();
  const handler = _eventHandlers[gid];
  handler(component, event);
}

export function render(element, component) {
  // Create root container instance
  const container = createContainer(component);
  const node = Renderer.createContainer(container);
  Renderer.updateContainer(element, node, null);
}