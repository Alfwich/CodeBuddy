(function() {
  // Angular controllers
  app.controller('main', function($scope) {

    $scope.buddy = buddy = new CodeBuddy();
    $scope.currentFunction = null;
    $scope.loadingHandle = null;
    $scope.timerHandle = null;
    $scope.rawCode = "";
    $scope.examples = Object.keys( examples );
    $scope.codeInputArea = $("textarea.code.input");
    $scope.rawCodeArea = $("textarea.code.text");
    $scope.overlayCodeArea = $("textarea.code.overlay");
    $scope.startTime = new Date();
    $scope.keypressTime = new Date();

    $scope.actions = {
      "Clear Errors": function() {
        $scope.buddy.clearErrors();
      },

      "Reset": function() {
        $scope.reset();
      },

      "Generate Test": function() {
        $scope.changeFunction( RandomGenerator( objToArray( $scope.buddy.errors ) ) );
      }
    };

    $scope.reset = function() {
      $scope.buddy.clear();
      $scope.rawCodeArea[0].scrollTop = 0;
      $scope.overlayCodeArea.css( { "top" : "0px" } );
      clearTimeout( $scope.loadingHandle );
      $scope.loadingHandle = null;
      $scope.startTime = new Date();
      $scope.keypressTime = new Date();
    }

    $scope.changeFunction = function(text) {
      if( examples.get(text) != "" ) {
        $scope.currentFunction = text;
        text = examples.get(text); 
      } else {
        $scope.currentFunction = "test";
      }

      $scope.buddy.update( text );
      $scope.rawCode = buddy.rawCode;
      $scope.reset();
    }

    $scope.inputHasFocus = function() { 
      return document.activeElement === $scope.codeInputArea[0];
    };

    $scope.removeError = function( error ) {
      $scope.buddy.removeError( error );
    }

    $scope.scrollOverlay = function() {
      var delta = Number.parseInt( $scope.rawCodeArea.css("font-size") ),
          expected = $scope.rawCodeArea[0].scrollTop+delta,
          actual = 0;
      $scope.rawCodeArea[0].scrollTop += delta;

      actual = delta - (expected - $scope.rawCodeArea[0].scrollTop );
      var topPos = Number.parseInt( $scope.overlayCodeArea.css("top") );
      $scope.overlayCodeArea.css( { "top" : String( topPos-actual )+"px" } );
    }

    // Bind document keypress handler
    $( document ).bind( "keypress", function( e ) { 
      if( !$scope.inputHasFocus() ) {
        if( $scope.buddy.evalKeypress( e.keyCode ) ){
          $scope.keypressTime = new Date();
        }
        e.preventDefault();
        e.stopPropagation();

        // TODO: Refactor this logic
        if( !$scope.buddy.inErrorState && ( e.keyCode == 13 || e.keyCode == 10 ) ) {
          $scope.scrollOverlay();
        };

        // Check to see if the exercise is complete
        if( $scope.buddy.isComplete() ) {

          // Transition to next typing exercise
          $scope.loadingHandle = setTimeout( function() {
            $scope.loadingHandle = null;
            if( $scope.currentFunction == "test" ) {
              $scope.changeFunction( RandomGenerator( objToArray( $scope.buddy.errors) ) );
            } else if( $scope.currentFunction !== null ) {
              $scope.changeFunction( examples.randomKey() );
            } else {
              $scope.reset();
            }

            $scope.$apply();
          }, 3000);
        }
      }

      $scope.$apply();
    });

    // Bind input textarea changes 
    $( $scope.codeInputArea ).bind( "keyup paste", function( e ) {

      // Remove focus on esc keypress
      if( e.type == "keyup" && e.keyCode == 27 ) {
        blurAll();
      } else {
        buddy.update( $scope.rawCode );
        $scope.currentFunction = null;
      }

      if( e.type != "paste" ) {
        e.preventDefault();
      }

      e.stopPropagation();

      $scope.reset();
      $scope.$apply();
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

    // Manually update the timers. We use jQuery and an interval because we want angular to be able to do its own thing
    // while this is updating very frequently
    $scope.timerHandle = setInterval( function(){
      var cur = new Date();
      if( !$scope.buddy.isComplete() ) {
        $("#currentTime").text( String( +cur.getTime() - +$scope.startTime.getTime() ) );
        $("#keypressTime").text( String( +cur.getTime() - +$scope.keypressTime.getTime() ) );
      };
    }, 50 );

    // Init controller
    $scope.changeFunction( examples.randomKey() );
  });
})();
