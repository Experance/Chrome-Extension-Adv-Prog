/*
if (window.location.hostname === "www.youtube.com/*") {
 
}
*/

//or

switch(window.location.hostname) {
    case "www.youtube.com":
        //this replaces the body of that page you're on
        document.body.innerHTML = "<p> Please Return to Studying, you will be alerted when it is break time </p>";
        setTimeout(window.close(), 10000)
        break;
}

