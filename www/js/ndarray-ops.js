function ndarray_ops (require, module, exports) {
    "use strict"

    var compile = require("cwise-compiler")

    var EmptyProc = {
        body: "",
        args: [],
        thisVars: [],
        localVars: []
    }

    function fixup(x) {
        if (!x) {
            return EmptyProc
        }
        for (var i = 0; i < x.args.length; ++i) {
            var a = x.args[i]
            if (i === 0) {
                x.args[i] = {
                    name: a,
                    lvalue: true,
                    rvalue: !!x.rvalue,
                    count: x.count || 1
                }
            } else {
                x.args[i] = {
                    name: a,
                    lvalue: false,
                    rvalue: true,
                    count: 1
                }
            }
        }
        if (!x.thisVars) {
            x.thisVars = []
        }
        if (!x.localVars) {
            x.localVars = []
        }
        return x
    }

    function pcompile(user_args) {
        return compile({
            args: user_args.args,
            pre: fixup(user_args.pre),
            body: fixup(user_args.body),
            post: fixup(user_args.proc),
            funcName: user_args.funcName
        })
    }

    function makeOp(user_args) {
        var args = []
        for (var i = 0; i < user_args.args.length; ++i) {
            args.push("a" + i)
        }
        var wrapper = new Function("P", [
            "return function ", user_args.funcName, "_ndarrayops(", args.join(","), ") {P(", args.join(","), ");return a0}"
        ].join(""))
        return wrapper(pcompile(user_args))
    }

    var assign_ops = {
        add: "+",
        sub: "-",
        mul: "*",
        div: "/",
        mod: "%",
        band: "&",
        bor: "|",
        bxor: "^",
        lshift: "<<",
        rshift: ">>",
        rrshift: ">>>"
    };
    (function() {
        for (var id in assign_ops) {
            var op = assign_ops[id]
            exports[id] = makeOp({
                args: ["array", "array", "array"],
                body: {
                    args: ["a", "b", "c"],
                    body: "a=b" + op + "c"
                },
                funcName: id
            })
            exports[id + "eq"] = makeOp({
                args: ["array", "array"],
                body: {
                    args: ["a", "b"],
                    body: "a" + op + "=b"
                },
                rvalue: true,
                funcName: id + "eq"
            })
            exports[id + "s"] = makeOp({
                args: ["array", "array", "scalar"],
                body: {
                    args: ["a", "b", "s"],
                    body: "a=b" + op + "s"
                },
                funcName: id + "s"
            })
            exports[id + "seq"] = makeOp({
                args: ["array", "scalar"],
                body: {
                    args: ["a", "s"],
                    body: "a" + op + "=s"
                },
                rvalue: true,
                funcName: id + "seq"
            })
        }
    })();

    var unary_ops = {
        not: "!",
        bnot: "~",
        neg: "-",
        recip: "1.0/"
    };
    (function() {
        for (var id in unary_ops) {
            var op = unary_ops[id]
            exports[id] = makeOp({
                args: ["array", "array"],
                body: {
                    args: ["a", "b"],
                    body: "a=" + op + "b"
                },
                funcName: id
            })
            exports[id + "eq"] = makeOp({
                args: ["array"],
                body: {
                    args: ["a"],
                    body: "a=" + op + "a"
                },
                rvalue: true,
                count: 2,
                funcName: id + "eq"
            })
        }
    })();

    var binary_ops = {
        and: "&&",
        or: "||",
        eq: "===",
        neq: "!==",
        lt: "<",
        gt: ">",
        leq: "<=",
        geq: ">="
    };
    (function() {
        for (var id in binary_ops) {
            var op = binary_ops[id]
            exports[id] = makeOp({
                args: ["array", "array", "array"],
                body: {
                    args: ["a", "b", "c"],
                    body: "a=b" + op + "c"
                },
                funcName: id
            })
            exports[id + "s"] = makeOp({
                args: ["array", "array", "scalar"],
                body: {
                    args: ["a", "b", "s"],
                    body: "a=b" + op + "s"
                },
                funcName: id + "s"
            })
            exports[id + "eq"] = makeOp({
                args: ["array", "array"],
                body: {
                    args: ["a", "b"],
                    body: "a=a" + op + "b"
                },
                rvalue: true,
                count: 2,
                funcName: id + "eq"
            })
            exports[id + "seq"] = makeOp({
                args: ["array", "scalar"],
                body: {
                    args: ["a", "s"],
                    body: "a=a" + op + "s"
                },
                rvalue: true,
                count: 2,
                funcName: id + "seq"
            })
        }
    })();

    var math_unary = [
        "abs",
        "acos",
        "asin",
        "atan",
        "ceil",
        "cos",
        "exp",
        "floor",
        "log",
        "round",
        "sin",
        "sqrt",
        "tan"
    ];
    (function() {
        for (var i = 0; i < math_unary.length; ++i) {
            var f = math_unary[i]
            exports[f] = makeOp({
                args: ["array", "array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b"],
                    body: "a=this_f(b)",
                    thisVars: ["this_f"]
                },
                funcName: f
            })
            exports[f + "eq"] = makeOp({
                args: ["array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a"],
                    body: "a=this_f(a)",
                    thisVars: ["this_f"]
                },
                rvalue: true,
                count: 2,
                funcName: f + "eq"
            })
        }
    })();

    var math_comm = [
        "max",
        "min",
        "atan2",
        "pow"
    ];
    (function() {
        for (var i = 0; i < math_comm.length; ++i) {
            var f = math_comm[i]
            exports[f] = makeOp({
                args: ["array", "array", "array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b", "c"],
                    body: "a=this_f(b,c)",
                    thisVars: ["this_f"]
                },
                funcName: f
            })
            exports[f + "s"] = makeOp({
                args: ["array", "array", "scalar"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b", "c"],
                    body: "a=this_f(b,c)",
                    thisVars: ["this_f"]
                },
                funcName: f + "s"
            }) exports[f + "eq"] = makeOp({
                args: ["array", "array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b"],
                    body: "a=this_f(a,b)",
                    thisVars: ["this_f"]
                },
                rvalue: true,
                count: 2,
                funcName: f + "eq"
            }) exports[f + "seq"] = makeOp({
                args: ["array", "scalar"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b"],
                    body: "a=this_f(a,b)",
                    thisVars: ["this_f"]
                },
                rvalue: true,
                count: 2,
                funcName: f + "seq"
            })
        }
    })();

    var math_noncomm = [
        "atan2",
        "pow"
    ];
    (function() {
        for (var i = 0; i < math_noncomm.length; ++i) {
            var f = math_noncomm[i]
            exports[f + "op"] = makeOp({
                args: ["array", "array", "array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b", "c"],
                    body: "a=this_f(c,b)",
                    thisVars: ["this_f"]
                },
                funcName: f + "op"
            })
            exports[f + "ops"] = makeOp({
                args: ["array", "array", "scalar"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b", "c"],
                    body: "a=this_f(c,b)",
                    thisVars: ["this_f"]
                },
                funcName: f + "ops"
            }) exports[f + "opeq"] = makeOp({
                args: ["array", "array"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b"],
                    body: "a=this_f(b,a)",
                    thisVars: ["this_f"]
                },
                rvalue: true,
                count: 2,
                funcName: f + "opeq"
            }) exports[f + "opseq"] = makeOp({
                args: ["array", "scalar"],
                pre: {
                    args: [],
                    body: "this_f=Math." + f,
                    thisVars: ["this_f"]
                },
                body: {
                    args: ["a", "b"],
                    body: "a=this_f(b,a)",
                    thisVars: ["this_f"]
                },
                rvalue: true,
                count: 2,
                funcName: f + "opseq"
            })
        }
    })();

    exports.any = compile({
                args: ["array"],
                pre: EmptyProc,
                body: {
                    args: [{
                                name: "a",
                                lvalue: false,
                                rvalue: true,
                                count: 1
                            }