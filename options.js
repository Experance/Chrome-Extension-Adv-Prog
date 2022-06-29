// javascript file sor the settings page
 
 /*
"use strict";
*/

function $(x) {return document.getElementById(x);}
var websiteList = ["www.instagram.com", "www.facebook.com", "www.tiktok.com", "www.youtube.com"];
window.onload=function() {
    printAllWebs();

    // for the tabs
    $("AbtPg").addEventListener("click", (event) => {
        openTabs(event, "AboutPage", "AbtPg");
    });
    $("WebBlk").addEventListener("click", (event) => {
        openTabs(event, "webblock", "WebBlk");
    });
    $("Setngs").addEventListener("click", (event) => {
        openTabs(event, "settings", "Setngs");
    });
    
    
    document.getElementById("AbtPg").click();
    // adds an array into the storage
    chrome.storage.sync.get("list", (result) => {
        if(typeof result.list === "undefined") {
            chrome.storage.sync.set({"list": websiteList});
            
        }
    });
    
    
    

    // input url button related stuff
    let inputButtonElement = $("inputtext");
    inputButtonElement.addEventListener("keyup", disabledButton);

    // once form / input data is "submitted"
    $("urlbutton").onclick = websiteInput;
    inputButtonElement.addEventListener("keyup", (event) => { 
        if ($("inputtext").click && event.code === "Enter") {
           
            websiteInput();
        }
    })  

    //clears all entries
    $("clear").onclick = clearAllEntries;

    receiveMessage();

}

function clearAllEntries() {
    chrome.storage.sync.clear("list");
    websiteList = ["www.instagram.com", "www.facebook.com", "www.tiktok.com", "www.youtube.com"];
    chrome.storage.sync.set({"list": websiteList});
    $("container").innerHTML = "";
    let line = document.createElement("hr");
    line.id = "line";
    $("container").appendChild(line)
    for (var i = 0; i < 4; i++) {
        addWebsList(websiteList[i]);
    }
    $("incorrect").innerHTML = "Please note, the first 4 entries are not removable";
}
// a function to disable or enable a function depending on text inside input box
function disabledButton() {
    if ($("inputtext").value == "") {
       $("urlbutton").disabled = true;
   } else if ($("inputtext").value != "") {
       $("urlbutton").disabled = false;
   }

   
}

// a function to deal with inputed data
function websiteInput() {
    $("incorrect").innerHTML = "";
    var holdURL = $("inputtext").value;
    // take data and put in database, put in options.html data list
    if (typeof(Storage) !== "undefined") {
        chrome.storage.sync.get("list", (result) => {
            if(chrome.runtime.error) {
                console.log("Runtime error.");
            } else if (typeof result.list === "undefined") {      
                console.log("result.list is undefined")    
            }                                              
            console.log(result.list);
            websiteList = result.list;
            if (holdURL.length >= 3) {
                $("incorrect").innerHTML = "";
                websiteList.push(holdURL);
                chrome.storage.sync.set({"list": websiteList});
                //https://developer.chrome.com/docs/extensions/mv3/messaging/

                chrome.runtime.sendMessage({addedWeb: true}, function(response) {
                console.log(response.answer);
                });
                 // on clicking submit, 
                $("inputtext").value = "";
                $("urlbutton").disabled = true;
                addWebsList(holdURL);
            } else {
                $("incorrect").innerHTML = "Please input an actual website.";
            }
            
        });
        
        /*
        localStorage.setItem(incrementNum().toString(), $("inputtext").value);
        // comment out below once you want to start adding stuff into localStorage
        localStorage.clear();
        // testing if storage works as expected, remove later
        $("hi").innerHTML = localStorageSize() + localStorage.getItem("8");
        */
    } else {
        //prob gotta use a txt file and traversing
    }
    // prints out websites onto page https://w3schools.com/js/js_htmldom_nodes.asp
    
   
  
}

// thx w3schools: https://www.w3schools.com/howto/howto_js_vertical_tabs.asp

function openTabs(event, tabName, buttonName) {
    
    var i, numOfTabs, btnClass;

    
   

    // makes the "active" attribute of each button to an empty string "" and more
    btnClass = document.getElementsByClassName("subtab");
    for (i = 0; i < btnClass.length; i++) {
        btnClass[i].style.fontWeight = "normal";
        btnClass[i].style.border = "none";
        btnClass[i].style.zIndex = "1";
        btnClass[i].className = btnClass[i].className.replace(" active", "");
    }
    document.getElementById(buttonName).style.zIndex = "4";  
    // makes every div of "subtabinfo" to have a display of none
    numOfTabs = document.getElementsByClassName("subtabinfo");
    for (i = 0; i < numOfTabs.length; i++) {
        numOfTabs[i].style.display = "none";
    }
    // makes the div of "subtabinfo" attributed to the specific button clicked
    // to have a display style of "blocked" and re-sets a className attribute of active
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
    
    
    
    var button = document.getElementById(buttonName).style;
    
    button.border = "0.1px solid black";
    button.borderRight = "white";
    button.fontWeight = "bold";
  
    //document.getElementById(tabName).style.zIndex = "1";
    //document.getElementById(buttonName).style.zIndex = "4";    
}


var temp = true;
// prints out websites onto page https://w3schools.com/js/js_htmldom_nodes.asp
function addWebsList(websites) {
    // below .remove needs to be fixed as its resulting in null after the first deletion
    (temp) ? $("nowebsites").remove() : temp;
    temp = false;
    const hr = document.createElement("hr");
    const span = document.createElement("span");
    const node = document.createTextNode(websites);
    span.appendChild(node);
   
    $("line").appendChild(span);
    const button = document.createElement("button");
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.backgroundImage = "url('trash.png')";
    $("line").appendChild(hr);
}

// messaging: https://developer.chrome.com/docs/extensions/mv3/messaging/
function receiveMessage() {
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name === "transfer");
        port.onMessage.addListener(function(msg) {
            addWebsList(msg.websites);
            console.log(msg.websites);
        });
    })
}

function printAllWebs() {
    chrome.storage.sync.get("list", (result) => {
        websiteList = result.list;
        for (var i = 0; i < websiteList.length; i++) {
            addWebsList(websiteList[i]);
        }
        /*
        if (websiteList.length <= 5) {
            for (var i = 0; i < 5 - websiteList.length; i++) {
                const br = document.createElement("br");
                $("container").appendChild(br);
            }
        }
        */
    })

}

