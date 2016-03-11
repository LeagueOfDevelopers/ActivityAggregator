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
angular.module('admin.controllers',
[
'ui.router',
'app.controllers.main'
])

.controller('inboxCtrl', 
	[
	 '$scope', 
	 '$state',
	 'API',
	 function($scope, $state, API){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'})
		$scope.$emit('needAuth');
	
}]).controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {email: 'sadq'};
		$scope.test = 'dqdw';

		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}, true);
		}
	}])
angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
   '$state',
   'UserManager',
  function ($scope, $state, UserManager) {

     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
     })

     $scope.currentUser = {};
      updateUserData();


      function updateUserData() {

        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
          console.log(result);
        });
      };



      $scope.$on('userUpdate', function (e, args) {
           updateUserData();
           console.log('auth!');
      })      

    }])

.controller('pageCtrl',
  ['$scope',
   '$state',
   '$http',
   'UserManager',
  function ($scope, $state, $http, UserManager) {

      $scope.showMobileMenu = false;
      angular.element(document.querySelector('.mobile_nav_bar_background')).css('visibility', 'visible');

      


      $scope.$on('needAuth', function (e, args) {
           if(!$scope.currentUser) {
            $state.go('auth');
           }
      })


}]);
angular.module('app.services', [])

  .service('API', 
    ['$rootScope',
    '$q',
    '$http',
   function($rootScope, $q, $http){

        
      var config = { 
        
        apiUrls : {

      user: {

        get: {
          method: 'POST',
          url: function(params) {
            return '/api' + '/isAuth';
          }
        },

        logout: {
          method: 'POST',
          url: function(params) {
            return '/api' + '/logout';
          }
        }
      },

      admin: {
        login: {
          method: 'POST',
          url: function() {
            return '/api/admin' + '/login';
          }
        }
      },

      students: {

        add: {
         method: 'POST',
         url: function() {
          return '/api' + '/students/';
         }
        }, 

        getDetail: {
          method: 'GET',
          url: function(params) {    // get
          return '/api'  + '/students/' + params.studentId;
        }
      },

        updateDetail: {
          method: 'POST',
          url: function(params) {    // post
          return '/api'  + '/students/' + params.studentId;
        }
      },

        search: { 
          method: 'GET',
          url: function(params) {   //get
          return '/api'  + '/students/' + ((params.searchParams.name == '') ? 
                                          'search_by_category/' + params.searchParams.category : 
                                          'search_by_name/' + params.searchParams.name);
        }
      },

        achivments: {
          add: {
          method: 'POST',
          url: function(params) { //post
            return '/api' + '/students/' + params.studentId + '/achivments';
          }
        },

          getDetail: {
          method: 'GET',
          url: function(params) { //get
            return '/api' + '/students/' + params.studentId + '/achivments/' + params.achId;
          }
        }
      }

      }
    } 
  }

    function parsePath(pathString, obj) {
      var path = pathString.split('.');
      if(Array.isArray(path)) {
        for (var i = 0, l = path.length; i < l; i++) {
          var item = path[i];
          if(obj[item]) {
            obj = obj[item]
          } else {
            return
          }
        } 
        return obj;
      } else {
        return obj[path];
      }
    };

    function query(path, params, log) {

 
      var apiMethod = parsePath(path, this.apiUrls);
      return $q.when(send(apiMethod, params)).then(function(result) {
        if(log) {
          console.log(result);
          }
          return result;

      });

      function send(apiMethod, params) {
        if(log) {
          console.log(apiMethod.url(params));
        }
        return $http({
          method: apiMethod.method,
          url   : apiMethod.url(params),
          data  : params.data
        }).success(function(res) {
          return {
            data: res,
            method: apiMethod
          };
        });
      };

    };

    return {
      query: query.bind(config)
    }


  }])


  .service('avatar',
    [ 
    function() {
    return  function(student) {
       return student.photoUri ? 'background-image: url(' + student.photoUri + ')' : ''; 
      }
  }])


  .service('UserManager',
   ['$rootScope',
    '$q',
    '$http',
   function ($rootScope, $q, $http) {
        
        var apiUrl = '/api';
        var curUser = null;

        var userDetail = null;
        function getCurrentUser(params) {
            params = params || { cache: true };
            return $q.when(curUser && params.cache ? curUser : getUser()).then(function (result) {
                return result.status ? result.data.user : result;
            });

            function getUser() {
              var reqUrl = apiUrl + '/auth/isAuth';
                return $http.post(reqUrl).success(function (data) {
                        console.log(data)
                        curUser = data.user;
                    
                    return curUser;
                });
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
        }
    }])

