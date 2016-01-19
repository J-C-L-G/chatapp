angular.module('chatApp')
.controller('mainContent.Controller', function ($scope) {

        var imagePath = 'static/assets/60.jpeg';

        $scope.messages = [{
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:58PM',
            notes: " I'll be in a home"
        }, {
            face : imagePath,
            what: 'Church this weekend?',
            who: 'Hohn Miller',
            when: '13:08PM',
            notes: " I'll be in your  doing houses"
        },
         {
            face : imagePath,
            what: 'Breakfast this weekend?',
            who: 'Anton Chan',
            when: '23:18PM',
            notes: " I'll be in a top po box"
        }];

});