angular.module('socket', [])
.factory('socket', function () {
    var socket = io.connect('wss://telemetryapp.azurewebsites.net',{
    upgrade: true, transports: ['websocket']});
    return socket;
})