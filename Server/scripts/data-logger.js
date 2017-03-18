var app = angular.module('DataLogger', ['gservice', 'socket', 'angularMoment', 'chart.js']);

app.controller('DataLoggerCtrl', function ($scope, $http, $location, socket, gservice) {
    $scope.date = + new Date;
    $scope.data = [];
    $scope.graph = {};
    $scope.graph.NodeID = '';
    $scope.graph.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.graph.series = [];
    $scope.nodes = [];

    $scope.graph.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        },
        elements: { line: { tension: 0 } }
    };

    function mapNameToNode(NodeID) {
        var name = "";
        $scope.nodes.forEach(function (item) {
            if (item.NodeID === NodeID) {
                name = item.NodeName;
            }
        });
        return name;
    }

    function mergeNodeReports(data) {
        var result = [];
        var node = {}
        data.forEach(function (item) {
            if (item.NodeID === node.NodeID) {
                var report = { Port: item.Port, Class: item.Class, Unit: item.Unit, Reading: item.Reading, Tstamp: item.Tstamp };
                node.Reports.push(report);
            }
            else {
                result.push(node);
                node = {
                    NodeID: item.NodeID,
                    Reports: [{ Port: item.Port, Class: item.Class, Unit: item.Unit, Reading: item.Reading, Tstamp: item.Tstamp }],
                    NodeName: mapNameToNode(item.NodeID)
                };
            }
            node.Longtitude = item.Longtitude;
            node.Latitude = item.Latitude;
            node.Altitude = item.Altitude;
        });
        result.push(node);
        result.shift();
        return result;
    }


    $http.get("/api/profile").success(function (response) {
        $scope.nodes = response;

        $http.get("/api/latest").success(function (response) {
            $scope.data = mergeNodeReports(response);
            gservice.addLocations($scope.data);
            gservice.initialize();
        });
    });

    socket.on('update:data', function () {
        $http.get("/api/latest").success(function (response) {
        $scope.data = mergeNodeReports(response);
        gservice.addLocations($scope.data);
        gservice.addMarker();
        })
    });

    function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    $scope.downloadCSV = function (args) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: $scope.graph.rawdata
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    function extractGraphData(data) {
        var result = { "Tstamp": [[0]], "Reading": [[0]] };

        data.forEach(function (port) {
            port.Reports.forEach(function (report) {
                result.Tstamp.push(report.Tstamp);
            });
        });
        result.Tstamp = result.Tstamp.sort(function (a, b) {
            return new Date(a).getTime() - new Date(b).getTime();
        });

        var row = 0;
        data.forEach(function (item) {
            var pointer = 0;
            for (i = 0; i < result.Tstamp.length; i++) {
                if (result.Tstamp[i] != item.Reports[pointer].Tstamp){
                    result.Reading[row][i] = result.Reading[row][i - 1];
                    }
                else {
                    result.Reading[row][i] = item.Reports[pointer].Reading;
                    if (pointer < item.Reports.length - 1)
                    pointer++;
                }
            };
            result.Reading.push([]);
            row++;
        });
        result.Reading.pop();
        return result;
    }

    function groupReportsByPort(portlist, data) {
        var result = [];
        portlist.forEach(function (key) {
            var report = { Port: key, Reports: [] };
            result.push(report)
        });
        data.forEach(function (report) {
            result.forEach(function (item) {
                if (report.Port === item.Port) {
                    item.Reports.push(report);
                }
            })
        })
        console.log(result);
        return result;
    }

    $scope.showGraph = function (node) {
        $scope.date = + new Date;
        function chunk(arr, size) {
            var newArr = [];
            for (var i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }
            return newArr;
        }

        $scope.graph.NodeID = node.NodeID;
        $scope.graph.NodeName = node.NodeName;
        var portlist = []
        node.Reports.forEach(function (item) {
            portlist.push(item.Port);
            var newSeries = 'Port ' + item.Port;
            $scope.graph.series.push(newSeries);
        });

        $http.get("/api/data/" + node.NodeID)
            .success(function (response) {
                $scope.graph.rawdata = response;
                $scope.graph.portData = groupReportsByPort(portlist, response);
                $scope.graph.data = extractGraphData(groupReportsByPort(portlist, response));
            })
            .error(function (error, status) {
                $scope.graph.data = { message: error, status: status };
            });
    }

    $scope.panTo = function (node) {
        gservice.panTo(node.Latitude, node.Longtitude, 6)
    }

    var vm = this;
    vm.time = new Date();
});

app.filter('searchFor', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.NodeName.toString().toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };
});