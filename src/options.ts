import * as moment from 'moment';
import * as $ from 'jquery';

// Saves options to chrome.storage.sync.
function save_options() {
  var rpcP = $('#rpcprov').val();
  //TODO add valid RPC-link check 

  chrome.storage.sync.set({
    'rpcProvider': rpcP
  }, function() {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text('Options saved.');
    setTimeout(function() {
      status.text('');
    }, 750);
  });
}
  console.log($('rpcprov').val());

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    'rpcProvider': 'https://mainnet.infura.io/radar'
  }, function(items: {favoriteColor, likesColor, rpcProvider}) {
    $('#rpcprov').val(items.rpcProvider);
  });
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);
$('#restore').click(restore_options);
