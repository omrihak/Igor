var clientApp = angular.module('clientApp', ['ngRoute']);

clientApp.controller('SwitchingMessagesController', function($routeParams, $http, $scope, $location){
    var index = -1;
    $scope.messages = [];
    $scope.messageToDisplay = {};


    getMessagesByScreen();

    function getMessagesByScreen(){
        var screenId = $location.absUrl().substr(-1 , 1);
        var url = "http://localhost:8080/messages/screen=" + screenId;
        $http.get(url).then(function(response){
            angular.forEach(response.data,function(message){
                $scope.messages.push(message);
            });

            scheduleMessages();
        });

        function scheduleMessages() {
            index = (index + 1) % $scope.messages.length;

            var durationToWait = showMessageIfInTime();
            setTimeout(scheduleMessages, durationToWait * 1000);
        }

        function showMessageIfInTime() {
            var currentMessageToDisplay;
            var message = $scope.messages[index];

            if (isItTimeToShowMessage(message.timeToShow)) {
                $scope.messageToDisplay = message;
                //loadMessageToHtmlPage(message);
                currentMessageToDisplay = message;
            }

            if (currentMessageToDisplay) {
                return (currentMessageToDisplay.duration);
            } else {
                return 0;
            }
        }

        function isItTimeToShowMessage(timesToShow) {
            var isItTime = false;
            var today = new Date();

            var startDate = convertStringToDate(timesToShow.startDate);
            var endDate = convertStringToDate(timesToShow.endDate);

            if (today >= startDate &&
                today <= endDate) {
                isItTime = true;
            }

            return isItTime;
        }

        function convertStringToDate(dateString) {
            if (dateString == '')
                return null;

            var parsedDate = new Date();
            parsedDate.setFullYear(dateString.substr(6, 4), dateString.substr(3, 2) - 1, dateString.substr(0, 2));

            return parsedDate;
        }

        function loadMessageToHtmlPage(adToShow) {
            $("#result").load(adToShow.template, function () {
                $.each(adToShow.texts, function (textIndex, text) {
                    $("#line" + (textIndex + 1)).html(text);
                });
                $.each(adToShow.pictures, function (pictureIndex, pictureRef) {
                    $("#image" + (pictureIndex + 1)).attr("src", pictureRef);
                });

                $("#messageId").html("Id:" + adToShow.id);

            });
        }
    }
});




