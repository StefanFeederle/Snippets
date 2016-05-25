angular.module('snippets')
    .service('snippetsService', ['$http', function ($http, $q) {

        var urlBase = 'server/';
        var currentSnippet = false;

        // Return public API

        return({
            currentSnippet: currentSnippet,
            getSnippets: getSnippets,
            getSnippet: getSnippet,
            newSnippet: newSnippet,
            deleteSnippet: deleteSnippet,
            saveSnippet: saveSnippet
        });

        // Public Methods

        function getSnippets () {
            var url = 'getSnippets.php';
            var request = $http.post(urlBase+url);
            return( request.then( handleSuccess, handleError ) );
        };

        function getSnippet (id) {
            var url = 'getSnippets.php';
            var request = $http({
                url: urlBase+url, 
                method: "POST",
                data: JSON.stringify({
                    id: id
                }),
                headers: {
                   'Content-Type': 'application/json'
                }
            });
            this.currentSnippet = id;
            return( request.then( handleSuccess, handleError ) );
        };

        function newSnippet () {
            var url = 'newSnippet.php';
            return $http({
                url: urlBase+url, 
                method: "POST",
                headers: {
                   'Content-Type': 'application/json'
                }
            });
        };

        function deleteSnippet (id) {
            var url = 'deleteSnippet.php';
            return $http({
                url: urlBase+url, 
                method: "POST",
                data: JSON.stringify({
                    id: id
                }) ,
                headers: {
                   'Content-Type': 'application/json'
                }
            });
        };

        function saveSnippet (snippet) {
            var url = 'saveSnippet.php';
            var request = $http({
                url: urlBase+url, 
                method: "POST",
                data: JSON.stringify({
                    id: snippet.id,
                    name: snippet.name,
                    language: snippet.language,
                    tags: snippet.tags,
                    comment: snippet.comment,
                    code: snippet.code,
                    owner: snippet.owner
                }),
                headers: {
                   'Content-Type': 'application/json'
                }
            });
            return(request.then(handleSuccess, handleError));
        };

        // Private Methods
        // I transform the error response, unwrapping the application data from
        // the API response payload.

        function handleError( response ) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess( response ) {
            return( response.data );
        }
    }]);

