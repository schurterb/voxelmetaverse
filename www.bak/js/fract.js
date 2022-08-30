function fract (require, module, exports) {
    'use strict';

    function fract(f) {
        return Math.abs(f % 1);
    }

    module.exports = fract;
}