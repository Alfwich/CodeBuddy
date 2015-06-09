var RandomGenerator = function( maps, options ) {
  var result = "",
      i = 0;

  if( !options || typeof options.length !== "number" ) {
    options = {
      length: 50
    };
  };

  // Remove empty map objects
  maps = maps.filter( function(ele){ return Object.keys(ele).length; } );

  if( maps.length ) {
    while( i++ < options.length ) {
      var randomMap = maps[_.random(0,maps.length-1)];
      var randomEntry = getRandomProperty( randomMap ); 
      result += result ? " " + randomEntry.val : randomEntry.val;
    }
  }

  return result;
};
