function gl_css3d (require, module, exports) {
    'use strict';

    var matrixToCSS = require('matrix-to-css');
    var mat4 = require('gl-mat4');
    var createMesh = require('gl-mesh');
    var glShader = require('gl-shader');


    module.exports = function(element, opts) {
        return new GLCSS3D(element, opts);
    };

    function GLCSS3D(element, opts) {
        if (!element) throw new Error('gl-css3d requires element');

        console.log("[gl-css3d] check 0")
        var domElement = document.createElement('div');
        domElement.id = 'dom-element-test';
        domElement.style.transformStyle = domElement.style.webkitTransformStyle = 'preserve-3d';
        domElement.style.overflow = 'hidden';
        domElement.style.pointerEvents = 'none';
        domElement.style.position = 'absolute';
        domElement.style.zIndex = '-1'; // below WebGL canvas
        domElement.style.top = '0';
        domElement.style.left = '0';
        domElement.style.margin = '0';
        domElement.style.padding = '0';

        console.log("[gl-css3d] check 1")
        var cameraElement = document.createElement('div');
        cameraElement.id = 'camera-element-test';
        cameraElement.style.position = 'absolute';
        cameraElement.style.transformStyle = cameraElement.style.webkitTransformStyle = 'preserve-3d';
        //cameraElement.style.display = 'none';
        cameraElement.style.pointerEvents = 'auto'; // allow mouse interaction

        console.log("[gl-css3d] check 2")
        cameraElement.appendChild(element);
        console.log("[gl-css3d] check 3")

        console.log("[gl-css3d] check 4")
        domElement.appendChild(cameraElement);
        document.body.appendChild(domElement);
        console.log("[gl-css3d] check 5")

        this.domElement = domElement;
        this.cameraElement = cameraElement;

        opts = opts || {};

        this.planeWidth = opts.planeWidth || 2; // assume -1 to +1
        this.planeHeight = opts.planeHeight || 2;
        // this.tint = opts.tint || [0.5,0,0,0]; // reddish tint, etc.. useful? (note gl blending mode)
        this.tint = opts.tint || [0, 0, 0, 0]; // fully transparent
        // this.tint = [1,1,1,1];
        this.blend = (opts.blend !== undefined) ? opts.blend : false; // overwrite transparent color
        this.flipX = (opts.flipX !== undefined) ? opts.flipX : true;
        this.flipY = (opts.flipY !== undefined) ? opts.flipY : true;
        this.backface = (opts.backface !== undefined) ? opts.backface : true;

        console.log("[gl-css3d] this.tint = ",this.tint);
        console.log("[gl-css3d] this.blend = ",this.blend);
        console.log("[gl-css3d] this :: ",this);

        this.cutoutMesh = null;
        this.cutoutShader = null;
        this.gl = null;
    }

    GLCSS3D.prototype.ginit = function(gl) {
        this.gl = gl;
        var hx = this.planeWidth / 2;
        var hy = this.planeHeight / 2;

        var indices =
            // triangles forming a rectangle for the front face
            [
                [2, 1, 0],
                [3, 1, 2]
            ];

        if (this.backface) {
            indices.push([0, 1, 2]);
            indices.push([2, 1, 3]);
        }

        this.cutoutMesh = createMesh(gl, indices, {
            "position": [
                [-hx, -hy, 0],
                [-hx, +hy, 0],
                [+hx, -hy, 0],
                [+hx, +hy, 0]
            ]
        })

        this.cutoutShader = glShader(gl,
            "#define GLSLIFY 1\n  attribute vec3 position;    uniform mat4 projection;  uniform mat4 view;    void main() {    gl_Position = projection * view * vec4(position, 1.0);  }",

          // color it all transparent so CSS element is visible through
          "  precision highp float;\n#define GLSLIFY 1\n  uniform vec4 color;    void main() {    gl_FragColor = color;  }");

        // this.cutoutShader = glShader(gl,
        //   "#define GLSLIFY 1\n\
        //   attribute vec3 position;\n\
        //   uniform mat4 projection;\n\
        //   uniform mat4 view;\n\
        //   void main() {\n\
        //     gl_Position = projection * view * vec4(position, 1.0);\n\
        //   }",
        //   // color it all transparent so CSS element is visible through
        //   "precision highp float;\n\
        //   #define GLSLIFY 1\n\
        //   uniform vec4 color;\n\
        //   void main() {\n\
        //     gl_FragColor = color;\n\
        //   }"
        // );
      };

    GLCSS3D.prototype.updatePerspective = function(cameraFOVradians, width, height) {
        // CSS world perspective - only needs to change on gl-resize (not each rendering tick)
        var fovPx = 0.5 / Math.tan(cameraFOVradians / 2) * height;
        this.domElement.style.perspective = this.domElement.style.webkitPerspective = fovPx + 'px';
        //domElement.style.perspectiveOrigin = '50% 50%'; // already is the default
        this.domElement.style.width = width + 'px';
        this.domElement.style.height = height + 'px';

        this.fovPx = fovPx;

        // CSS camera element child
        this.cameraElement.style.width = width + 'px';
        this.cameraElement.style.height = height + 'px';

        this.width = width;
        this.height = height;
    };

    var cssMatrix = mat4.create();

    GLCSS3D.prototype.updateView = function(view) {
        var scaleX = this.planeWidth / this.width;
        var scaleY = this.planeHeight / this.height;
        var scaleZ = 1;
        if (this.flipX) scaleX = -scaleX;
        if (this.flipY) scaleY = -scaleY;
        mat4.scale(cssMatrix, view, [scaleX, scaleY, scaleZ]);

        // three.js CSS3Renderer getCameraCSSMatrix inverts these to fix flipped rotation orientation
        // TODO: matrix transformation instead?
        cssMatrix[1] = -cssMatrix[1];
        cssMatrix[5] = -cssMatrix[5];
        cssMatrix[9] = -cssMatrix[9];
        cssMatrix[13] = -cssMatrix[13];

        this.cameraElement.style.transform = this.cameraElement.style.webkitTransform = 'translateZ(' + this.fovPx + 'px) ' + matrixToCSS(cssMatrix);
    };

    GLCSS3D.prototype.renderCutout = function(view, proj) {
        this.cutoutShader.bind()
        this.cutoutShader.attributes.position.location = 0

        this.cutoutShader.uniforms.projection = proj
        this.cutoutShader.uniforms.view = view
        // console.log("[gl-css3d] this.tint = ",this.tint);
        this.cutoutShader.uniforms.color = this.tint

        this.cutoutMesh.bind(this.cutoutShader)

        if (!this.blend) this.gl.disable(this.gl.BLEND);
        this.cutoutMesh.draw()
        if (!this.blend) this.gl.enable(this.gl.BLEND); // TODO: use module to push/restore gl state?

        this.cutoutMesh.unbind()
    };


    GLCSS3D.prototype.render = function(view, proj) {
        if(enable_per_tick_logging) console.log("[gl-css3d][render] start render")
        this.updateView(view);
        this.renderCutout(view, proj);
        if(enable_per_tick_logging) console.log("[gl-css3d][render] end render")
    };
}
