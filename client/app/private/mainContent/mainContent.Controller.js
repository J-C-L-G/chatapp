angular.module('chatApp')
.controller('mainContent.Controller', function ($scope, Socket, Sync) {

        //DUMMY IMPLEMENTATION

        var imagePath = 'static/assets/60.jpeg';

        $scope.messages = [{
            face : imagePath,
            what: 'Traes el poop',
            who: 'Contact 0',
            when: '3:58PM',
            notes: "Traes el poop"
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

        $scope.testMessage = function(){
            Socket.sendMessage(Sync.getActiveUser().contacts[0]._id,'traes el poop');
        }

});