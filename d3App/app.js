var app = angular.module('d3App', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'D3Controller as controller',
            templateUrl: 'd3App/graphs.html'
        });
});