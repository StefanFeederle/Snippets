// Include app dependency on ngMaterial
snippets.controller("snippetController", function($scope, snippetsService, $state, $interval, $mdDialog){
    console.log("snippetController called");
    $scope.editorReady = false;
    $scope.snippet = {
        dataReady : false
    };
    $scope.savedSnippet = {};
    $scope.unsavedChanges = false;
    $scope.saveInProgress = false;

    if($state.params.id){                               //snippetid from url paramter
        getSnippet($state.params.id);
    } else if (snippetsService.currentSnippet) {        //snippetid from snippetService-Cache
        $state.go('home.snippet', {"id": snippetsService.currentSnippet});
    } else {
        $state.go('home.list');
    }

    function getSnippet(id) {
        snippetsService.getSnippet(id)
            .then(function (response) {
                $scope.snippet = response[0];
                $scope.snippet.dataReady = true;
                watchSnippet();
            });
    }

    function watchSnippet(){
        //attach object lisener
        $scope.$watch("snippet", function(newValue, oldValue) {
            if (newValue !== oldValue && $scope.snippet.dataReady) {
                $scope.unsavedChanges = true;
            }
        }, true);
    }

    $scope.$on("saveSnippet", function (event, args) {
        $scope.saveSnippet();
    });
    //window.addEventListener("beforeunload", function (e) {
    //        var confirmationMessage = 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';
    //        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    //        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
    //});

    //$scope.$on('$stateChangeStart', function (event){
    //    var answer = confirm("Es sind ungespeicherte Änderungen vorhanden, trotzdem verlassen?");
    //    if (!answer){
    //        event.preventDefault()
    //    }else{  
    //        return;
    //    }
    //});
 
    window.onbeforeunload = function(){
        console.log("onbeforeunload fired");
        if($scope.unsavedChanges){
            return "Es sind ungespeicherte Änderungen vorhanden, trotzdem verlassen?";
        } else{ 
            return;
        }
    }

    //$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //    console.log(event);
    //   //var answer = confirm("Are you sure you want to leave this page?");
    //   //if (!answer) {
    //       event.preventDefault();
    //   //}
    //    var dialog = $mdDialog.confirm()
    //      .title('Delete Snippet?')
    //      .textContent('All of the banks have agreed to forgive you your debts.')
    //      .ariaLabel('Lucky day')
    //      .targetEvent(event)
    //      .ok('Delete!')
    //      .cancel('Cancel');
    //    
    //    $mdDialog.show(dialog).then(
    //        function() {
    //            //dialog confirmed
    //            //snippetsService.deleteSnippet(snippet.id)
    //            //.then(function(){
    //            //    console.log("reloading state");
    //            //    $state.go($state.current, {}, {reload: true});
    //            //});
    //        },
    //        function() {
    //            //dialog canceled                
    //        }
    //    );
    //});

    //savetrigger
    var intervalpointer = null;

    function startSaveInterval(time){
        if(!intervalpointer){
            console.log("starting timer");
            intervalpointer = $interval(saveInterval, time);
        }
    }

    function stopSaveInterval(){
        console.log("stopping timer");
        $interval.cancel(intervalpointer);
        intervalpointer = null;
    }

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        stopSaveInterval();
    });

    function saveInterval() {
        //console.log($scope.unsavedChanges);
        //console.log($scope.saveInProgress);
        if($scope.unsavedChanges && !$scope.saveInProgress){
            $scope.saveSnippet();
        }
    }

    $scope.$watch("options.autosave", function(newValue, oldValue) {
        //console.log("autosave changed, is now "+newValue);
        if(newValue){ 
            startSaveInterval(1500);
        } else {
            stopSaveInterval();
        }  
    }, true);

    $scope.saveSnippet = function (){
        var snippetToSave = angular.copy($scope.snippet);
        //snippet changed since last save?
        if(!angular.equals(snippetToSave, $scope.savedSnippet)){
            if(!$scope.saveInProgress){
                $scope.saveInProgress = true;
                $scope.unsavedChanges = false;
                snippetsService.saveSnippet(snippetToSave)
                .then(function (response) {
                    //update the last saved snippet, ergo the database-state
                    $scope.savedSnippet = angular.copy(snippetToSave);
                    $scope.saveInProgress = false;
                });
            } else {

            }
        } else {
            console.log("no new data to save");
        }
    }

    $scope.highlightEditor = function(lineStart, lineEnd){
        //if (!$scope.editorReady || !lineStart) return;

        //if(lineEnd){
            //single line
            var markerId = $scope.editor._session.addMarker(new $scope.editor.Range(1, 0, 2, 999), "ace_highlight-marker", "fullLine");
        //} else {
            //multiple line
            //var markerId = $scope._session.addMarker(new Range(lineStart, 0, lineEnd, 0), "ace_highlight-marker", "fullLine");
        //}
        
        //remove highlight
        //$scope._session.removeMarker(markerId);
    }
    $scope.aceLoaded = function(_editor) {
        $scope.editor = {
            _editor : _editor,
            _session : _editor.getSession(),
            _renderer : _editor.renderer,
            modelist : ace.require("ace/ext/modelist"),
            Range : ace.require("ace/range").Range,
            ready : true
        }
        //modestrings erzeugen
        $scope.editor.modelist.modeStrings = [];
        for (var prop in $scope.editor.modelist.modesByName){
            $scope.editor.modelist.modeStrings.push(prop);
        }

        //Editor konfigurieren
        //$scope._editor.setShowPrintMargin(false);
        $scope.editor._editor.setOptions({
            wrap: true,
            indentedSoftWrap: true,
            showPrintMargin: false
        })
        $scope.editor._editor.$blockScrolling = "Infinity";
        //$scope._editor.setWrapBehavioursEnabled(true);

        //$scope.highlightEditor();

        //data ready?
        if($scope.snippet.dataReady){
            $scope.setEditorLanguage($scope.snippet.language.toLowerCase());
        }
    };


    $scope.getEditorLanguage = function(){
        if($scope.editor.ready){
            return $scope.editor._session.$modeId;
        }else{
            console.log("Editor not initialized, cant get language");
            return false;
        }    
    };


    $scope.setEditorLanguage = function(languageString){
        if($scope.editorHasLanguage(languageString)) {
           $scope.applyEditorLanguage(languageString);
           console.log("language changed to "+languageString);
        }
    };

    $scope.applyEditorLanguage = function(mode){
        if($scope.editor.ready){
            $scope.editor._session.setMode({
                path: $scope.editor.modelist.modesByName[mode].mode, 
                inline: true
            });
        }else{
            console.log("Editor not initialized, cant set language");
        }    
    };

    $scope.editorHasLanguage = function(languageString){
        if($scope.editor.ready){        
            if($scope.editor.modelist.modesByName[languageString] === undefined) {
                console.log("mode "+languageString+" doesn't exist");
                return false;
            } else {
                return true;
            }
        }else{
            console.log("Editor not initialized, can not check languages");
            return false;
        } 
    };

});