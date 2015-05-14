// Create the main buddy which will init the controller
$(document).ready( function() {
  buddy = new CodeBuddy( "code" );
});

function blurAll(){
 var tmp = document.createElement("input");
 document.body.appendChild(tmp);
 tmp.focus();
 document.body.removeChild(tmp);
}

