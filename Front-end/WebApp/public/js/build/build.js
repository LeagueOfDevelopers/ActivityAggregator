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


/* Controllers */
angular.module('app.controllers',
[
'app.controllers.main',
'app.controllers.partials',
'ui.router'
]);

angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
  '$state',
    function ($scope, $state) {
      var stateName = $state.current.name;
      switch (stateName) {
        case 'studentsBase': $scope.title = 'База активистов НИТУ МИСиС';
          break;
        case 'profile': $scope.title = 'Профиль студента';
          break;
        default: $scope.title = "Онлайн портфолио активных студентов НИТУ МИСиС";

      }

    }])

.controller('pageCtrl',
  ['$scope',
  '$state',
  '$http',
  'UserManager',
    function ($scope, $state, $http, UserManager) {

      $scope.profileLink = {
        sref: 'auth',
        title: 'Рассказать о себе'
      }
      $scope.currentUser = {};
      updateUserData();

      function updateUserData() {
        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
          if($scope.currentUser.name && $scope.currentUser.id) {
            $scope.profileLink.sref = 'profile';
            $scope.profileLink.title = $scope.currentUser.name;
          } else {
            $state.go('auth')
          }
          console.log(result);
        })
      };



      $scope.$on('needAuth', function (e, args) {
        if(!($scope.currentUser.name && $scope.currentUser.id)) {
          updateUserData();
        }
        console.log($scope.currentUser + 'auth');
      })

}]);

angular.module('app.controllers.partials',
[
  'ui.router'
])

  .controller('studentsBaseCtrl',
  [
    '$scope',
    '$http',
    function ($scope, $http) {
      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      $scope.$watch('searchParams.category', function() {
        $scope.getStudentsList($scope.searchParams);
      })

      $scope.getStudentsList = function(searchParams) {
        var reqUrl = 'api/students/' + ((searchParams.name == '') ? 'search_by_category/' + searchParams.category : 'search_by_name/' + searchParams.name);
        console.log(requestUrl);
      };
      $http.get(reqUrl).sucess(function(result) {
        console.log(result);
        $scope.searchResults = result.data;

      })
    }
  ])

  .controller('profileCtrl',
  [
    '$scope',
    '$http',
    'UserManager',
    function ($scope, $http, UserManager) {
      $scope.showEditField= false;
      UserManager.getUserDetail().then(function (result) {
        console.log(result);
        $scope.userDetail = result;
          console.log(result);
        });
      $scope.editUserDetail = function () {
        $scope.showEditField= true;
      }
      $scope.applyChanges = function () {
        if($scope.newUserDetail) {
          $scope.showEditField = false;
             $scope.userDetail = UserManager.updatdeUserDetail($scope.newUserDetail);
        }
      }
      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = null;
      }


    }
  ])

  .controller('authCtrl', ['$scope', function($scope){
    $scope.login = {};
  }])

  .controller('registryCtrl', ['$scope', function($scope){

  }])

angular.module('app.directives', [])

.directive('popup.achivments', {
	restrict: 'E',
	scope: {
		achivmentsList: '='
	},
	templateUrl: 'achivment_popup.html',
	link: function(scope, elem, attr) {

	}
});

angular.module('app.services', [])


  .service('UserManager',
   ['$rootScope',
    '$q',
    '$http',
     function ($rootScope, $q, $http) {

        var apiUrl = '/api';
        var curUser = {
          id: '1',
          name: 'Здрасте Здрасте'
        };
        var userDetail = null;

        function getCurrentUser(params) {
            params = params || { cache: true };
            return $q.when(curUser && params.cache ? curUser : getUser()).then(function (result) {
                return result.status ? result.data.user : result;
            });

            function getUser() {
              var reqUrl = apiUrl + '/auth/isAuth';
                return $http.get(reqUrl).success(function (data) {
                    if (!data.result) {
                        return false;
                    } else if (data.user) {
                        curUser = data.user;
                    }
                    return curUser;
                });
            }
        }

        function getUserDetail() {
        return $q.when(userDetail ? userDetail : getDetail()).then(function (result) {
          return result.data.info;
        })

          function getDetail() {
            var reqUrl = apiUrl + '/students/' + curUser.id;
            return $http.get(reqUrl).success(function(data) {
              if (!data.result) {
                        return false;
                    } else {
                        userDetail = data;
                    }
                    return userDetail;
            })
          };
        }

      

      function updateUserDetail(data) {
        return $q.when(updateData(data)).then(function () {
          return getUserDetail();
        })

        function updateData(data) {
          userInfo[about] = data;

        }
      }

        function logout() {
            return $http.post('/api/auth/logout').success(function (data) {
                curUser = null;
                var defaultAction = true;
                return data && data.result
                    ? data.result : defaultAction;
            });
        }

        return {
            getCurrentUser: getCurrentUser,
            logout: logout,
            getUserDetail: getUserDetail
        }
    }])

