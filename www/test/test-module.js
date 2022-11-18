/*
  Test module for verifying the various aspects of the module-loader work correctly.
*/

//TODO: handle events

//TODO: test sending messages

addEventListener("message", (event) => {
  console.log("[test-module] Message Received :: ",event);

  //TODO: Ensure that large data/objects can be efficiently sent back to the event source
  // event.source.postMessage("Test Response");
  self.postMessage("Test Response");
  console.log("[test-module] Response Sent");
})

console.log(`[test-module] LOADED`);

/*
 eventChannelManager.getChannel("test-channel").send(new CustomEvent('test', {}))

 eventChannelManager.getChannel("test-channel").send("test");

 eventChannelManager.getChannel("test-channel").workerList[0].worker.postMessage("help")


  eventChannelManager.getChannel("test-channel").send("test");


*/
