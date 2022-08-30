function voxel_fluid (require, module, exports) {
    'use strict';

    var ucfirst = require('ucfirst');

    module.exports = function(game, opts) {
        return new FluidPlugin(game, opts);
    };

    function FluidPlugin(game, opts) {

        this.registry = game.plugins.get('voxel-registry');
        if (!this.registry) throw new Error('voxel-fluid requires voxel-registry plugin');

        this.fluids = [];

        this.registerFluid('water');
        this.registerFluid('lava');

        this.enable();
    }

    FluidPlugin.prototype.enable = function() {
        // TODO: add tick handler to spread, see voxel-virus
    };

    FluidPlugin.prototype.disable = function() {};

    FluidPlugin.prototype.registerFluid = function(name) {
            var still = this.registry.registerBlock(name, {
                        texture: name + '_still',
                        // cube - custom model causes 2nd phase render
                        blockModel: [{
                                    from: [0, 0, 0],
                                    to: [16, 16, 16],
                                    faceData: {
                                        down: {},
                                        up: {},
                                        north: {},
                                        south: {},
                                        west: {},
                                        east: {}
                                    },
                                    texture: name + '_still',
                                }