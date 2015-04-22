/**
 *
 * Created by zhuang on 4/21/2015.
 */

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var db_prefix_path = './db/';


var scheme = require(db_prefix_path + 'scheme.json');
var db, vendor, account, pur_operator, pay_condition;
for (var key in scheme) {
    if (scheme.hasOwnProperty(key)) {
        var db_name = scheme[key];
        eval(key + '=require("' + db_prefix_path + db_name.filename + '")')
    }
}

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('db_require', function () {
        for (var index=0; index < db.length; index++) {
            socket.emit('item_response', db[index]);
        }
        //socket.emit('db_response',db)
    });
    socket.on('operator_require', function () {
        socket.emit('operator_response', pur_operator)
    });
    socket.on('inputing', function (inputing_msg) {
        socket.broadcast.emit('inputing_msg', inputing_msg)
    });
    socket.on('add_item', function (item) {
        db.push(item);
        io.emit('item_response', item);
    })
});

http.listen(80, function () {
    console.log('listening on *:80');
});

