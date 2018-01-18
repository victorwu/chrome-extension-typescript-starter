import * as moment from 'moment';
import * as $ from 'jquery';
import * as Web3 from 'web3';

let count = 0;
var initialized = 0, isConnected, networkName = 'Unknown', usingRPC, lastUpdated;
var bnum, timestamp, miner, dfty, gasUsed, numTx;
// Get RPC from chrome storage
chrome.storage.sync.get(['rpcProvider', 'initialized', 'isConnected'], function(items: {rpcProvider}) {
  if(!items.rpcProvider || items.rpcProvider == undefined) {
    usingRPC = 'https://mainnet.infura.io/radar';
  } else usingRPC = items.rpcProvider;
  console.log("RPC initialized to: " + usingRPC);


});
// Update RPC if chrome storage detects a change from options.html
chrome.storage.onChanged.addListener(function(changes, sync){
  console.log("RPC switched to: " + changes.rpcProvider);
  usingRPC = changes.rpcProvider;
});


$(function() {
  var web3 = new Web3(new Web3.providers.HttpProvider(usingRPC));

  // Get ETH connectivity Information
  var seeNetwork = function () {
    isConnected = web3.isConnected();
    switch (web3.version.network) {
      case "1":
        networkName = "Main";
        break;
      case "2":
       networkName = "Morden";
       break;
      case "3":
        networkName = "Ropsten";
        break;
      case "4":
        networkName = "Rinkeby";
        break;
      case "42":
        networkName = "Kovan";
        break;
      default:
        networkName = "Unknown";
    }
    lastUpdated = moment().format('YYYY-MM-DD HH:mm:ss');
    bnum = web3.eth.blockNumber;
    //Get Block Information
    web3.eth.getBlock(bnum, true, function(error, block){
      if(!error) {
        bnum = block.number,
        timestamp = new Date(block.timestamp*1000), // time it was mined
        miner = block.miner, // of this block
        dfty = block.difficulty, // difficulty of the block
        gasUsed = block.gasUsed, // to mine this block
        numTx = block.transactions.length; // number of transactions in this block
      }
    });

    loadData();
  };

  var loadData = function () {
    $('#connected').text(isConnected);
    $('#network').text(' (' + networkName + ' Network,');
    $('#rpcp').text(' "' + usingRPC + '")');
    $('#time').text(lastUpdated);
    $('#blockNum').text(bnum);
    $('#blockInfo').text(`
      mined on ` + timestamp + ` by ` + miner + ` at ` + dfty + ` difficulty, 
      using ` + gasUsed + ` gas with ` + numTx + ` transactions.
    `);
  };

  if(initialized == 0) { 
    // setTimeout(seeNetwork(), 1000);
    initialized = 1;
  }
  loadData();


// chrome.storage.onChanged.addListener(

  // Get Block Number
  $('#getStatus').click(()=>{
    seeNetwork();
  });




  // const queryInfo = {
  //   'active': true,
  //   'currentWindow': true
  // };
  // chrome.tabs.query(queryInfo, function(tabs) {
    //
  // });

  // chrome.browserAction.setBadgeText({text: '' + count});
  // $('#url').text(tabs[0].url);
  // $('#countUp').click(()=>{
  //   chrome.browserAction.setBadgeText({text: '' + count++});
  // });

  // $('#changeBackground').click(()=>{
  //   chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
  //     chrome.tabs.sendMessage(tabs[0].id, {
  //       color: '#005555'
  //     },
  //     function(msg) {
  //       console.log("result message:", msg);
  //     });

  //   });
  // });
});
