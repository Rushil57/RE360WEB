var app = angular.module('MyApp', ['toaster', 'ngAnimate'])
app.controller('MyController', function ($scope, $http, $window, $timeout,toaster) {
    $scope.init = function () {
        $scope.UserName = "";
        $scope.Password = "";
        $scope.imgloader = false;
    }
    $scope.LoginAdmin = function () {
        if ($scope.regForm.$valid) {
            $scope.showImgLoader();
            var Admin = { UserName: $scope.UserName, Password: $scope.Password }
            var post = $http({
                method: "POST",
                url: "/User/LoginAdmin",
                dataType: 'json',
                data: JSON.stringify({ "Parameter": JSON.stringify(Admin) }),
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (data, status) {
                $scope.stopImgLoader();
                if (data.status == "200") {
                    $window.location.href = data.url;
                } else {
                    $scope.popError(data.message);
                }
            });
            post.error(function (data, status) {
                $scope.stopImgLoader();
                if (!!data) {
                    $scope.popError(data.message);
                } else {
                    $scope.popError('Something Went Wrong');
                }
            });
        }
    }
    $scope.showImgLoader = function () {
        $scope.imgloader = true;

        //$timeout(function () {
        //    $scope.stopImgLoader();
        //}, 5000);
    }
    $scope.stopImgLoader = function () {
        $scope.imgloader = false;
    }
    $scope.popError = function (message) {
        toaster.pop({
            type: 'error',
            title: message,
            body: 'validation-error-toast.html',
            bodyOutputType: 'template',
            showCloseButton: true,
            toasterId: 'page-validation'
        });
    }

});
