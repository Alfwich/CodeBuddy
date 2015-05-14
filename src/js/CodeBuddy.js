CodeBuddy = function( div ) {
  this.hasInit = false;
  this.outputDiv = div;

  this.codeInputArea = null;
  this.inputUpdateHandle = null;


  this.codeTextArea = null;
  this.codeOverArea = null;

  this.rawCode = "";
  this.passedCode = "";
  this.codePos = 0;
  this.errorMap = {};
  this.init();
};

CodeBuddy.prototype.initHandlers = function() {
  $( document ).bind( "keypress", this.handleUpdate.bind(this) );
  $( this.codeInputArea ).bind( "keyup paste", this.handleInput.bind( this ));
};


CodeBuddy.prototype.handleInput = function( e ) {


  clearTimeout( this.inputUpdateHandle );

  // Remove focus on esc keypress
  if( e.type == "keyup" && e.keyCode == 27 ) {
    blurAll();
  } else {
    this.inputUpdateHandle = setTimeout( (function() {
      this.update();
    }).bind(this), 500);
  }

  if( e.type != "paste" ) {
    e.preventDefault();
  }

  e.stopPropagation();
};

CodeBuddy.prototype.update = function( ) {
  this.rawCode = $( this.codeInputArea ).val();
  this.passedCode = "";
  $( this.codeTextArea ).val( this.rawCode );
  $( this.codeOverArea).val( this.passedCode );
  this.codePos = 0;
};

CodeBuddy.prototype.handleUpdate = function( e ) {
  // If the current active element is not the code input area then update the buddy state
  if( document.activeElement != this.codeInputArea[0] ) {
    // Match!
    if( e.keyCode == 13 ) {
      e.keyCode = 10;
    }
    console.log( e.keyCode );
    if( e.keyCode == this.rawCode.charCodeAt(this.codePos) ) {
      this.passedCode += this.rawCode[this.codePos++];
      $( this.codeOverArea).val( this.passedCode+"|" );
    } else {
      if( typeof this.errorMap[String.fromCharCode( e.keyCode )] === "undefined" ) {
        this.errorMap[String.fromCharCode( e.keyCode )] = 1;
      } else {
        this.errorMap[String.fromCharCode( e.keyCode )] += 1;
      };
    }

    e.preventDefault();
    e.stopPropagation();
  }

};

CodeBuddy.prototype.init = function() {
  if( !this.hasInit ) {
    this.outputDiv = $( "#" + this.outputDiv );
    if( this.outputDiv.length ) {
      this.hasInit = true;

      this.codeInputArea = $("<textarea>", {
        "class" : "code input",
        "placeholder" : "Paste your own text here..."
      });

      var containerDiv = $("<div>", {
        "class" : "code container"
      });

      this.codeTextArea = $("<textarea>", {
        "class" : "code text",
        "disabled" : true
      });

      this.codeOverArea = $("<textarea>", {
        "class" : "code over",
        "disabled" : true
      });

      $(this.outputDiv).append( this.codeInputArea, containerDiv.append( this.codeTextArea, this.codeOverArea ) );

      this.initHandlers();
    }
  }
};
