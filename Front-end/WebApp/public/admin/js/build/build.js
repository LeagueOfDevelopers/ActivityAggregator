 angular.module('ActivityAggregator.admin',
 [
   'ui.router',
   'app.services',
   'admin.controllers',
   'ngSanitize',
   'ngDialog'
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
         url: '/admin/student/:id',
         views: {
           'page_content': {
             templateUrl: 'admin/partials/profile.html',
             controller: 'profileCtrl'
           }
         },
       })

       .state('achivment_detail', {
          url: '/admin/achivment_detail',
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
        url: '/admin/registryAdmin/:code',
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
                controller: 'inviteCtrl'
             }
          }
       })


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
	 'avatar',
	 function($scope, $state, API, avatar){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'})
		$scope.$emit('needAuth');
		$scope.avatar = avatar;
		API.query('achivments.requests', null, true).then(function(res) {
			$scope.studentsList = res.data || null;
		});
    API.query('students.requests', null, true).then(function(res) {
      $scope.registryRequests = res.data;
    })
	
}]).controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {};

		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}).then(function(res) {
        if(res.data != 'not found') {
				$scope.$emit('userUpdate');
				$state.go('inbox');
      } else {
        $scope.$emit('showMessage', {msg: 'Введены неверные данные'})
      }
			})
		}
	}])

.controller('registryAdminCtrl',
  [
  '$scope',
  '$state',
  '$stateParams',
  'API',
 function($scope, $state, $stateParams, API) {
  $scope.code = $stateParams.code;

  $scope.submit = function() {
    if($scope.newAdmin.$valid && $scope.code) {
      $scope.newAdmin.code = $scope.code

      API.query('admin.registry', {data: $scope.newAdmin}, true).then(function(res) {
        switch(res.data) {
          case 
          '0': $scope.$emit('showMessage', {msg: 'код уже использован!'});  
            break;
          case '1':
             $scope.$emit('showMessage', {msg: 'код не подходит'}); 
            break;
          default: 
          $scope.$emit('userUpdate');
          $scope.$emit('showMessage', {msg: 'Администратор успешно зарегестрирован'});
          $scope.go('auth');
            break;
        }
      })
    
  }
 }
}
  ])

.controller('profileCtrl', 
	[
	'$scope',
	'API',
	'$stateParams',
	'avatar',
   function($scope, API, $stateParams, avatar) {
   		$scope.$emit('needAuth');
   		$scope.avatar = avatar;
   		API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
   			$scope.student = res.data || null;
   		})

      $scope.confirm = function() {
        API.query('students.confirm', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Студент верифицирован'});
            API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
              $scope.student = res.data || null;
            });
        })
      }
      $scope.reject = function() {
        API.query('students.reject', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Заявка отклонена'});
            API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
              $scope.student = res.data || null;
            });
        })
      }
   }
	])

 .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      '$stateParams',
      'ngDialog',
     function($scope, $state, $http, $stateParams, ngDialog){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name}); 
         $scope.showEditField = false;
         $scope.showPhotos = false;
         $scope.fullPhoto = null;
         $scope.message = '';
         // var ach = {};
         // $http.get('api/achivments/' + $stateParams.achToShow._id).success(function(res) {
         //   ach = res.data.achivments[0];
         //   console.log(res);
         // })

       var ach = $stateParams.achToShow;
        var type = '';
        switch(ach.type) {
          case 'science' : type = 'Наука';  break;
          case 'social' : type = 'Общественная деятельность'; break;
          case 'cultural' : type = 'Культура'; break;
          case 'sport' : type = 'Спорт'; break;
          case 'study' : type = 'Учеба'; break;
        }

        var cr = new Date();
        cr.setTime(Date.parse(ach.created));

        $scope.achivment = {
          owner: $stateParams.owner,
          type: type,
          title: ach.name,
          organization: ach.organization,
          result: ach.result,
          checked: ach.checked,
          description: ach.description,
          created: cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear(),
          message: ach.message,
          files: ach.files,
          level: ach.level
        }

        $scope.confirm = function() {
          $http.post('api/admin/confirm/' + ach._id).success(function(result) {
            $scope.$emit('showMessage',  {msg: 'Достижение подтверждено'})
          })

        }

        $scope.unconfirm = function() {
          if($scope.message != '') {
          $scope.showTextaria = false;
          $http.post('api/admin/unconfirm/' + ach._id, {message: $scope.message}).success(function(result) {
            $scope.$emit('showMessage', {msg: 'Отказ отправлен'})
          })
        }
         }

       $scope.showPhoto = function(photo) {
          $scope.photoToShow = photo;
          $scope.visiblePhoto = true;
         }

    
       }])

       .controller('inviteCtrl', ['$scope', '$http', function($scope, $http) {
                    $scope.inviteCode = 'код';
                    $scope.inviteLink = 'ссылка';
                    $scope.secret = null;
                    $scope.generate = function() {

                    if($scope.secret) {

                    $http.post('api/admin/invite/' + $scope.currentUser._id, {secret: $scope.secret}).success(function(res) {
                      $scope.inviteCode = res.data;
                      $scope.inviteLink = 'http://' + '162.243.78.140' + '/admin/registryAdmin/' + res.data;
                    })
                    
                  }
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
   '$timeout',
  function ($scope, $state, UserManager, $timeout) {

     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
     })

     $scope.currentUser = {};
      updateUserData();


      function updateUserData() {

        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
        });
      };

      $scope.$on('showMessage', function(e, args) {
        $scope.showMessage = true;
        $scope.msg = args.msg;
        angular.element(document.querySelector('.notification_popup')).addClass('.popupIn');
        $timeout(function() {
        angular.element(document.querySelector('.notification_popup')).removeClass('.popupIn').addClass('.popupOut');
        $scope.showMessage = false;
        $scope.msg = '';
        }, 5000);
      })



      $scope.$on('userUpdate', function (e, args) {
           updateUserData();
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
        },
        registry: {
          method: 'POST',
          url: function() {
            return '/api/admin/registry';
          }
        }
      },

      students: {
        getDetail: {
          method: 'GET',
          url: function(params) {    
          return '/api'  + '/students/' + params.studentId;
        }
      },
      requests: {
        method: 'GET',
        url: function() {
          return '/api/admin/registryRequests'
          }
        },
        confirm: {
          method: 'POST',
          url: function(params) {
            return 'api/admin/confirmStudent/' + params.studentId;
            }
          },
          reject: {
          method: 'POST',
          url: function(params) {
            return 'api/admin/rejectStudent/' + params.studentId;
          }
        }
      
    },

      achivments: {
        requests: {
          method: 'GET',
          url: function() {
            return '/api/adm/requests';
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
      return $q.when(send(apiMethod, params || null)).then(function(result) {
        if(log) {
          console.log(result);
          }
          return result;

      });

      function send(apiMethod, params) {
        if(log) {
          console.log(apiMethod.url(params || null));
        }
        return $http({
          method: apiMethod.method,
          url   : apiMethod.url(params),
          data  : params && params.data ? params.data : undefined
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
    return  function(item) {
       return item.photoUri ? 'background-image: url(' + item.photoUri + ')' : ''; 
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

