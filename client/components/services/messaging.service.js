angular.module('chatApp')
       .factory('Messaging',[function(){
        var conversations = {};

        var imagePath = 'static/assets/60.jpeg';

        function addMessage(data){
            if(!angular.isUndefined(conversations[data.chat])){
                conversations[data.chat].updated = new Date().getTime();
                conversations[data.chat].messages.push({message:data.message, from:data.from});
            }else{
                conversations[data.chat] = {
                    chat : data.chat,
                    face : imagePath,
                    messages: [{message:data.message, from:data.from}],
                    updated : new Date().getTime()
                }
            }
        }

        return {
            addMessage : addMessage,
            getMessages : function(){return conversations;}
        }

    }]);