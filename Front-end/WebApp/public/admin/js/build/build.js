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
      $scope.registryRequests = res.data || null;
    })
	
}])

.controller('authCtrl',
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
				$scope.$emit('auth');
				$state.go('inbox');
      } else {
        $scope.$emit('showMessage', {msg: 'Введены неверные данные', type: 'bad'})
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
          '0': $scope.$emit('showMessage', {msg: 'код уже использован!', type: 'bad'});  
            break;
          case '1':
             $scope.$emit('showMessage', {msg: 'код не подходит', type: 'bad'}); 
            break;
          default: 
          $scope.$emit('userUpdate');
          $scope.$emit('showMessage', {msg: 'Администратор успешно зарегестрирован', type: 'good'});
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
   		});

      $scope.confirm = function() {
        API.query('students.confirm', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Студент верифицирован', type: 'good'});
            API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
              $scope.student = res.data || null;
            });
        })
      };

      $scope.reject = function() {
        API.query('students.reject', {studentId: $stateParams.id}, true).then(function(res) {
            $scope.$emit('showMessage', {msg: 'Заявка отклонена', type: 'good'});
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
      '$window',
      'API',
     function($scope, $state, $http, $stateParams, ngDialog, $window, API){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name}); 
         $scope.showEditField = false;
         $scope.showPhotos = false;
         $scope.fullPhoto = null;
         $scope.message = '';
         $scope.wasAction = false;
         

         var ach = {};
      

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
          name: ach.name,
          organization: ach.organization,
          result: ach.result,
          checked: ach.checked,
          description: ach.description,
          created: cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear(),
          message: ach.message,
          files: ach.files,
          level: ach.level
        };

        $scope.confirm = function() {
          $http.post('api/admin/confirm/' + ach._id).success(function(result) {
            $scope.$emit('showMessage',  {msg: 'Достижение подтверждено', type: 'good'});
              $state.go('student', {id: $stateParams.owner._id});

          })

        };

        $scope.unconfirm = function() {
          if($scope.message != '') {
          $scope.showTextaria = false;
          $http.post('api/admin/unconfirm/' + ach._id, {message: $scope.message}).success(function(result) {
            $scope.$emit('showMessage', {msg: 'Отказ отправлен', type: 'good'});
              $state.go('student', {id: $stateParams.owner._id});
          })
        }
         };

         $scope.isPdf = function(photo) {
          return !(photo.split('.').indexOf('pdf') == -1);
        };

       $scope.showPhoto = function(photo) {
          if(!$scope.isPdf(photo)) {
            $scope.photoToShow = photo;
            $scope.visiblePhoto = true;
          } else {
            var url = API.baseUrl + photo.slice(1, photo.length);
            $window.open(url);
          } 
         }
}])

.controller('inviteCtrl',
    ['$scope',
        '$http',
        'API',
        function($scope, $http, API) {
                    $scope.inviteCode = 'код';
                    $scope.inviteLink = 'ссылка';
                    $scope.secret = null;

                    $scope.generate = function() {
                    if($scope.currentUser.role == 1) {
                    if($scope.secret) {
                        $http.post('api/admin/invite/' + $scope.currentUser._id, {secret: $scope.secret}).success(function (res) {
                            $scope.inviteCode = res.data;
                            $scope.inviteLink = API.baseUrl + '/admin/registryAdmin/' + res.data;
                        })
                    } else {
                        $scope.$emit('showMessage', {msg: 'Требуются права администратора', type: 'bad'});
                    }
                  }
                  }
                
      
    }]);

angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
   '$state',
   'UserManager',
   '$timeout',
   'API',
  function ($scope, $state, UserManager, $timeout, API) {

     //define default vars and consts
     $scope.starting = false;
     $scope.BASE_URI = API.baseUrl;
     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.showMessage = false;
     $scope.msg = {
      content: '',
      type: {
        good: false,
        bad: false
      }
     };
     $scope.currentUser = {};
     $scope.onLoad = {
            common: false,
            studentDetail: false,
            avatar: false,
            achivments: false,
            file: false
          };

     auth();

    //event listeners

     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
     });

      $scope.$on('auth', function (e, args) {
           auth();
           $scope.$broadcast('userUpdated');
      });     

      $scope.$on('userUpdate', function (e, args) {
           UserManager.update().then(function() {
            $scope.$emit('auth');
           })
      });   

      $scope.$on('showMessage', function(e, args) {
         showMessage(e, args);
      });

      $scope.$on('loadData', function(e, args) {
        startLoad(e, args);
      });

      $scope.$on('loadData_done', function(e, args) {
        stopLoad(e, args);
      });

      //describe functions

      $scope.logout = function() {
          UserManager.logout();
          $scope.$emit('userUpdate');
          $state.go('auth');
        };

      function auth() {
          UserManager.Current().then(function (result) {
            if(!result) $scope.currentUser = null;
            else $scope.currentUser = result.data.user;
            console.log($scope.currentUser);
        });
      };

      function showMessage(e , args) {
        $scope.showMessage = true;
        $scope.msg.type[args.type] = true;
        $scope.msg.content = args.msg;
        console.log($scope.msg);

        $timeout(function() {
        angular.element(document.querySelector('.notification_popup')).removeClass('.popupIn').addClass('.popupOut');
             $scope.showMessage = false;
              $scope.msg.type[args.type] = false;
              $scope.msg.content = '';
        }, 5000);
      };

      function startLoad(e, args) {

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + ' is not defined');
        else $scope.onLoad[args.field] = true;

      };

      function stopLoad(e, args) {

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + 'is not defined');
        else $scope.onLoad[args.field] = false;
        
      };

       $timeout(function() {
        $scope.starting = false;
       }, 2500)

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

         baseUrl: 'http://achievements.lod-misis.ru',
        
        apiUrls : {

      user: {

        get: {
          method: 'POST',
          url: function(params) {
            return '/api/auth' + '/isAuth';
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
      query: query.bind(config),
      baseUrl: config.baseUrl,
      apiUrls: config.apiUrls,
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
    'API',
   function ($rootScope, $q, $http, API) {
        
        var apiUrl = '/api';
        var curUser = null;

        var userDetail = null;

        function Current() {
              return API.query('user.get', null, false).then(function(res) {
            return res;
            })
          };

        

         function update() {
            return $q.when(updateUser()).then(function(res) {
          return res;
           })
         };
    
      function updateUser() {
        return $http.get('/api/admin/update').success(function(result) {
          console.log('ok');
          return result.data;
       })
      };

       

        function logout() {
            return $http.post('/api/auth/logout').success(function (data) {
                curUser = null;
                var defaultAction = true;
                return data && data.result
                    ? data.result : defaultAction;
            });
        }

        return {
            Current: Current,
            logout: logout,
            update: update
        }
    }])

