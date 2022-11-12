/*
  worker = webworker = thread

  //TODO: enhance worker security with whitelisting :: https://stackoverflow.com/questions/10653809/making-webworkers-a-safe-environment/
*/

const workerManager = {
  workerList: {},

  listWorkers: function () {
    return Object.keys(this.workerList);
  },

  getWorker: function(id) {
    return this.workerList[id];
  },

  startWorker: function (id, url, options={}) {
    if(!this.workerList[id]) {
      try {
        console.log(`[worker-manager] Starting worker '${id}' with script '${url}'.`);
        if(!options.name) options.name = id;
        this.workerList[id] = new Worker(url, options);
      } catch(e) {
        console.log(`[worker-manager][ERROR] Failed to start worker '${id}' with script '${url}'.`,e);
      }
    } else {
      console.log(`[worker-manager] '${id}' is already running.`);
    }
    return this.workerList[id];
  },

  stopWorker: function (id) {
    if(this.workerList[id]) {
      console.log(`[worker-manager] Stopping worker '${id}'`)
      this.workerList[id].terminate();
      delete this.workerList[id];
      return true;
    }
    return false;
  }
}
