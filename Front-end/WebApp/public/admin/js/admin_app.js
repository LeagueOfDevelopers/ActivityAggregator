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
     $locationProvider.html5Mode(true);

       $stateProvider.state('inbox', {
         url: '/',
         views: {
           'page_content': {
             templateUrl: 'admin/partials/admin_inbox.html',
             controller: 'inboxCtrl'
           }
         }
       })

       .state('auth', {
       	url: '/auth',
       	views: {
       		'page_content': {
       			templateUrl: 'admin/partials/authAdmin.html',
       			controller: 'authCtrl', 
       		}
       	}
       })


       .state('profile', {
         url: '/profile/:id',
         views: {
           'page_content': {
             templateUrl: 'admin/partials/profile.html',
             controller: 'profileCtrl'
           }
         },
       })

   }])