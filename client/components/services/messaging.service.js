angular.module('chatApp')
       .factory('Messaging',[function(){
        var conversations = {};

        var imagePath = 'static/assets/60.jpeg';

        function addMessage(data){
            if(!angular.isUndefined(conversations[data.chat])){
                conversations[data.chat].what.push({message:data.message, from:data.from});
            }else{
                conversations[data.chat] = {
                    face : imagePath,
                    what: [{message:data.message, from:data.from}],
                    who: data.from,
                    when: new Date().getDate,
                    notes: data.message
                }
            }
        }

        return {
            addMessage : addMessage,
            getMessages : function(){return conversations;}
        }

    }]);