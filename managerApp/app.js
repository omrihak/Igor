
var app = angular.module('managerApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'MessagesController as controller',
                templateUrl: 'managerApp/messagesManagement.html'
            })
			.when('/:id',
            {
                controller: 'EditMessageController as controller',
                templateUrl: 'managerApp/editMessageManagement.html'
            });
});

app.value('images',[
    'clientApp/pictures/adele1.jpg',
    'clientApp/pictures/adele2.jpg',
    'clientApp/pictures/blue_pony.jpg',
    'clientApp/pictures/dino_heart.jpg',
    'clientApp/pictures/helloWorld.jpg',
    'clientApp/pictures/Igor_1.jpg',
    'clientApp/pictures/Igor_2.jpg',
    'clientApp/pictures/pink_pony.jpg',
    'clientApp/pictures/rainbow.jpg',
    'clientApp/pictures/unicorn.jpg'

]);

app.value('templates',[
    'clientApp/templates/templateA.html',
    'clientApp/templates/templateB.html',
    'clientApp/templates/templateC.html'
]);




