// Include app dependency on ngMaterial
snippets.controller("listController", function($scope, snippetsService, $state, $mdDialog, $window){
    console.log("listController called");
    function getSnippets() {
        snippetsService.getSnippets()
            .then(function (response) {
                $scope.snippets = response;
            })
    }
    getSnippets();

    $scope.selectSnippet = function(snippet){
        $state.go('home.snippet', {id: snippet.id});
    };

    $scope.deleteSnippet = function(snippet, $event){
        $event.stopPropagation();
        console.log("snippet with id "+snippet.id+" was clicked, deleting snippet!");

        var dialog = $mdDialog.confirm()
          .title('Delete Snippet?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent($event)
          .ok('Delete!')
          .cancel('Cancel');
        
        $mdDialog.show(dialog).then(
            function() {
                //dialog confirmed
                snippetsService.deleteSnippet(snippet.id)
                .then(function(){
                    console.log("reloading state");
                    $state.go($state.current, {}, {reload: true});
                });
            },
            function() {
                //dialog canceled                
            }
        );
    }; 
    
    $scope.shareSnippet = function(snippet, $event){
        console.log("snippet with id "+snippet.id+" was clicked, sharing snippet!");
        var recipient   = "";
        var subject     = "Ich will den Codebaustein <"+snippet.name+"> mit dir teilen";
        var link        = $window.location.href+"snippet/"+snippet.id;
        var body        = "Du kannst den Codebaustein <"+snippet.name+"> auf "+link+" anschauen.";
        
        $window.open("mailto:"+recipient+"?subject="+subject+"&body="+body,"_self");
    };
});

