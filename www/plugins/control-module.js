/*
  The control module is a plugin that maps 'input' channel events to 'control' channel events

  Suggested plugin config ::
  {
    'url': './plugins/control-module.js',
    'worker': 'control-module',
    'inputChannels': ['input'],
    'outputChannels': ['control']
  }

  Default mapping ::
  {
    'w': 'forward',
    'a': 'left',
    's': 'backward',
    'd': 'right'
  }

*/

function default_mapping() {
  eventHandlers['configure']({mapping:{
    'w': 'forward',
    'a': 'left',
    's': 'backward',
    'd': 'right',
    'space': 'jump',
    'inventory': 'i'
  }});
}

const eventHandlers = {};
const controlFunctions = {};
var mapping = {};
const controlState = {};

//Load handler mappings
eventHandlers['configure'] = function(e) {
  mapping = e.mapping;
}

function sendEvent (name, data) {
  self.postMessage({type:name, value:data});
}

addEventListener("message", (e) => {
  // console.log('[control-module] message data :: ',JSON.stringify(e.data))
  // console.log('[control-module] eventHandlers['+e.data.type+'] : ', eventHandlers[e.data.type]);
  try {
    controlState[mapping[e.data.type]] = e.data.value;
    sendEvent('state',controlState);
  } catch(e) {
    console.log(`[control-module][ERROR]:`,e);
  }
});

default_mapping();
