/* @flow */
import uuid from 'uuid';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import hyphenateStyleName from 'fbjs/lib/hyphenateStyleName';

/**
 *
 */
export type Aura = {
  getCallback: <T>(T) => T,
  createComponents: (Array<[string, Object]>, Function) => void,
};

export type AuraComponent = {
  get: (string) => any,
  set: (string, any) => void,
  isValid: () => boolean,
  getGlobalId: () => string,
  getLocalId: () => string,
  find: (string) => ?AuraComponent,
  getReference: (string) => Function,
  addEventHandler: (string, Function) => void,
  addValueHandler: ({ event: string, value: string, method: Function }) => void,
  destroy: () => void,
};

export type AuraEvent = {
  getSource: () => AuraComponent,
  getName: () => string,
};

export type Props = Object;
export type Instance = {
  id: string,
  type: string,
  props: Props,
  children: Array<Instance>,
  container: Container;
  cmp?: ?AuraComponent,
};
export type Container = {
  root?: Instance,
  cmp: AuraComponent,
  auraRun: (Function) => void,
};

/**
 *
 */
declare var $A: Aura;

/**
 *
 */
function randId() {
  return Math.random().toString(16).substring(2);
}

async function createComponents(componentDefs: Array<[string, Object]>) {
  return new Promise((resolve, reject) => {
    $A.createComponents(
      componentDefs,
      (components: AuraComponent[], status: 'SUCCESS' | 'ERROR' | 'INCOMPLETE', errMessages: ?Object[]) => {
        if (status === 'SUCCESS') {
          resolve(components);
        } else {
          const message = errMessages && errMessages.filter(err => err.status !== 'SUCCESS')
            .map(err => err.message)
            .join('\n');
          reject(new Error(message));
        }
      }
    );
  });
}

async function registerComponentRoot(container: Container) {
  if (!container.root) { return; }
  const root = container.root;
  await syncComponentTree(container.root);
  container.auraRun(() => {
    container.cmp.set('v.body', root.cmp);
  });
}

function unregisterComponentRoot(
  container: Container,
) {
  container.auraRun(() => {
    container.cmp.set('v.body', []);
  });
}

function destroyInstance(instance: Instance) {
  if (instance.cmp) {
    const cmp = instance.cmp;
    instance.cmp = null;
    instance.container.auraRun(() => cmp.destroy());
  }
}

async function syncComponentTree(inst: Instance) {
  console.log('syncComponentTree', inst);
  const cmpInsts = flattenToInstanceArray(inst)
  const cmpMap = {};
  const initInsts = cmpInsts.filter((cmpInst) => !cmpInst.cmp);
  const initCompDefs = initInsts.map(convertToComponentDefs);
  console.log('compDefs=>', initCompDefs);
  if (initCompDefs.length > 0) {
    const components = await createComponents(initCompDefs);
    for (const [index, cmp_] of Object.entries(components)) {
      const cmp = ((cmp_: any) : AuraComponent);
      const i = parseInt(index, 10);
      const initInst = initInsts[i];
      // assignFunctionProps(cmp, initInst.props);
      initInst.cmp = cmp;
    }
  }
  reflectComponentTree(inst);
  // const missingCompDefs = instances.map(convertToComponentDefs);
}

function _reflectComponentTree(inst: Instance): ?AuraComponent {
  const cmp = inst.cmp;
  if (!cmp) { return null; }
  if (inst.type === 'TEXT') { return cmp; }
  const body = inst.children.map((cinst) => {
    return _reflectComponentTree(cinst);
  }).filter((cmp) => cmp);
  if (body.length > 0) {
    try {
      cmp.set('v.body', body);
    } catch(e) {
      console.error(e);
      inst.cmp = null;
      cmp.destroy();
      return null;
    }
  }
  return cmp;
}

function reflectComponentTree(inst: Instance): void {
  const auraRun = inst.container.auraRun;
  auraRun(() => { _reflectComponentTree(inst) });
}

function isHtmlInstance(inst: Instance) {
  return !/^[\w\-]+:|^TEXT$/.test(inst.type);
}

function toHtmlAttr(prop: string) {
  return (
    prop === 'className' ? 'class' :
    prop === 'htmlFor' ? 'for' :
    prop
  );
}

const UNITLESS_NUMBER = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

function toStyleAttrValue(styles: {[string]: any }): string {
  return Object.keys(styles).map((name: string) => {
    const val = styles[name];
    const unit =
      (typeof val === 'number' && val !== 0 && !UNITLESS_NUMBER[name]) ? 'px' : '';
    const styleName = name === 'cssFloat' ? 'float' : hyphenateStyleName(name);
    return `${styleName}:${val}${unit};`;
  }).join(' ');
}

function _updateComponentProps(
  inst: Instance,
  updatePayload: Array<{ prop: string, value: any }>
) {
  const cmp = inst.cmp;
  if (!cmp) { return; }
  for (const { prop, value } of updatePayload) {
    if (typeof value !== 'function') {
      if (isHtmlInstance(inst)) {
        const attr = toHtmlAttr(prop);
        const attrs = cmp.get('v.HTMLAttributes');
        const val = attr === 'style' ? toStyleAttrValue(value) : value;
        attrs[attr] = val;
        cmp.set(`v.HTMLAttributes`, attrs);
      } else {
        cmp.set(`v.${prop}`, value);
      }
    }
  }
}

function updateComponentProps(inst, updatePayload) {
  const auraRun = inst.container.auraRun;
  auraRun(() => { _updateComponentProps(inst, updatePayload) });
}

function convertToHtmlAttrs(props: Object) {
  return Object.keys(props).reduce((attrs, prop) => {
    const value = props[prop];
    const attr = toHtmlAttr(prop);
    const val = attr === 'style' ? toStyleAttrValue(value) : value;
    return { ...attrs, [attr]: val };
  }, {});
}

function convertToComponentDefs(inst: Instance): [string, Object] {
  const container = inst.container || inst;
  const containerCmp = container.cmp;
  if (!containerCmp) { throw new Error('no container cmp defined'); }
  const cmpProps = Object.keys(inst.props).reduce((props, prop) => {
    if (prop === 'children') { return props; }
    let value = inst.props[prop];
    if (typeof value === 'function') {
      value = containerCmp.getReference('c.handleEvent');
    }
    return { ...props, [prop]: value };
  }, {});
  if (/^[\w\-]+:/.test(inst.type)) {
    return [
      inst.type,
      { ...cmpProps, 'aura:id': inst.id },
    ];
  }
  if (inst.type === 'TEXT') {
    return [
      'aura:text',
      {
        'aura:id': inst.id,
        value: inst.props.value,
      }
    ];
  }
  return [
    'aura:html',
    {
      tag: inst.type,
      'aura:id': inst.id,
      HTMLAttributes: convertToHtmlAttrs(cmpProps),
    },
  ];
}


function flattenToInstanceArray(inst: Instance): Array<Instance> {
  return [
    inst,
    ...inst.children
      .map((cinst) => flattenToInstanceArray(cinst))
      .reduce((ret, arr) => [...ret, ...arr], []),
  ];
}

/**
 *
 */
function diffProps(oldProps: Object, newProps: Object) {
  const updatePayload = [];
  for (const key of Object.keys(oldProps)) {
    if (key === 'children') { continue; }
    const oldValue = oldProps[key];
    const newValue = newProps[key];
    if (oldValue !== newValue) {
      updatePayload.push({ prop: key, value: newValue });
    }
  }
  return updatePayload.length > 0 ? updatePayload : null;
}

/**
 *
 */
const LightningRenderer = Reconciler({
  appendInitialChild(
    parentInstance: Instance,
    child: Instance,
  ): void {
    parentInstance.children.push(child);
  },

  createInstance(
    type: string,
    props: Props,
    rootContainerInstance: Container,
    hostContext: {},
    internalInstanceHandle: Object,
  ): Instance {
    const id = randId();
    return { id, type, props, children: [], container: rootContainerInstance };
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    // console.log('#createTextInstance()', text);
    const id = randId();
    const type = 'TEXT';
    const props = { value: text };
    return { id, type, props, children: [], container: rootContainerInstance };
  },

  finalizeInitialChildren(element, type, props) {
    // console.log('#finalizeInitialChildren()');
    return false;
  },

  getPublicInstance(inst) {
    // console.log('#getPublicInstance()', inst);
    return inst;
  },

  prepareForCommit(...args) {
    // console.log('#prepareForCommit()', ...args);
    // noop
  },

  prepareUpdate(element, type, oldProps, newProps) {
    // console.log('#prepareUpdate()');
    return diffProps(oldProps, newProps);
  },

  resetAfterCommit(...args) {
    // console.log('#resetAfterCommit()', ...args);
    // noop
  },

  resetTextContent(element) {
    // console.log('#resetTextContent()', element);
    // noop
  },

  getRootHostContext(rootInstance) {
    // console.log('#getRootHostContext()');
    // You can use this 'rootInstance' to pass data from the roots.
  },

  getChildHostContext() {
    // console.log('#getChildHostContext()');
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    // console.log('#shouldSetTextContent()');
    return false;
  },

  now: (
    process.hrtime ?
      () => process.hrtime() :
    typeof performance !== null ?
      () => performance.now() :
      () => Date.now()
  ),

  useSyncScheduling: true,

  mutation: {
    appendChild(
      parentInstance: Instance,
      child: Instance,
    ): void {
      // console.log('mutation#appendChild()')
      parentInstance.children.push(child);
      syncComponentTree(parentInstance);
    },

    appendChildToContainer(
      container: Container,
      child: Instance,
    ): void {
      // console.log('mutation#appendChildToContainer()', container, child)
      container.root = child;
      registerComponentRoot(container);
    },

    removeChild(
      parentInstance: Instance,
      child: Instance,
    ): void {
      // console.log('mutation#removeChild()')
      const index = parentInstance.children.indexOf(child);
      if (index >= 0) {
        parentInstance.children.splice(index, 1);
      }
      (async () => {
        await syncComponentTree(parentInstance);
        destroyInstance(child);
      })();
    },

    removeChildFromContainer(
      container: Container,
      child: Instance,
    ): void {
      // console.log('mutation#removeChildFromContainer()')
      if (container.root === child) {
        container.root = undefined;
      }
      unregisterComponentRoot(container);
      destroyInstance(child);
    },

    insertBefore(
      parentInstance: Instance,
      child: Instance,
      beforeChild: Instance,
    ): void {
      // console.log('mutation#insertBefore()')
      const index = parentInstance.children.indexOf(beforeChild);
      if (index >= 0) {
        parentInstance.children.splice(index, 0, child);
      }
      syncComponentTree(parentInstance);
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      // console.log('mutation#commitUpdate()', instance, updatePayload, type, oldProps, newProps);
      instance.props = newProps;
      updateComponentProps(instance, updatePayload);
      // noop
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // console.log('mutation#commitMount()')
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      // console.log('mutation#commitTextUpdate()')
      textInstance.props.value = newText;
      updateComponentProps(textInstance, [{ prop: 'value', value: newText }]);
    },
  }
});

export default LightningRenderer;
