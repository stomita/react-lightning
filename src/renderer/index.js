/* @flow */
import Renderer from './LightningRenderer';
import type {
  Aura, AuraComponent, AuraEvent,
  Container, Instance,
} from './LightningRenderer';

declare var $A: Aura;

/**
 *
 */
function findInstance(
  inst: ?Instance,
  id: string,
): ?Instance {
  if (!inst) { return null; }
  if (inst.id === id) { return inst; }
  for (const cinst of inst.children) {
    if (typeof cinst !== 'string') {
      const ret = findInstance(cinst, id);
      if (ret) { return ret; }
    }
  }
  return null;
}

function findHandlerFunc(inst: Instance, eventName: string) {
  let propName;
  if (inst.type === 'lightning:input') {
    if (eventName === 'input' || (inst.props.type === 'checkbox' && eventName === 'click')) {
      propName = 'onchange';
    }
  } else {
    propName = `on${eventName}`;
  }
  return inst.props[propName];
}

function createEventHandler(container: Container) {
  return (cmp: AuraComponent, event: AuraEvent) => {
    const srcCmp = event.getSource();
    const eventName = event.getName();
    console.log('handleEvent', srcCmp, eventName);
    const inst = findInstance(container.root, srcCmp.getLocalId());
    if (!inst) { return; }
    const fn = findHandlerFunc(inst, eventName);
    if (!fn) { return; }
    fn(event);
  };
}

const _eventHandlers = {};

function createContainer(cmp: AuraComponent) {
  const container = {
    cmp,
    auraRun: $A.getCallback((fn: Function): void => {
      if (cmp.isValid()) fn();
    }),
  };
  const gid = cmp.getGlobalId();
  _eventHandlers[gid] = createEventHandler(container);
  return container;
};

export function handleEvent(
  component: AuraComponent,
  event: AuraEvent,
) {
  const gid = component.getGlobalId();
  const handler = _eventHandlers[gid];
  handler(component, event);
}

export function render(
  element: React$Element<any>,
  component: AuraComponent,
) {
  // Create root container instance
  const container = createContainer(component);
  const node = Renderer.createContainer(container);
  Renderer.updateContainer(element, node, null);
}
