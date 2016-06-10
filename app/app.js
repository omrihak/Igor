
var app = angular.module('managerApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/messages',
            {
                controller: 'MessagesController as controller',
                templateUrl: 'app/messagesManagement.html'
            })
			.when('/messages/:id',
            {
                controller: 'EditMessageController as controller',
                templateUrl: 'app/editMessageManagement.html'
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

app.value('images',[
    'pictures/adele1.jpg',
    'pictures/adele2.jpg',
    'pictures/blue_pony.jpg',
    'pictures/dino_heart.jpg',
    'pictures/helloWorld.jpg',
    'pictures/Igor_1.jpg',
    'pictures/Igor_2.jpg',
    'pictures/pink_pony.jpg',
    'pictures/rainbow.jpg',
    'pictures/unicorn.jpg'

]);

app.value('templates',[
    'templates/templateA.html',
    'templates/templateB.html',
    'templates/templateC.html'
]);




