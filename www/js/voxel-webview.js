// function voxel_webview(require, module, exports) {
//     (function(Buffer) {
//         (function() {
//             'use strict';
//
//             var createCSS3D = require('gl-css3d');
//
//
//             module.exports = function(game, opts) {
//                 return new WebviewPlugin(game, opts);
//             };
//
//             module.exports.pluginInfo = {
//                 loadAfter: ['voxel-commands', 'voxel-shader']
//             };
//
//             function WebviewPlugin(game, opts) {
//                 this.game = game;
//
//                 this.shader = game.plugins.get('voxel-shader');
//                 if (!this.shader) throw new Error('voxel-webview requires voxel-shader plugin');
//
//                 this.url = opts.url || 'data:text/html,' + Buffer("PCFET0NUWVBFIEhUTUw+CjxodG1sPgo8aGVhZD4KPHRpdGxlPnZveGVsLXdlYnZpZXc8L3RpdGxlPgo8bWV0YSBjaGFyc2V0PSJ1dGYtOCI+CjwvaGVhZD4KPGJvZHkgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JheSI+CjxoMT52b3hlbC13ZWJ2aWV3IGxvYWRlZCE8L2gxPgo8cD5UeXBlIDx0dD4udXJsPC90dD4gdG8gbG9hZCBhbm90aGVyIHBhZ2UsIG9yIDx0dD4ud2ViPC90dD4gdG8gaW50ZXJhY3QuCgo8cD5Tb21lIHdlYnNpdGVzIHRvIHRyeToKPGJyPjxzbWFsbD4obm90ZSB0aGF0IHNvbWUgcG9wdWxhciB3ZWJzaXRlcyBkaXNhYmxlIGZyYW1pbmcgYW5kIApjYW5ub3QgYmUgYnJvd3NlZCBoZXJlKTwvc21hbGw+Cgo8cD48dWw+CjxsaT48YSBocmVmPSJodHRwOi8vYnJvd3NlcmlmeS5vcmciPmJyb3dzZXJpZnkub3JnPC9hPgo8bGk+PGEgaHJlZj0iaHR0cDovL3N0YWNrLmdsIj5zdGFjay5nbDwvYT4KPGxpPjxhIGhyZWY9Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLzhnTTN4TU9iRXo0Ij55b3V0dWJlLmNvbSAoZW1iZWRkZWQgdmlkZW8pPC9hPiA8IS0tIHNlZSBodHRwOi8vYXBpYmxvZy55b3V0dWJlLmNvbS8yMDEwLzA3L25ldy13YXktdG8tZW1iZWQteW91dHViZS12aWRlb3MuaHRtbCAtLT4KPGxpPjxhIGhyZWY9Imh0dHA6Ly92b3hlbG1ldGF2ZXJzZS5jb20iPnZveGVsbWV0YXZlcnNlLmNvbTwvYT4KPGxpPjxhIGhyZWY9Imh0dHBzOi8vZHVja2R1Y2tnby5jb20iPmR1Y2tkdWNrZ28uY29tPC9hPgoKPCEtLSAKICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9icm93c2VyaWZ5Lm9yZy8nOwogIC8vdGhpcy51cmwgPSBvcHRzLnVybCB8fCAnaHR0cDovL25wbWpzLm9yZy8nOyAvLyBhZGRlZCBYLUZyYW1lLU9wdGlvbnM6IGRlbnkgYWZ0ZXIgc2VjdXJpdHkgYXVkaXQKICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9sZWFybmluZ3RocmVlanMuY29tLyc7IC8vIGhpdHMgaWxsZWdhbCByZXR1cm4gaW4gZW1iZWRkZWQgdmlkZW8gcGxheWVyPz8KICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20vJzsgLy8gcmVmdXNlcyB0byBkaXNwbGF5IHNpbmNlIFgtRnJhbWUtT3B0aW9uczogREVOWQogIC8vdGhpcy51cmwgPSBvcHRzLnVybCB8fCAnaHR0cDovL3ZveGVsanMuY29tLyc7IC8vIGFsc28gaGFzIGVtYmVkZGVkIHlvdXR1YmUgdmlkZW8gcGxheWVyCiAgLy90aGlzLnVybCA9IG9wdHMudXJsIHx8ICdodHRwOi9hb2wuY29tLyc7IC8vIGZhaWxzIHNldHRpbmcgYW9sX2RldmlsX2ZsYWcgVW5jYXVnaHQgU2VjdXJpdHlFcnJvcjogQmxvY2tlZCBhIGZyYW1lIHdpdGggb3JpZ2luICJodHRwOi8vd3d3LmFvbC5jb20KICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9naXRodWIuY29tLyc7IC8vIGFsc28gaGFzIFgtRnJhbWUtT3B0aW9uczogZGVueQogIGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tIC8vIFgtRnJhbWUtT3B0aW9ucyBTQU1FT1JJR0lOCiAgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbSAvLyBYLUZyYW1lLU9wdGlvbnM6IFNBTUVPUklHSU4KICBodHRwczovL3d3dy55YWhvby5jb20gWC1GcmFtZS1PcHRpb25zOiBERU5ZCi0tPgoKPC9wPgo8L2JvZHk+CjwvaHRtbD4K", "base64");
//
//                 opts.planeWidth = opts.planeWidth || 10;
//                 opts.planeHeight = opts.planeHeight || 10;
//                 //this.elementWidth = opts.elementWidth || 1024; // TODO
//
//                 var iframe = document.createElement('iframe');
//                 iframe.src = this.url;
//                 iframe.style.width = '100%';
//                 iframe.style.height = '100%';
//                 iframe.id = 'voxel-webview';
//
//                 //opts.tint = opts.tint || [1,0,0,0];
//                 opts.flipX = false; // for some reason
//                 this.css3d = createCSS3D(iframe, opts);
//
//                 this.enable();
//             }
//
//             WebviewPlugin.prototype.enable = function() {
//
//                 if (this.game.shell.gl) {
//                     // gl is already initialized - we won't receive gl-init, or the first gl-resize
//                     // call it here (on-demand plugin loading) TODO: cleaner generic fix for plugins receiving init events too late
//                     this.ginit();
//                     this.updatePerspective();
//                 } else {
//                     this.game.shell.on('gl-init', this.onInit = this.ginit.bind(this));
//                 }
//
//                 this.shader.on('updateProjectionMatrix', this.onUpdatePerspective = this.updatePerspective.bind(this));
//                 this.game.shell.on('gl-render', this.onRender = this.render.bind(this));
//
//
//                 var self = this;
//
//                 window.addEventListener('click', this.onClick = function(ev) {
//                     // click anywhere outside of iframe to exit TODO: what if it fills the entire screen? (alternate escape hatch)
//                     // (we won't receive click events for the iframe here)
//                     // TODO: register on WebGL canvas element instead?
//                     //  tried this.game.view.renderer.domElement but didn't receive events
//
//                     if (document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex === '0') {
//                         document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex = '-1';
//                     }
//                 });
//
//                 // commands for interacting TODO: replace with something in-game (survival), https://github.com/deathcap/voxel-webview/issues/3
//                 var commands = this.game.plugins.get('voxel-commands');
//                 if (commands) {
//                     commands.registerCommand('url',
//                         this.onURL = function(address) {
//                             if (!address || address.length === 0) {
//                                 address = window.location.origin; // load self
//                             }
//
//                             if (address.indexOf('://') === -1) {
//                                 address = 'http://' + address; // so example.com doesn't load relative path
//                             }
//
//                             document.getElementById('voxel-webview').src = address; // TODO: set url through .url setter?
//                         },
//                         'address',
//                         'loads URL into webview');
//
//                     commands.registerCommand('web',
//                         this.onWeb = function() {
//                             // bring to foreground
//                             // TODO: alternatively could toggle pointer-events, see https://github.com/deathcap/voxel-webview/issues/1#issuecomment-74467436
//                             // but raising the z-index unobscures the page for easier user interaction
//                             var z = document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex;
//                             document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex = {
//                                 '-1': 0,
//                                 0: -1
//                             } [z];
//                         },
//                         '',
//                         'interact with a webview');
//                 }
//             };
//
//             WebviewPlugin.prototype.disable = function() {
//                 window.removeEventListener('click', this.onClick);
//
//                 var commands = this.game.plugins.get('voxel-commands');
//                 if (commands) {
//                     commands.unregisterCommand('url', this.onURL);
//                     commands.unregisterCommand('web', this.onWeb);
//                 }
//
//                 this.game.shell.removeListener('gl-render', this.onRender);
//                 if (this.onInit) this.game.shell.removeListener('gl-init', this.onInit);
//                 this.shader.removeListener('updateProjectionMatrix', this.onUpdatePerspective);
//             };
//
//             WebviewPlugin.prototype.ginit = function(gl) {
//                 this.css3d.ginit(this.game.shell.gl);
//             };
//
//             WebviewPlugin.prototype.updatePerspective = function() {
//                 var cameraFOVradians = this.shader.cameraFOV * Math.PI / 180;
//
//                 this.css3d.updatePerspective(cameraFOVradians, this.game.shell.width, this.game.shell.height);
//             };
//
//             WebviewPlugin.prototype.render = function() {
//                 this.css3d.render(this.shader.viewMatrix, this.shader.projectionMatrix);
//             };
//
//
//         }).call(this)
//     }).call(this, require("buffer").Buffer)
//
// }
function voxel_webview(require, module, exports) {
  'use strict';

  var Buffer = require("buffer").Buffer;
  var createCSS3D = require('gl-css3d');

  module.exports = function(game, opts) {
    console.log("WebView Plugin Check");
    return new WebviewPlugin(game, opts);
  };

  module.exports.pluginInfo = {
      loadAfter: ['voxel-commands', 'voxel-shader']
  };

  function WebviewPlugin(game, opts) {
      this.game = game;

      this.shader = game.plugins.get('voxel-shader');
      if (!this.shader) throw new Error('voxel-webview requires voxel-shader plugin');

      this.url = opts.url || 'data:text/html,' + Buffer("PCFET0NUWVBFIEhUTUw+CjxodG1sPgo8aGVhZD4KPHRpdGxlPnZveGVsLXdlYnZpZXc8L3RpdGxlPgo8bWV0YSBjaGFyc2V0PSJ1dGYtOCI+CjwvaGVhZD4KPGJvZHkgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JheSI+CjxoMT52b3hlbC13ZWJ2aWV3IGxvYWRlZCE8L2gxPgo8cD5UeXBlIDx0dD4udXJsPC90dD4gdG8gbG9hZCBhbm90aGVyIHBhZ2UsIG9yIDx0dD4ud2ViPC90dD4gdG8gaW50ZXJhY3QuCgo8cD5Tb21lIHdlYnNpdGVzIHRvIHRyeToKPGJyPjxzbWFsbD4obm90ZSB0aGF0IHNvbWUgcG9wdWxhciB3ZWJzaXRlcyBkaXNhYmxlIGZyYW1pbmcgYW5kIApjYW5ub3QgYmUgYnJvd3NlZCBoZXJlKTwvc21hbGw+Cgo8cD48dWw+CjxsaT48YSBocmVmPSJodHRwOi8vYnJvd3NlcmlmeS5vcmciPmJyb3dzZXJpZnkub3JnPC9hPgo8bGk+PGEgaHJlZj0iaHR0cDovL3N0YWNrLmdsIj5zdGFjay5nbDwvYT4KPGxpPjxhIGhyZWY9Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLzhnTTN4TU9iRXo0Ij55b3V0dWJlLmNvbSAoZW1iZWRkZWQgdmlkZW8pPC9hPiA8IS0tIHNlZSBodHRwOi8vYXBpYmxvZy55b3V0dWJlLmNvbS8yMDEwLzA3L25ldy13YXktdG8tZW1iZWQteW91dHViZS12aWRlb3MuaHRtbCAtLT4KPGxpPjxhIGhyZWY9Imh0dHA6Ly92b3hlbG1ldGF2ZXJzZS5jb20iPnZveGVsbWV0YXZlcnNlLmNvbTwvYT4KPGxpPjxhIGhyZWY9Imh0dHBzOi8vZHVja2R1Y2tnby5jb20iPmR1Y2tkdWNrZ28uY29tPC9hPgoKPCEtLSAKICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9icm93c2VyaWZ5Lm9yZy8nOwogIC8vdGhpcy51cmwgPSBvcHRzLnVybCB8fCAnaHR0cDovL25wbWpzLm9yZy8nOyAvLyBhZGRlZCBYLUZyYW1lLU9wdGlvbnM6IGRlbnkgYWZ0ZXIgc2VjdXJpdHkgYXVkaXQKICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9sZWFybmluZ3RocmVlanMuY29tLyc7IC8vIGhpdHMgaWxsZWdhbCByZXR1cm4gaW4gZW1iZWRkZWQgdmlkZW8gcGxheWVyPz8KICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20vJzsgLy8gcmVmdXNlcyB0byBkaXNwbGF5IHNpbmNlIFgtRnJhbWUtT3B0aW9uczogREVOWQogIC8vdGhpcy51cmwgPSBvcHRzLnVybCB8fCAnaHR0cDovL3ZveGVsanMuY29tLyc7IC8vIGFsc28gaGFzIGVtYmVkZGVkIHlvdXR1YmUgdmlkZW8gcGxheWVyCiAgLy90aGlzLnVybCA9IG9wdHMudXJsIHx8ICdodHRwOi9hb2wuY29tLyc7IC8vIGZhaWxzIHNldHRpbmcgYW9sX2RldmlsX2ZsYWcgVW5jYXVnaHQgU2VjdXJpdHlFcnJvcjogQmxvY2tlZCBhIGZyYW1lIHdpdGggb3JpZ2luICJodHRwOi8vd3d3LmFvbC5jb20KICAvL3RoaXMudXJsID0gb3B0cy51cmwgfHwgJ2h0dHA6Ly9naXRodWIuY29tLyc7IC8vIGFsc28gaGFzIFgtRnJhbWUtT3B0aW9uczogZGVueQogIGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tIC8vIFgtRnJhbWUtT3B0aW9ucyBTQU1FT1JJR0lOCiAgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbSAvLyBYLUZyYW1lLU9wdGlvbnM6IFNBTUVPUklHSU4KICBodHRwczovL3d3dy55YWhvby5jb20gWC1GcmFtZS1PcHRpb25zOiBERU5ZCi0tPgoKPC9wPgo8L2JvZHk+CjwvaHRtbD4K", "base64");

      opts.planeWidth = opts.planeWidth || 10;
      opts.planeHeight = opts.planeHeight || 10;
      //this.elementWidth = opts.elementWidth || 1024; // TODO

      var iframe = document.createElement('iframe');
      iframe.src = this.url;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.id = 'voxel-webview';

      //opts.tint = opts.tint || [1,0,0,0];
      opts.flipX = false; // for some reason
      this.css3d = createCSS3D(iframe, opts);
      console.log("[voxel-webview] this.css3d :: ",this.css3d)

      this.enable();
  }

  WebviewPlugin.prototype.enable = function() {

      if (this.game.shell.gl) {
          // gl is already initialized - we won't receive gl-init, or the first gl-resize
          // call it here (on-demand plugin loading) TODO: cleaner generic fix for plugins receiving init events too late
          this.ginit();
          this.updatePerspective();
      } else {
          this.game.shell.on('gl-init', this.onInit = this.ginit.bind(this));
      }

      this.shader.on('updateProjectionMatrix', this.onUpdatePerspective = this.updatePerspective.bind(this));
      this.game.shell.on('gl-render', this.onRender = this.render.bind(this));


      var self = this;

      window.addEventListener('click', this.onClick = function(ev) {
          // click anywhere outside of iframe to exit TODO: what if it fills the entire screen? (alternate escape hatch)
          // (we won't receive click events for the iframe here)
          // TODO: register on WebGL canvas element instead?
          //  tried this.game.view.renderer.domElement but didn't receive events

          if (document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex === '0') {
              document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex = '-1';
          }
      });

      // commands for interacting TODO: replace with something in-game (survival), https://github.com/deathcap/voxel-webview/issues/3
      var commands = this.game.plugins.get('voxel-commands');
      console.log("[voxel-webview] commands :: ",commands)
      if (commands) {
          commands.registerCommand('url',
              this.onURL = function(address) {
                  console.log("[voxel-webview] onURL :: ",address)
                  if (!address || address.length === 0) {
                      address = window.location.origin; // load self
                  }

                  if (address.indexOf('://') === -1) {
                      address = 'http://' + address; // so example.com doesn't load relative path
                  }

                  document.getElementById('voxel-webview').src = address; // TODO: set url through .url setter?
              },
              'address',
              'loads URL into webview');

          commands.registerCommand('web',
              this.onWeb = function() {
                  console.log("[voxel-webview] onWeb")
                  // bring to foreground
                  // TODO: alternatively could toggle pointer-events, see https://github.com/deathcap/voxel-webview/issues/1#issuecomment-74467436
                  // but raising the z-index unobscures the page for easier user interaction
                  var z = document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex;
                  document.getElementById('voxel-webview').parentElement.parentElement.style.zIndex = {
                      '-1': 0,
                      0: -1
                  } [z];
              },
              '',
              'interact with a webview');
      }
  };

  WebviewPlugin.prototype.disable = function() {
      window.removeEventListener('click', this.onClick);

      var commands = this.game.plugins.get('voxel-commands');
      if (commands) {
          commands.unregisterCommand('url', this.onURL);
          commands.unregisterCommand('web', this.onWeb);
      }

      this.game.shell.removeListener('gl-render', this.onRender);
      if (this.onInit) this.game.shell.removeListener('gl-init', this.onInit);
      this.shader.removeListener('updateProjectionMatrix', this.onUpdatePerspective);
  };

  WebviewPlugin.prototype.ginit = function(gl) {
      console.log("[voxel-webview] ginit")
      this.css3d.ginit(this.game.shell.gl);
  };

  WebviewPlugin.prototype.updatePerspective = function() {
      console.log("[voxel-webview] updatePerspective")
      var cameraFOVradians = this.shader.cameraFOV * Math.PI / 180;
      this.css3d.updatePerspective(cameraFOVradians, this.game.shell.width, this.game.shell.height);
  };

  WebviewPlugin.prototype.render = function() {
      console.log("[voxel-webview] render")
      this.css3d.render(this.shader.viewMatrix, this.shader.projectionMatrix);
  };
}
