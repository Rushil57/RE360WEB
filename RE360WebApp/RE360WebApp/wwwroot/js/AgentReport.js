//var app = angular.module('MyAppAgentReport', [])
//var baseUrl = "https://re360webapp.azurewebsites.net";
var baseUrl = "";
var app = angular.module('MyAppAgentReport', ['toaster', 'ngAnimate'])
    .directive('validationErrorToast', function () {

    })
app.controller('AgentReportController', function ($scope, $http, $window, $timeout, toaster) {
    //$scope.imgloader = false;
    //$scope.AgentDetail = null;
    $scope.init = function () {
        $scope.GetBaseUrl()
        $scope.GetAgentReport()
        $scope.filteredTodos = []
        $scope.currentPage = 1
        $scope.numPerPage = 10
        $scope.maxSize = 5;
        $scope.imgloader = false;
        //$scope.makeTodos();
    }
    //$scope.makeTodos = function () {
    //    $scope.todos = [];
    //    for (i = 1; i <= 1000; i++) {
    //        $scope.todos.push({ text: "todo " + i, done: false });
    //    }
    //};
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
            $scope.stopImgLoader();
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
        });
        post.error(function (data, status) {
            $scope.stopImgLoader();
            if (!!data) {
                $scope.popError(data.message);
                //swal("Error!", data.message, "error");
            } else {
                $scope.popError('Something Went Wrong');
                //swal("Error!", 'Something Went Wrong', "error");
            }
            $scope.AgentDetail = null;
        });
    }
    $scope.showImgLoader = function () {
        $scope.imgloader = true;
        //$timeout(function () {
        //    $scope.stopImgLoader();
        //}, 5);
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
    $scope.DeleteAgent = function (AgentID) {
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
                //swal("Deleted!", "Your Agent has been deleted.", "success");
                $scope.GetAgentReport()
            } else {
                $scope.popError(data.message);
                //swal("Error!", data.message, "error");
            }
        });
        post.error(function (data, status) {
            swal("Error!", data.message, "error");
        });
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
            $scope.popError('Something Went Wrong');
            //swal("Error!", 'Something Went Wrong', "error");
        });
    }

    $scope.DeleteAgentByID = function (AgentID) {
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this Agent!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55", confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true,
            closeOnCancel: true,
            showLoaderOnConfirm: true           // Add this line
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.DeleteAgent(AgentID)
            }

            //if (!isConfirm) {
            //    swal("Cancelled", "Your Agent is safe :)", "error");
            //} else {
            //    $scope.DeleteAgent(AgentID)
            //    //$timeout(function () {
            //    //    swal("Deleted!", "Your Agent has been deleted.", "success");
            //    //}, 2000);

            //};
        });
    }
});
