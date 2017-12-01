var exp_app = require('express');
var socket_io = require('socket.io');
var app = exp_app();

//server init
var port = process.env.PORT||80||443;
var listen_port = app.listen(port, function() {
    console.log('Server Started !!!!!');
    console.log('PORT OPENED ON : ' + port);
});

app.use(exp_app.static('interface'));

//socket.io init
var socket_transceiver = socket_io(listen_port);

socket_transceiver.on('connection', function(socket_io) {
    console.log('Connection engaged, socket created !');

    socket_io.on('message_data', function(data) {
        socket_transceiver.sockets.emit('message_data', data);
    })

    socket_io.on('writting', function(data) {
        socket_io.broadcast.emit('writting', data);
    })

    socket_io.on('image_data', function(data) {
        socket_transceiver.sockets.emit('image_data', data);
    })
})