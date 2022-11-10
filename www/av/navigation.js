var toggle_looking = false;
var lastX = -1;
var lastZ = -1;
var scaling_factor = 0.5
function defaultNavigation(camera) {

    if(camera.getMesh) {
      camera = camera.getMesh();
    }

    // On left mouse down and hold, activate looking
    function enable_looking(e) {
      toggle_looking = true;
    }
    document.addEventListener('mousedown', enable_looking);

    // On left mouse up, de-activate looking
    function disable_looking(e) {
      toggle_looking = false;
    }
    document.addEventListener('mouseup', disable_looking);

    // While looking is activated, moving the mouse changes the camera angle
    function look(e) {
      if(toggle_looking) {
        console.log("x :: "+e.clientX);
        console.log("y :: "+e.clientY);
        if(lastX > 0) {
          camera.rotation.x = Math.abs(e.clientX - lastX) * scaling_factor;
          lastX = e.clientX;
        }
        if(lastZ > 0) {
          camera.rotation.z = Math.abs(e.clientY - lastZ) * scaling_factor;
          lastZ = e.clientY;
        }
      }
    }
    document.addEventListener('mousemove', look);

    // On arrow left, move left
    // On arrow right, move right
    // On arrow up, zoom in
    // On arrow down, zoom out
    function arrow_navigation(event) {
      switch(event.key) {
          case 'ArrowLeft':
            camera.position.x -= 0.01;
            break;
          case 'ArrowRight':
            camera.position.x += 0.01;
            break;
          case 'ArrowUp':
            camera.position.z -= 0.01;
            break;
          case 'ArrowDown':
            camera.position.z += 0.01;
            break;
          default:
            break;
      }
    }
    document.addEventListener('keydown', arrow_navigation);

    // On scroll up, move up
    // On scroll down, move down
    function scroll_up_and_down(event) {
      camera.position.y -= event.deltaY * 0.002
    }
    document.addEventListener('wheel', scroll_up_and_down)
}
