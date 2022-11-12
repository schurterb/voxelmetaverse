var loaded_modules = {};
var require;
require = function (name) {
  if(initFunctions[name]) {
    if( !loaded_modules[name] ) {
      // console.log("Loading "+name);
      var module={}; var exports={}; initFunctions[name](require, module, exports);
      // console.log(" - COMPLETE");
      if(module.exports) {
        loaded_modules[name] = module.exports
      } else {
        loaded_modules[name] = exports;
      }
    }
    return loaded_modules[name]
  } else {
    console.log("Error :: "+name+" does not exist");
    return null;
  }
}

const enable_per_tick_logging = false;
const createEngine = require('voxel-engine');

// (part of the aetherview test)
const resourceLoader = new ResourceLoader();
const engine = new AetherEngine({});

function main() {
  console.log('voxelmetaverse starting'); // TODO: show git version (browserify-commit-sha)


  createEngine({exposeGlobal: true, pluginLoaders: {
      'voxel-artpacks': require('voxel-artpacks'),
      'voxel-wireframe': require('voxel-wireframe'),
      'voxel-chunkborder': require('voxel-chunkborder'),
      'voxel-outline': require('voxel-outline'),
      'voxel-carry': require('voxel-carry'),
      'voxel-bucket': require('voxel-bucket'),
      'voxel-fluid': require('voxel-fluid'),
      'voxel-skyhook': require('voxel-skyhook'),
      'voxel-bedrock': require('voxel-bedrock'),
      'voxel-recipes': require('voxel-recipes'),
      'voxel-quarry': require('voxel-quarry'),
      'voxel-measure': require('voxel-measure'),
      'voxel-webview': require('voxel-webview'),
      'voxel-vr': require('voxel-vr'),
      'voxel-workbench': require('voxel-workbench'),
      'voxel-furnace': require('voxel-furnace'),
      'voxel-chest': require('voxel-chest'),
      'voxel-inventory-hotbar': require('voxel-inventory-hotbar'),
      'voxel-inventory-crafting': require('voxel-inventory-crafting'),
      'voxel-voila': require('voxel-voila'),
      'voxel-health': require('voxel-health'),
      'voxel-health-bar': require('voxel-health-bar'),
      //'voxel-health-fall': require('voxel-health-fall'); // TODO: after https://github.com/deathcap/voxel-health-fall/issues/1
      'voxel-food': require('voxel-food'),
      'voxel-scriptblock': require('voxel-scriptblock'),
      'voxel-sfx': require('voxel-sfx'),
      'voxel-flight': require('voxel-flight'),
      'voxel-gamemode': require('voxel-gamemode'),
      'voxel-sprint': require('voxel-sprint'),
      'voxel-decals': require('voxel-decals'),
      'voxel-mine': require('voxel-mine'),
      'voxel-harvest': require('voxel-harvest'),
      'voxel-use': require('voxel-use'),
      'voxel-reach': require('voxel-reach'),
      'voxel-pickaxe': require('voxel-pickaxe'),
      'voxel-hammer': require('voxel-hammer'),
      'voxel-wool': require('voxel-wool'),
      'voxel-pumpkin': require('voxel-pumpkin'),
      'voxel-blockdata': require('voxel-blockdata'),
      'voxel-glass': require('voxel-glass'),
      'voxel-land': require('voxel-land'),
      'voxel-flatland': require('voxel-flatland'),
      'voxel-decorative': require('voxel-decorative'),
      'voxel-inventory-creative': require('voxel-inventory-creative'),
      //'voxel-clientmc': require('voxel-clientmc');  // TODO: after published
      'voxel-console': require('voxel-console'),
      'voxel-commands': require('voxel-commands'),
      'voxel-drop': require('voxel-drop'),
      'voxel-zen': require('voxel-zen'),
      'camera-debug': require('camera-debug'),
      'voxel-plugins-ui': require('voxel-plugins-ui'),
      'voxel-fullscreen': require('voxel-fullscreen'),
      'voxel-keys': require('voxel-keys'),
      'kb-bindings-ui': require('kb-bindings-ui')
    }, pluginOpts: {
    'voxel-engine': {
      appendDocument: true,
      exposeGlobal: true,  // for debugging

      lightsDisabled: true,
      arrayTypeSize: 2,  // arrayType: Uint16Array
      useAtlas: true,
      generateChunks: false,
      chunkDistance: 2,
      worldOrigin: [0, 0, 0],
      controls: {
        discreteFire: false,
        // (BNS - 2022-10-30) The fireRate value is not actually ms between firing atm.  Higher values = faster block break time; lower = slower block break time
        fireRate: 500, //100, // ms between firing
        jumpTimer: 25
      },
      keybindings: {
        // voxel-engine defaults
        'W': 'forward',
        'A': 'left',
        'S': 'backward',
        'D': 'right',
        '<up>': 'forward',
        '<left>': 'left',
        '<down>': 'backward',
        '<right>': 'right',
        '<mouse 1>': 'fire',
        '<mouse 3>': 'firealt',
        '<space>': 'jump',
        '<shift>': 'crouch',
        '<control>': 'alt',
        '<tab>': 'sprint',

        // our extras
        'F5': 'pov',
        'O': 'home',
        'E': 'inventory',

        'T': 'console',
        '/': 'console2',
        '.': 'console3',

        'P': 'packs',

        'F1': 'zen'
      }
    },

    // built-in plugins
    'voxel-registry': {},
    'voxel-stitch': {
      artpacks: ['./resources/ProgrammerArt-ResourcePack.zip']
    },
    'voxel-shader': {
      //cameraFOV: 45,
      //cameraFOV: 70,
      cameraFOV: 90
      //cameraFOV: 110,
    },

    'voxel-mesher': {},
    'game-shell-fps-camera': {
      position: [0, -40, 0]
    },

    'voxel-artpacks': {},
    'voxel-wireframe': {},
    'voxel-chunkborder': {},
    'voxel-outline': {},
    'voxel-recipes': {},
    'voxel-quarry': {},
    'voxel-measure': {},
    'voxel-webview': {},
    'voxel-vr': {onDemand: true}, // has to be enabled after gl-init to replace renderer
    'voxel-carry': {},
    'voxel-bucket': {fluids: ['water', 'lava']},
    'voxel-fluid': {},
    //'voxel-virus': {materialSource: 'water', material: 'waterFlow', isWater: true}, // requires this.game.materials TODO: water
    'voxel-skyhook': {},
    'voxel-bedrock': {},
    'voxel-blockdata': {},
    // 'voxel-chest': {},
    // 'voxel-workbench': {},
    // 'voxel-furnace': {},
    // 'voxel-pickaxe': {},
    // 'voxel-hammer': {},
    // 'voxel-wool': {},
    // 'voxel-pumpkin': {},

    // 'voxel-glass': {},
    'voxel-land': {populateTrees: true},
    'voxel-flatland': {block: 'bedrock', onDemand:true},
    'voxel-decorative': {},
    // 'voxel-inventory-creative': {},
    //'voxel-clientmc': {url: 'ws://localhost:1234', onDemand: true}, // TODO

    'voxel-console': {},
    'voxel-commands': {},
    'voxel-drop': {},
    'voxel-zen': {},


    //'voxel-player': {image: 'player.png', homePosition: [2,14,4], homeRotation: [0,0,0]}, // three.js TODO: stackgl avatar
    // 'voxel-health': {},
    // 'voxel-health-bar': {},
    //'voxel-health-fall': {}, // requires voxel-player TODO: enable and test
    // 'voxel-food': {},
    'voxel-scriptblock': {},
    'voxel-sfx': {},
    'voxel-flight': {flySpeed: 0.8, onDemand: true},
    'voxel-gamemode': {},
    'voxel-sprint': {},
    // 'voxel-inventory-hotbar': {inventorySize:10, wheelEnable:true},
    // 'voxel-inventory-crafting': {},
    'voxel-reach': { reachDistance: 8 },
    'voxel-decals': {},
    // left-click hold to mine
    'voxel-mine': {
      instaMine: false,
      progressTexturesPrefix: 'destroy_stage_',
      progressTexturesCount: 9
    },
    // right-click to place block (etc.)
    // 'voxel-use': {},
    // handles 'break' event from voxel-mine (left-click hold breaks blocks), collects block and adds to inventory
    'voxel-harvest': {},
    // 'voxel-voila': {},
    'voxel-fullscreen': {},
    'voxel-keys': {},

    // the GUI window (built-in toggle with 'H')
    //'voxel-debug': {}, // heavily three.js dependent TODO: more debugging options for stackgl-based engine besides camera?
    // 'camera-debug': {}, // TODO: port from game-shell-fps-camera
    // 'voxel-plugins-ui': {},
    // 'kb-bindings-ui': {}
    },
    'modules': {

    }
  });
}

main();
