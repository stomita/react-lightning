import uuid from 'uuid';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';

/**
 *
 */


/**
 *
 */


/**
 *
 */
function randId() {
  return Math.random().toString(16).substring(2);
}

async function createComponents(componentDefs) {
  return new Promise((resolve, reject) => {
    $A.createComponents(componentDefs, (components, status, errMessages) => {
      if (status === 'SUCCESS') {
        resolve(components);
      } else {
        const message = errMessages && errMessages.filter(err => err.status !== 'SUCCESS').map(err => err.message).join('\n');
        reject(new Error(message));
      }
    });
  });
}

async function registerComponentRoot(container) {
  if (!container.root) {
    return;
  }
  const root = container.root;
  await syncComponentTree(container.root);
  container.auraRun(() => {
    container.cmp.set('v.body', root.cmp);
  });
}

function unregisterComponentRoot(container) {
  container.auraRun(() => {
    container.cmp.set('v.body', []);
  });
}

function destroyInstance(instance) {
  if (typeof instance !== 'string' && instance.cmp) {
    const cmp = instance.cmp;
    instance.cmp = null;
    instance.container.auraRun(() => cmp.destroy());
  }
}

async function syncComponentTree(inst) {
  console.log('syncComponentTree', inst);
  const cmpInsts = flattenToInstanceArray(inst);
  const cmpMap = {};
  const initInsts = cmpInsts.filter(cmpInst => !cmpInst.cmp);
  const initCompDefs = initInsts.map(convertToComponentDefs);
  console.log('compDefs=>', initCompDefs);
  if (initCompDefs.length > 0) {
    const components = await createComponents(initCompDefs);
    for (const [index, cmp_] of Object.entries(components)) {
      const cmp = cmp_;
      const i = parseInt(index, 10);
      const initInst = initInsts[i];
      // assignFunctionProps(cmp, initInst.props);
      initInst.cmp = cmp;
    }
  }
  reflectComponentTree(inst);
  // const missingCompDefs = instances.map(convertToComponentDefs);
}

function _reflectComponentTree(inst) {
  const body = inst.children.map(cinst => {
    if (typeof cinst !== 'string') {
      return _reflectComponentTree(cinst);
    }
    return cinst;
  });
  const cmp = inst.cmp;
  if (!cmp) {
    throw new Error('cannot be reached here');
  }
  cmp.set('v.body', body);
  return cmp;
}

function reflectComponentTree(inst) {
  const auraRun = inst.container.auraRun;
  auraRun(() => {
    _reflectComponentTree(inst);
  });
}

function _updateComponentProps(inst, updatePayload) {
  const cmp = inst.cmp;
  if (!cmp) {
    return;
  }
  for (const { prop, value } of updatePayload) {
    if (typeof value !== 'function') {
      cmp.set(`v.${prop}`, value);
    }
  }
}

function updateComponentProps(inst, updatePayload) {
  const auraRun = inst.container.auraRun;
  auraRun(() => {
    _updateComponentProps(inst, updatePayload);
  });
}

function convertToComponentDefs(inst) {
  const container = inst.container || inst;
  const containerCmp = container.cmp;
  if (!containerCmp) {
    throw new Error('no container cmp defined');
  }
  console.log('inst.type=>', inst.type);
  const cmpProps = Object.keys(inst.props).reduce((props, prop) => {
    if (prop === 'children') {
      return props;
    }
    let value = inst.props[prop];
    if (typeof value === 'function') {
      value = containerCmp.getReference('c.handleEvent');
    }
    return Object.assign({}, props, { [prop]: value });
  }, {});
  if (inst.type.indexOf('lightning:') === 0) {
    return [inst.type, Object.assign({}, cmpProps, { 'aura:id': inst.id })];
  }
  return ['aura:html', Object.assign({}, cmpProps, {
    tag: inst.type,
    'aura:id': inst.id
  })];
}

function flattenToInstanceArray(inst) {
  if (typeof inst === 'string') {
    return [];
  }
  return [inst, ...inst.children.map(cinst => flattenToInstanceArray(cinst)).reduce((ret, arr) => [...ret, ...arr], [])];
}

/**
 *
 */
function diffProps(oldProps, newProps) {
  const updatePayload = [];
  for (const key of Object.keys(oldProps)) {
    if (key === 'children') {
      continue;
    }
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
  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child);
  },

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    const id = randId();
    return { id, type, props, children: [], container: rootContainerInstance };
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    // console.log('#createTextInstance()', text);
    return text;
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

  now: process.hrtime ? () => process.hrtime() : typeof performance !== null ? () => performance.now() : () => Date.now(),

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      // console.log('mutation#appendChild()')
      parentInstance.children.push(child);
      syncComponentTree(parentInstance);
    },

    appendChildToContainer(container, child) {
      // console.log('mutation#appendChildToContainer()', container, child)
      container.root = child;
      registerComponentRoot(container);
    },

    removeChild(parentInstance, child) {
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

    removeChildFromContainer(container, child) {
      // console.log('mutation#removeChildFromContainer()')
      if (container.root === child) {
        container.root = undefined;
      }
      unregisterComponentRoot(container);
      destroyInstance(child);
    },

    insertBefore(parentInstance, child, beforeChild) {
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
      textInstance.children = newText;
    }
  }
});

export default LightningRenderer;