
app.controller('MessagesController', function ($scope, messagesService) {
    getAllMessages();

    function getAllMessages() {
        messagesService.getMessages().then(function (result) {
            $scope.messages = result;
        });
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
            "timeToShow": [
                {
                    "startDate": $scope.newMessage.startDate,
                    "endDate": $scope.newMessage.endDate
                }
            ],
            "screen": $scope.newMessage.screen
            ,
            "address": $scope.newMessage.address
        };
        $scope.messages.push(newMessage);

        //messagesService.insertMessage(newMessage).success(function(response){
        //    $scope.messages.push(newMessage);
        //});
    };

    $scope.deleteMessage = function (id) {
        //messagesService.deleteMessage(id).success(function(response){
        //for (var i = 0 ; i < $scope.message.length; i++) {
        //    if ($scope.message['id'] == id) {
        //        $scope.message.splice(i, 1);
        //        break;
        //    }
        //}
        //});
        for (var i = 0; i < $scope.messages.length; i++) {
            if ($scope.messages[i]['id'] == id) {
                $scope.messages.splice(i, 1);
                break;
            }
        }
    };
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
