var app = angular.module('MyApp', ['toaster', 'ngAnimate'])
    .directive('validationErrorToast', function () {

    })
app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');

                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
app.controller('MyController', function ($scope, $http, $window, $interval, $timeout, toaster, $interval) {
    $scope.init = function () {
        //$scope.imgloader = true;
        $scope.baseUrl = "";
        $scope.GetBaseUrl();
    }
    $scope.GetBaseUrl = function () {
        var post = $http({
            method: "GET",
            url: "/User/GetBaseUrl",
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.then(function (data, status) {
        });
        post.success(function (data, status) {
            if (data.data != null) {
                $scope.baseUrl = data;
            }
        });
        post.error(function (data, status) {
            //swal("Error!", 'Something Went Wrong', "error");
            $scope.popError('Something Went Wrong');
        });
    }

    $scope.showImgLoader = function () {
        $scope.imgloader = true;
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
    $scope.Logout = function () {
        $window.location.href = $scope.baseUrl + "/User/Index";
    }
});

app.controller('AgentReportController', function ($scope, $http, $window, $timeout, toaster, $interval) {
    
    $scope.init = function () {
        $scope.GetAgentReport()
        $scope.filteredTodos = []
        $scope.currentPage = 1
        $scope.numPerPage = 10
        $scope.maxSize = 5;
    }
    $scope.GetAgentReport = function () {
        $scope.showImgLoader();
        var post = $http({
            method: "POST",
            url: "/Agent/GetAgentReport",
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.then(function (data, status) {
        });
        post.success(function (data, status) {
            if (data.data != null) {
                $scope.AgentDetail = data.data;
            } else {
                $scope.AgentDetail = null;
            }
            $scope.stopImgLoader();
        });
        post.error(function (data, status) {
            if (!!data) {
                $scope.popError(data.message);
            } else {
                $scope.popError('Something Went Wrong');
            }
            $scope.AgentDetail = null;
            $scope.stopImgLoader();
        });
    }
    $scope.redirectRegi = function (AgentID) {
        debugger
        if (AgentID == "" || AgentID == undefined) {
            $window.location.href = $scope.baseUrl + "/Agent/agentRegistration";
        } else {
            $window.location.href = $scope.baseUrl + "/Agent/agentRegistration?AgentID=" + AgentID;
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
        post.then(function (data, status) {
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
            //swal("Error!", data.message, "error");
            $scope.popError(data.message);
        });
    }

    $scope.DeleteAgentByID = function (AgentID) {
        swal({
            title: "Delete!",
            text: "Are you sure you want to delete this Agent?",
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

app.controller('AgentRegController', function ($scope, $http, $window, $interval, $timeout, toaster, $interval) {
    $scope.init = function (AgentID) {
        $scope.AgentID = "";
        $scope.Model = "";
        $scope.ShowSalePricePer = false;
        $scope.AgentID = AgentID;
        $scope.GetUserDetails();
        /*$scope.stopImgLoader()*/
    }
    $scope.GetUserDetails = function () {
        var post = $http({
            method: "POST",
            url: '/Agent/GetAgentByID?AgentID=' + $scope.AgentID,
            dataType: 'json',
            data: null,
            headers: { "Content-Type": "application/json" }
        });
        post.then(function (data, status) {
        });
        post.success(function (data, status) {
            $scope.Model = data.data;
            $scope.Header = !!$scope.Model.agentID ? 'Edit Agent' : 'Register Agent';
            $scope.btnText = !!$scope.Model.agentID ? 'Update' : 'Register';
            //if ($scope.AgentID != "" && ($scope.Model.salePricePercantage == null || $scope.Model.salePricePercantage == 0)) {
            //    $scope.deletePercentage(true)
            //} else {
            //    $scope.deletePercentage(false)
            //}
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
            post.then(function (data, status) {
            });
            post.success(function (data, status) {
                $scope.stopImgLoader();
                if (data.status == "200") {
                    $scope.popSuccess(data.message);
                    $interval(function () {
                        $window.location.href = $scope.baseUrl + "/Agent/AgentReport";
                    }, 5);

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
    $scope.Back = function () {
        $window.location.href = $scope.baseUrl + "/Agent/AgentReport";
    }

});

