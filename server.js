var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoDB = require('mongodb');
var mongoClient = mongoDB.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/advertisements';
var users = [];
var messagesCollection;
mongoClient.connect(mongoUrl, function(err, db) {
    if (err) {
        console.log("Problem with connecting to mongodb. " + err);
    } else {
        messagesCollection = db.collection('messages');
        console.log("Connected correctly to server.");
    }
});

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get("/screen=:screen", function(request, response) {
    response.sendfile(__dirname + "/clientApp/main.html")
});

app.get("/manager", function(request, response) {
    response.sendfile(__dirname + "/managerApp/manager.html")
});

app.get("/graphs", function(request, response) {
    response.sendfile(__dirname + "/d3App/graphs.html")
});

app.get("/messages/screen=:screen", function(request, response) {
    messagesCollection.find({screen: parseInt(request.params.screen)}).toArray(function (err, messages) {
        response.json(messages);
        response.end();
    });
});

app.get("/messages", function(request, response) {
    messagesCollection.find().toArray(function (err, messages) {
        response.json(messages);
        response.end();
    });
});

app.get("/messages/:messageId", function(request, response) {
    messagesCollection.find({id: parseInt(request.params.messageId)}).toArray(function (err, message) {
        if (err) {
            console.log("Problem get message from mongodb: " + err);
        } else {
            console.log("Success get message from mongodb");
        }
        response.json(message);
        response.end();
    });
});

app.post("/messages", function(request, response) {
    var newMessage = request.body;
    messagesCollection.find({}, {id: 1, _id: 0}).sort({id: -1}).limit(1).toArray(function (err, maxId) {
        var newId = maxId[0].id + 1;
        newMessage['id'] = newId;

        messagesCollection.insertOne(newMessage, function (err, result) {
            if (err) {
                console.log("Problem add new message to mongodb: " + err);
            } else {
                console.log("Success add new message to mongodb");
            }

            for (var i = 0; i < users.length; i++) {
                if (users[i].screenId == parseInt(newMessage['screen'])) {
                    users[i].emit('newMessage', newMessage);
                }
            }

            response.write(newId.toString());
            response.end();
        });
    });
});

app.post("/messagesFilter1", function(request, response) {
    var filterData = {};

    if (request.body.duration && parseInt(request.body.duration)) {
        filterData.duration = {$gt: parseInt(request.body.duration)};
    }

    if (request.body.name) {
        filterData.name = {$regex: ".*" + request.body.name + ".*"};
    }

    if (request.body.screen && parseInt(request.body.screen)) {
        filterData.screen = parseInt(request.body.screen);
    }

    messagesCollection.find(filterData).toArray(function (err, message) {
        if (err) {
            console.log("Problem get messages from mongodb: " + err);
        } else {
            console.log("Success get messages from mongodb");
        }
        response.json(message);
        response.end();
    });
});


app.post("/messagesFilter2", function(request, response) {
    var filterData = {};

    if (request.body.texts && parseInt(request.body.texts)) {
        filterData.texts = {$size: parseInt(request.body.texts)};
    }

    if (request.body.pictures && parseInt(request.body.pictures)) {
        filterData.pictures = {$size: parseInt(request.body.pictures)};
    }

    if (request.body.address && request.body.address) {
        filterData.address = {$regex: ".*" + request.body.address + ".*"};
    }

    messagesCollection.find(filterData).toArray(function (err, message) {
        if (err) {
            console.log("Problem get messages from mongodb: " + err);
        } else {
            console.log("Success get messages from mongodb");
        }
        response.json(message);
        response.end();
    });
});

app.put("/messages/:messageId", function(request, response) {
    var updatedMessage = request.body;

    updatedMessage._id = mongoDB.ObjectID.createFromHexString(updatedMessage._id);

    messagesCollection.updateOne({id: parseInt(request.params.messageId)}, updatedMessage, function (err, result) {
        console.log("update result:. " + result);

        if (err) {
            console.log("Problem update message in mongodb: " + err);
        } else {
            console.log("Success update message in mongodb");
        }

        for (var i = 0; i < users.length; i++) {
            if (users[i].screenId == updatedMessage.screen) {
                users[i].emit('updateMessage', updatedMessage);
            }
        }

        response.end();
    })
});

app.delete("/messages/:messageId", function(request, response) {
    var newMessage = request.body;

    messagesCollection.find({id: parseInt(request.params.messageId)}, {screen: 1}).toArray(function (err, message) {
        messagesCollection.deleteOne({id: parseInt(request.params.messageId)}, function (err, result) {
            if (err) {
                console.log("Problem delete message from mongodb: " + err);
            } else {
                console.log("Success delete message from mongodb");
            }

            for (var i = 0; i < users.length; i++) {
                if (users[i].screenId == message[0]['screen']) {
                    console.log(message[0]['screen']);
                    users[i].emit('deleteMessage', request.params.messageId);
                }
            }

            response.end();
        });
    });
});

app.get('/amountMessagesPerScreen', function(request, response) {
    messagesCollection.aggregate([
        {"$group": {_id: "$screen", count: {$sum: 1}}}
    ]).toArray(function (err, message) {
        if (err) {
            response.write(err);
            response.end();
        } else {
            console.log(message);
            response.json(message);
            response.end();
        }
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('addUser', function (screenId) {
        socket.screenId = screenId;
    });
    users.push(socket);
});

server.listen(8081);
app.listen(8080);
console.log("server is up");