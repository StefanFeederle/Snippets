snippets.controller('headerController', function($scope, snippetsService, $state, $localStorage) {
    $scope.search = {
        text : ""
    }

    $scope.options = $localStorage.$default({
        autosave : false
    });
    console.log("headerController called");

    $scope.clearSearch = function(){
        $scope.search.text = "";
        $scope.search.Active = !$scope.search.Active;
    }

    $scope.addSnippet = function(){
        snippetsService.newSnippet()
        .success(function (response) {
            $state.go('home.snippet', {id: response.snippetid})
        })
        .error(function (error) {
            //$scope.status = 'Unable to load customer data: ' + error.message;
        });
    };


    $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
});