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
    }

    function scheduleMessages() {
        index = (index + 1) % $scope.messages.length;

        var durationToWait = showMessageIfInTime();
        setTimeout(scheduleMessages, durationToWait * 1000);
    }

    function showMessageIfInTime() {
        var durationTime = 0;
        var message = $scope.messages[index];

        if (isItTimeToShowMessage(message.timeToShow)) {
            $scope.messageToDisplay = message;
            $scope.$apply();
            durationTime = message.duration;
        }

        return durationTime;
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
});
