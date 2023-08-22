var app = angular.module('MyApp', ['toaster', 'ngAnimate'])
var baseUrl = "https://localhost:7093";
app.controller('MyController', function ($scope, $http, $window, $timeout, toaster) {
    $scope.init = function () {
        /*$scope.GetBaseUrl();*/
    }
    //$scope.GetBaseUrl = function () {
    //    var post = $http({
    //        method: "POST",
    //        url: "/Agent/GetBaseUrl",
    //        dataType: 'json',
    //        data: null,
    //        headers: { "Content-Type": "application/json" }
    //    });
    //    post.success(function (data, status) {
    //        if (data.data != null) {
    //            baseUrl = data;
    //        }
    //    });
    //    post.error(function (data, status) {
    //        $scope.popError('Something Went Wrong');
    //    });
    //}
});