
class View {
  constructor(canvas, sizes = { width: window.innerWidth, height: window.innerHeight }) {
    this.scene = new THREE.Scene();
    this.cameras = [];

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true //Makes background transparent
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const self = this;
    window.addEventListener('resize', () => {
      self.renderer.setSize(globalParams.frameSizes.width, globalParams.frameSizes.height);
      self.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    //Listen to render events from the engine
    window.addEventListener('render', (e) => {
      self.update();
    });
  }

  getScene() {
    return this.scene;
  }

  add(obj) {
    if( Array.isArray(obj) ) {
      for(let x in obj) {
        this.add(obj[x]);
      }
    } else if(obj.getMesh) {
      this.add(obj.getMesh());
    } else {
      this.scene.add(obj);
      if(obj.type.toLowerCase().includes("camera")) {
        this.cameras.push(obj);
      }
    }
  }

  remove(obj) {
    if( Array.isArray(obj) ) {
      obj.map(this.remove);
    } else if(obj.getMesh) {
      this.remove(obj.getMesh());
    } else {
      this.scene.remove(obj);
      if(obj.type.toLowerCase().includes("camera")) {
        this.cameras.remove(obj);
      }
    }
  }

  update() {
    for(let i=0; i<this.cameras.length; i++) {
      this.renderer.render(this.scene, this.cameras[i]);
    }
  }
}
