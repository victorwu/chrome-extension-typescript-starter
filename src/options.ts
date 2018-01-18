import * as moment from 'moment';
import * as $ from 'jquery';

// Saves options to chrome.storage.sync.
function save_options() {
  // var color = $('#color').val();
  // var likesColor = $('#like').prop('checked');
  var rpcP = $('rpcprov').val();
  //TODO add valid RPC-link check 

  chrome.storage.sync.set({
    // favoriteColor: color,
    // likesColor: likesColor,
    rpcProvider: rpcP
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
    // favoriteColor: 'red',
    // likesColor: true,
    rpcProvider: 'https://mainnet.infura.io/radar'
  }, function(items: {favoriteColor, likesColor, rpcProvider}) {
    // $('#color').val(items.favoriteColor);
    // $('#like').prop('checked', items.likesColor);
    $('#rpcprov').val(items.rpcProvider);
  });
}

$('#save').click(save_options);
// $(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);
$('#restore').click(restore_options);
