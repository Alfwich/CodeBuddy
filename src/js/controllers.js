(function() {
  // Angular controllers
  app.controller('main', function($scope) {

    $scope.currentFunction = examples.randomKey();
    $scope.buddy = buddy = new CodeBuddy( examples[$scope.currentFunction].toString() );
    $scope.rawCode = buddy.rawCode;

    $scope.codeInputArea = $("textarea.code.input");

    $scope.inputHasFocus = function() { 
      return document.activeElement === $scope.codeInputArea[0];
    };

    // Bind document keypress handler
    $( document ).bind( "keypress", function( e ) { 
      if( !$scope.inputHasFocus() ) {
        $scope.buddy.evalKeypress( e.keyCode );
        e.preventDefault();
        e.stopPropagation();
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
      }

      if( e.type != "paste" ) {
        e.preventDefault();
      }

      e.stopPropagation();

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
  });
})();
