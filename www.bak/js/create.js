function create (require, module, exports) {
    module.exports = create;

    // /**
    //  * Creates a new, empty vec3
    //  *
    //  * @returns {vec3} a new 3D vector
    //  */
    // function create() {
    //     var out = new Float32Array(3)
    //     out[0] = 0
    //     out[1] = 0
    //     out[2] = 0
    //     return out
    // }

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */
  function create() {
      var out = new Float32Array(16);
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
  };
}
