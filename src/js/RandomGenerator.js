var RandomGenerator = function( maps, options ) {
  var result = "",
      i = 0;

  if( !options || typeof options.length !== "number" ) {
    options = {
      length: 50
    };
  };

  console.log( maps );

  while( i++ < options.length ) {
    var randomMap = maps[_.random(0,maps.length-1)];
    console.log( randomMap );
  }

  return result;
};
