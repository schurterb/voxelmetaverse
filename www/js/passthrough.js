function passthrough (require, module, exports) {
    module.exports = require('./readable').PassThrough
}