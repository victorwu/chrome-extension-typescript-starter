import * as moment from 'moment';
import * as $ from 'jquery';
import * as Web3 from 'web3';
// import { ZeroEx } from '0x.js'; // TODO: Remove need to compile with this commented out first
/// <reference path="node_modules/@types/node/index.d.ts" />


var initialized = 0, isConnected, networkName = 'Unknown', lastUpdated, usingRPC, mta, tta, orderBook, recentPairs;
var bnum, timestamp, miner, dfty, gasUsed, numTx;

export function getTokenTicker(address) {
  var tickers = JSON.parse(Get("https://raw.githubusercontent.com/kvhnuke/etherwallet/mercury/app/scripts/tokens/ethTokens.json"));
  // Find and return ticker symbol corresponding to contract address
  if(address.toUpperCase() == "0x2956356cd2a2bf3202f771f50d3d14a367b48070".toUpperCase()) {
    return 'WETH';
  }
  for(var i=0;i<tickers.length; i++) {
    if(tickers[i].address.toUpperCase() == address.toUpperCase()) {
      return tickers[i].symbol;
    }
  }
  return address;
};
// HTTP Request
export function Get(theUrl){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",theUrl,false);
  Httpreq.send(null);
  return Httpreq.responseText;
};



// Load data in Chrome sync storage
export function loadData() {
  // Check if connection was made 
  if(isConnected){ isConnected = "<span class='greenInfo'>On</span>"; } 
  else { isConnected = "<span style='color:red'>Off</span>"; }
  $('#connected').html(isConnected);
  $('#network').html('<span class="grayText"> [</span>' + networkName + ' Network,');
  $('#rpcp').html('<span class="grayText"> "' + usingRPC + '"; </span>');
  $('#time').html(lastUpdated);
  $('#blockNum').html(bnum);
  $('#blockInfo').html(`<span class='grayText'>; mined on </span>` + timestamp + 
    ` <span class='grayText'><br />by ` + miner + `at </span>` + dfty + 
    `<span class='grayText'> difficulty, using </span>` + gasUsed + 
    `<span class='grayText'> gas with </span>` + numTx + 
    ` <span class='grayText'> transactions.]</span>`);
  var parseOB = function (orderBookInput) {
    // Display this when extension is loaded for first time, after a fresh install
    if(orderBookInput == '') return 'No data. Click "Refresh Network Status" to continue.';

    var parsedOB = [];
    if(typeof orderBookInput == 'object') {
      parsedOB = orderBookInput;
    } else {
      // String -> Object
      parsedOB = JSON.parse(orderBookInput);
    }

    // Write orderBook object to html table
    var text = `<table style='min-width: 700px;'><tr>
                  <td align='right'>Amount A</td><td>Token A</td><td>for</td>
                  <td align='right'>Amount B</td><td>Token B</td><td>View Order</td></tr>`;
    for(var i=0;i<parsedOB.length;i++) {
      var order = parsedOB[i];
      // console.log(order);
      text += "<tr><td align='right'>" + (order.makerTokenAmount/1000000000000000000).toFixed(7) + "</td>" + 
                  "<td>(" + getTokenTicker(order.makerTokenAddress).substring(0, 7) + ")</td><td> ⇄ </td>" + 
                  "<td align='right'>" + (order.takerTokenAmount/1000000000000000000).toFixed(7) + "</td>" + 
                  "<td>(" + getTokenTicker(order.takerTokenAddress) + ")</td>" +
                  "<td><a href='https://app.radarrelay.com/order/" + order.orderHash + "/' target='_blank'>" + 
                    "<img src='https://app.radarrelay.com/assets/img/share-icon.svg' /></a></td></tr>";
    }
    text += "</table>";
    return text;
  };
  $('#orderBook').html(parseOB(orderBook));
};

// Get ETH connectivity Information
export function seeNetwork() {
  var web3 = new Web3(new Web3.providers.HttpProvider(usingRPC));
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
  web3.eth.getBlock(bnum, true, function(error, block) {
    if(!error) {
      bnum = block.number,
      timestamp = moment(new Date(block.timestamp*1000)).format('YYYY-MM-DD HH:mm:ss'), // time it was mined
      miner = block.miner, // of this block
      dfty = block.difficulty + '', // difficulty of the block
      gasUsed = block.gasUsed, // to mine this block
      numTx = block.transactions.length // number of transactions in this block
    }
  }); // console.log("Last updated at " + lastUpdated);

  // Get Order Book Array of last orders
  orderBook = Get("https://api.radarrelay.com/0x/v0/orders?page=1&per_page=10&makerTokenAddress="+ mta + "&takerTokenAddress=" + tta);
  // console.log(orderBook);

  // Save data to chrome storage for quick access
  var orderBookSliced = JSON.parse(orderBook).slice(0,5); // cut array to save space
  // console.log(orderBook)
  chrome.storage.sync.set({
    'initialized': 1,
    'rpcProvider': usingRPC,
    'isConnected': isConnected,
    'networkName': networkName,
    'lastUpdated': lastUpdated,
    'bnum': bnum,
    'timestamp': timestamp,
    'miner': miner,
    'dfty': dfty,
    'gasUsed': gasUsed,
    'numTx': numTx,
    'orderBook': orderBookSliced
  });

  loadData();

  // Remove badge from extension after loading
  chrome.browserAction.setBadgeText({text: ''});
};



// Get data from chrome storage
if(!initialized) {
  chrome.storage.sync.get(null, function(items) {
    if(!items.rpcProvider || items.rpcProvider == undefined) {
      usingRPC = 'https://mainnet.infura.io/radar';
    } else usingRPC = items.rpcProvider;
    console.log("RPC initialized to: " + usingRPC);

    if(!items.mta || items.mta == undefined) {
      mta = '';
    } else mta = items.mta;
    console.log("makerTokenAddress initialized to: " + mta);

    if(!items.tta || items.tta == undefined) {
      tta = '';
    } else tta = items.tta;
    console.log("takerTokenAddress initialized to: " + tta);

    if(!items.orderBook || items.orderBook == undefined) {
      orderBook = [];
    } else orderBook = items.orderBook;
    // console.log("Retrieved orderBook: " + orderBook);

    initialized = items.initialized;
    isConnected = items.isConnected;
    networkName = items.networkName;
    lastUpdated = items.lastUpdated;
    bnum = items.bnum;
    timestamp = items.timestamp;
    miner = items.miner;
    dfty = items.dfty;
    gasUsed = items.gasUsed;
    numTx = items.numTx;
    recentPairs = items.recentPairs;
  });
};
// Update RPC if chrome storage detects a change from options.html
// chrome.storage.onChanged.addListener(function(changes, sync){
//   if(!changes.rpcProvider || changes.rpcProvider == undefined) {
//     usingRPC = 'https://mainnet.infura.io/radar';
//   } else usingRPC = changes.rpcProvider;
//   console.log("RPC switched to: " + usingRPC);
// });


$(function() {

  // if(initialized == 0) { 
  //   setTimeout(seeNetwork(), 1000);
  //   initialized = 1;
  // }
  loadData();


// chrome.storage.onChanged.addListener(

  // Get Block Number
  $('#getStatus').click(()=>{
    seeNetwork();
  });
  // Get Block Number
  $('#gotoOptions').click(()=>{
    chrome.tabs.create({ url: "chrome://extensions/?options=" + chrome.runtime.id } )
  });



  // const queryInfo = {
  //   'active': true,
  //   'currentWindow': true
  // };
  // chrome.tabs.query(queryInfo, function(tabs) {
    //
  // });

  // let count = 0;
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
