// Various global constants
// const constants = {
// }

// Various global parameters
var globalParams = {
  frameSizes: {
      width: window.innerWidth,
      height: window.innerHeight
  }
}

// Updaters for global parameters
window.addEventListener('resize', () => {
    globalParams.frameSizes.width = window.innerWidth;
    globalParams.frameSizes.height = window.innerHeight;
});
