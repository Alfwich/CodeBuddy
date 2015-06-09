
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

