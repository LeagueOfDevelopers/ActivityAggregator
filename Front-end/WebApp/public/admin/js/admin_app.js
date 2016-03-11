angular.module('ActivityAggregator.admin',
 [
   'ui.router',
   'app.services',
   'admin.controllers',
   'ngSanitize'
 ])

 .config(
    [
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
   function($urlRouterProvider, $stateProvider, $locationProvider) {

   	 $urlRouterProvider.otherwise("/");

       $stateProvider.state('inbox', {
         url: '/',
         views: {
           'page_content': {
             templateUrl: 'partials/admin_inbox.html',
             controller: 'inboxCtrl'
           }
         }
       })

       .state('auth', {
       	url: '/auth',
       	views: {
       		'page_content': {
       			templateUrl: 'partials/auth.html',
       			controller: 'authCtrl', 
       		}
       	}
       });

   }])