
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
    while( this.feedClient( client, meal ) <= 5.0 ) {
      console.log( "Feeding client; current level:", client.foodUnits );
    }

    client.requestPayment();
    client.eject();
  },

  gameLoop: function GameLoop() {
  	this.frame = this.frame.bind(this);
  	this.lastTime = 0;
    this.seconds = 0.2;
  	this.callback = function() {};
  },
  cacheType: function() {
    CacheSimulator.prototype.cacheType = function() {
      var cacheSimulator = this,
          result = 0;
    
      if( cacheSimulator.cacheSize == 1 ) {
        result = 2;
    
      } else if( cacheSimulator.setSize == cacheSimulator.cacheSize ) {
        result = 1;
    
      } else if( cacheSimulator.setSize != 1 ) {
        result = 0;
    
      } else {
        result = 2;
      }
    
      return result;
    }
  },
  
  objects : function(){
    var result = {
      tag : "",
      offset : 0,
      bitsForOffset : bitsForBlock,
      set : 0,
      bitsForSet : bitsForSet,
      raw : binAddress
    },
    tester = {
      favoriteColor: "Red",
      generalInterest: "Motorcycles",
      jackOfAllTrades: true,
      masterOfNone: true
    },
    fruits = {
      orange: { like: false, color: "orange" },
      apple:  { like: true, color: "red" },
      grapes: { like: true, color: "purple/green" }
    };
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




