function shams (require, module, exports) {
    'use strict';

    var hasSymbols = require('has-symbols/shams');

    module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
    };
}