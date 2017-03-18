var express = require('express');
var app = express();
var https = require('https');
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.set('transports', ['websocket']);
io.on('connection', function (socket) {
    console.log('a user connected');
});
module.exports.socket = io;

var database = require('./database.js').global;
var router = require('./router.js');
var api_router = require('./api.js');

app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/partials', express.static(__dirname + '/views/partials'));
app.use('/', router);
app.use('/api', api_router);

server.listen(process.env.PORT || 1337);