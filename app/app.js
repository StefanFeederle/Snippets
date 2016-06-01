"use strict";

var snippets = angular.module( 'snippets', [ 'ngMaterial', 'ui.router', 'ui.ace', 'ngStorage', 'snippetFilters'] )

snippets.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    /////////////////////////////
    // Redirects and Otherwise //
    /////////////////////////////

    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider.otherwise('/');

    // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
    // Here we are just setting up some convenience urls.
    //.when('/c?id', '/contacts/:id')
    //.when('/user/:id', '/contacts/:id')

    // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state

    $stateProvider
    .state('home',{
        abstract: true,
        templateUrl: 'app/views/header.html',
        controller: 'headerController'
    })
    .state('search',{
        abstract: true,
        templateUrl: 'app/views/header.search.html',
        controller: 'headerController'
    })
    .state('home.list',{
        url: '/list',
        templateUrl: 'app/views/list.html',
        controller: 'listController' 
    })
    .state('search.list',{
        url: '/search',
        templateUrl: 'app/views/list.html',
        controller: 'listController' 
    })
    .state('home.snippet',{
        url: '/snippet/:id',
        templateUrl: 'app/views/snippet.html',
        controller: 'snippetController'
    });
}]);

//Make state public
snippets.run( ['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams; 
    }
]);
angular.module('snippets').
  filter('multiple', function() {
    return function(movies,genres) {
      var out = [];
      // Filter logic here, adding matches to the out var.
      return out;
    }
});