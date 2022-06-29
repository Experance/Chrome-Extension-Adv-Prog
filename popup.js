/*
"use strict";
*/

var testing = false;
var websiteList = ["www.instagram.com", "www.facebook.com", "www.tiktok.com", "www.youtube.com"];
// the function below learned from https://www.thoughtco.com/and-in-javascript-2037515#:~:text=The%20dollar%20sign%20(%24)%20and,properties%2C%20events%2C%20and%20objects.

function $(x) {return document.getElementById(x);}

//document.addEventListener("DOMContentLoaded", main, false);
window.onload=function main() {
    // adds an array into the storage
    chrome.storage.sync.get("list", (result) => {
        if(typeof result.list === "undefined") {
            chrome.storage.sync.set({"list": websiteList});
            chrome.storage.sync.set({"startorstop": "true"});
        }
    });
    
    // preloads popup content 
    start(false);
    

    // opens settings
    $("settings").onclick = openOptions;
    
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

    
    // when clicking the start button
    $("startprocess").addEventListener("click", (event) => {
        console.log("successful");
        start(true);
    });
};



// a function to open settings
function openOptions() { 
    window.open("options.html");
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
                websiteList.push(holdURL);
                chrome.storage.sync.set({"list": websiteList});
                //https://developer.chrome.com/docs/extensions/mv3/messaging/

                chrome.runtime.sendMessage({addedWeb: true}, function(response) {
                console.log(response.answer);
                });
                 // on clicking submit, 
                $("inputtext").value = "";
                $("urlbutton").disabled = true;
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
    
    
   
}



function timePeriod() {
    var today = new Date();
    // commands: .getHours(), .getMinutes(), .getSeconds()
    // this is in 24 hour format
    var currentTime = today.getHours() + ":" + today.getMinutes();
    var inputedTime = document.querySelector('input[type="time"]');
    if (parseInt(today.getHours()) > 12) {
        if (parseInt(today.getHours()) > 21) {
            currentTime = parseInt(today.getHours) - 12 + ":" + today.getMinutes();
        } else {
            currentTime = "0" + parseInt(today.getHours) - 12 + ":" + today.getMinutes();
        }   
    }
    if(inputedTime.value === (today.getHours() + ":" + today.getMinutes())) {
        //stop blocking 
    }
}

var tempBreak = 30;
function breakTime() {
    
}

// function for when the start/stop button is clicked (also saves data after closure)
function start(name) {
    if (name) { 
        chrome.storage.sync.get("trueorfalse", (result) => {
            var placeHolder = result.trueorfalse;
            if (placeHolder === "true") {
                chrome.storage.sync.set({"trueorfalse": "false"});
                start(false);
            } else {
                chrome.storage.sync.set({"trueorfalse": "true"});
                start(false);
            }
        } );
        console.log("successfulx2");
    }
    // https://w3schools.com/jsref/dom_obj_style.asp
    var styleing = document.querySelector("#startprocess").style;
    chrome.storage.sync.get("trueorfalse", (result) => {
        console.log(result.trueorfalse);
        if (result.trueorfalse === "true") {
            $("startprocess").innerHTML = "Start";
            styleing.backgroundColor = "rgb(21, 192, 21)";
            styleing.color = "black";
            testing = false;
            document.querySelector(".overall").style.opacity = "1";
            chrome.storage.sync.set({"trueorfalse": "true"});
            console.log("successful TRUE");
        } else {    
            styleing.color = "white";
            styleing.backgroundColor = "red";

        
            //var styleing2 = document.querySelector("#startprocess:hover").style;
            //styleing.cssText = "#startprocess:hover {background-color: 'lightred'}";
            //styleing2.backgroundColor = "lightred";

            $("startprocess").innerHTML = "Stop";
            testing = true;
            document.querySelector(".overall").style.opacity = "0.5";
            chrome.storage.sync.set({"trueorfalse": "false"});
            console.log("successful FALSE");
        } 
    });
    
    
}


// messaging: https://developer.chrome.com/docs/extensions/mv3/messaging/
function sendMessage(website) {
    var port = chrome.runtime.connect({name: "transfer"});
    port.postMessage({websites: website});
    
    /*
    port.onMessage.addListener(function(msg) {
    if (msg.question === "Who's there?") {
        port.postMessage({answer: "Madame"});
    } else if (msg.question === "Madame who?") {
        port.postMessage({answer: "Madame... Bovary"});
    }
});
    */
}
