var CodeBuddy = function( defaultText ) {
  this.rawCode = "";
  this.passedCode = "";
  this.inErrorState = false;
  this.codePos = 0;
  this.errors = {};
  this.delayErrorTimeout = null;
  this.storageObject = localStorage;
  this.loadState();

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
    // Add the correct char to the end of the passedCode string with the static leader
    this.passedCode = this.passedCode.substr(0,this.passedCode.length-1) + c + CodeBuddy.prototype.leader;
}

CodeBuddy.prototype.generateError = function( type, val ) {
  return {
    type: type,
    val: val,
    occ: 0
  };
}

CodeBuddy.prototype.markError = function(type) {
  var val = "",
      result = null;

  switch(type) {
    case "delay":
    case "key":
      val = this.rawCode[this.codePos];
      break;

    case "transition":
      val = this.rawCode[this.codePos]+this.rawCode[this.codePos+1];
      break;

    case "block":
      val = this.rawCode.substr( this.codePos-1, 5 );
      break;

         
  };

  if( val ) {
    result = acquire( this.errors, val, this.generateError( type, val ) );
    result.occ++;
  }

  return result;
}

CodeBuddy.prototype.handleErrors = function( keyPressCorrect ) {
  if( keyPressCorrect ) {
    // Delay error
    clearTimeout( this.delayErrorTimeout );

    // Set a delay error timeout if we are not at the end of the input
    if( !this.isComplete() ) {
      this.delayErrorTimeout = 
        setTimeout( this.markError.bind( this, "delay" ), 1000 );
    }
  } else {

    // Record the error stroke and that an error transition occured
    if( !/undefined|\s/.test( this.rawCode[this.codePos] ) ) {
      this.markError( "key" );
    }

    if( this.codePos && 
        !/undefined|\s/.test( this.rawCode[this.codePos]+this.rawCode[this.codePos+1] )) {
      var transition = this.markError( "transition" );

      // Add a block error if the transition has occurance greater than 5
      if( transition.occ > 5 && this.codePos >= 2) {
        this.markError( "block" );
      }
    }

    this.saveState();
  }
}

CodeBuddy.prototype.processKeypress = function( keyCode ) {
  var result = false;

  if( keyCode == this.rawCode.charCodeAt(this.codePos) ) {
    this.processChar( this.rawCode[this.codePos++] );
    result = true;
  }

  this.handleErrors( result );

  return result;
}

CodeBuddy.prototype.saveState = function(){
  if( this.storageObject ) {
    this.storageObject.setItem( "CodeBuddy.errorMap", JSON.stringify( this.errors ) );
  } 
}

CodeBuddy.prototype.loadState = function() {
  if( this.storageObject ) {
    var cachedMap = this.storageObject.getItem( "CodeBuddy.errorMap" );
    if( cachedMap ) {
      this.errors = JSON.parse( cachedMap );

      // Remove Angular ID fields from the saved error entries
      for( var k in this.errors ) {
        delete this.errors[k]["$$hashKey"];
      }
    }
  } 
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
    case 13:
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

  return !this.inErrorState;
};

CodeBuddy.prototype.clear = function() {
  this.passedCode = "";
  this.codePos = 0;
};

CodeBuddy.prototype.clearErrors = function() {
  this.errors = {};
  this.saveState();
};

CodeBuddy.prototype.removeError = function(error) {
  delete this.errors[error.val];
  this.saveState();
}
