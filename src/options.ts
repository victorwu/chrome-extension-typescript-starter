import * as moment from 'moment';
import * as $ from 'jquery';
import * as popup from './popup';



// Get recently viewed pairs
var recentPairs;
chrome.storage.sync.get(recentPairs, function(items){
  if(items.recentPairs) {
    recentPairs = items.recentPairs;
  }
  console.log(recentPairs);
});



// Saves options to chrome.storage.sync.
function save_options() {
  var rpcP = $('#rpcprov').val();
  //TODO add valid RPC-link check 
  var mta = $('#makerTA').val();
  var tta = $('#takerTA').val();
  //TODO add valid tokenAddress check 

  chrome.storage.sync.set({
    'rpcProvider': rpcP,
    'mta': mta,
    'tta': tta
  }, function() {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text('Options saved');
    setTimeout(function() {
      status.text('');
    }, 750);
  });
} // console.log($('rpcprov').val());

// Enter String and get valid token address or false if token symbol not found
export function getTokenAddress(symbol) {
  var tickers = JSON.parse(popup.Get("https://raw.githubusercontent.com/kvhnuke/etherwallet/mercury/app/scripts/tokens/ethTokens.json"));
  // Find and return ticker symbol corresponding to contract address
  for(var i=0;i<tickers.length; i++) {
    // console.log(tickers[i].symbol.toUpperCase());
    // console.log(symbol.toUpperCase() + "symbol");
    if(tickers[i].symbol.toUpperCase() == symbol.toUpperCase()) {
      return tickers[i].address;
    }
  }

  // return "Token contract not found for " + symbol;
  return false;
}
$('#tokenSymbol').keyup(function(){
  if(getTokenAddress($('#tokenSymbol').val())) {
    $('#tokenAddress').val(getTokenAddress($('#tokenSymbol').val()));
  } else {
    $('#tokenAddress').val('Address of Valid Token Symbol will appear here.');
  }
});


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    'rpcProvider': 'https://mainnet.infura.io/radar',
    'mta': '',
    'tta': '',
    'recentPairs': recentPairs
  }, function(items: {rpcProvider, mta, tta}) {
    $('#rpcprov').val(items.rpcProvider);
    $('#makerTA').val(items.mta);
    $('#takerTA').val(items.tta);
    $('#recentPairs').text(recentPairs);
    // Let user know options were restored.
    var restored = $('#restored');
    restored.text('Options restored');
    setTimeout(function() {
      restored.text('');
    }, 750);
  });
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);
$('#restore').click(restore_options);