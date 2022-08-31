function doConvert (require,module,exports){
    var pre = {
      "body": "{}",
      "args": [],
      "thisVars": [],
      "localVars": []
    };
    var args = [
      {
        "name": "_inline_1_arg0_",
        "lvalue": true,
        "rvalue": false,
        "count": 1
      },
      {
        "name": "_inline_1_arg1_",
        "lvalue": false,
        "rvalue": true,
        "count": 1
      },
      {
        "name": "_inline_1_arg2_",
        "lvalue": false,
        "rvalue": true,
        "count": 4
      }
    ];
    var local_vars = [
      "_inline_1_i",
      "_inline_1_v"
    ];
    var post = {
      "body": "{}",
      "args": [],
      "thisVars": [],
      "localVars": []
    };
    var input_obj = {
      "args": [
        "array",
        "scalar",
        "index"
      ],
      "pre": pre,
      "body": {
        "body": "{\nvar _inline_1_v=_inline_1_arg1_,_inline_1_i\nfor(_inline_1_i=0;_inline_1_i<_inline_1_arg2_.length-1;++_inline_1_i) {\n_inline_1_v=_inline_1_v[_inline_1_arg2_[_inline_1_i]]\n}\n_inline_1_arg0_=_inline_1_v[_inline_1_arg2_[_inline_1_arg2_.length- 1]]\n}",
        "args": args,
        "thisVars": [],
        "localVars": local_vars
      },
      "post": post,
      "funcName": "convert",
      "blockSize": 64
    }
    module.exports=require('cwise-compiler')(input_obj)
}
