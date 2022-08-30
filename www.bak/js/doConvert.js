function doConvert (require, module, exports) {
    module.exports = require('cwise-compiler')({
                "args": ["array", "scalar", "index"],
                "pre": {
                    "body": "{}",
                    "args": [],
                    "thisVars": [],
                    "localVars": []
                },
                "body": {
                    "body": "{nvar_inline_1_v=_inline_1_arg1_,_inline_1_infor(_inline_1_i=0;_inline_1_i<_inline_1_arg2_.length-1;++_inline_1_i){n_inline_1_v=_inline_1_v[_inline_1_arg2_[_inline_1_i]]n}n_inline_1_arg0_=_inline_1_v[_inline_1_arg2_[_inline_1_arg2_.length-1]]n}",
                    "args": [{
                                "name": "_inline_1_arg0_",
                                "lvalue": true,
                                "rvalue": false,
                                "count": 1
                            }