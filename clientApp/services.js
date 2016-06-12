app.service('messagesService', function ($http, $q) {
    var baseUrl = "http://localhost:8080/messages";
    var messages = [];

    initMessages();

    function initMessages(){
        $http.get(baseUrl).then(function(result){
            result.data.forEach(function(message){
                messages.push(message);
            });
        });
    };


    this.getMessages = function () {
        return messages;
    };

    this.getMessageById = function (messageId) {
        return $http.get(baseUrl + '/' + messageId);
    };

    this.insertMessage = function (newMessage) {
        return $http.post(baseUrl, newMessage);
    };
    //
    this.deleteMessage = function (messageId) {
        return $http.delete(baseUrl + '/' + messageId);
    };

    this.updateMessage = function (messageId, updatedMessage) {
        return $http.put(baseUrl+ '/' + messageId, updatedMessage);
    };
});