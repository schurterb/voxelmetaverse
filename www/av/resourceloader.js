class ResourceLoader {
  constructor(textures) {
    this.textures = {};

    //Load resources
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", "./resources/resource.map.json", false);
    xmlHttpReq.send(null);
    var result = JSON.parse(xmlHttpReq.responseText);
    if('textures' in result) {
      const textureLoader = new THREE.TextureLoader();
      for(name in result.textures) {
        this.textures[name] = textureLoader.load(result.textures[name]);
      }
    }
  }
  
  //Textures getter (no setter)
  getTexture(name) {
    return this.textures[name];
  }
}
