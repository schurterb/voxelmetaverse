
const initFunctions = {
  "./end-of-stream": end_of_stream,
  "_process": _process,
  "./writable": writable,
  "./readable": readable,
  "stream": stream,
  "./_stream_readable": _stream_readable,
  "./_stream_writable": _stream_writable,
  "inherits": inherits,
  "aabb-3d": aabb_3d,
  "three": three,
  "minecraft-skin": minecraft_skin,
  "events": events,
  "./init.json.js": init_json,
  "./types.json.js": types_json,
  "../../../errors": errors,
  "voxel-hello-world": voxel_hello_world,
  "./internal/streams/stream": stream,
  "buffer": buffer,
  "util": util,
  "./internal/streams/buffer_list": buffer_list,
  "./internal/streams/destroy": destroy,
  "./internal/streams/state": state,
  "../errors": errors,
  "./_stream_duplex": _stream_duplex,
  "string_decoder/": string_decoder,
  "./internal/streams/async_iterator": async_iterator,
  "./internal/streams/from": from,
  "ever": ever,
  "vkey": vkey,
  "voxel-engine": voxel_engine,
  "voxel-highlight": voxel_highlight,
  "voxel-player": voxel_player,
  "voxel": voxel,
  "extend": extend, //TODO: fix this
  "voxel-fly": voxel_fly,
  "voxel-walk": voxel_walk,
  "tic": tic,
  "atlaspack": atlaspack,
  "safe-buffer": safe_buffer,
  "inherits-alt": inherits_alt,
  "./lib/index": index,
  "process/browser.js": browser,
  "timers": timers,
  "util-deprecate": util_deprecate,
  "underscore": underscore,
  "./chunker": chunker,
  "./meshers/culled": culled,
  "./meshers/greedy": greedy,
  "./meshers/monotone": monotone,
  "./meshers/stupid": stupid,
  "gl-matrix": gl_matrix,
  "pointer-lock": pointer_lock,
  "drag-stream": drag_stream,
  "fullscreen": fullscreen,
  "domnode-dom": domnode_dom,
  "through": through,
  "./tree": tree,
  "voxel-mesh": voxel_mesh,
  "voxel-raycast": voxel_raycast,
  "voxel-texture": voxel_texture,
  "voxel-control": voxel_control,
  "voxel-view": voxel_view,
  "./lib/stats": stats,
  "./lib/detector": detector,
  "path": path,
  "interact": interact,
  "raf": raf,
  "collide-3d-tilemap": collide_3d_tilemap,
  "spatial-events": spatial_events,
  "voxel-region-change": voxel_region_change,
  "kb-controls": kb_controls,
  "voxel-physical": voxel_physical,
  "pin-it": pin_it,
  "./_stream_transform": _stream_transform,
  "base64-js": base64_js,
  "ieee754": ieee754
};
function require (name) {
  if(initFunctions[name]) {
    console.log("Loading "+name);
    module={}; exports={}; initFunctions[name](require, module, exports);
    console.log(" - COMPLETE");
    if(module.exports) {
      return module.exports;
    } else {
      return exports;
    }
  } else {
    console.log("Error :: "+name+" does not exist");
    return null;
  }
}

var createGame = require('voxel-hello-world');
var game = createGame();
