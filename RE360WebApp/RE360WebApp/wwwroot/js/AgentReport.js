//var app = angular.module('MyAppAgentReport', [])
var baseUrl = "https://localhost:7093";
var app = angular.module('MyAppAgentReport', ['toaster', 'ngAnimate'])
    .directive('validationErrorToast', function () {

    })
app.controller('AgentReportController', function ($scope, $http, $window, $timeout, toaster) {
    $scope.init = function () {
        $scope.GetBaseUrl()
        $scope.imgloader = false;
        $scope.AgentDetail = null;
        $scope.GetAgentReport()
        $scope.filteredTodos = []
        $scope.currentPage = 1
        $scope.numPerPage = 10
        $scope.maxSize = 5;
        $scope.makeTodos();
    }

    $scope.makeTodos = function () {
        $scope.todos = [];
        for (i = 1; i <= 1000; i++) {
            $scope.todos.push({ text: "todo " + i, done: false });
        }
    };

    $scope.GetAgentReport = function () {
        $scope.showImgLoader();
        var post = $http({
            method: "POST",
            url: "/Agent/GetAgentReport",
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            //$scope.stopImgLoader();
            if (data.data != null) {
                $scope.AgentDetail = data.data;
                //$scope.$watch("currentPage + numPerPage", function () {
                //    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                //        , end = begin + $scope.numPerPage;

                //    $scope.filteredTodos = $scope.todos.slice(begin, end);
                //});
            } else {
                $scope.AgentDetail = null;
            }
            //$window.alert('Something Went Wrong');
        });
        post.error(function (data, status) {
            //$scope.stopImgLoader();
            if (!!data) {
                $scope.popError(data.message);
            } else {
                $scope.popError('Something Went Wrong');
            }
            $scope.AgentDetail = null;
        });
    }
    $scope.showImgLoader = function () {
        $scope.imgloader = true;
        $timeout(function () {
            $scope.stopImgLoader();
        }, 50);
    }
    $scope.stopImgLoader = function () {
        $scope.imgloader = false;
    }
    $scope.redirectRegi = function (AgentID) {
        if (AgentID == "") {
            $window.location.href = baseUrl + "/Agent/agentRegistration";
        } else {
            $window.location.href = baseUrl + "/Agent/agentRegistration?AgentID=" + AgentID;
        }
    }
    $scope.DeleteAgentByID = function (AgentID) {
        var post = $http({
            method: "POST",
            url: '/Agent/DeleteAgentByID?AgentID=' + AgentID,
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.success(function (data, status) {
            if (data.status == "200") {
                $scope.popSuccess(data.message);
                $scope.GetAgentReport()
            } else {
                $scope.popError(data.message);
            }
        });
        post.error(function (data, status) {
            $scope.popError(data.message);

        });
    }

    //$scope.more = function () {
    //    console.log('More info clicked!');

    //    toaster.pop({
    //        type: 'info',
    //        title: 'More Info',
    //        body: 'More Info content here',
    //        toasterId: 'notification'
    //    });
    //};
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
            $scope.popError('Something Went Wrong');
        });
    }
});
