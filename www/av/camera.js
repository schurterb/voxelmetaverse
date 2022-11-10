class DefaultCamera extends AetherObject {
  constructor(position = {x:0, y:-2, z:2}) {
    super();
    this.camera = new THREE.PerspectiveCamera(75, globalParams.frameSizes.width / globalParams.frameSizes.height, 0.1, 100);
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;

    window.addEventListener('resize', function (e) {
       this.camera.aspect = globalParams.frameSizes.width / globalParams.frameSizes.height;
       this.camera.updateProjectionMatrix();
    }.bind(this));
  }

  getMesh() {
    return this.camera;
  }
}
