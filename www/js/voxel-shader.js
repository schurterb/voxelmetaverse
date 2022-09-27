function voxel_shader (require, module, exports) {

    var fs = require("fs")
    var glShader = require('gl-shader')
    var mat4 = require('gl-mat4')
    var inherits = require('inherits');
    var EventEmitter = require('events').EventEmitter;

    module.exports = function(game, opts) {
        return new ShaderPlugin(game, opts);
    };
    module.exports.pluginInfo = {
        clientOnly: true,
        loadAfter: ['voxel-stitch', 'game-shell-fps-camera'],
    };

    function ShaderPlugin(game, opts) {
        this.shell = game.shell;

        this.stitcher = game.plugins.get('voxel-stitch');
        if (!this.stitcher) throw new Error('voxel-shader requires voxel-stitch plugin'); // for tileCount uniform and updateTexture event

        this.meshes = opts.meshes || game.voxels.meshes
        if (!this.meshes) throw new Error('voxel-shader requires "meshes" option or game.voxels.meshes set to array of voxel-mesher meshes')

        if (game.getCamera) {
            this.camera = game.getCamera()
            if (!(this.camera && this.camera.view)) throw new Error('voxel-shader requires a camera with a view matrix'); // for camera view matrix
        } else {
            this.camera = game.plugins.get('game-shell-fps-camera');
            if (!this.camera) throw new Error('voxel-shader requires game-shell-fps-camera plugin'); // for camera view matrix
        }

        this.perspectiveResize = opts.perspectiveResize !== undefined ? opts.perspectiveResize : true;
        this.cameraNear = opts.cameraNear !== undefined ? opts.cameraNear : 0.1;
        this.cameraFar = opts.cameraFar !== undefined ? opts.cameraFar : 200.0;
        this.cameraFOV = opts.cameraFOV !== undefined ? opts.cameraFOV : 45.0;

        this.projectionMatrix = mat4.create();

        this.enable();
    }
    inherits(ShaderPlugin, EventEmitter);

    ShaderPlugin.prototype.enable = function() {
        this.on('updateProjectionMatrix', this.perspective.bind(this));
        this.shell.on('gl-init', this.onInit = this.ginit.bind(this));
        this.shell.on('gl-render', this.onRender = this.render.bind(this));
        if (this.perspectiveResize) this.shell.on('gl-resize', this.onResize = this.updateProjectionMatrix.bind(this));
        this.stitcher.on('updateTexture', this.onUpdateTexture = this.texturesReady.bind(this));
    };

    ShaderPlugin.prototype.disable = function() {
        this.shell.removeListener('gl-init', this.onInit);
        this.shell.removeListener('gl-render', this.onRender);
        if (this.onResize) this.shell.removeListener('gl-resize', this.onResize);
        this.stitcher.removeListener('updateTexture', this.onUpdateTexture);
    };

    ShaderPlugin.prototype.texturesReady = function(texture) {
        this.texture = texture; // used in tileMap uniform
    }

    ShaderPlugin.prototype.ginit = function() {
        this.shader = this.createAOShader();
        this.shader2 = this.createCustomModelShader();
        this.updateProjectionMatrix();
        this.viewMatrix = mat4.create();

    };

    ShaderPlugin.prototype.perspective = function(out) {
        mat4.perspective(out, this.cameraFOV * Math.PI / 180, this.shell.width / this.shell.height, this.cameraNear, this.cameraFar)
    };

    ShaderPlugin.prototype.updateProjectionMatrix = function() {
        this.emit('updateProjectionMatrix', this.projectionMatrix);
    };

    ShaderPlugin.prototype.render = function() {
        if(enable_per_tick_logging) console.log("[voxel-shader][render] start render")
        var gl = this.shell.gl

        this.camera.view(this.viewMatrix)

        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)

        //Bind the shader
        // phase 1 - solid blocks
        gl.disable(gl.BLEND)
        var shader = this.shader
        if (!shader) throw new Error('voxel-shader render() called before gl-init, shader=', this.shader)
        shader.bind()
        shader.attributes.attrib0.location = 0
        shader.attributes.attrib1.location = 1
        shader.uniforms.projection = this.projectionMatrix
        shader.uniforms.view = this.viewMatrix
        shader.uniforms.tileCount = this.stitcher.tileCount

        if (this.texture) shader.uniforms.tileMap = this.texture.bind() // if a texture is loaded

        var keys = Object.keys(this.meshes)
        var length = keys.length

        for (var k = 0; k < length; ++k) {
            var chunkIndex = keys[k]
            var mesh = this.meshes[chunkIndex]

            var triangleVAO = mesh.vertexArrayObjects.surface
            if (triangleVAO && triangleVAO.length !== 0) { // if there are triangles to render
                shader.uniforms.model = mesh.modelMatrix
                triangleVAO.bind()
                gl.drawArrays(gl.TRIANGLES, 0, triangleVAO.length)
                triangleVAO.unbind()
            }
        }

        // phase 2 - "porous" blocks
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // TODO: premult alpha? https://github.com/deathcap/voxel-stitch/issues/6
        gl.enable(gl.BLEND)
        var shader2 = this.shader2
        shader2.bind()
        shader2.attributes.position.location = 0
        shader2.uniforms.view = this.viewMatrix
        shader2.uniforms.projection = this.projectionMatrix
        if (this.texture) shader2.uniforms.texture = this.texture.bind()

        for (k = 0; k < length; ++k) {
            var chunkIndex = keys[k]
            var mesh = this.meshes[chunkIndex]

            var blockMesh = mesh.vertexArrayObjects.porous
            if (blockMesh && blockMesh.length !== 0) {
                shader2.uniforms.model = this.meshes[chunkIndex].modelMatrix

                blockMesh.bind()
                blockMesh.draw(gl.TRIANGLES, blockMesh.length)
                blockMesh.unbind()
            }
        }
        if(enable_per_tick_logging) console.log("[voxel-shader][render] end render")
    };

    ShaderPlugin.prototype.createAOShader = function() {
        return glShader(this.shell.gl,
          "#define GLSLIFY 1\nattribute vec4 attrib0;\nattribute vec4 attrib1;\n\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nuniform float tileCount;\n\nvarying vec3  normal;\nvarying vec2  tileCoord;\nvarying float tileSize;\nvarying vec2  texCoord;\nvarying float ambientOcclusion;\n\nmat4 translate(float x, float y, float z) { // TODO: @import glslify? same as in avatar\n    return mat4(1.0, 0.0, 0.0, 0.0,\n                0.0, 1.0, 0.0, 0.0,\n                0.0, 0.0, 1.0, 0.0,\n                  x,   y,   z, 1.0);\n}\n\nvoid main() {\n  //Compute position\n  vec3 position = attrib0.xyz;\n  \n  //Compute ambient occlusion\n  ambientOcclusion = attrib0.w / 255.0;\n  \n  //Extracted packed bits of normal. GLSL 1.0 doesn't support bitfieldExtract or even bitwise operations :(\n  int packedNormal = int(attrib1.x);\n  int nx = packedNormal / 16;               // xx____\n  int ny = packedNormal / 4 - nx * 4;       // __xx__\n  int nz = packedNormal - nx * 16 - ny * 4; // ____xx\n\n  normal = 128.0 - vec3(nx + 127, ny + 127, nz + 127);\n  \n  //Compute texture coordinate\n  texCoord = vec2(dot(position, vec3(normal.y-normal.z, 0, normal.x)),\n                  dot(position, vec3(0, -abs(normal.x+normal.z), normal.y)));\n  \n  //Compute tile coordinate\n  tileSize    = exp2(attrib1.y);\n  float tx    = (attrib1.z * 256.0 + attrib1.w) / tileCount; // 16-bit\n  tileCoord.x = floor(tx);\n  tileCoord.y = fract(tx) * tileCount;\n\n  // Offset to account for air padding (separate from other matrices so they can be reused)\n  mat4 shift = translate(-1.0, -1.0, -1.0);\n\n  gl_Position = projection * view * model * shift * vec4(position, 1.0);\n}\n",
          "precision highp float;\n#define GLSLIFY 1\n\nuniform sampler2D tileMap;\nuniform float tileCount;\n\nvarying vec3  normal;\nvarying vec2  tileCoord;\nvarying float tileSize;\nvarying vec2  texCoord;\nvarying float ambientOcclusion;\n\nvoid main() {\n\n  vec2 uv      = texCoord;\n  vec4 color   = vec4(0,0,0,0);\n  float weight = 0.0;\n\n  vec2 tileOffset = 2.0 * pow(2.0, 4.0) * tileCoord;\n  float denom     = 2.0 * pow(2.0, 4.0) * tileCount;\n\n  for(int dx=0; dx<2; ++dx) {\n    for(int dy=0; dy<2; ++dy) {\n      vec2 offset = 2.0 * fract(0.5 * (uv + vec2(dx, dy)));\n      float w = pow(1.0 - max(abs(offset.x-1.0), abs(offset.y-1.0)), 16.0);\n      \n      vec2 tc = (tileOffset + tileSize * offset) / denom;\n      color  += w * texture2D(tileMap, tc);\n      weight += w;\n    }\n  }\n  color /= weight;\n  \n  if(color.w < 0.5) {\n    discard;\n  }\n  \n  float light = ambientOcclusion + max(0.15*dot(normal, vec3(1,1,1)), 0.0);\n  \n  gl_FragColor = vec4(color.xyz * light, color.w);\n}\n"
        )
        // return glslify({
        //   vertex: './lib/ao.vsh',
        //   fragment: './lib/ao.fsh'
        // })(this.shell.gl)
    };

    ShaderPlugin.prototype.createCustomModelShader = function() {
        // TODO: refactor with voxel-decals, voxel-chunkborder?
        return glShader(this.shell.gl,
          "#define GLSLIFY 1\n                        attribute vec3 position;                        attribute vec2 uv;                                                uniform mat4 projection;                        uniform mat4 view;                        uniform mat4 model;                        varying vec2 vUv;                                                void main() {                        gl_Position = projection * view * model * vec4(position, 1.0);                        vUv = uv;                        }",
         "                        precision highp float;\n#define GLSLIFY 1\n                                                uniform sampler2D texture;                        varying vec2 vUv;                                                void main() {                        gl_FragColor = texture2D(texture, vUv);                        }");
    };
}
