angular.module('chatApp')
    .directive('onFinishRender',['$timeout','$location','$anchorScroll',
        function ($timeout, $location, $anchorScroll) {
            function updateLocation(idValue){
                $location.hash(idValue);
                $anchorScroll();
            }

            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            updateLocation(attr['idvalue']);
                        });
                    }
                }
            }
    }]);