//serial port
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("COM4", { baudrate: 9600 });
var data_value = '0.0';
// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server);
var port = process.env.PORT || 80;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//io.on('connection', function (socket) {
io.sockets.on('connection', function (socket) {
    socket.on('dato', function(data,callback){
        serialPort.write('DAT1%');
      console.log('request : '+ data_value);
      callback(data_value);
    });
    socket.on('led', function(data){
        var rsp = 'LED'+data[1]+data[2]+((data[3] == '1')?'ON':'OFF') + '%';
        console.log(rsp);
            serialPort.write(rsp);
                
    });
});
//serial port event
serialPort.on('data',function(data) { 
    if(!isNaN(parseFloat(data) && parseFloat(data) != data_value))
        data_value = String(data);
    if(isNaN(parseFloat(data)))
        console.log('valor invalido: '+ String(data));
});
