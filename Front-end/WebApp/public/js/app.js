angular.module('ActivityAggregator',
 [
   'ui.router',
   'app.controllers',
   'app.services',
   'app.directives',
   'ngSanitize',
   'ngFileUpload'
 ])

  .config(
    [
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
     function ($urlRouterProvider, $stateProvider, $locationProvider) {
       $urlRouterProvider.otherwise("/");
       $locationProvider.html5Mode(true);

       $stateProvider.state('studentsBase', {
         url: '/studentsBase',
         views: {
           'page_content': {
             templateUrl: 'partials/studentsBase.html',
             controller: 'studentsBaseCtrl'
           },
             'footer': {
                 templateUrl: 'partials/footer.html'
             }
         }
       })

        .state('mainPage', {
         url: '/',
         views: {
           'page_content': {
             templateUrl: 'partials/main.html',
             controller: 'indexCtrl'
           },
             'footer': {
                 templateUrl: 'partials/footer.html'
             }
         }
       })

       .state('account', {
         url: '/account/:user_id',
         views: {
           'page_content': {
             templateUrl: 'partials/profile.html',
             controller: 'accountCtrl'
           },

             'footer': {
                 templateUrl: 'partials/footer.html'
             }
         }
       })

       .state('profile', {
         url: '/profile/:id',
         views: {
           'page_content': {
             templateUrl: 'partials/profile_another.html',
             controller: 'profileCtrl'
           },
             'footer': {
                 templateUrl: 'partials/footer.html'
             }
         }
       })

       .state('add_achivment', {
          url: '/account/:user_id/new_achivment',
            views: {
            'page_content': {
             templateUrl: 'partials/addAchivment.html',
             controller: 'newAchCtrl'
            }
          }
       })

       .state('achivment_detail', {
          url: '/achivment_detail/:studentId/:achId',
          views: {
           'page_content': {
             templateUrl: 'partials/achivment.html',
             controller: 'achCtrl'
             }
          },
       })

       .state('auth', {
          url: '/auth',
           views: {
             'page_content': {
               templateUrl: 'partials/auth.html',
               controller: 'authCtrl'
            },

               'footer': {
                   templateUrl: 'partials/footer.html'
               }
           }
       })

           .state('recovery', {
               url: '/recovery',
               views: {
                   'page_content': {
                       templateUrl: 'partials/recovery.html',
                       controller: 'recoveryCtrl'
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
