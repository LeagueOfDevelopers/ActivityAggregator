angular.module('ActivityAggregator',
 [
   'ui.router',
   'app.controllers',
   'app.services',
   'app.directives',
   'ngSanitize'
 ])

  .config(
    [
    '$urlRouterProvider',
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
             controller: 'profileCtrl'
           },
           'footer': {
             templateUrl: 'partials/footer.html',
           }
         }
       })

       .state('add_achivment', {
        url: '/profile/new_achivment',
        views: {
          'page_content': {
           templateUrl: 'partials/addAchivment.html',
           controller: 'newAchCtrl'
          }
        }
       })

       .state('achivment_detail', {
          url: '/achivment_detail/:id',
          views: {
           'page_content': {
             templateUrl: 'partials/achivment.html',
             controller: 'achCtrl'
             }
          },
          resolve: {
            achToShow: function($http, $stateParams) {
              return true;
            }
          }
           
       })

       .state('auth', {
          url: '/auth',
           views: {
             'page_content': {
               templateUrl: 'partials/auth.html',
               controller: 'authCtrl'
            }
           }
       })
       .state('registry', {
          url: '/registry',
           views: {
             'page_content': {
               templateUrl: 'partials/registry.html',
               controller: 'registryCtrl'
             }
           }
       })
     }]);
