var database = require('./database.js').global;
var io = require('./server.js').socket;

var builder = {};
builder.callbackBuilder = function(response) {
    return {
        success: function (data) {
            response.json(data);
        },
        error: function (data) {
            response.json(data);
        }
    };
}

builder.callbackBuilder_errorHandle = function(response, request) {
    return {
        success: function (data) {
            try {
                response.send(data);
            }
            catch (err) {
                response.status(404).send('Cannot GET ' + request.url);
            }
        },
        error: function (data) {
            response.json(data);
        }
    };
}

builder.nodeIDMapBuilder = function() {
	return function (request, response) {
		var callback = builder.callbackBuilder_errorHandle(request, response);
		if (((request.query.param === 'device') || (request.query.param === 'name')) && (request.query.q != undefined))
			database.mapNodeID(request.query.param, decodeURIComponent(request.query.q)).then(callback.success, callback.error);
		else {
			response.send("Invalid lookup")
		}
	}
}

module.exports = builder;