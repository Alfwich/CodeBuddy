var CodeBuddy = function( defaultText ) {
  this.rawCode = "";
  this.passedCode = "";
  this.inErrorState = false;
  this.codePos = 0;
  this.maps = {};
  this.delayErrorTimeout = null;

  if( localStorage ) {
    var cachedMap = localStorage.getItem( "CodeBuddy.errorMap" );
    if( cachedMap ) {
      this.maps = JSON.parse( cachedMap );
      // Remove Angular ID fields from the saved error entries
      for( var k in this.maps ) {
        delete this.maps[k]["$$hashKey"];
      }
    }
  }

  if( defaultText ) {
    this.update( defaultText );
  }
};

CodeBuddy.prototype.leader = "_";

CodeBuddy.prototype.update = function( text ) {
  this.rawCode = this.formatText( text );
  this.passedCode = "";
  this.codePos = 0;
  this.inErrorState = false;
};

CodeBuddy.prototype.formatText = function( text ) {
  return this.replaceTabs( text );
};

CodeBuddy.prototype.replaceTabs = function( text ) {
  return text.replace( /\t/g, "  " );
};

CodeBuddy.prototype.processChar = function( c ) {
    this.passedCode = this.passedCode.substr(0,this.passedCode.length-1) + c + CodeBuddy.prototype.leader;
}

CodeBuddy.prototype.processKeypress = function( keyCode ) {
  var result = false;

  if( keyCode == this.rawCode.charCodeAt(this.codePos) ) {
    // Add the correct char to the end of the passedCode string with the static leader
    this.processChar( this.rawCode[this.codePos++] );
    result = true;

    // Delay error
    clearInterval( this.delayErrorTimeout );

    // Set a delay error timeout if we are not at the end of the input
    if( !this.isComplete() ) {
      this.delayErrorTimeout = setInterval( function() {
         acquire( this.maps, this.rawCode[ this.codePos ], { 
          val: this.rawCode[this.codePos], 
          type: "delay",
          occ: 0
        }).occ++;     
      }.bind(this), 500 );
    }

  } else {

    // Record the error stroke and that an error transition occured
    if( this.rawCode[this.codePos] != " " ) {
      acquire( this.maps, this.rawCode[ this.codePos ], { 
        val: this.rawCode[this.codePos], 
        type: "key",
        occ: 0
      }).occ++;
    }

    if( this.codePos && typeof this.rawCode[this.codePos] !== "undefined" && typeof this.rawCode[this.codePos+1] !== "undefined" && this.rawCode[this.codePos] != " " && this.rawCode[this.codePos+1] != " " ) {
      var transition = acquire( this.maps, this.rawCode[this.codePos]+this.rawCode[this.codePos+1], {
        val: this.rawCode[this.codePos] + this.rawCode[this.codePos+1],
        type: "transition",
        occ: 0
      });

      // Add a block error if the transition has occurance greater than 5
      if( ++transition.occ > 5 && this.codePos >= 2) {
        acquire( this.maps, this.rawCode.substr( this.codePos-2, 5 ), {
          val: this.rawCode.substr( this.codePos-2, 5 ),
          type: "block",
          occ: 0
        });
      }
    }

    localStorage.setItem( "CodeBuddy.errorMap", JSON.stringify( this.maps ) );
  }

  return result;
}

CodeBuddy.prototype.keyCodeTransform = function( keyCode ) {
  switch( keyCode ) {
    case 13:
      keyCode = 10;
    break;
  }

  return keyCode;
}

// Return if we are done with the available content
CodeBuddy.prototype.isComplete = function() {
  return !this.inErrorState && this.codePos >= this.rawCode.length;
}

CodeBuddy.prototype.postProcessEval = function(keyCode) {
  switch( keyCode ) {
    case 10:
    while( this.codePos < this.rawCode.length && this.rawCode[this.codePos] == ' ') {
      this.processChar( this.rawCode[this.codePos++] );
    }
    break;
  }
}

CodeBuddy.prototype.evalKeypress = function( keyCode ) {
  if( !this.isComplete() ) {
    // Apply any keycode transformation needed 
    keyCode = this.keyCodeTransform( keyCode );

    // process the keypress and set the error state
    this.inErrorState = !this.processKeypress( keyCode );

    // Perform special post-processing
    this.postProcessEval(keyCode);
    
  }
};

CodeBuddy.prototype.clear = function() {
  this.passedCode = "";
  this.codePos = 0;
};

CodeBuddy.prototype.clearErrors = function() {
  this.maps = {};
  localStorage.setItem( "CodeBuddy.errorMap", "{}" );
};
