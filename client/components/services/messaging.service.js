angular.module('chatApp')
       .factory('Messaging',[function(){
        var conversations = [];

        var imagePath = 'static/assets/60.jpeg';

        function findChatIndex(chatName){
            for( var index = 0; index < conversations.length ; index++){
                if(conversations[index].chat == chatName){
                    return index;
                }
            }
            return -1;
        }

        function getChatByName(chatName){
            var chatIndex = findChatIndex(chatName);
            return (chatIndex >= 0) ? conversations[chatIndex] : undefined ;
        }


        function addMessage(data){
            var chatIndex = findChatIndex(data.chat);
            if( chatIndex >= 0){
                conversations[chatIndex].updated = new Date().getTime();
                conversations[chatIndex].messages.push({message:data.message, from:data.from, date: data.date, isImage:data.isImage});
            }else{
                conversations.unshift({
                    chat : data.chat,
                    face : imagePath,
                    messages: (angular.isUndefined(data.message)) ? [] :[{message:data.message, from:data.from, date: data.date, isImage:data.isImage}],
                    updated : new Date().getTime()
                });
            }
            return true;
        }

        function clearChatByName(chatName){
            var index = findChatIndex(chatName);
            if(index >= 0){
                conversations.splice(index,1);
            }
        }

        function logout(){
            conversations.length = 0;
        }

        return {
            addMessage : addMessage,
            getConversations : function(){return conversations;},
            getChatByName : getChatByName,
            clearChatByName : clearChatByName,
            logout : logout
        }
    }]);