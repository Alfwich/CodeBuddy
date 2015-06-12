(function () {
    WinJS.Namespace.define( "CodeBuddy.Helpers", {
        // Allows us to provide a default implementation for a k=>v pair
        acquire : function (a, k, d) {
            var result = null;
            if (typeof a !== "undefined") {
                if (typeof a[k] === "undefined" && typeof d !== "undefined") {
                    a[k] = d;
                }
                result = a[k];
            }

            return result;
        },

        // Returns a random own property from an object
        getRandomProperty : function (o) {
            var result = "",
                properties = Object.keys(o);

            if (properties.length) {
                result = properties[_.random(0, properties.length - 1)]
            }

            return o[result];
        },

        // Converts an object into an array-like form
        objToArray : function( obj ) {
            var result = [];

            for( var p in obj ) {
                result.push( obj[p] );
            }

            return result;
        },

        listFindObject: function (list, ele) {
            for (var k in list) {

            }
        }

    });
})();
