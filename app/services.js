﻿
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
		console.log(messages);
		angular.forEach(messages, function(message){
			console.log(message.id);

			if(message.id == messageId){
				return message;
			}
		});

		//messages.forEach(function(message){
		//	console.log(message.id);
        //
		//	if(message.id == messageId)
		//	{
		//		console.log(12121);
		//		console.log(message);
        //
		//		return message;
		//	}
		//});
	};

    this.insertMessage = function (newMessage) {
		return $http.post(baseUrl, newMessage);
    };
    //
    this.deleteMessage = function (messageId) {
		return $http.delete(baseUrl + '/' + messageId);
    };

    //this.getCustomer = function (id) {
    //    for (var i = 0; i < customers.length; i++) {
    //        if (customers[i].id === id) {
    //            return customers[i];
    //        }
    //    }
    //    return null;
    //};

});