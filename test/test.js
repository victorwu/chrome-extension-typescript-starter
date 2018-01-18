var Web3 = require('web3');
var web3 = new Web3();
// var chrome = require('sinon-chrome');

describe('background.ts', function(){
  describe('blocksBehind', function(){

    let blocksBehind = 0;
    var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/radar'));
    var blockNumber = web3.eth.blockNumber;

    // Check at the beginning of the test
    console.log("starting blockNumber: " + blockNumber);

    // Wait a minute to check if blocks behind
    setTimeout(function(){
      blocksBehind = web3.eth.blockNumber - blockNumber;

      // Check ETH network every 30 seconds
      it('ETH block times are 20 seconds on average, ' + 
        'polling should detect a block within a minute', function(done) {

        // Set a badge to extension icon to indicate # blocks behind
        if(blocksBehind > 0) {

          // chrome.browserAction.setBadgeText({text: '' + blocksBehind});
          done();

        } else {

          setImmediate(done);
          setImmediate(done); // two done() fails the test

        }
      });

      console.log('ending blockNumber: ' + web3.eth.blockNumber);
      console.log('number of blocksBehind: ' + blocksBehind);

    }, 1000 * 60 );
  });
});