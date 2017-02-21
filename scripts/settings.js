var app = angular.module('SettingsForm', [])
app.controller('SettingsFormCtrl', function ($scope, $http) {
    $scope.port =
        {
            NodeID: '',
            Port: '',
            Sensor: '',
            Unit: ''
        };

    $scope.config = function () {
        console.log($scope.port);
    }
});

app.controller('RegisterFormCtrl', function ($scope, $http) {
    $scope.node =
        {
            NodeID: '',
            DeviceID: '',
            NodeName: '',
            Latitude: '',
            Longtitude: '',
            Altitude: ''
        };

    $scope.register = function () {
        console.log($scope.node);
        // $http.post('/register', $scope.node);
    }
});
