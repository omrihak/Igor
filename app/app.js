
var app = angular.module('managerApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/messages',
            {
                controller: 'MessagesController as controller',
                templateUrl: 'app/messagesManagement.html'
            });
        ////Define a route that has a route parameter in it (:customerID)
        //.when('/customerorders/:customerID',
        //    {
        //        controller: 'CustomerOrdersController',
        //        templateUrl: '/app/partials/customerOrders.html'
        //    })
        ////Define a route that has a route parameter in it (:customerID)
        //.when('/orders',
        //    {
        //        controller: 'OrdersController',
        //        templateUrl: '/app/partials/orders.html'
        //    })
        //.otherwise({ redirectTo: '/customers' });
});




