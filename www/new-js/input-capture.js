/*
  To provide good control over the game, the input mapping component must work
  as follows:

  * User input is stored in a table and updated immediately when an button is pressed
    or the mouse moved, etc.
  * The mapper listens to the engine for ticks.
  * On each tick, the mapper sends the complete table to the input channel as a
    series of events.

*/
const inputCaptureComponents = [];
function initializeCaptureComponents(opts) {
  inputCaptureComponents.push(new KeyboardCapture(opts));
  inputCaptureComponents.push(new MouseCapture(opts));
}

class InputCapture {
  constructor(mapping, opts = {}) {
    this.state = {};
    this.mapping = mapping || {};
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
          //TODO: how to lock state inbetween calls?
          //     -- push to interval
          //     -- actually, should be async alright
          this.state = this.mapping[key](this.state, e, this.opts) || this.state;
        }.bind(this));
      } catch(e) {
        console.log(`[input-mapper] ERROR :: Failed to create mapping for '${key}'`);
      }
    }
    if(this.tickSource instanceof EventChannel) {
      this.tickSource.subscribe(function (e) {
        this.tick(e);
      }.bind(this));
    }
  }

  //TODO: Implement event listener to tick source
  tick(tickEvent) {
    // freeze a copy of the state of the map at this tick
    // const state = new Map(this.state);
    // send an update for each item in the state
    // for(var k in state) {
    //   // TODO: consider doing this async for speed
    //   const key = k;
    //   this.channel.send(key, state[key]);
    // }
    for(const [key, value] of Object.entries(this.state)) {
      this.channel.send(key, value);
    }
  }
}

class KeyboardCapture extends InputCapture {
  constructor(opts = {}) {
    super({
      'keydown': function(s, e, o={}) {
        if(e.isTrusted) {
          s[e.key] = true;
        }
        return s;
      },
      'keyup': function(s, e, o={}) {
        if(e.isTrusted) {
          s[e.key] = false;
        }
        return s;
      }
    }, opts);
  }
}

class MouseCapture extends InputCapture {
  constructor(opts = {}) {
    super({
      'mousedown': function(s, e, o={}) {
        if(e.isTrusted) {
          var buttonNames = o.buttonNames || ['mouse-0','mouse-1','mouse-2'];
          s[buttonNames[e.button]] = true;
        }
        return s;
      },
      'mouseup': function(s, e, o={}) {
        if(e.isTrusted) {
          var buttonNames = o.buttonNames || ['mouse-0','mouse-1','mouse-2'];
          s[buttonNames[e.button]] = false;
        }
        return s;
      }
    }, opts);
  }
}
