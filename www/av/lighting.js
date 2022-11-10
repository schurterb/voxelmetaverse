function defaultLighting(scene, gui_enabled = false) {

  const pointLight1 = new THREE.SpotLight(0xffd1);
  pointLight1.position.set(1.13, 1.59, 0.07)
  pointLight1.intensity = 0.48
  scene.add(pointLight1)

  const pointLight2 = new THREE.SpotLight(0xffd1);
  pointLight2.position.set(-5.11, -2.96, 1.59)
  pointLight2.intensity = 0.65
  scene.add(pointLight2)

  if(gui_enabled) {
    const gui = new dat.GUI();

    const light1 = gui.addFolder('Light 1');
    light1.add(pointLight1.position, 'x').min(-6).max(6).step(0.01)
    light1.add(pointLight1.position, 'y').min(-5).max(5).step(0.01)
    light1.add(pointLight1.position, 'z').min(-5).max(5).step(0.01)
    light1.add(pointLight1, 'intensity').min(0).max(10).step(0.01)

    const light1Color = {
      color: 0xffd1
    };
    light1.addColor(light1Color, 'color')
      .onChange(function() { pointLight1.color.set(light1Color.color); });

    const light2 = gui.addFolder('Light 2');
    light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
    light2.add(pointLight2.position, 'y').min(-5).max(5).step(0.01)
    light2.add(pointLight2.position, 'z').min(-5).max(5).step(0.01)
    light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

    const light2Color = {
      color: 0xffd1
    };
    light2.addColor(light2Color, 'color')
      .onChange(function() { pointLight2.color.set(light2Color.color); });
  }
}
