import * as options from './options';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // if (msg.color) {
    //     console.log('Receive color = ' + msg.color);
    //     document.body.style.backgroundColor = msg.color;
    //     sendResponse('Change color to ' + msg.color);
    // } else {
    //     sendResponse('Color message is none.');
    // }
});


// get recent trading pairs listed (from visiting app.RadarRelay.com)
var recentPairs;
// Move to Background.js - Chrome api does not work well in content_scripts
// https://stackoverflow.com/questions/24024682/google-chrome-exstension-chrome-tabs-onupdated-addlistener
chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    var url = tab[0].url;
    // var url = tab.url;
    // var url = changeInfo.url;
    window.console.log(url);
    var urlSplit = url.split('/');

    // grab info from chrome sync
    chrome.storage.sync.get({recentPairs},function(items){
      if (items.recentPairs) {
        recentPairs = items.recentPairs;  
      }
    });

    // if page was a trading pair, save it to recent pairs
    if(options.getTokenAddress(urlSplit[3]) && options.getTokenAddress(urlSplit[4])) {
      var pairs = [urlSplit[3], urlSplit[4]];
      recentPairs.push(pairs);
      chrome.storage.sync.set({
        'recentPairs': recentPairs
      });
      console.log(recentPairs);
      window.alert("here");
    }
    window.console.log('updated from contentscript');
  }
);
// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
//     var urlSplit = url.split('/');

//     // grab info from chrome sync
//     chrome.storage.sync.get({recentPairs},function(items){
//       if (items.recentPairs) {
//         recentPairs = items.recentPairs;  
//       }
//     });

//     // if page was a trading pair, save it to recent pairs
//     if(options.getTokenAddress(urlSplit[3]) && options.getTokenAddress(urlSplit[4])) {
//       var pairs = [urlSplit[3], urlSplit[4]];
//       recentPairs.push(pairs);
//       chrome.storage.sync.set({
//         'recentPairs': recentPairs
//       });
//       console.log(recentPairs);
//     }
// });
