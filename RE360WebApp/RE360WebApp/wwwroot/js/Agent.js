var app = angular.module('MyAppAgentReg', ['toaster', 'ngAnimate'])
//var baseUrl = "https://re360webapp.azurewebsites.net";
var baseUrl = "";
app.controller('AgentRegController', function ($scope, $http, $window, $timeout, toaster) {
    $scope.imgloader = false;
    $scope.modalShown = false;
    $scope.init = function (AgentID) {
        $scope.AgentID = "";
        $scope.Model = "";
        $scope.gifName = 'Save';
        $scope.ShowSalePricePer = false;
        $scope.imgloader = false;
        $scope.AgentID = AgentID;
        $scope.GetBaseUrl()
        $scope.GetUserDetails();
    }
    $scope.GetUserDetails = function () {
        var post = $http({
            method: "POST",
            url: '/Agent/GetAgentByID?AgentID=' + $scope.AgentID,
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            $scope.Model = data.data;
            if ($scope.AgentID != "" && ($scope.Model.salePricePercantage == null || $scope.Model.salePricePercantage == 0)) {
                $scope.deletePercentage(true)
            } else {
                $scope.deletePercentage(false)
            }
        });
        post.error(function (data, status) {
            $scope.popError(data.message);
            //swal("Error!", data.message, "error");
        });
    }

    $scope.SaveUser = function () {
        if ($scope.regForm.$valid) {
            $scope.showImgLoader();
            if ($scope.Model.commisions.length > 0) {
                for (var i = 0; i < $scope.Model.commisions.length; i++) {
                    $scope.Model.commisions[i].sequence = i + 1
                }
            }
            var post = $http({
                method: "POST",
                url: "/Agent/ADDUpdateAgent",
                dataType: 'json',
                data: JSON.stringify({ "Parameter": JSON.stringify($scope.Model) }),
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (data, status) {
                $scope.stopImgLoader();
                if (data.status == "200") {
                    $scope.popSuccess(data.message);
                    //swal("Error!", data.message, "error");
                    $window.location.href = baseUrl + "/Agent/AgentReport";
                } else {
                   // swal("Error!", data.message, "error");
                    $scope.popError(data.message);
                }
            });
            post.error(function (data, status) {
                $scope.stopImgLoader();
                if (!!data) {
                    //swal("Error!", data.message, "error");
                    $scope.popError(data.message);

                } else {
                    //swal("Error!", 'Something Went Wrong', "error");
                    $scope.popError('Something Went Wrong');
                }
            });
        }
    }
    $scope.AddCommision = function () {
        if ($scope.Model.commisions.length == 0) {
            $scope.Model.commisions.push({
                percent: '',
                upToAmount: '',
                sequence: $scope.Model.commisions.length > 0 ? parseInt($scope.Model.commisions.length + 1) : 1,
            });
        }
        $scope.Model.commisions.push({
            percent: '',
            upToAmount: '',
            sequence: $scope.Model.commisions.length > 0 ? parseInt($scope.Model.commisions.length + 1) : 1,
        });
    }
    $scope.DeleteCommision = function (item) {
        if ($scope.Model.commisions.length == 2) {
            $scope.Model.commisions = [];
        } else {
            var index = $scope.Model.commisions.indexOf(item);
            $scope.Model.commisions.splice(index, 1);
        }
    }
    $scope.deletePercentage = function (flag) {
        $scope.Model.salePricePercantage = flag ? null : $scope.Model.salePricePercantage
        $scope.ShowSalePricePer = flag;
    }
    $scope.showImgLoader = function () {
        $scope.imgloader = true;
        $scope.gifName = 'Saving...';
        //$timeout(function () {
        //    $scope.stopImgLoader();
        //}, 5);
    }
    $scope.stopImgLoader = function () {
        $scope.imgloader = false;
        $scope.gifName = 'Save';
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
    $scope.popSuccess = function (message) {
        toaster.pop({
            type: 'success',
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
                baseUrl = data;
            }
        });
        post.error(function (data, status) {
            //swal("Error!", 'Something Went Wrong', "error");
            $scope.popError('Something Went Wrong');
        });
    }
});
