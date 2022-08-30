function function_bind (require, module, exports) {
    'use strict';

    var implementation = require('./implementation');

    module.exports = Function.prototype.bind || implementation;
}