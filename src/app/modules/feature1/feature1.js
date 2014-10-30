angular.module( 'ngmobile.feature1', [
        'ui.router'
    ])
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'feature1', {
            url: '/feature1',
            views: {
                "main": {
                    controller: 'Feature1Ctrl',
                    templateUrl: 'modules/feature1/feature1.tpl.html'
                }
            },
            data: {
                pageTitle: 'Feature1'
            }
        });
    })
    .controller( 'Feature1Ctrl', function($scope, $ionicLoading) {
        $scope.mapCreated = function(map) {
            $scope.map = map;
        };

        $scope.centerOnMe = function() {
            console.log('Centering');
            if (!$scope.map) {
                return;
            }

            $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $ionicLoading.hide();
            }, function(error) {
                console.log('Unable to get location: ' + error.message);
            });
        };
    })
    .directive('map', function() {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function($scope, $element, $attr) {
                function initialize() {
                    console.log('initializing map');

                    var mapOptions = {
                        center: new google.maps.LatLng(40.036808, -76.1100406),
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map($element[0], mapOptions);

                    $scope.onCreate({
                        map: map
                    });

                    // Stop the side bar from dragging when mousedown/tapdown on the map
                    google.maps.event.addDomListener($element[0], 'mousedown', function(e) {
                        e.preventDefault();
                        return false;
                    });
                }

                google.maps.event.addDomListener(window, 'load', initialize);
            }
        };
    });