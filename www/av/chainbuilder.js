
// Block - element of blockchain
class Block extends AetherObject {
  constructor(data, s = 0.5) {
    super(data,
          new THREE.BoxBufferGeometry(s, s, s),
          new THREE.MeshStandardMaterial(),);
    this.material.metalness = 0.7;
    this.material.roughness = 0.2;
    this.material.normalMap = resourceLoader.getTexture('bubble');
    this.material.color = new THREE.Color(0x292929);

    this.min_speed = 0.2;
    this.max_speed = 0.6;
    this.scaling_factor = 1;
    this.speed = Math.random();
    while(this.speed > this.max_speed && this.speed < this.min_speed) {
      this.speed = Math.random();
    }
    this.direction = (Math.random() > (this.min_speed + (this.max_speed - this.min_speed)/2)) ? 1 : -1;

    //Rotate block
    this.onClockTick = function(e) {
      this.mesh.rotation.y = this.speed * this.scaling_factor * e.detail.elapsedTime * this.direction;
    }.bind(this);

    //Show block data on hover
    this.onObjectHover = function(e) {
      if(e.detail[0].object.id === this.mesh.id) {
        // console.log(e.detail[0]);
        var data_keys = Object.keys(this.data);
        var hover = $('#hover-data');
        var table = $('<table/>');
        var tr;
        for (var i=0; i<data_keys.length; i++) {
          tr = $('<tr/>');
          tr.append("<td>" + data_keys[i] + ":  </td>");
          tr.append("<td> " + this.data[data_keys[i]] + " </td>");
          table.append(tr);
        }
        hover.html(table);
        hover.css({ "left": engine.mouseX + 'px', "top": engine.mouseY + 'px' });
        hover.removeClass("hidden");
        hover.addClass("show");
      }
    }
  }


}

// Blockchain - encapsulation of an entire Blockchain
class Blockchain extends AetherObject {
  constructor(provider = null, config={}) {
    super();
    this.provider = provider;
    this.blocks = [];

    conditionalCopy(this, config, 'size', 0.5);
    conditionalCopy(this, config, 'start', 0);
    conditionalCopy(this, config, 'count', 100);
    conditionalCopy(this, config, 'update_interval', 2000);
    if(config.hasOwnProperty('logging')) {
      this.logging = config.logging;
    }

    for(let x=0; x<this.count; x++) {
      var block = new Block({"data": "..."}, this.size);
      block.getMesh().position.set(0, ((this.size + 0.01) * x * -1), 0);
      this.blocks.push(block);
    }

    this.updateData();
  };
  updateData() {
    return new Promise(async function (resolve, reject) {
      console.log("provider : ",this.provider);
      if(this.provider) {
        this.chainlength = await this.provider.getBlockNumber();
        for(var x=0; x<this.count; x++) {
          var block_data = await this.provider.getBlock(this.chainlength -x);
          this.blocks[x].setData( block_data );
        }
      }
    }.bind(this)).catch(function(err) {
      if(this.logging) {
        console.log('[error]',err);
      }
    }.bind(this));
  }
  
  //TODO: See if there is a way we can recursively get the appropriate fields
  //      from all nested AetherObjects
  getGeometry() {
    return this.blocks.map(block => block.getGeometry());
  }
  getMaterial() {
    return this.blocks.map(block => block.getMaterial());
  }
  getMesh() {
    return this.blocks.map(block => block.getMesh());
  }

  getBlock(x) { return this.blocks.slice(x, x+1); }
}

// BlockchainFactory - factory class for creating blockchains
class BlockchainFactory {
  constructor() {
    this.chains = {};
  }

  //TODO: Figure out what to do here...
}
