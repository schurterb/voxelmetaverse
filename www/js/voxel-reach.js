function voxel_reach (require, module, exports) {
    'use strict';

    var ever = require('ever');
    var inherits = require('inherits');
    var EventEmitter = require('events').EventEmitter;
    var fract = require('fract');

    module.exports = function(game, opts) {
        var output = new Reach(game, opts);
        return output;
    };

    module.exports.pluginInfo = {};

    function Reach(game, opts) {
        this.game = game;
        opts = opts || {};
        opts.reachDistance = opts.reachDistance || 8;
        opts.mouseButton = opts.mouseButton !== undefined ? opts.mouseButton : 0; // left

        this.opts = opts;
        this.currentTarget = null;
        this.havePointer = false;

        this.enable();
    }

    // (BNS - 2022/09/06) Oddly, it seems that this overwrites any previously defined prototypes on the first argument (i.e. Reach)
    //                    Therefore, it must be placed before any other prototypes are defined.
    inherits(Reach, EventEmitter);

    Reach.prototype.enable = function() {
        var self = this;

        if (this.game.isClient) {
            if (self.game.shell) {
                // game-shell
                Object.defineProperty(self, 'havePointer', {
                    get: function() {
                        return self.game.shell.pointerLock;
                    }
                });
            } else if (this.game.interact) {
                // interact
                this.game.interact.on('attain', function() {
                    self.havePointer = true;
                });

                this.game.interact.on('release', function() {
                    self.havePointer = false;
                });
            } else {
                throw new Error('voxel-reach requires interact or game-shell');
            }
        }

        // Continuously fired events while button is held down (from voxel-engine)
        function fire(fireTarget, state) {
          console.log("--------------------------------");
          console.log("Received fire event");
            /*jshint unused:false*/
            var action, target;
            action = self.action(state);
            if (!action) {
                return;
            }
            target = self.specifyTarget();

            if (action === 'mining' && (self.currentTarget || target)) {
                // changing target while mouse held (moving mouse)
                if (!targetsEqual(target, self.currentTarget)) {
                    self.emit('stop mining', self.currentTarget);
                    self.emit('start mining', target);
                }
            }
            console.log("Emitting "+action+" ...");
            self.emit(action, target);
        }

        // Edge triggered
        // TODO: refactor
        // (BNS - 2022/10/25) We need to have a variable that stores the up-down
        //    state and a loop that fires a hold event if down= true for 2 or more seconds
        function mousedown(ev) {
            if (!self.havePointer) return;
            if (ev.button !== self.opts.mouseButton) return;
            self.emit('start mining', self.specifyTarget());
            self.mouseState = 'down';
        }

        function mouseup(ev) {
            if (!self.havePointer) return;
            if (ev.button !== self.opts.mouseButton) return;
            self.currentTarget = null;
            self.emit('stop mining', self.specifyTarget());
            self.mouseState = 'up';
        }

        this.game.on('fire', fire);
        ever(document.body).on('mousedown', mousedown);
        ever(document.body).on('mouseup', mouseup);

        // Save callbacks for removing in disable()
        this.fire = fire;
        this.mousedown = mousedown;
        this.mouseup = mouseup;

        // (BNS - 2022/10/25) emit a fire event when the mouse is held for more than 500 ms
        //  for response time, the loop runs every 10 ms.
        this.mouseState = null;
        this.prevMouseState = null;
        this.fireIntervalCheck = 10; //ms
        this.stateDuration = 0;
        this.fireThreshold = 500; //ms
        setInterval(function() {
          if(this.mouseState == 'down') {
            if(this.mouseState == this.prevMouseState) {
              this.stateDuration += this.fireIntervalCheck;
              if(this.stateDuration >= this.fireThreshold) {
                this.game.onFire('mining');
                this.stateDuration = 0;
              }
            }
          } else {
            this.stateDuration = 0;
          }
          this.prevMouseState = this.mouseState;
        }.bind(this), this.fireIntervalCheck);
    };

    Reach.prototype.disable = function() {
        this.game.removeListener('fire', this.fire);
        if (this.game.isClient) {
            ever(document.body).removeListener('mousedown', this.mousedown);
            ever(document.body).removeListener('mouseup', this.mouseup);
        }
    };

    function targetsEqual(a, b) {
        var strA = (a && a.voxel) ? a.voxel.join(',') : 'none';
        var strB = (b && b.voxel) ? b.voxel.join(',') : 'none';
        return strA === strB;
    }

    // Raytrace and get the hit voxel, side, and subcoordinates for passing to events
    Reach.prototype.specifyTarget = function() {
        var sub, side, hit, value;

        hit = this.game.raycastVoxels(this.game.cameraPosition(), this.game.cameraVector(), this.opts.reachDistance);

        if (!hit) {
            // air
            return false;
        }

        // relative position within voxel where it was hit, range (1..0), for example (0.5, 0.5) is center:

        // (1,1)--(0,1)
        //   |      |
        //   |      |
        // (1,0)--(0,0)

        sub = [fract(hit.position[0]), fract(hit.position[1]), fract(hit.position[2])];
        // remove coordinate from direction, since it is always 0 (within epilson); convert 3D -> 2D
        var fix = ((hit.normal.indexOf(1) + 1) || (hit.normal.indexOf(-1) + 1)) - 1; // TODO: deobfuscate
        sub.splice(fix, 1);

        side = this.normalToCardinal(hit.normal);

        value = this.game.getBlock(hit.voxel);

        return {
            voxel: hit.voxel,
            adjacent: hit.adjacent,
            side: side,
            sub: sub,
            normal: hit.normal,
            value: value
        };
    };

    Reach.prototype.normalToCardinal = function(normal) {
        return {
            "1,0,0": "east", // TODO: double-check these conventions
            "-1,0,0": "west",
            "0,1,0": "top",
            "0,-1,0": "bottom",
            "0,0,1": "south",
            "0,0,-1": "north"
        } [normal];
    };

    Reach.prototype.cardinalToNormal = function(direction) {
        return {
            "east": [1, 0, 0],
            "west": [-1, 0, 0],
            "top": [0, 1, 0],
            "bottom": [0, -1, 0],
            "south": [0, 0, 1],
            "north": [0, 0, -1]
        } [direction];
    };

    Reach.prototype.action = function(kb_state) {
        if (kb_state.fire) {
            // left-click (hold) = mining
            return 'mining';
        } else if (kb_state.firealt) {
            // right-click = use
            return 'use';
            // TODO: middle-click = pick
        } else if (typeof(kb_state) === "string"){
            return kb_state;
        } else {
            return undefined;
        }
    };
}
