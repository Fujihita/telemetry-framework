angular.module('socket', [])
.factory('socket', function () {
    var socket = io.connect(process.env.WEBSOCKET_ADDRESS,{
    upgrade: true, transports: ['websocket']});
    return socket;
})