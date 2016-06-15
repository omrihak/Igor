
app.controller('MessagesController', function ($scope, $location, messagesService, images, templates) {
    $scope.filterScreenId = "";
    $scope.filterName = "";
    $scope.images = images;
    $scope.templates = templates;
    getAllMessages();

    function getAllMessages() {
        $scope.messages = messagesService.getMessages();
    } 

    $scope.insertMessage = function () {
        var newMessage = {
            name: $scope.newMessage.name, "texts": [
                $scope.newMessage.text1, $scope.newMessage.text2, $scope.newMessage.text3
            ], "pictures": [
                $scope.newMessage.image1,
                $scope.newMessage.image2
            ],
            "template": $scope.newMessage.template,
            "duration": $scope.newMessage.duration,
            "timeToShow": {
                "startDate": $scope.newMessage.startDate.toLocaleDateString('en-GB'),
                "endDate": $scope.newMessage.endDate.toLocaleDateString('en-GB')
            }
            ,
            "screen": $scope.newMessage.screen,
            "address": $scope.newMessage.address
        };

        messagesService.insertMessage(newMessage).then(function (successResponse) {
            newMessage.id = successResponse.data;
            $scope.messages.push(newMessage);
        }, function (errorResponse) {
            console.log('Error while insert to mongo db:' + errorResponse['data'])
        });

        resetTextBoxes();
    };

    $scope.deleteMessage = function (messageId) {

        messagesService.deleteMessage(messageId).then(function(successResponse){
            for (var i = 0 ; i < $scope.messages.length; i++) {
                if ($scope.messages[i]['id'] == messageId) {
                    $scope.messages.splice(i, 1);
                    break;
                }
            }
        }, function (errorResponse){
            console.log('Error while delete from mongo db:' + errorResponse['data'])
        });
    };

    function resetTextBoxes(){
        $scope.newMessage.name = '';
        $scope.newMessage.text1 = '';
        $scope.newMessage.text2 = '';
        $scope.newMessage.text3 = '';
        $scope.newMessage.image1 = '';
        $scope.newMessage.image2 = '';
        $scope.newMessage.template = '';
        $scope.newMessage.duration = '';
        $scope.newMessage.startDate = '';
        $scope.newMessage.endDate = '';
        $scope.newMessage.screen = '';
        $scope.newMessage.address = '';
    }
});

app.controller('EditMessageController', function ($scope, $routeParams, messagesService, images, templates) {
    $scope.images = images;
    $scope.templates = templates;

    getMessage();

    function getMessage() {
        messagesService.getMessageById($routeParams.id).then(function (result) {
            if (result.data.length == 0) {
                alert('There is no message with id' + $routeParams.id);
            } else {
                $scope.message = result.data[0];
                $scope.startDate = parseDMY($scope.message.timeToShow.startDate);
                $scope.endDate = parseDMY($scope.message.timeToShow.endDate);
                getMap();
            }
        });
    }

    $scope.updateMessage = function () {
        $scope.message.timeToShow.startDate = $scope.startDate.toLocaleDateString('en-GB');
        $scope.message.timeToShow.endDate = $scope.endDate.toLocaleDateString('en-GB');
        messagesService.updateMessage($scope.message.id, $scope.message);
        getMap();
    };

    function parseDMY(value) {
        var date = value.split("/");
        var d = parseInt(date[0], 10),
            m = parseInt(date[1], 10),
            y = parseInt(date[2], 10);
        return new Date(y, m - 1, d);
    }

    function getMap() {
        console.log(1);
        var mapOptions = {zoom: 12, mapTypeId: google.maps.MapTypeId.ROADMAP};

        var map = new google.maps.Map(angular.element(document.querySelector('#MapCanvas'))[0], mapOptions);

        setMarkers(map);
    };

    function setMarkers(map) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({'address': $scope.message.address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: $scope.message.name,
                    zIndex: 0
                });

            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
});
