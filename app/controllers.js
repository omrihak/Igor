
app.controller('MessagesController', function ($scope, $location, messagesService, images, templates) {
    getAllMessages();

    function getAllMessages() {
        $scope.messages = messagesService.getMessages();
    }
	
	$scope.images = images;
	
	$scope.templates = templates;

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
            "timeToShow": [
                {
                    "startDate": $scope.newMessage.startDate.toLocaleDateString('en-GB'),
                    "endDate": $scope.newMessage.endDate.toLocaleDateString('en-GB')
                }
            ],
            "screen": $scope.newMessage.screen,
            "address": $scope.newMessage.address
        };

        messagesService.insertMessage(newMessage).then(function(successResponse){
			$scope.messages.push(newMessage);
        }, function (errorResponse){
			console.log('Error while insert to mongo db:' + errorResponse['data'])
		});
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
	
	//$scope.editMessage = function(id){
	//	$location.path('/messages/'+id);
	//};
});



app.controller('EditMessageController', function ($scope, $routeParams, messagesService, images, templates) {
	getMessage();

	$scope.images = images;

	$scope.templates = templates;

    function getMessage() {
		$scope.message = messagesService.getMessageById($routeParams.id);
		console.log($scope.message);

        //messagesService.getMessages().forEach(function(message){
		//	if(message.id == $routeParams.id)
		//	{
		//		$scope.message = message;
		//	}
		//});
    }
});

//
////This controller retrieves data from the customersService and associates it with the $scope
////The $scope is bound to the order view
//app.controller('CustomerOrdersController', function ($scope, $routeParams, customersService) {
//    $scope.customer = {};
//    $scope.ordersTotal = 0.00;
//
//    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
//    //one place...not required though especially in the simple example below
//    init();
//
//    function init() {
//        //Grab customerID off of the route
//        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
//        if (customerID > 0) {
//            $scope.customer = customersService.getCustomer(customerID);
//        }
//    }
//
//});
//
////This controller retrieves data from the customersService and associates it with the $scope
////The $scope is bound to the orders view
//app.controller('OrdersController', function ($scope, customersService) {
//    $scope.customers = [];
//
//    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
//    //one place...not required though especially in the simple example below
//    init();
//
//    function init() {
//        $scope.customers = customersService.getCustomers();
//    }
//});
//
//
////This controller is a child controller that will inherit functionality from a parent
////It's used to track the orderby parameter and ordersTotal for a customer. Put it here rather than duplicating
////setOrder and orderby across multiple controllers.
//app.controller('OrderChildController', function ($scope) {
//    $scope.orderby = 'product';
//    $scope.reverse = false;
//    $scope.ordersTotal = 0.00;
//
//    init();
//
//    function init() {
//        //Calculate grand total
//        //Handled at this level so we don't duplicate it across parent controllers
//        if ($scope.customer && $scope.customer.orders) {
//            var total = 0.00;
//            for (var i = 0; i < $scope.customer.orders.length; i++) {
//                var order = $scope.customer.orders[i];
//                total += order.orderTotal;
//            }
//            $scope.ordersTotal = total;
//        }
//    }
//
//    $scope.setOrder = function (orderby) {
//        if (orderby === $scope.orderby)
//        {
//            $scope.reverse = !$scope.reverse;
//        }
//        $scope.orderby = orderby;
//    };
//
//});
