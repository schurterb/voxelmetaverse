
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
var require;
require = function (name) {
  if(initFunctions[name]) {
    console.log("Loading "+name);
    var module={}; var exports={}; initFunctions[name](require, module, exports);
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

//Some weird problem where function isn't being passed correctly...??
// var createGame = require('voxel-hello-world');
// console.log(createGame);
// var game = createGame();

var createGame = require('voxel-engine')
var highlight = require('voxel-highlight')
var player = require('voxel-player')
var voxel = require('voxel')
var extend = require('extend')
var fly = require('voxel-fly')
var walk = require('voxel-walk')

function start(opts, setup) {
    setup = setup || defaultSetup
    var defaults = {
        generate: voxel.generator['Valley'],
        chunkDistance: 2,
        materials: ['#fff', '#000'],
        materialFlatColor: true,
        worldOrigin: [0, 0, 0],
        controls: {
            discreteFire: true
        }
    }
    opts = extend({}, defaults, opts || {})

    // setup the game and add some trees
    var game = createGame(opts)
    var container = opts.container || document.body
    window.game = game // for debugging
    game.appendTo(container)
    if (game.notCapable()) return game

    var createPlayer = player(game)

    // create the player from a minecraft skin file and tell the
    // game to use it as the main player
    var avatar = createPlayer(opts.playerSkin || 'player.png')
    avatar.possess()
    avatar.yaw.position.set(2, 14, 4)

    setup(game, avatar)

    return game
}

function defaultSetup(game, avatar) {

    var makeFly = fly(game)
    var target = game.controls.target()
    game.flyer = makeFly(target)

    // highlight blocks when you look at them, hold <Ctrl> for block placement
    var blockPosPlace, blockPosErase
    var hl = game.highlighter = highlight(game, {
        color: 0xff0000
    })
    hl.on('highlight', function(voxelPos) {
        blockPosErase = voxelPos
    })
    hl.on('remove', function(voxelPos) {
        blockPosErase = null
    })
    hl.on('highlight-adjacent', function(voxelPos) {
        blockPosPlace = voxelPos
    })
    hl.on('remove-adjacent', function(voxelPos) {
        blockPosPlace = null
    })

    // toggle between first and third person modes
    window.addEventListener('keydown', function(ev) {
        if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
    })

    // block interaction stuff, uses highlight data
    var currentMaterial = 1

    game.on('fire', function(target, state) {
        var position = blockPosPlace
        if (position) {
            game.createBlock(position, currentMaterial)
        } else {
            position = blockPosErase
            if (position) game.setBlock(position, 0)
        }
    })

    game.on('tick', function() {
        walk.render(target.playerSkin)
        var vx = Math.abs(target.velocity.x)
        var vz = Math.abs(target.velocity.z)
        if (vx > 0.001 || vz > 0.001) walk.stopWalking()
        else walk.startWalking()
    })
}

var game = start();
