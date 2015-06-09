var RandomGenerator = function( errors, options ) {
  var result = [ "" ] ,
      i = 0;

  if( !options || typeof options.length !== "number" ) {
    options = {
      length: 50
    };
  };

  // Remove empty map objects

  if( errors.length ) {

    var totalWeight = errors.reduce( function(a,b){ 
      // a can either be the first object or the raw value being computed
      return (typeof a === "object"?a.occ:a) + (b?b.occ:0);
    });

    while( i++ < options.length ) {
      var randomEntry = _.random(totalWeight),
          j = -1;

      while( randomEntry > 0 || j < 0 ) {
        randomEntry -= errors[++j].occ;
        if( typeof errors[j] === "undefined" ) { j = 0; }
      }

      result[result.length-1] += errors[j].val;

      // Add spaces randomly
      if( Math.random() < 0.5 ) {
        result[result.length-1] += " ";
      }

      // Add a new line if the line is greater than 45 characters
      if( result[result.length-1].length > 65 ) {
        result.push("");
      }
    }
  }

  // combine the lines into the final text
  return result.join("\n");
};
