/*
  worker = webworker = thread

  //TODO: enhance worker security with whitelisting :: https://stackoverflow.com/questions/10653809/making-webworkers-a-safe-environment/
*/

/* exports threadManager */

const threadManager = {
  workerList: {},

  listThreads: function () {
    return Object.keys(this.workerList);
  },

  getThread: function(id) {
    return this.workerList[id];
  },

  startThread: function (id, url, options={}) {
    if(!this.workerList[id]) {
      try {
        if(!options) options = {};
        console.log(`[worker-manager] Starting worker '${id}' with script '${url}'.`);
        if(!options.name) options.name = id;
        this.workerList[id] = new Thread(id, url, { "workerOptions": options });
        this.workerList[id].start();
      } catch(e) {
        console.log(`[worker-manager][ERROR] Failed to start worker '${id}' with script '${url}'.`,e);
      }
    } else {
      console.log(`[worker-manager] '${id}' is already running.`);
    }
    return this.workerList[id];
  },

  stopThread: function (id) {
    if(this.workerList[id]) {
      console.log(`[worker-manager] Stopping worker '${id}'`)
      this.workerList[id].stop();
      delete this.workerList[id];
      return true;
    }
    return false;
  }
}

class Thread {
  constructor(id, url, opts) {
    this.id = id;
    this.url = url;
    this.options = opts.workerOptions || {};
    this.worker = null;
    this.listeners = [];
  }

  start() {
    if( !this.isRunning() ) {
      this.worker = new Worker(this.url, this.options);
      this.worker.onmessage = function(e) {
        for(var i in this.listeners) {
          this.listeners[i](e);
        }
      }.bind(this);
      this.worker.onmessageerror = function(e) {
        console.log(`[${this.id}] Messsage Error: ${e}`)
      }.bind(this);
      this.worker.onerror = function(e) {
        console.log(`[${this.id}] ERROR: ${e}`)
      }.bind(this);
    }
    return this.isRunning();
  }

  stop() {
    if(this.isRunning()) {
      this.worker.terminate();
      this.worker = null;
    }
    return !this.isRunning();
  }

  isRunning() {
    return this.worker != null;
  }

  dispatchEvent(event) {
    if(this.isRunning()) {
      // console.log("TODO: Ensure that this can efficiently copy/send large data and objects to worker threads");
      if(typeof(event) != "string") {
        this.worker.postMessage(JSON.stringify(event));
      } else {
        this.worker.postMessage(event);
      }
    }
  }

  addListener(l) {
    if( !this.listeners[l] ) {
      this.listeners.push(l);
    }
  }
  removeListener(l) {
    if(this.listeners[l]) {
      delete this.listeners[l];
    }
  }
}
