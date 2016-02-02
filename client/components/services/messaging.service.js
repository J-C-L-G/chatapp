angular.module('chatApp')
       .factory('Messaging',[function(){
        var conversations = {};

        var imagePath = 'static/assets/60.jpeg';

        function addMessage(data){
            if(!angular.isUndefined(conversations[data.from])){
                conversations[data.from].what.push(data.message);
            }else{
                conversations[data.from] = {
                    face : imagePath,
                    what: [data.message],
                    who: data.from,
                    when: new Date(),
                    notes: data.message
                }
            }
        }

        return {
            addMessage : addMessage,
            getMessages : function(){return conversations;}
        }

    }]);