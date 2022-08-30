function ndarray_resample (require, module, exports) {
    "use strict"

    var fft = require("ndarray-fft")
    var pool = require("ndarray-scratch")
    var ops = require("ndarray-ops")

    varclampScale = require('cwise/lib/wrapper')({
                "args": ["array", "array", "scalar", "scalar", "scalar"],
                "pre": {
                    "body": "{}",
                    "args": [],
                    "thisVars": [],
                    "localVars": []
                },
                "body": {
                    "body": "{var_inline_1_f=_inline_1_arg1_*_inline_1_arg2_;_inline_1_f<_inline_1_arg3_&&(_inline_1_f=_inline_1_arg3_),_inline_1_f>_inline_1_arg4_&&(_inline_1_f=_inline_1_arg4_),_inline_1_arg0_=_inline_1_f}",
                    "args": [{
                                "name": "_inline_1_arg0_",
                                "lvalue": true,
                                "rvalue": false,
                                "count": 1
                            }