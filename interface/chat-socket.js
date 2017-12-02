//don't forget to change this as well if you change the port on the back-end
var socket_io_lib = io.connect('http://192.168.0.102:1212');

//variables for selecting element
var message_box = document.getElementById('message-box');
var send_button = document.getElementById('send-button');
var username_box = document.getElementById('username-box');
var msg_stat = document.getElementById('is_writting');
var alert_error = document.getElementById('alert-error');
var ok_button = document.getElementById('ok_button');
var error_msg = document.getElementById('error_msg');
var overlay = document.getElementById('overlay');
var chat_window = document.getElementById('chat-window');
var choose_file = document.getElementById("choose-file");
var insert_picture = document.getElementById("insert-picture");
var message = document.getElementById("message");

//misc. variable
var image;

//shared function
function message_box_send() {
    if (username_box.value.length == 0) {
        overlay.style.visibility = 'visible';
        alert_error.style.visibility = 'visible';
        error_msg.innerHTML = '<strong> Username is empty ! </strong><br>';
    } else if (message_box.value.length < 5) {
        overlay.style.visibility = 'visible';
        alert_error.style.visibility = 'visible';
        error_msg.innerHTML = '<strong> Message must be <br> at least 5 characters ! </strong><br>';
    } else {
        socket_io_lib.emit('message_data', {
            username: username_box.value,
            message: message_box.value,
        });
    }
}

function image_send(data_base64) {
    socket_io_lib.emit('image_data', {
        username: username_box.value,
        picture: data_base64
    });
}

function message_box_clear() {
    message_box.value = '';
    message_box.blur();
}

//send button
//send button on click action
send_button.addEventListener('click', function() {
    message_box_send();
    message_box_clear();
});

//message button
//input image button
insert_picture.addEventListener('click', function() {
    if (username_box.value.length == 0) {
        overlay.style.visibility = 'visible';
        alert_error.style.visibility = 'visible';
        error_msg.innerHTML = '<strong> Username is empty ! </strong><br>';
    } else {
        choose_file.click();
    }
})

choose_file.addEventListener('change', function() {
    var file = choose_file.files[0];
    var reader = new FileReader();

    reader.onload = function() {
        image_send(reader.result);
    }
reader.readAsDataURL(file);
})

//on enter key pressed
message_box.addEventListener('keypress', function(key_pressed) {
    if (key_pressed.keyCode == 13) {
        message_box_send();
        message_box_clear();
    }
})

username_box.addEventListener('keypress', function(key_pressed) {
    if (key_pressed.keyCode == 13) {
        message_box.focus();
    }
})

//on focusin
message_box.addEventListener('focusin', function() {
    socket_io_lib.emit('writting', {
        writting: '<i>' + username_box.value + ' is writting....</i>'
    });
});

//on focusout
message_box.addEventListener('focusout', function() {
    socket_io_lib.emit('writting', {
        writting: ''
    });
});

//token-windows stuff

//ok button
//on click
ok_button.addEventListener('click', function() {
    alert_error.style.visibility = 'hidden';
    overlay.style.visibility = 'hidden';
});

//soccket.io stuff
//receive data
socket_io_lib.on('message_data', function(data) {
    message.innerHTML += '<span><strong>' + data.username + ': </strong>' + data.message + '</span>';
    chat_window.scrollTop = chat_window.scrollHeight;
});

socket_io_lib.on('image_data', function(data) {
    message.innerHTML += '<span><strong>'+ data.username +':'+'<img src="' + data.picture + '"></strong></span>';
    chat_window.scrollTop = chat_window.scrollHeight;
});

socket_io_lib.on('writting', function(data) {
    msg_stat.innerHTML = data.writting;
});