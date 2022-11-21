/*
  To provide good control over the game, the input mapping component must work
  as follows:

  * User input is stored in a table and updated immediately when an button is pressed
    or the mouse moved, etc.
  * The mapper listens to the engine for ticks.
  * On each tick, the mapper sends the complete table to the input channel as a
    series of events.

*/

export class UserInputMapper {
  constructor(mapping, opts = {}) {
    if(!mapping) {
      console.log("[input-mapper] ERROR :: mapping is null!");
      return;
    }
    this.state = {};
    this.mapping = this.getMappingFunctions ? this.getMappingFunctions() : {};
    this.opts = opts || {};
    this.element = this.opts.element || document.body;
    this.tickSource = this.opts.tickSource || eventChannelManager.getChannel('engine');
    this.channel = this.opts.channel || eventChannelManager.getChannel('input');

    this.__init();
  }

  __init() {
    //TODO: Initialize the mapping table
    for(var k in this.mapping) {
      try {
        const key = k;
        this.element.addEventListener(key, function (e) {
          console.log(" ----- ----- ----- ");
          console.log("Event Type :: ",key);
          console.log("Event Data :: ",e);
          //TODO: how to lock state inbetween calls?
          //     -- push to interval
          this.state = this.mapping[key](this.state, e);
        }.bind(this));
      } catch(e) {
        console.log(`[input-mapper] ERROR :: Failed to create mapping for '${key}'`);
      }
    }
    if(this.tickSource instanceof EventChannel) {
      this.tickSource.subscribe((e) => { this.tick(e); }.bind(this)));
    }
  }

  //TODO: Implement event listener to tick source
  tick(tickEvent) {
    
  }
}
