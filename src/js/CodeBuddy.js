CodeBuddy = function( ) {
  this.rawCode = "";
  this.passedCode = "";
  this.codePos = 0;
  this.errorMap = {};
};

CodeBuddy.prototype.update = function( text ) {
  this.rawCode = text;
  this.passedCode = "";
  this.codePos = 0;
};


CodeBuddy.prototype.evalKeypress = function( keyCode ) {
  if( keyCode == 13 ) {
    keyCode = 10;
  }

  if( keyCode == this.rawCode.charCodeAt(this.codePos) ) {
    this.passedCode =  this.passedCode.substr(0,this.passedCode.length-1) + this.rawCode[this.codePos++] + "_";
  } else {
    if( typeof this.errorMap[String.fromCharCode( keyCode )] === "undefined" ) {
      this.errorMap[String.fromCharCode( keyCode )] = 1;
    } else {
      this.errorMap[String.fromCharCode( keyCode )] += 1;
    };
  }

};

