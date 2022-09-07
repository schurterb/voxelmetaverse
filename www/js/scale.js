function scale (require, module, exports) {
    module.exports = scale;

    // (BNS - 2022/09/06) There are a lot of these and they are all different...

    // /**
    //  * Scales a vec3 by a scalar number
    //  *
    //  * @param {vec3} out the receiving vector
    //  * @param {vec3} a the vector to scale
    //  * @param {Number} b amount to scale the vector by
    //  * @returns {vec3} out
    //  */
    // function scale(out, a, b) {
    //
    //   console.log("out : ",out);
    //   console.log("a : ",a);
    //   console.log("b : ",b);
    //     out[0] = (a[0] == 0) ? 0 : a[0] * b
    //     out[1] = (a[1] == 0) ? 0 : a[1] * b
    //     out[2] = (a[2] == 0) ? 0 : a[2] * b
    //     console.log("out : ",out);
    //     return out
    // }

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to scale
     * @param {vec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/
    function scale(out, a, v) {
        var x = v[0], y = v[1], z = v[2];

        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;
        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;
        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
            console.log("out : ",out);
        return out;
    };
}
