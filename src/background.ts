import * as Web3 from 'web3';

let blocksBehind = 0;

function polling() {
  // Check ETH network every 30 seconds
  chrome.storage.sync.get(null, function(items) {
    var usingRPC;
    if(!items.rpcProvider || items.rpcProvider == undefined) {
      usingRPC = 'https://mainnet.infura.io/radar';
    } else usingRPC = items.rpcProvider;
    var web3 = new Web3(new Web3.providers.HttpProvider(usingRPC));

    blocksBehind = web3.eth.blockNumber - items.bnum;
  });

  // Set a badge to extension icon to indicate # blocks behind
  if(blocksBehind > 0) {
    chrome.browserAction.setBadgeText({text: '' + blocksBehind}); 
  }

  console.log('polling, blocksBehind: ' + blocksBehind);
  setTimeout(polling, 1000 * 30);
}

polling();

