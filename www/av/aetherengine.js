
//Should this extend Object3D for better integration?
class AetherObject {
  constructor(data_ = {}, geometry_ = null, material_ = null, mesh_ = null) {
    this.geometry = geometry_;
    this.material = material_;
    if(mesh_) {
      this.mesh = mesh_;
    } else if(this.geometry && this.material) {
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    if(this.mesh) {
      this.mesh.userData = data_;
    }
    this.data = data_;
    this.metadata = {
      'onRender': 'enabled',
      'onClockTick': 'enabled',
      'onObjectClick': 'enabled',
      'onObjectHover': 'enabled',
      'onObjectFocus': 'enabled',
      'onResize': 'enabled'
    }

    //undefined event handlers
    this.onRender = null;
    this.onClockTick = null;
    this.onObjectClick = null;
    this.onObjectHover = null;
    this.onObjectFocus = null;

    this.initEventHandlers();
  }

  getGeometry() { return this.geometry; }
  getMaterial() { return this.material; }
  getMesh() { return this.mesh; }

  getData() {
    if(this.mesh) {
      return this.mesh.userData;
    } else {
      return this.data;
    }
  }
  getData(key) {
    if(this.mesh) {
      return this.mesh.userData[key];
    } else {
      return this.data[key];
    }
  }
  setData(key, value) {
    if(this.mesh) {
      this.mesh.userData[key] = value ;
    }
    this.data[key] = value;
  }
  setData(obj) {
    if(typeof(obj) == 'object') {
      this.data = obj;
      // var keys = Object.keys(obj);
      // for(var i=0; i<keys.length; i++) {
      //   console.log(" in set : ",i," - ",keys[i]," - ",obj[keys[i]]);
      //   this.setData(keys[i], obj[keys[i]]);
      //   console.log("sanity check :: ",this);
      // }
    }
  }

  initEventHandlers() {
    window.addEventListener('render', function (event) {
      if(this.onRender && this.metadata['onRender'] === 'enabled') {
        this.onRender(event);
      }
    }.bind(this));
    window.addEventListener('clocktick', function (event) {
      if(this.onClockTick && this.metadata['onClockTick'] === 'enabled') {
        this.onClockTick(event);
      }
    }.bind(this));
    window.addEventListener('objectclick', function (event) {
      if(this.onObjectClick && this.metadata['onObjectClick'] === 'enabled') {
        this.onObjectClick(event);
      }
    }.bind(this));
    window.addEventListener('objecthover', function (event) {
      if(this.onObjectHover && this.metadata['onObjectHover'] === 'enabled') {
        this.onObjectHover(event);
      }
    }.bind(this));
    window.addEventListener('objectfocus', function (event) {
      if(this.onObjectFocus && this.metadata['onObjectFocus'] === 'enabled') {
        this.onObjectFocus(event);
      }
    }.bind(this));
  }
}

class AetherEngine {
  constructor(params = {}) {
    this.camera = null;
    this.view = null;
    this.running = false;
    this.ticks = 0;
    this.starttime = Date.now();

    //Params
    this.params = params;
    if( !this.params.hasOwnProperty('renderDelay') ) {
      this.params.renderDelay = 20; //millisecond delay between clocktick event and render event
    }
    if( !this.params.hasOwnProperty('interactDelay') ) {
      this.params.interactDelay = 20; //millisecond delay between clocktick event and checking for user interactions
    }

    //Events
    this.tickEventName = 'clocktick';
    this.renderEventName = 'render';
    this.hoverEventName = 'objecthover';

    //Initialize racastrer
    this.raycaster = new THREE.Raycaster();
    this.mouseX = 0;
    this.mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }.bind(this));

    //Start clock
    this.clock = new THREE.Clock();
  }

  setCamera(camera) {
    this.camera = camera;
  }
  getCamera() {
    return this.camera;
  }

  setView(view) {
    this.view = view;
  }
  getView() {
    return this.view;
  }

  start() {
    this.running = true;
    this.ticks = 0;
    this.starttime = Date.now();
    this.clockTickEventLauncher();
  }

  stop() {
    this.running = false;
  }

  clockTickEventLauncher() {
    if(this.running) {
      this.ticks++;
      let now = Date.now();
      var data = {
        detail: {
          ticks: this.ticks,
          elapsedTime: this.clock.getElapsedTime(),
          start: this.starttime,
          timestamp: now
        }
      }
      window.dispatchEvent(new CustomEvent(this.tickEventName, data));

      // setTimeout(this.renderEventLauncher.bind(this), this.params.renderDelay, data);
      setTimeout((n, d) => {
        window.dispatchEvent(new CustomEvent(n, d));
      }, this.params.renderDelay, this.renderEventName, data);

      setTimeout(function (d) {
        this.raycasting(d);
      }.bind(this), this.params.renderDelay, data);

      window.requestAnimationFrame(this.clockTickEventLauncher.bind(this));
    }
  }

  renderEventLauncher(data) {
    if(this.running) {
      window.dispatchEvent(new CustomEvent(this.renderEventName, data));
    }
  }

  raycasting(data) {
    if(this.running && (this.camera != null) && (this.camera != undefined) &&
                       (this.view != null) && (this.view != undefined) ) {
      let mousePos3D = new THREE.Vector3(( this.mouseX / window.innerWidth ) * 2 - 1, - ( this.mouseY / window.innerHeight ) * 2 + 1, 0.5 );
      this.raycaster.setFromCamera(mousePos3D, this.camera.getMesh());
      var intersects = this.raycaster.intersectObjects( this.view.getScene().children, true );

      if(intersects.length > 0) {
        window.dispatchEvent(new CustomEvent(this.hoverEventName,{detail:intersects}));
      } else {
        var hover = $('#hover-data');
        if( hover && hover.length > 0 && !("hidden" in hover[0].classList) ) {
          hover.removeClass("show");
          hover.addClass("hidden");
        }
      }
    }
  }
}
