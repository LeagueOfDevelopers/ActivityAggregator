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
         url: '/admin/',
         views: {
           'page_content': {
             templateUrl: 'admin/partials/admin_inbox.html',
             controller: 'inboxCtrl'
           }
         }
       })

       .state('auth', {
       	url: '/admin/auth',
       	views: {
       		'page_content': {
       			templateUrl: 'admin/partials/authAdmin.html',
       			controller: 'authCtrl', 
       		}
       	}
       })


       .state('student', {
         url: 'admin/student/:id',
         views: {
           'page_content': {
             templateUrl: 'admin/partials/profile.html',
             controller: 'profileCtrl'
           }
         },
       })

       .state('achivment_detail', {
          url: 'admin/achivment_detail',
          params: {
            'achToShow': null,
            'owner': null
          },

          views: {
           'page_content': {
             templateUrl: 'admin/partials/achivment.html',
             controller: 'achCtrl'
             }
          },
                   
           
       })
       .state('registryAdmin', {
        url: '/admin/registryAdmin/:code?',
        views: {
          'page_content': {
            templateUrl: 'admin/partials/registry_admin.html',
            controller: 'registryAdminCtrl'
          }
        }
       })

       .state('inviteAdmin', {
        url: 'admin/invite',
        views: {
           'page_content': {
                templateUrl: 'admin/partials/invite.html',
                controller: function($scope, $http) {
                  $scope.generate = function() {

                    if($scope.secret) {

                    $http.post('api/admin/invite', $scope.secret).success(function(res) {
                      $scope.inviteCode = res.data;
                      $scope.inviteLink = 'http://localhost:3000/admin/register/' + res.data;
                    })
                    
                  }
                  }
                }
             }
          },
       })


   }])