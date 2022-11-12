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
      if(this.moduleList.indexOf(name) < 0) {
        var script = document.create('script');
        script.type = 'module';
        script.src = module.url;
        script.onload = async function() {
          console.log("Importing '"+name+"' from "+module.url);
          const items = await import(module.url);
          this.moduleList[name] = items;
        }
        document.body.append(script);
        this.moduleOpts[name] = module;
      } else {
        console.log("The module '"+name+"' has already been loaded.");
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
  }
}
