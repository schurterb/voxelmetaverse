async function ethertest() {
  console.log("Testing InfuraProvider");

  // From https://github.com/dappuniversity/ethers_examples/blob/master/examples/1_accounts.js
  const INFURA_ID = '645218b7af35464bac32292d3758e754';
  const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);

  console.log("Provider :: ",provider);
  console.log("Latest block number :: ",await provider.getBlockNumber());

  const address = '0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e'
  const balance = await provider.getBalance(address);
  console.log(`\nETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`);
}
