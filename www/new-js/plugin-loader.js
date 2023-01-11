/*
  config format ::
  { ... ,
    'plugins': {
      '<plugin-name>': {
        'url': `<url to load plugin file from>`,
        'thread': `<name of webthread to run on>`,
        'threadOpts': {} //Options to pass to the thread
        'inputChannels': [`list of input channels`],
        'outputChannels': [`list of output channels`]
      }
    }
  }

  * Only 'url' param is required
  * 'thread' will default to '' if unspecified   # TODO: Figure out default thread
  * 'inputChannels' is optional and has no Defaults
  * 'outputChannels' is optional and will default to ... # TODO: figure out default channels

  plugin file requirements ::
    The plugin will be run entirely in a webthread and must have event handlers
    to receive events from the input channels.  Anything sent to the main thread
    must be emitted as an event.
*/

/* exports pluginLoader */

/* imports threadManager */

const pluginLoader = {

  pluginList: {},

  listPlugins: function() {
    return Object.keys(this.pluginList);
  },

  getPlugin: function(name) {
    return this.pluginList[name];
  },

  disablePlugin: function(name) {
    if(this.pluginList[name]) {
      // console.log(`TODO: Disconnect channels from thread`);
      plugin.inputChannels.forEach((item, i) => {
        let channel = eventChannelManager.getChannel(item);
        if(channel) channel.unsubscribe(thread);
      });
      plugin.outputChannels.forEach((item, i) => {
        thread.removeListener(item);
      });
      threadManager.stopThread(this.pluginList[name].thread || this.pluginList[name].worker);
      console.log(`[plugin-loader] '${name}' disabled`);
    }
  },
  enablePlugin: function(name) {
    if(this.pluginList[name]) {
      var plugin = this.pluginList[name];
      var thread = threadManager.startThread(plugin.thread || plugin.worker, plugin.url, plugin.threadOpts || plugin.workerOpts);
      // console.log(`TODO: Connect channels to thread`);
      plugin.inputChannels.forEach((item, i) => {
        let channel = eventChannelManager.getChannel(item);
        if(channel) channel.subscribe(thread);
      });
      plugin.outputChannels.forEach((item, i) => {
        const channel = eventChannelManager.getChannel(item);
        if(channel) thread.addListener(function(e) { channel.send(e.data.type, e.data.value); });
      });
      console.log(`[plugin-loader] '${name}' enabled`);
    }
  },

  loadPlugin: function(name, plugin) {
    if(name && plugin && plugin.url) {
      if( !this.pluginList[name] ) {
        console.log(`[plugin-loader] Loading '${name}'.`);
        this.pluginList[name] = plugin;
        this.enablePlugin(name);
      } else {
        console.log(`[plugin-loader] The plugin '${name}' has already been loaded.`);
      }
    } else {
      console.log(`[plugin-loader][ERROR] Invalid plugin configuration (name = '${name}', opts = '`+JSON.stringify(plugin)+`')`)
    }
  },

  loadPlugins: function(plugins) {
    if(typeof plugins === 'object') {
      for(const name in plugins) {
        this.loadPlugin(name, plugins[name]);
      }
    }
  }
}
