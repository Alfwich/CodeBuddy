var CodeBuddy = function( defaultText ) {
  this.rawCode = "";
  this.passedCode = "";
  this.inErrorState = false;
  this.codePos = 0;
  this.errorMap = {};
  this.transitionMap = {};

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
  } else {
    // Record the error stroke and that an error transition occured
    acquire( this.errorMap, String.fromCharCode( keyCode ), { 
      val: String.fromCharCode( keyCode ), 
      occ: 0
    }).occ++;

    if( this.codePos ) {
      acquire( this.transitionMap, this.rawCode[this.codePos-1]+this.rawCode[this.codePos], {
        lhs: this.rawCode[this.codePos-1],
        rhs: this.rawCode[this.codePos],
        val: this.rawCode[this.codePos-1] + this.rawCode[this.codePos],
        occ: 0
      }).occ++;
    }
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
  this.errorMap = {};
  this.transitionMap = {};
};
