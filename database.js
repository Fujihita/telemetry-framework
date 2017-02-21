var shared = {};

var Connection = require('tedious').Connection;
var config = {
    userName: process.env.SQL_SERVER_LOGIN_NAME,
    password: process.env.SQL_SERVER_LOGIN_PWD,
    server: process.env.SQL_SERVER_URL,
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: true, database: process.env.SQL_SERVER_DATABASE }
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log('debug: ', err);
});

function createQuery() {
    var SQL = {
        'payload': {},
        'query': '',
        'select': function (resolve, reject) {
            var data = [];
            var Request = require('tedious').Request;
            var TYPES = require('tedious').TYPES;
            request = new Request(SQL.query, function (err, rowCount) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
            request.on('row', function (columns) {
                var element = {};
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        element[column.metadata.colName] = column.value;
                    }
                });
                data.push(element);
            });
            try {
                request.addParameter('Value1', TYPES.VarChar, SQL.payload.Value1);
            }
            catch (err) {
                console.log(err);
            }
            try {
                request.addParameter('Value2', TYPES.VarChar, SQL.payload.Value2);
            }
            catch (err) {
                console.log(err);
            }
            connection.execSql(request);
        },
        'post': function (resolve, reject) {
            var Request = require('tedious').Request;
            var TYPES = require('tedious').TYPES;
            request = new Request(SQL.query, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            console.log(SQL.payload);
            try {
                request.addParameter('NodeID', TYPES.Int, SQL.payload.NodeID);
                request.addParameter('Port', TYPES.TinyInt, SQL.payload.Port);
                request.addParameter('Reading', TYPES.VarChar, SQL.payload.Reading);
                request.addParameter('Latitude', TYPES.VarChar, SQL.payload.Latitude);
                request.addParameter('Longtitude', TYPES.VarChar, SQL.payload.Longtitude);
                request.addParameter('Altitude', TYPES.VarChar, SQL.payload.Altitude);
            }
            catch (err) {
                console.log(err);
            }
            console.log(request);
            connection.execSql(request);
        },
        'update': function (resolve, reject) {
            var Request = require('tedious').Request;
            var TYPES = require('tedious').TYPES;
            request = new Request(SQL.query, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            try {
                request.addParameter('NodeID', TYPES.Int, SQL.payload.NodeID);
                request.addParameter('DeviceID', TYPES.VarChar, SQL.payload.DeviceID);
                request.addParameter('NodeName', TYPES.VarChar, SQL.payload.NodeName);
                request.addParameter('Latitude', TYPES.VarChar, SQL.payload.Latitude);
                request.addParameter('Longtitude', TYPES.VarChar, SQL.payload.Longtitude);
                request.addParameter('Altitude', TYPES.VarChar, SQL.payload.Altitude);
            }
            catch (err) {
                console.log(err);
            }
            connection.execSql(request);
        },
        'config': function (resolve, reject) {
            var Request = require('tedious').Request;
            var TYPES = require('tedious').TYPES;
            request = new Request(SQL.query, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
            try {
                request.addParameter('NodeID', TYPES.Int, SQL.payload.NodeID);
                request.addParameter('Port', TYPES.TinyInt, SQL.payload.Port);
                request.addParameter('Cycle', TYPES.Int, SQL.payload.Cycle);
                request.addParameter('Class', TYPES.VarChar, SQL.payload.Class);
                request.addParameter('Unit', TYPES.VarChar, SQL.payload.Unit);
            }
            catch (err) {
                console.log(err);
            }
            connection.execSql(request);
        }
    }

    return {
        'getAllReports': function () {
            SQL.query = 'SELECT * FROM db_datawriter.reports';
            return makePromise(SQL.select);
        },
        'getLatestReports': function () {
            SQL.query = 'SELECT * FROM (SELECT *, row_number() OVER (PARTITION BY NodeID, Port ORDER BY Tstamp DESC) rn FROM db_datawriter.reports) t1 WHERE rn = 1';
            return makePromise(SQL.select);
        },
        'getReportsFromNode': function (nodeID) {
            SQL.payload = { Value1: nodeID };
            SQL.query = 'SELECT * FROM db_datawriter.reports WHERE NodeID = @Value1';
            return makePromise(SQL.select);
        },
        'getReportsFromPort': function (nodeID, port) {
            SQL.payload = { Value1: nodeID, Value2: port };
            SQL.query = 'SELECT * FROM db_datawriter.reports WHERE NodeID = @Value1 AND Port = @Value2';
            return makePromise(SQL.select);
        },
        'getLatestFromNode': function (nodeID) {
            SQL.payload = { Value1: nodeID };
            SQL.query = 'SELECT * FROM (SELECT *, row_number() OVER (PARTITION BY NodeID, Port ORDER BY Tstamp DESC) rn FROM db_datawriter.reports) t1 WHERE rn = 1 AND NodeID = @Value1';
            return makePromise(SQL.select);
        },
        'getLatestFromPort': function (nodeID, port) {
            SQL.payload = { Value1: nodeID, Value2: port };
            SQL.query = 'SELECT * FROM (SELECT *, row_number() OVER (PARTITION BY NodeID, Port ORDER BY Tstamp DESC) rn FROM db_datawriter.reports) t1 WHERE rn = 1 AND NodeID = @Value1 AND Port = @Value2';
            return makePromise(SQL.select);
        },
        'getConfig': function (nodeID) {
            SQL.payload = { Value1: nodeID };
            SQL.query = 'SELECT NodeID, Port, Cycle, Class, Unit FROM db_datawriter.config WHERE NodeID = @Value1'; // required column order for client-side config parser
            return makePromise(SQL.select);
        },
        'post': function (payload) {
            SQL.payload = payload;
            SQL.query = 'EXECUTE db_datawriter.uspInsertReport @NodeID, @Port, @Reading, @Latitude, @Longtitude, @Altitude';
            return makePromise(SQL.post);
        },
        'getProfile': function (nodeID) {
            SQL.payload = { Value1: nodeID };
            SQL.query = 'SELECT * FROM db_datawriter.nodes WHERE NodeID = @Value1';
            return makePromise(SQL.select);
        },
        'getAllProfiles': function () {
            SQL.query = 'SELECT * FROM db_datawriter.nodes';
            return makePromise(SQL.select);
        },
        'mapNodeID': function (parameter, value) {
            value = '%' + value + '%';
            SQL.payload = { Value1: value };
            if (parameter === 'device')
                SQL.query = 'SELECT NodeID, NodeName, DeviceID FROM db_datawriter.nodes WHERE DeviceID LIKE @Value1';
            else if (parameter === 'name')
                SQL.query = 'SELECT NodeID, NodeName, DeviceID FROM db_datawriter.nodes WHERE NodeName LIKE @Value1';
            return makePromise(SQL.select);
        },
        'registerNode': function (DeviceID) {
            SQL.payload = { Value1: DeviceID };
            SQL.query = 'DECLARE @NodeID INT EXECUTE db_datawriter.uspInsertNode @Value1, @NodeID OUTPUT SELECT NodeID = @NodeID';
            return makePromise(SQL.select);
        },
        'updateNode': function (payload) {
            SQL.payload = payload;
            SQL.query = 'UPDATE db_datawriter.nodes SET DeviceID=@DeviceID, NodeName=@NodeName, Latitude=@Latitude, Longtitude=@Longtitude, Altitude=@Altitude WHERE NodeID=@NodeID';
            return makePromise(SQL.update);
        },
        'updateConfig': function (payload) {
            SQL.payload = payload;
            SQL.query = 'UPDATE db_datawriter.config SET Class=@Class, Cycle=@Cycle, Unit=@Unit WHERE NodeID=@NodeID AND Port=@Port';
            return makePromise(SQL.config);
        },
        'createConfig': function (payload) {
            SQL.payload = payload;
            SQL.query = 'INSERT INTO db_datawriter.config (NodeID, Port) VALUES (@NodeID, @Port)';
            return makePromise(SQL.config);
        },
        'deleteConfig': function (payload) {
            SQL.payload = payload;
            SQL.query = 'DELETE FROM db_datawriter.config WHERE NodeID=@NodeID AND Port=@Port';
            return makePromise(SQL.config);
        },
    };
}

function makePromise(resolver) {
    var promise = new Promise(resolver);
    return promise;
}

var db = [];

shared.getAllReports = function () {
    try {
        return createQuery().getAllReports();
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getLatestReports = function () {
    try {
        return createQuery().getLatestReports();
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.post = function (element) {
    try {
        return createQuery().post(element);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getAllProfiles = function () {
    try {
        return createQuery().getAllProfiles();
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getProfile = function (nodeID) {
    try {
        return createQuery().getProfile(nodeID);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getReportsFromNode = function (nodeID) {
    try {
        return createQuery().getReportsFromNode(nodeID);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getReportsFromPort = function (nodeID, port) {
    try {
        return createQuery().getReportsFromPort(nodeID, port);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getLatestFromNode = function (nodeID) {
    try {
        return createQuery().getLatestFromNode(nodeID);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getLatestFromPort = function (nodeID, port) {
    try {
        return createQuery().getLatestFromPort(nodeID, port);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.mapNodeID = function (parameter, value) {
    try {
        return createQuery().mapNodeID(parameter, value);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.registerNode = function (payload) {
    try {
        return createQuery().registerNode(payload);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.getConfig = function (nodeID) {
    try {
        return createQuery().getConfig(nodeID);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.updateNode = function (payload) {
    try {
        return createQuery().updateNode(payload);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.createConfig = function (payload) {
    try {
        return createQuery().createConfig(payload);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.deleteConfig = function (payload) {
    try {
        return createQuery().deleteConfig(payload);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

shared.updateConfig = function (payload) {
    try {
        return createQuery().updateConfig(payload);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

module.exports.global = shared;