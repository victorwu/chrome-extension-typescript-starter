// var webpack = require('webpack');
// var path = require('path');
// var vendor = require('../dist/js/vendor.js');
// var vendorjs = require('../dist/js/vendor.js.js');
// var options = require('../dist/js/options.js');
var jsdom = require('jsdom');
global.document = require('jsdom').jsdom('<html></html>');
global.window = document.defaultView;
global.$ = global.jQuery = require('jquery')(window);
// var $ = require('jquery');
var Web3 = require('web3');
// var web3 = new Web3();
// var chrome = require('sinon-chrome');

describe('background.ts', function(){
  describe('Get Block Info with Web3', function(){

    it("Get current block number:", function(done){

      let blocksBehind = 0;
      var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/radar'));
      var blockNumber = web3.eth.blockNumber;
      web3.eth.getBlock(blockNumber, function (error, result) {
        if(!error) {
          done();
          // console.log(result.number);
        }
        else {
          setImmediate(done);
          setImmediate(done); // two done() fails the test
          console.log(error);
        }
      });

    // Check at the beginning of the test
    // console.log("starting blockNumber: " + blockNumber);

    // Wait a minute to check if blocks behind
    // setTimeout(function(){
    //   blocksBehind = web3.eth.blockNumber - blockNumber;

    //   // Check ETH network every 30 seconds
    //   it('ETH block times are 20 seconds on average, ' + 
    //     'polling should detect a block within a minute', function(done) {

    //     // Set a badge to extension icon to indicate # blocks behind
    //     if(blocksBehind > 0) {

    //       // chrome.browserAction.setBadgeText({text: '' + blocksBehind});
    //       done();

    //     } else {

    //       setImmediate(done);
    //       setImmediate(done); // two done() fails the test

    //     }
    //   });

    //   console.log('ending blockNumber: ' + web3.eth.blockNumber);
    //   console.log('number of blocksBehind: ' + blocksBehind);

    // }, 1000 * 60 );
    });
  });
});


describe("Get Token Address by Token Symbol", function(){
  describe("using me json of tokensymbol/address on github", function(){
    function getTokenTicker(address) {
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

    it("zrx is 0xE41d2489571d322189246DaFA5ebDe1F4699F498", function(done){
      if(getTokenTicker("zrx")=="0xE41d2489571d322189246DaFA5ebDe1F4699F498") {
        done();
      } else {
        setImmediate(done);
        setImmediate(done);
      }
    });

    it("ZRX is 0xE41d2489571d322189246DaFA5ebDe1F4699F498", function(done){
      if(getTokenTicker("ZRX")=="0xE41d2489571d322189246DaFA5ebDe1F4699F498") {
        done();
      } else {
        setImmediate(done);
        setImmediate(done);
      }
    });

    it("abc is not a token, getTokenAddress returns false", function(done){
      if(!getTokenTicker("abc")) {
        done();
      } else {
        setImmediate(done);
        setImmediate(done);
      }
    });

  });
});
