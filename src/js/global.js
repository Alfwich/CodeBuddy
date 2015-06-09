
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

// Returns a random own property from an object
var getRandomProperty = function( o ) {
  var result = "",
      properties = Object.keys( o );

  if( properties.length ) {
    result = properties[_.random(0,properties.length-1)]
  }
  
  return o[result];
}

var examples = {
  randomKey: function() {
    var keys = Object.keys( this );
    return keys[_.random(0,keys.length-1)];
  },

  get: function(k) {
    var result = "";

    if( typeof this[k] !== "undefined" ) {
      result = this[k].toString();
    }

    return result;
  },

  meal1: function meal1() {
    if( $globals["mealType"] !== "pork-meal" ) {
      doSomethingCool( "chicken" );
    } else {
      findANewJob( $this );
    }
  },

  meal2: function meal2() {
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

  meal3: function meal3(client,meal) {
    while( this.feedClient( client, meal ) <= 5.0 /* FOOD UNITS */ ) {
      console.log( "Feeding client; current level:", client.foodUnits );
    }

    client.requestPayment();
    client.eject();
  },

  vTest: function vTest(){
  /*
      1
      2
      3
      4
      5
      6
      7
      8
      9
      10
  */
  }
};

// Returns an array of all own properties for an object
var objToArray = function( obj ) {
  var result = [];

  for( var p in obj ) {
    result.push( obj[p] );
  }

  return result;
}




