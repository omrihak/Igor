var socket = io.connect('http://localhost:8081');

socket.on('connect', function () {
    socket.emit('addUser', screen);
});

socket.on('newMessage', function (newMessage) {
    messages.push(newMessage);
});

socket.on('updateMessage', function (updatedMessage) {
    $.each(messages, function (index, message) {
        if (message['id'] == updatedMessage['id']) {
            messages.splice(index, 1);
            messages.push(updatedMessage);

        }
    });
});

socket.on('deleteMessage', function (messageId) {
    $.each(messages, function (index, message) {
        if (message['id'] == messageId) {
            messages.splice(index, 1);
        }
    });
});