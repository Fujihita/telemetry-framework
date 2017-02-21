var express = require('express');
var router = express.Router();
var builder = require('./builder.js')
var io = require('./server.js').socket;
var database = require('./database.js').global;

router.param('node', function (req, res, next, node) {
    req.node = node;
    next();
});
router.param('port', function (req, res, next, port) {
    req.port = port;
    next();
});

router.route('/profile')
    .get(function (request, response) {
        var callback = builder.callbackBuilder(response);
        if (request.query.id == null)
            database.getAllProfiles().then(callback.success, callback.error);
        else if (!isNaN(request.query.id))
            database.getProfile(request.query.id).then(callback.success, callback.error);
        else
            response.send("Profile not found");
    })
    .post(function (request, response) {
        var callback = builder.callbackBuilder(response);
        if (request.query.action === 'new')
            database.registerNode(request.body.DeviceID).then(callback.success, callback.error);
        else if (request.query.action === 'edit')
            database.updateNode(request.body).then(callback.success, callback.error);
        else
            response.status(400).send('Bad request');
    });

router.route('/data')
    .get(function (request, response) {
        var callback = builder.callbackBuilder(response);
        database.getAllReports().then(callback.success, callback.error);
    })
    .post(function (request, response) {
        var callback = builder.callbackBuilder(response);
        database.post(request.body).then(function(){response.send("Report received!");}, callback.error);
    });
router.get('/latest', function (request, response) {
    var callback = builder.callbackBuilder(response);
    database.getLatestReports().then(callback.success, callback.error);
});

router.get('/data/:node', function (request, response) {
    var callback = builder.callbackBuilder(response);
    database.getReportsFromNode(request.node).then(callback.success, callback.error);
});
router.get('/data/:node/:port', function (request, response) {
    var callback = builder.callbackBuilder_errorHandle(response, request);
    database.getReportsFromPort(request.node, request.port).then(callback.success, callback.error);
});
router.get('/latest/:node', function (request, response) {
    var callback = builder.callbackBuilder_errorHandle(response, request);
    database.getLatestFromNode(request.node).then(callback.success, callback.error);
});
router.get('/latest/:node/:port', function (request, response) {
    var callback = {
        success: function (data) {
            try {
                response.send(data[0].Reading);
            }
            catch (err) {
                response.status(404).send('Cannot GET ' + request.url);
            }
        },
        error: function (err) {
            console.log(err);
        }
    };
    database.getLatestFromPort(request.node, request.port).then(callback.success, callback.error);
});

router.get('/config/:node', function (request, response) {
    var callback = builder.callbackBuilder_errorHandle(response, request);
    database.getConfig(request.node).then(callback.success, callback.error);
});

router.post('/config', function (request, response) {
    var callback = builder.callbackBuilder(response);
    if (request.query.action === 'new')
        database.createConfig(request.body).then(callback.success, callback.error);
    else if (request.query.action === 'edit')
        database.updateConfig(request.body).then(callback.success, callback.error);
    else if (request.query.action === 'delete')
        database.deleteConfig(request.body).then(callback.success, callback.error);
    else
        response.status(400).send('Bad request');
});

router.get('/search', builder.nodeIDMapBuilder());

module.exports = router;