describe( 'AppCtrl', function() {
    console.log("test");

    describe( 'isCurrentUrl', function() {
        var AppCtrl, $location, $scope;

        beforeEach( module( 'ngmobile' ) );

        beforeEach( inject( function( $controller, _$location_, $rootScope ) {
            $location = _$location_;
            $scope = $rootScope.$new();
            AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
        }));

        it( 'should pass a dummy test', inject( function() {
            expect( AppCtrl ).toBeTruthy();
        }));
    });
});