class ChainConnectorFactory {
  constructor(params = {}) {  }

  getChainConnector(config = {}) {
    if(config.hasOwnProperty('infura')) {
      return new ethers.providers.JsonRpcProvider("https://"+config.infura.network+"/"+config.infura.id);
    }
    return null;
  }
}
