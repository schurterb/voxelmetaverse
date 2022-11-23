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
    'w': 'move-forward',
    'a': 'move-left',
    's': 'move-right',
    'd': 'move-back'
  }

*/

addEventListener("message", (e) => {
  console.log(`[control-module] Message Received :: ${e.data}`);
  // console.log(`[control-module] Message Received :: ${e.data['mouse-0']}`);
});
