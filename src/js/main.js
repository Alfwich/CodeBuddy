// Create the main buddy which will init the controller
// Global application 

app = angular.module('codeBuddy', []);


function blurAll(){
 var tmp = document.createElement("input");
 document.body.appendChild(tmp);
 tmp.focus();
 document.body.removeChild(tmp);
}

