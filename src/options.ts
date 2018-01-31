import * as moment from 'moment';
import * as $ from 'jquery';
import * as popup from './popup';
import Vue from "vue";


var rpcP, mta, tta, recentPairs;

// Get recently viewed pairs
chrome.storage.sync.get(recentPairs, function(items){
  if(items.recentPairs) {
    recentPairs = items.recentPairs;
  }
  console.log(recentPairs);
});



// Saves options to chrome.storage.sync.
function save_options() {
  rpcP = $('#rpcprov').val();
  //TODO add valid RPC-link check 
  mta = $('#makerTA').val();
  tta = $('#takerTA').val();
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
    $('#makerTA').val(mta);
    $('#takerTA').val(tta);
    // $('#recentPairs').text(recentPairs);
    // Let user know options were restored.
    var restored = $('#restored');
    restored.text('Options set');
    setTimeout(function() {
      restored.text('');
    }, 750);
  });
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);
$('#restore').click(restore_options);

// Display the saved token pairs
Vue.component('token-pairs', {
  props: ['pairs'],
  template: `<button class="gryBtn" style="margin-left:5px" @click=updateTickers(pairs)>
               {{ pairs.mtas }} <> {{ pairs.ttas }}</button>`,
  methods: {
    updateTickers (setPairs) {
      mta = setPairs.mta;
      tta = setPairs.tta;
      $('#makerTA').val(mta);
      $('#takerTA').val(tta);
      save_options();
    }
  }
});
// Default pairing Array. TODO: save recent pairings
var pairingArray = [
      { id: 0, mtas: 'ZRX', mta:'0xE41d2489571d322189246DaFA5ebDe1F4699F498', 
               ttas: 'WETH', tta:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
      { id: 2, mtas: 'WETH', mta:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 
               ttas: 'OMG', tta:'0xd26114cd6EE289AccF82350c8d8487fedB8A0C07' },
      { id: 1, mtas: 'REQ', mta:'0x8f8221aFbB33998d8584A2B05749bA73c37a938a', 
               ttas: 'WETH', tta:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }
    ];
var app7 = new Vue({
  el: '#tokenPairs',
  template:`
  <div style="right:0"><br>
    Prefill with defaults: 
    <token-pairs
      v-for="item in pairings"
      v-bind:pairs="item"
      v-bind:key="item.id">
    </token-pairs>
  </div>`,
  data: {
    pairings: pairingArray
  }
})