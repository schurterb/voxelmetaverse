// function webglew (require, module, exports) {
//     'use strict'
//
//     var weakMap = typeof WeakMap === 'undefined' ? require('weak-map') : WeakMap
//
//     var WebGLEWStruct = new weakMap()
//
//     function baseName(ext_name) {
//         return ext_name.replace(/^[A-Z]+_/, '')
//     }
//
//     function initWebGLEW(gl) {
//         var struct = WebGLEWStruct.get(gl)
//         if (struct) {
//             return struct
//         }
//         var extensions = {}
//         var supported = gl.getSupportedExtensions()
//         for (var i = 0; i < supported.length; ++i) {
//             var extName = supported[i]
//
//             //Skip MOZ_ extensions
//             if (extName.indexOf('MOZ_') === 0) {
//                 continue
//             }
//             var ext = gl.getExtension(supported[i])
//             if (!ext) {
//                 continue
//             }
//             while (true) {
//                 extensions[extName] = ext
//                 var base = baseName(extName)
//                 if (base === extName) {
//                     break
//                 }
//                 extName = base
//             }
//         }
//         WebGLEWStruct.set(gl, extensions)
//         return extensions
//     }
//     module.exports = initWebGLEW
// }

function webglew (require, module, exports) {
    "use strict";

    var VENDOR_PREFIX = [
        "WEBKIT_",
        "MOZ_"
    ];

    function baseName(ext_name) {
        for (var i = 0; i < VENDOR_PREFIX.length; ++i) {
            var prefix = VENDOR_PREFIX[i];
            if (ext_name.indexOf(prefix) === 0) {
                return ext_name.slice(prefix.length);
            }
        }
        return ext_name;
    }

    function initWebGLEW(gl) {
        if (gl._webglew_struct) {
            return gl._webglew_struct;
        }
        var extensions = {};
        var supported = gl.getSupportedExtensions();
        for (var i = 0; i < supported.length; ++i) {
            var ext = gl.getExtension(supported[i]);
            if (!ext) {
                continue;
            }
            extensions[supported[i]] = ext;
            extensions[baseName(supported[i])] = ext; //Add version without VENDOR
        }
        gl._webglew_struct = extensions;
        return extensions;
    }
    module.exports = initWebGLEW;
}
