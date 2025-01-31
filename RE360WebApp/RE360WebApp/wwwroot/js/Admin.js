﻿var app = angular.module('MyAppAdmin', ['toaster', 'ngAnimate'])
app.controller('AdminController', function ($scope, $http, $window, $timeout, toaster) {
    $scope.init = function () {
        $scope.UserName = "";
        $scope.Password = "";
        $scope.imgloader = false;
        $scope.baseUrl = "";
        $scope.GetBaseUrl()
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
                    $window.location.href = $scope.baseUrl + "/Agent/AgentReport";
                } else {
                    $scope.popError(data.message);
                    //swal("Error!", data.message, "error");
                }
            });
            post.error(function (data, status) {
                $scope.stopImgLoader();
                if (!!data) {
                    $scope.popError(data.message);
                    //swal("Error!", data.message, "error");
                } else {
                    //swal("Error!", 'Something Went Wrong', "error");
                    $scope.popError('Something Went Wrong');
                }
            });
        }
    }
    $scope.showImgLoader = function () {
        //$scope.imgloader = true;

        //$timeout(function () {
        //    $scope.stopImgLoader();
        //}, 5000);
    }
    $scope.stopImgLoader = function () {
        //$scope.imgloader = false;
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
    $scope.GetBaseUrl = function () {
        var post = $http({
            method: "GET",
            url: "/User/GetBaseUrl",
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            if (data.data != null) {
                $scope.baseUrl = data;
            }
        });
        post.error(function (data, status) {
            $scope.popError('Something Went Wrong');
        });
    }
});
