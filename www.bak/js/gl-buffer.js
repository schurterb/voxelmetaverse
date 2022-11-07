function gl_buffer (require, module, exports) {
    "use strict"

    var pool = require("typedarray-pool")
    var ops = require("ndarray-ops")
    var ndarray = require("ndarray")

    var SUPPORTED_TYPES = [
        "uint8",
        "uint8_clamped",
        "uint16",
        "uint32",
        "int8",
        "int16",
        "int32",
        "float32"
    ]

    // V1
    // #########################################################################
    // function GLBuffer(gl, type, handle, length, usage) {
    //     this.gl = gl
    //     this.type = type
    //     this.handle = handle
    //     this.length = length
    //     this.usage = usage
    // }
    //
    // var proto = GLBuffer.prototype
    //
    // proto.bind = function() {
    //     this.gl.bindBuffer(this.type, this.handle)
    // }
    //
    // proto.unbind = function() {
    //     this.gl.bindBuffer(this.type, null)
    // }
    //
    // proto.dispose = function() {
    //     this.gl.deleteBuffer(this.handle)
    // }
    //
    // function updateTypeArray(gl, type, len, usage, data, offset) {
    //     var dataLen = data.length * data.BYTES_PER_ELEMENT
    //     if (offset < 0) {
    //         gl.bufferData(type, data, usage)
    //         return dataLen
    //     }
    //     if (dataLen + offset > len) {
    //         throw new Error("gl-buffer: If resizing buffer, must not specify offset")
    //     }
    //     gl.bufferSubData(type, offset, data)
    //     return len
    // }
    //
    // function makeScratchTypeArray(array, dtype) {
    //     var res = pool.malloc(array.length, dtype)
    //     var n = array.length
    //     for (var i = 0; i < n; ++i) {
    //         res[i] = array[i]
    //     }
    //     return res
    // }
    //
    // function isPacked(shape, stride) {
    //     var n = 1
    //     for (var i = stride.length - 1; i >= 0; --i) {
    //         if (stride[i] !== n) {
    //             return false
    //         }
    //         n *= shape[i]
    //     }
    //     return true
    // }
    //
    // proto.update = function(array, offset) {
    //     if (typeof offset !== "number") {
    //         offset = -1
    //     }
    //     this.bind()
    //     if (typeof array === "object" && typeof array.shape !== "undefined") { //ndarray
    //         var dtype = array.dtype
    //         if (SUPPORTED_TYPES.indexOf(dtype) < 0) {
    //             dtype = "float32"
    //         }
    //         if (this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
    //             var ext = gl.getExtension('OES_element_index_uint')
    //             if (ext && dtype !== "uint16") {
    //                 dtype = "uint32"
    //             } else {
    //                 dtype = "uint16"
    //             }
    //         }
    //         if (dtype === array.dtype && isPacked(array.shape, array.stride)) {
    //             if (array.offset === 0 && array.data.length === array.shape[0]) {
    //                 this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data, offset)
    //             } else {
    //                 this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data.subarray(array.offset, array.shape[0]), offset)
    //             }
    //         } else {
    //             var tmp = pool.malloc(array.size, dtype)
    //             var ndt = ndarray(tmp, array.shape)
    //             ops.assign(ndt, array)
    //             if (offset < 0) {
    //                 this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp, offset)
    //             } else {
    //                 this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp.subarray(0, array.size), offset)
    //             }
    //             pool.free(tmp)
    //         }
    //     } else if (Array.isArray(array)) { //Vanilla array
    //         var t
    //         if (this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
    //             t = makeScratchTypeArray(array, "uint16")
    //         } else {
    //             t = makeScratchTypeArray(array, "float32")
    //         }
    //         if (offset < 0) {
    //             this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t, offset)
    //         } else {
    //             this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t.subarray(0, array.length), offset)
    //         }
    //         pool.free(t)
    //     } else if (typeof array === "object" && typeof array.length === "number") { //Typed array
    //         this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array, offset)
    //     } else if (typeof array === "number" || array === undefined) { //Number/default
    //         if (offset >= 0) {
    //             throw new Error("gl-buffer: Cannot specify offset when resizing buffer")
    //         }
    //         array = array | 0
    //         if (array <= 0) {
    //             array = 1
    //         }
    //         this.gl.bufferData(this.type, array | 0, this.usage)
    //         this.length = array
    //     } else { //Error, case should not happen
    //         throw new Error("gl-buffer: Invalid data type")
    //     }
    // }
    //
    // function createBuffer(gl, data, type, usage) {
    //     type = type || gl.ARRAY_BUFFER
    //     usage = usage || gl.DYNAMIC_DRAW
    //     // console.log("type :: ",type);
    //     // console.log("gl.ARRAY_BUFFER :: ",gl.ARRAY_BUFFER);
    //     // console.log("gl.ELEMENT_ARRAY_BUFFER :: ",gl.ELEMENT_ARRAY_BUFFER);
    //     if (type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
    //         throw new Error("gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER")
    //     }
    //     if (usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
    //         throw new Error("gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW")
    //     }
    //     var handle = gl.createBuffer()
    //     var result = new GLBuffer(gl, type, handle, 0, usage)
    //     result.update(data)
    //     return result
    // }
    // #########################################################################

    // V2
    // #########################################################################
    function GLBuffer(gl, type, handle, length, usage) {
      this.gl = gl
      this.type = type
      this.handle = handle
      this.length = length
      this.usage = usage
    }

    GLBuffer.prototype.bind = function() {
      this.gl.bindBuffer(this.type, this.handle)
    }

    GLBuffer.prototype.dispose = function() {
      this.gl.deleteBuffer(this.handle)
    }

    function updateTypeArray(gl, type, len, usage, data, offset) {
      if(offset <= 0 && data.length > len) {
        gl.bufferData(type, data, usage)
        return data.length
      }
      if(data.length + offset > len) {
        throw new Error("gl-buffer: If resizing buffer, offset must be 0")
      }
      gl.bufferSubData(type, offset, data)
      return len
    }

    function makeScratchTypeArray(array, dtype) {
      var res = pool.malloc(array.length, dtype)
      var n = array.length
      for(var i=0; i<n; ++i) {
        res[i] = array[i]
      }
      return res
    }

    GLBuffer.prototype.update = function(array, offset) {
      if(!offset) {
        offset = 0
      }
      this.bind()
      if(typeof array === "number") {
        if(offset > 0) {
          throw new Error("gl-buffer: Cannot specify offset when resizing buffer")
        }
        this.gl.bufferData(this.type, array, this.usage)
        this.length = array
      } else if(array.shape) {
        var dtype = array.dtype
        if(dtype === "float64" || dtype === "array" || dtype === "generic") {
          dtype = "float32"
        }
        if(this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
          dtype = "uint16"
        }
        if(array.shape.length !== 1) {
          throw new Error("gl-buffer: Array length must be 1")
        }
        if(dtype === array.dtype && array.stride[0] === 1) {
          if(array.offset === 0 && array.data.length === array.shape[0]) {
            this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data, offset)
          } else {
            this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array.data.subarray(array.offset, array.shape[0]), offset)
          }
        } else {
          var tmp = pool.malloc(array.shape[0], dtype)
          var ndt = ndarray(tmp)
          ops.assign(ndt, array)
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, tmp, offset)
          pool.free(tmp)
        }
      } else if(Array.isArray(array)) {
        if(this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
          var t = makeScratchTypeArray(array, "uint16")
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t.subarray(0, array.length), offset)
          pool.freeUint16(t)
        } else {
          var t = makeScratchTypeArray(array, "float32")
          this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, t.subarray(0, array.length), offset)
          pool.freeFloat32(t)
        }
      } else {
        this.length = updateTypeArray(this.gl, this.type, this.length, this.usage, array, offset)
      }
    }

    GLBuffer.prototype.draw = function(mode, count, offset) {
      offset = offset || 0
      var gl = this.gl
      if(this.type === gl.ARRAY_BUFFER) {
        gl.drawArrays(mode, offset, count)
      } else if(this.type === gl.ELEMENT_ARRAY_BUFFER) {
        this.bind()
        gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset)
      } else {
        throw new Error("Invalid type for WebGL buffer")
      }
    }

    function createBuffer(gl, data, type, usage) {
        type = type || gl.ARRAY_BUFFER
        usage = usage || gl.DYNAMIC_DRAW
        // console.log("type :: ",type);
        // console.log("gl.ARRAY_BUFFER :: ",gl.ARRAY_BUFFER);
        // console.log("gl.ELEMENT_ARRAY_BUFFER :: ",gl.ELEMENT_ARRAY_BUFFER);
        if (type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
            throw new Error("gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER")
        }
        if (usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
            throw new Error("gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW")
        }
        var handle = gl.createBuffer()
        var result = new GLBuffer(gl, type, handle, 0, usage)
        result.update(data)
        return result
    }
    // (BNS - 2022/09/08) compromise between the two versions...
    // function createBuffer(gl, type, data, usage) {
    function createBuffer(gl, data, type, usage) {
      if(data === undefined) {
        data = type
        type = gl.ARRAY_BUFFER
      }
      if(type === undefined) {
        type = gl.ARRAY_BUFFER
      }
      if(!usage) {
        usage = gl.DYNAMIC_DRAW
      }
      var len = 0
      var handle = gl.createBuffer()
      gl.bindBuffer(type, handle)

      // console.log("typeof data = "+(typeof data));
      // console.log("data instanceof Array = "+(data instanceof Array));
      // console.log("data.length = "+data.length);
      // console.log("data.shape = "+data.shape);
      if(typeof data === "number") {
        gl.bufferData(type, data, usage)
        len = data
      } else if(data instanceof Array) {
        if(type === gl.ELEMENT_ARRAY_BUFFER) {
          gl.bufferData(type, new Uint16Array(data), usage)
        } else {
          gl.bufferData(type, new Float32Array(data), usage)
        }
        len = data.length
      } else if(data.length != null && data.length != undefined) {
        gl.bufferData(type, data, usage)
        len = data.length
      } else if(data.shape) {
        var dtype = data.dtype
        if(dtype === "float64" || dtype === "array" || dtype === "generic") {
          dtype = "float32"
        }
        if(type === gl.ELEMENT_ARRAY_BUFFER) {
          dtype = "uint16"
        }
        if(data.shape.length !== 1) {
          throw new Error("gl-buffer: Array shape must be 1D")
        }
        var len = data.shape[0]
        if(dtype === data.type && data.stride[0] === 1) {
          gl.bufferData(type, data.data.subarray(data.offset, data.offset+len), usage)
        } else {
          var tmp = pool.malloc(data.shape[0], dtype)
          var ndt = ndarray(tmp)
          ops.assign(ndt, data)
          gl.bufferData(type, tmp, usage)
          pool.free(tmp)
        }
      } else {
        console.log(" ### DATA :: ",data);
        throw new Error("gl-buffer: Invalid format for buffer data")
      }
      if(type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
        throw new Error("gl-buffer: Invalid type for webgl buffer")
      }
      if(usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
        throw new Error("gl-buffer: Invalid usage for buffer")
      }
      return new GLBuffer(gl, type, handle, len, usage);
    }
    // #########################################################################

    module.exports = createBuffer
}
