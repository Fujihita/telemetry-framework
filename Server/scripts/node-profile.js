var app = angular.module('NodeProfile', ['angularMoment'])
app.controller('NodeProfileCtrl', function ($scope, $http) {
    $scope.node =
        {
            NodeID: window.location.pathname.split('/')[2],
            DeviceID: '',
            NodeName: '',
            Latitude: '',
            Longtitude: '',
            Altitude: ''
        };
    $scope.config = {};
    $scope.reports = {};

    function refresh() {
        $http.get("/api/profile?id=" + $scope.node.NodeID).success(function (response) {
            $scope.node = response[0];
            $http.get("/api/config/" + $scope.node.NodeID).success(function (response) {
                $scope.config = response;
                $http.get("/api/latest/" + $scope.node.NodeID).success(function (response) {
                    $scope.reports = response;
                });
            });
        });
    }
    refresh();
    
    $scope.update = function () {
        if (document.getElementById("clientGPS").checked) {
            node.Longtitude = '';
            node.Latitude = '';
            node.Altitude = '';
        }
        $http.post('/api/profile?action=edit', $scope.node).success(function (response) { console.log(response);});
    }

    $scope.port =
        {
            NodeID: window.location.pathname.split('/')[2],
            Port: '',
            Cycle: '',
            Class: '',
            Unit: ''
        };

    $scope.editConfig = function () {
        $http.post('/api/config?action=edit', $scope.port).success(function (response) { console.log(response); refresh();});
    }
    $scope.deleteConfig = function () {
        $http.post('/api/config?action=delete', $scope.port).success(function (response) { console.log(response); refresh();});
    }

    $scope.new =
        {
            NodeID: window.location.pathname.split('/')[2],
            Port: '',
        };
    $scope.createConfig = function () {
        $http.post('/api/config?action=new', $scope.new).success(function (response) { console.log(response); refresh();});
    }

    $scope.CheckBoxHandler = function () {
        var UseClientGPS = document.getElementById("clientGPS").checked;
        document.getElementById("LongtitudeForm").readOnly = UseClientGPS;
        document.getElementById("LatitudeForm").readOnly = UseClientGPS;
        document.getElementById("AltitudeForm").readOnly = UseClientGPS;
    }

    $scope.updateForm = function () {
        $scope.port.Class = '';
        $scope.port.Unit = '';
        $scope.config.forEach(function (item) {
            if (item.Port == $scope.port.Port) {
                $scope.port.Cycle = item.Cycle;
                $scope.port.Class = item.Class;
                $scope.port.Unit = item.Unit;
            }
        });
    }
});