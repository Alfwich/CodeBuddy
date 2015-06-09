
// Allows us to provide a default implementation for a k=>v pair
var acquire = function( a, k, d ) {
  var result = null;
  if( typeof a !== "undefined" ) {
    if( typeof a[k] === "undefined" && typeof d !== "undefined" ) {
      a[k] = d;
    }
    result = a[k];
  }

  return result;
};

var examples = {
  randomKey : function() {
    var keys = Object.keys( this );
    return keys[Math.round(Math.random()*(keys.length-1))];
  },

  meal1 : function meal1() {
    if( $globals["mealType"] !== "pork-meal" ) {
      doSomethingCool( "chicken" );
    } else {
      findANewJob( $this );
    }
  },

  meal2 : function meal2() {
    switch( sideDish ) {
      case "ham":
        console.log( "Oink" );
      break;
      case "coleslaw":
        console.log( ">??<" );
      break;
      case "beef":
        console.log( "moo!" );
      break;
    }

    return $global.beef;
  },
};
