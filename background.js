
// https://developer.chrome.com/docs/extensions/mv3/service_workers/ 

/**** WEEK 7 NOTES */

/*** sample 

chrome.runtime.onInstalled.addListener(() => { // this is an event
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
});

*/

// you can use different commands to recognize when the user does something i.e.
/* chrome.bookmarks.onCreated.addListener(() => { 
    // do something
    
    })
*/

// listeners shouldn't be registerd asynchronously, as they won't be properly triggered

// extensions can remove listeners from their background scripts by calling removeListener. If all 
// listeners for an event are removed, CHrome will no longer load the extension's background script
// for that event.

/*

//commands: a match to url (could be used for blockign websites by messageing the popup for the inputed
// website and then adding it):

cont filter = {
    url: [
        {
            urlMatches: "https://www.youtube.com/"
        },
    ],
};

*/

// unloading background scripts

/*
//first, store data periodically so info is not lost if an extensions crashes without receiving onSuspend:

chrome.storage.local.set({variable: variableInformation});

// if an extension uses message passing, make sure all ports are closed or else the background script 
// will not unload until all message ports have shut. runtime.Port.onDisconnect tells you when open ports are closing
//, manually close them with rntime.Port.disconnect

chrome.runtime.onMessage.addListener((message, callback) => {
    if (message === "hello") {
        sendResponse({greeting: "welcome!"}) 
    
        
    } else if (message === "goodbye") {
        chrome.runtime.Port.disconnect();
    }
});

*/



/*** WEEK 7 NOTES CONTINUED*/
//https://developer.chrome.com/docs/extensions/reference/storage/
// storage

/***
 chrome.storage.sync
  // methods
storage.sync.getBytesInUse() //returns how much of max total quota is being used
storage.StorageArea.get() // retries one or more items from teh storage area
storage.StorageArea.set() // stores one or more items in the storage area. If the item already exists, its value will be updated
storage.StorageArea.remove() // removes one or more items from the storage area
storage.StorageArea.clear() // removes all items from the storage area

  // usage
chrome.storage.sync.set({key: value}, function() {
    // the stored info is value
});

chrome.storage.sync.get(["key"], function(result) {
    result.key; // the value currently is result.key
})

  //onChanged -> detects changes to storage (storage updates)
 onChanged

 chrome.storage.onChanged.addListener(function (changes, namespace) {
     for (let [key, { oldValue, newValue}] of Object.entries(changes)) {
         console.log(
             `Storage key "" in namespace "" changed.`,
             `Old value was "", new value is "".`
         );
     }
 });
// Preload things from storage asynchronously example


 // Where we will expose all the data we retrieve from storage.sync.
const storageCache = {};

// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await initStorageCache;
  } catch (e) {
    // Handle error that occurred during storage initialization.
  }
  // Normal action handler logic.
});

// Reads all data out of storage.sync and exposes it via a promise.

function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}
 */
// ->>> Function body injected and executed as a content script as manifest.json is limited

/*****
 function injectedFunction() {
   // injects  some stuff i.e. document.body.style.backroundColor = "orange";

 }
  
 chrome.action.onClicked.addListener((tab) => {
   chrome.scripting.executescript({
     targe: { tabId: tab.id },
     function: injectedFuntion
   });
 });

 // https://developer.chrome.com/docs/extensions/mv3/content_scripts

 You can exclude and include different things, go in teh above link and scroll to about the middle
 */
 var websiteList = ["www.instagram.com", "www.facebook.com", "www.tiktok.com", "www.youtube.com"];

 // adds an array into the storage
chrome.storage.sync.get("list", (result) => {
  if(typeof result.list === "undefined") {
      chrome.storage.sync.set({"list": websiteList});
      chrome.storage.sync.set({"startorstop": "true"});
  }
});

 // adds manifest access to the extension
chrome.manifest = chrome.runtime.getManifest();


// for when the extension is first installed (from https://developer.chrome.com/docs/extensions/reference/tabs/)
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "options.html"
    });
  }
  // context menus: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Context_menu_items
  var contextMenuItem = {
      "id": "addWebsite",
      "title": "Add Website",
      "contexts": ["all"] //find a context that applies to taking the url of a webpage
  }

  chrome.contextMenus.create(contextMenuItem); // adds that context menu
});


/*
// listener for when the websiteList changes, so that the remove function can be run again
chrome.storage.onChanged.addListener(function (changes, namespace) {
  
});
*/


// to add functionality use an onClicked for when the contextMenu option part is clicked
chrome.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId == "addWebsite") {
    chrome.storage.sync.get("list", (value) => {
      
      websiteList = value.list;
      
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function(tabs) {
        var tab = tabs[0];
        holdURL = tab.url;
        
        if (typeof tab.url != null) {
          websiteList.push(tab.url);
          console.log(tab.url + "     onActivated");
          tabit = tab.id;
          chrome.storage.sync.set({"list": websiteList});
        }
      });
      
      loopInfo(1, false);
      
      //notification
      var added = {
        title: "Website Added",
        message: "This Webpage has been sucessfully added to your blocking list",
        iconUrl: "48.png",
        type: "basic"
      }
      chrome.notifications.create("addWebNotif", added, () => {});
    });
  }
});

// listener for a message from popup.js regarding whether a tab was added to the list
// https://developer.chrome.com/docs/extensions/mv3/messaging/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.addedWeb) {
      loopInfo(1, false);
      sendResponse({response: "successful"});
    }
    return true;
  }

);



/***
//            Accessing a Websites url (for regular javascript files)

//     Protocol + Domain + Page

document.URL
> "http://example.com/page1.html"

document.location.href
> "http://example.com/page1.html"

//     Protocol + Domain

document.location.origin
> "http://example.com"

//     Domain

document.location.host
> "example.com"

//     Page

document.location.pathname
> "/page1.html"

*/

chrome.storage.onChanged.addListener(function (changes, namespace) {
  loopInfo(1, false);
}); 

// function that does all the tab removal
function loopInfo(tabsid, trueorfalse) {
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query
 
  let querying = chrome.tabs.query({lastFocusedWindow: true, active: true});
  querying.then((tabs) => {
    chrome.storage.sync.get("list", (value) => {
      var websiteList = value.list;
      console.log(String(holdURL) + "1");
        for (var i = 0; i < websiteList.length; i++) {
          console.log("It is looping..." + "2");
          
          if (String(holdURL).includes(websiteList[i]) || websiteList[i].includes(String(holdURL))) {
            chrome.storage.sync.get("trueorfalse", (result) => {
              if (result.trueorfalse === "false") {
                if (trueorfalse) {
                  chrome.tabs.remove(parseInt(tabsid));
              
                }
                chrome.tabs.remove(parseInt(tabit));
                console.log("It worked!!!!!!!!!!!!!" + "3");

                //setTimeout(chrome.tabs.remove(getCurrentTab.tabID), 11000);
              }
            });
            
            
          }
        }
    });
  }, () =>{});

}
// var's holding url and tab id
var holdURL;
var tabit;

// get id and url when a page is first loading/when you move to a pre-loaded tab, 
// then calls the function that removes tabs
chrome.tabs.onActivated.addListener((event) => {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    holdURL = tab.url;
    console.log(tab.url + "     onActivated");
    tabit = event.tabId;
  });

  
  setTimeout(() => {loopInfo(1, false);}, 1500);
  
} );

// get id and url when a page is reloaded, or when the url is changed, 
// then calls the function that removes tabs
chrome.tabs.onUpdated.addListener((tabsid, changeInfo, tab) => {
  console.log(changeInfo.status);
  if (changeInfo.status == "complete") {
    
    var tempId = tabsid;
    holdURL = tab.url;
    console.log(tab.url + "     onUpdated");

    loopInfo(tempId, true);
  }
});

/**** 
       Week 8 notes
// chrome.tabs  (https://developer.chrome.com/docs/extensions/reference/tabs/))

//open extension page in a new tab
chrome.tabs.create({
  url: "onboarding.html"
})

chrome.tabs.remove(
  tabIds: number | number[], //the tab ID or list of tab IDs to close
  callback?: function,
)



*/
