
app.service('messagesService', function ($http, $q) {
    var baseUrl = "http://localhost:8080/";

    this.getMessages = function () {
        var defer = $q.defer();

        $http.get(baseUrl + 'messages').then(function(result){
            defer.resolve(result.data);
        });

        return defer.promise;
    };

    this.insertMessage = function (newMessage) {
        // insert to mongo db
    };
    //
    this.deleteMessage = function (id) {
        // delete from mongo db
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