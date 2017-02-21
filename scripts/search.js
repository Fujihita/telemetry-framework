var app = angular.module('Search', [])
app.controller('SearchFormCtrl', function ($scope, $http) {
    $scope.query = '';
    $scope.result = '';
    $scope.parameter = '';
    $scope.searchOption = '';
    $scope.options = ['MAC address / IMEI', 'name'];
    $scope.search = function () {
        $http.get("/api/search?param=" + $scope.parameter + "&q=" + $scope.query).success(function (response) {
            try {
                $scope.result = response;
            }
            catch (e) {
                $scope.result = e;
            }
            console.log($scope.result);
        })
    }
    $scope.searchSelected = function (item) {
        if (item === 'MAC address / IMEI')
            $scope.parameter = 'device';
        else if (item === 'name')
            $scope.parameter = 'name';
        else
            return;
        $scope.searchOption = item;
    }
    $scope.searchSelected($scope.options[0]);
});