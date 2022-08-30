function dat_gui (require, module, exports) {
    module.exports = require('./vendor/dat.gui')
    module.exports.color = require('./vendor/dat.color')
}