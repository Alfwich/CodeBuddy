(function() {
  // Angular controllers
  app.controller('main', function($scope) {

    $scope.buddy = buddy = new CodeBuddy();
    $scope.currentFunction = null;
    $scope.rawCode = "";
    $scope.examples = Object.keys( examples );
    $scope.codeInputArea = $("textarea.code.input");
    $scope.rawCodeArea = $("textarea.code.text");
    $scope.overlayCodeArea = $("textarea.code.overlay");

    $scope.actions = {
      "Clear Errors": function() {
        $scope.buddy.clearErrors();
      },

      "Reset": function() {
        $scope.buddy.clear();
        $scope.rawCodeArea[0].scrollTop = 0;
        $scope.overlayCodeArea.css( { "top" : "0px" } );
      },

      "Generate Test": function() {
        examples["test"] = RandomGenerator( objToArray( $scope.buddy.maps ) );
        $scope.changeFunction( "test" );
      }
    };

    $scope.changeFunction = function(k) {
      if( examples.get(k) != "" ) {
        $scope.currentFunction = k;
        $scope.buddy.update( examples.get( $scope.currentFunction ) );
        $scope.rawCode = buddy.rawCode;
        $scope.rawCodeArea[0].scrollTop = 0;
      }
    }

    $scope.inputHasFocus = function() { 
      return document.activeElement === $scope.codeInputArea[0];
    };

    $scope.removeError = function( error ) {
      $scope.buddy.removeError( error );
    }

    // Bind document keypress handler
    $( document ).bind( "keypress", function( e ) { 
      if( !$scope.inputHasFocus() ) {
        $scope.buddy.evalKeypress( e.keyCode );
        e.preventDefault();
        e.stopPropagation();
      }

      // TODO: Refactor this logic
      if( !$scope.inErrorState && ( e.keyCode == 13 || e.keyCode == 10 ) ) {
        var delta = Number.parseInt( $scope.rawCodeArea.css("font-size") ),
            expected = $scope.rawCodeArea[0].scrollTop+delta,
            actual = 0;
        $scope.rawCodeArea[0].scrollTop += delta;

        actual = delta - (expected - $scope.rawCodeArea[0].scrollTop );
        var topPos = Number.parseInt( $scope.overlayCodeArea.css("top") );
        $scope.overlayCodeArea.css( { "top" : String( topPos-actual )+"px" } );
      };

      $scope.$apply();
    });

    // Bind input textarea changes 
    $( $scope.codeInputArea ).bind( "keyup paste", function( e ) {

      // Remove focus on esc keypress
      if( e.type == "keyup" && e.keyCode == 27 ) {
        blurAll();
      } else {
        buddy.update( $scope.rawCode );
      }

      if( e.type != "paste" ) {
        e.preventDefault();
      }

      e.stopPropagation();

      $scope.$apply();
    });

    $($scope.rawCodeArea).on( "changed", function(e) {
      console.log( $scope.rawCodeArea[0].scrollHeight );
    });

    // Handle tabs
    $("body").on( "keydown", function(e) {
      if(e.keyCode == 9 ) { 
        e.preventDefault(); 
        if( $scope.inputHasFocus() ) {
          console.log( "Should tab input line" );
        } else {
          $scope.buddy.evalKeypress( 32 );
          $scope.buddy.evalKeypress( 32 );
        }
      } 
      $scope.$apply();
    });

    // Init controller
    $scope.changeFunction( examples.randomKey() );
  });
})();
