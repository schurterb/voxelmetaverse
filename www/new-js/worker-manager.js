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
  }

  start() {
    if( !this.isRunning() ) {
      this.worker = new Worker(this.url, this.options);
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
      console.log("TODO: Ensure that this can efficiently copy/send large data and objects to worker threads");
      this.worker.postMessage(event);
    }
  }
}
