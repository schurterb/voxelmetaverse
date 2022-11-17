/*
  Multi-directional event channels.
  These channels allow events to be passed throughout the main thread, between
  the main thread and worker threads, and between different browsers (via WebRTC)

  EventChannel config ::
  {
    'local': <boolean>,
    'workers': <boolean>,
    'distributed': <boolean>,
    'events': [...] //List of supported events
  }

  EventChannels only send.  To do worker-to-worker event routing, a worker must
  have an onMessage handler set up to forward the message to the proper channels.

*/

/* exports eventChannelManager, EventChannel */

const eventChannelManager = {

  eventChannels: {},

  listChannels: function() {
    return Object.keys(this.eventChannels);
  },

  getChannel: function(id) {
    return this.eventChannels[id];
  },

  addChannel: function(id, opts) {
    if(!this.eventChannels[id]) {
      this.eventChannels[id] = new EventChannel(id, opts);
    }
    return this.eventChannels[id];
  },

  removeChannel: function(id) {
    if(this.eventChannels[id]) {
      this.eventChannels[id].close();
      delete this.eventChannels[id];
    }
  }
};

class EventChannel {
  constructor(id, opts) {
    this.id = id;
    this.events = opts.events; //required

    // Enable local events
    this.local = opts.local || false;

    // Enable worker events
    this.workers = opts.workers || false;
    if(this.workers) {
      this.workerList = [];
    }

    // Enable distributed events
    this.distrubted = opts.distrubted || false;
    if(this.distrubted) {
      console.log("[EventChannel] TODO: Implement distributed events via WebRTC Data Channels");
    }
  }

  subscribe(entity) {
    if(entity instanceof Thread) {
      this.workerList.push(entity);
    }
    //TODO: implement distributed events via WebRTC Data Channels
  }
  unsubscribe(entity) {
    if(typeof(entity) === 'Thread') {
      var idx = this.workerList.indexOf(entity);
      if(idx > 0) { this.workerList = this.workerList.split(idx, 1); }
    }
    //TODO: implement distributed events via WebRTC Data Channels
  }

  //TODO: how to create proper event from CustomEvent
  send(event) {
    if(this.local) {
      document.dispatchEvent(event);
    }
    if(this.workers) {
      console.log("check 2 :: "+this.workerList);
      for(var i in this.workerList) {
        console.log("check 3");
        this.workerList[i].dispatchEvent(event);
          console.log("check 4");
      }
    }
    if(this.distributed) {
      console.log("[EventChannel] TODO: Implement distributed events via WebRTC Data Channels");
    }
  }
}
