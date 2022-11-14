/*
  (2022-11-11) depricated after security considerations.  Loading the module
               AT ALL in the main thread is sub-optimal and restricts developers
               to certain criterea. See plugin-loader.js instead.

  config format ::
  { ... ,
    'modules': {
      '<module-name>': {
        'url': "<url to load module file from>",
        'worker': "<name of webworker to run on>"
        'opts': []
      }
    }
  }

  * Only 'url' param is required
  * 'worker' will default to '' if unspecified   # TODO: Figure out default worker
  * 'opts' will be an empty array if unspecified

  module file requirements ::
  export const channels = [...];         # an array of channels to load
  export function main(options) { ... }; # the main function to execute

  * Only the main function is required.
  * If no channels are specified, then ....  # TODO: Figure out default channel(s)
*/

export const moduleLoader = {

  moduleList: {},
  moduleOpts: {},

  listModules: function() {
    return Object.keys(this.moduleList);
  },
  list: function() {
    return this.listModules();
  },

  getModule: function(name) {
    return this.moduleList[name];
  },
  get: function(name) {
    return this.getModule(name);
  },

  loadModule: function(name, module) {
    if(name && module && module.url) {
      if( !this.moduleList[name] ) {
        this.moduleOpts[name] = module.opts;
        var script = document.createElement('script');
        script.type = 'module';
        script.src = module.url;
        script.onload = async function() {
          await this.__importModule(name, module.url);
          this.__initModule(name, module.worker, module.opts);
        }.bind(this);
        document.body.append(script);
      } else {
        console.log("[module-loader] The module '"+name+"' has already been loaded.");
      }
    } else {
      console.log("[module-loader][ERROR] Invalid module configuration (name = '"+name+"', opts = '"+JSON.stringify(module)+"')")
    }
  },

  loadModules: function(modules) {
    if(typeof modules === 'object') {
      for(const name in modules) {
        this.loadModule(name, modules[name]);
      }
    }
  },

  __importModule: async function(name, url) {
    console.log("[module-loader] Importing '"+name+"' from "+url);
    const items = await import(url);
    if(items.main) {
      this.moduleList[name] = items;
    } else {
      console.log("[module-loader][ERROR] The module '"+name+"' at "+url+" does not have a main function.  Unable to load.");
    }
  },

  __initModule: function(name, worker_id, opts) {
    console.log("[module-loader] Initializing '"+name+"'");
    console.log(" TODO: set up worker manager");
    console.log(" TODO: initialize module main on worker");
  }
}
