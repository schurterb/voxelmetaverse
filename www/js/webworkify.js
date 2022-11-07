function webworkify (require, module, exports) {

   // var bundleFn = "function (initFunctions, loaded_modules, starters) { \
   //   var require; \
   //   require = function (name) { \
   //     if(initFunctions[name]) { \
   //       if( !loaded_modules[name] ) { \
   //         console.log(\"[webworkify] Loading \"+name); \
   //         var module={}; var exports={}; initFunctions[name](require, module, exports); \
   //         console.log(\"[webworkify]  - COMPLETE\"); \
   //         if(module.exports) { \
   //           loaded_modules[name] = module.exports \
   //         } else { \
   //           loaded_modules[name] = exports; \
   //         } \
   //       } \
   //       return loaded_modules[name] \
   //     } else { \
   //       console.log(\"Error :: \"+name+\" does not exist\"); \
   //       return null; \
   //     } \
   //   }; \
   //   for (let x=0; x<starters.length; x++) { \
   //     require(starters[x]); \
   //   } \
   // }";
    var bundleFn = "function (initFunctions, loaded_modules, starters) { \
      var require; \
      require = function (name) { \
        if(initFunctions[name]) { \
          if( !loaded_modules[name] ) { \
            var module={}; var exports={}; initFunctions[name](require, module, exports); \
            if(module.exports) { \
              loaded_modules[name] = module.exports \
            } else { \
              loaded_modules[name] = exports; \
            } \
          } \
          return loaded_modules[name] \
        } else { \
          console.log(\"Error :: \"+name+\" does not exist\"); \
          return null; \
        } \
      }; \
      for (let x=0; x<starters.length; x++) { \
        require(starters[x]); \
      } \
    }";
    var stringify = JSON.stringify;

    module.exports = function(fn) {

        console.log("[webworkify] fn :: ",fn);

        var sources = initFunctions;
        var cache = loaded_modules;
        var keys = [];
        var wkey;
        var cacheKeys = Object.keys(cache);

        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            if (cache[key] === fn) {
                wkey = key;
                break;
            }
        }

        if (!wkey) {
            wkey = "anon"+Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
            sources[wkey] = Function(['require', 'module', 'exports'], '(' + fn + ')(self);');
            Object.defineProperty(sources[wkey], "name", { value: wkey });
        }
        var skey = "anon"+Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

        var scache = {};
        // sources[skey] = Function(['require'], 'require(' + stringify(wkey) + ');');
        sources[skey] = Function(['require'], 'const main_const_var = require(' + stringify(wkey) + ')();');
        Object.defineProperty(sources[skey], "name", { value: skey });

        var src = "";
        src += Object.keys(sources).map(function (key) {
          if(typeof(sources[key]) === Function || typeof(sources[key]) == "function") {
            return (""+sources[key]).replace("anonymous", key);
          } else {
            return "// "+key+" is not a function, but is "+typeof(sources[key]);
          }
        }).join("\n");
        src += "\n var initFunctions = {"+Object.keys(sources).map(function (key) {
          if(typeof(sources[key]) === Function || typeof(sources[key]) == "function") {
            return "  \""+key+"\": "+sources[key].name;
          } else {
            return "  \""+key+"\": "+stringify(sources[key]);
          }
        }).join(",")+"};";
        src += "("+bundleFn+")(initFunctions,{},["+stringify(skey)+"]);";
        // var src = '(' + bundleFn + ')({'
        //     + Object.keys(sources).map(function (key) {
        //         return stringify(key) + ':' + (typeof(sources[key]) == Function) ? sources[key] : stringify(sources[key]);
        //     }).join(',')
        //     + '},{},[' + stringify(skey) + '])';
        // var src = '(' + bundleFn + ')({'
        //     + Object.keys(sources).map(function (key) {
        //         return stringify(key) + ':['
        //             + sources[key][0]
        //             + ',' + stringify(sources[key][1]) + ']'
        //         ;
        //     }).join(',')
        //     + '},{},[' + stringify(skey) + '])';
        // console.log("sources :: ",sources);
        // var src = stringify(sources[Object.keys(sources)[0]][1]);
        // console.log(" ##################################################### ");
        // console.log("src :: ",src);
        // console.log(" ##################################################### ");
        // return new Worker(window.URL.createObjectURL(
        //     new Blob([src], { type: 'text/javascript' })
        // ));
        return new Worker('./js/chunk-generator-worker.js')
    };
}
