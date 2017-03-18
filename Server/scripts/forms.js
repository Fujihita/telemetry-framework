var app = angular.module('Forms', [])
app.controller('ReportFormCtrl', function ($scope, $http) {
    $scope.report =
        {
            NodeID: '',
            Port: '',
            Reading: '',
        };
    $scope.submit = function () {
        $http.post('/api/data', $scope.report).success(function (response) { console.log(response); });
    }
});

app.controller('ConfigFormCtrl', function ($scope, $http) {
    $scope.port =
        {
            NodeID: '',
            Port: '',
            Class: '',
            Unit: ''
        };

    $scope.config = function () {
        console.log($scope.port);
    }
});

app.controller('RegisterFormCtrl', function ($scope, $http) {
    $scope.node =
        {
            DeviceID: ''
        };
    $scope.register = function () {
        $http.post('/api/profile?action=new', $scope.node).success(function (response) {
                $scope.node.NodeID = response[0].NodeID;
        });
    }
});