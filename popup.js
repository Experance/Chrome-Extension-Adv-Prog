// the function below learned from https://www.thoughtco.com/and-in-javascript-2037515#:~:text=The%20dollar%20sign%20(%24)%20and,properties%2C%20events%2C%20and%20objects.
function $(x) {return document.getElementById(x);}

window.onload=function() {
    
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
};


// a functino to open settings
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
    // take data and put in database, put in options.html data list
    

    // on clicking submit, 
    $("inputtext").value = "";
    $("urlbutton").disabled = true;
}

