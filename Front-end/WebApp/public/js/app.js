angular.module('ActivityAggregator',
 [
   'ui.router',
   'app.controllers',
   'app.services',
   'ngSanitize'
 ])

  .config(
    ['$urlRouterProvider',
    '$stateProvider',
     function ($urlRouterProvider, $stateProvider) {
       $urlRouterProvider.otherwise("/studentsBase");

       $stateProvider.state('studentsBase', {
         url: '/studentsBase',
         views: {
           'page_content': {
             templateUrl: 'partials/studentsBase.html',
             controller: 'studentsBaseCtrl'
           }
         }
       })

       .state('profile', {
         url: '/profile',
         views: {
           'page_content': {
             templateUrl: 'partials/profile.html',
           },
           'footer': {
             templateUrl: 'partials/footer.html',
           }
         }
       })
     }]);
