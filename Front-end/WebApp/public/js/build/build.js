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

       $stateProvider.state('studentsBase', {
         url: '/studentsBase',
         views: {
           'page_content': {
             templateUrl: 'partials/studentsBase.html',
             controller: 'studentsBaseCtrl'
           }
         }
       })

        .state('mainPage', {
         url: '/',
         views: {
           'page_content': {
             templateUrl: 'partials/main.html',
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
         }
       })

       .state('profile', {
         url: '/profile/:id',
         views: {
           'page_content': {
             templateUrl: 'partials/profile_another.html',
             controller: 'profileCtrl'
           }
         },
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
          url: '/achivment_detail',
          params: {
            'achToShow': null,
            'owner': null
          },
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


angular.module('app.controllers.partials',
[ 
  'ui.router'
])

  .controller('studentsBaseCtrl',
   ['$scope',
    '$http',
    'API',
    'avatar',
   function ($scope, $http, API, avatar) {
      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});
      $scope.avatar = avatar;
      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      $scope.$watch('searchParams.category', function() {
        $scope.searchParams.name = '';
        var category = '';
        switch($scope.searchParams.category) {
          case 'Наука' : category = 'science';  break;
          case 'Общественная деятельность' : category = 'social'; break;
          case 'Культура' : category = 'cultural'; break;
          case 'Спорт' : category = 'sport'; break;
          case 'Учеба' : category = 'study'; break;
        }
         

        $scope.getStudentsList({name: '', category: category});
        
      })

      $scope.getStudentsList = function(searchParams) {
        $scope.searchResults = {}
        $scope.$emit('result loading');
        API.query('students.search', {searchParams: searchParams}, true).then(function(result) {
          $scope.searchResults = result.data;
        });
      };

    }
  ]) 

  .controller('accountCtrl',
   ['$scope',
    '$http',
    'UserManager',
    'Upload',
    'avatar',
   function ($scope, $http, UserManager, Upload, avatar) {

    $scope.$emit('changeTitle', {title: 'Профиль студента'});    
    $scope.$emit('needAuth');
    $scope.avatar = avatar;
    $scope.showEditField = false;
    $scope.userDetail = $scope.currentUser; 
    $scope.oldAbout = '';
    $scope.newUserDetail = '';

      $scope.editUserDetail = function () {
        $scope.showEditField= true;
        $scope.newUserDetail = $scope.userDetail.about;
        $scope.oldAbout = $scope.userDetail.about;
        $scope.userDetail.about = '';
      }

      $scope.applyChanges = function () {    
        $scope.userDetail.about = $scope.newUserDetail;
        $http.post('/api/students/' + $scope.currentUser._id, {about : $scope.newUserDetail}).success(function(data) {
          console.log(data);
          $scope.$emit('userUpdate');
        });
        $scope.showEditField = false;    
      }
      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = null;
          $scope.userDetail.about = $scope.oldAbout;
      }

      $scope.uploadAvatar = function(avatar) {
        console.log(avatar);
        Upload.upload({
            url: '/api/students/' + $scope.currentUser._id + '/avatar',
            data: {avatar : avatar}
          }).then(function(res) {
            console.log(res);
            $scope.$emit('userUpdate');
          })

      };
    }
  ])
  
  .controller('profileCtrl',
   ['$scope',
    '$http',
    '$stateParams',
    'avatar',
   function($scope, $http, $stateParams, avatar){

      $scope.avatar = avatar;
      console.log($stateParams.id);
     $scope.student = {};
     $http.get('/api/students/' + $stateParams.id).success(function(data) {
      console.log(data);
     $scope.student = data;
     $scope.photo = function(student) {
       return student.photoUri ? 'background-image: url(' + student.photoUri + ')' : ''; 
      };
     })

  }])

  .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      '$stateParams',
     function($scope, $state, $http, $stateParams){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name}); 
         console.log($stateParams)
        var ach = $stateParams.achToShow;
        var type = '';
        switch(ach.type) {
          case 'science' : type = 'Наука';  break;
          case 'social' : type = 'Общественная деятельность'; break;
          case 'cultural' : type = 'Культура'; break;
          case 'sport' : type = 'Спорт'; break;
          case 'study' : type = 'Учеба'; break;
        }

        $scope.achivment = {
          owner: $stateParams.owner,
          type: type,
          title: ach.name,
          organization: ach.organization,
          result: ach.result,
          photo: [],
          checked: ach.checked,
          description: ach.description 
        }

        $scope.type = '';

         switch(ach.type) {
          case 'science' : category = 'Наука';  break;
          case 'social' : category = 'Общественная деятельность'; break;
          case 'cultural' : category = 'Культура'; break;
          case 'sport' : category = 'Спорт'; break;
          case 'study' : category = 'Учеба'; break;
        }
         
    
       }])

  .controller('newAchCtrl',
    ['$scope',
     '$http',
     '$timeout',
     'Upload',
     '$state',
    function($scope, $http, $timeout, Upload, $state) {
    $scope.newAch = {};
    $scope.type = 'Наука';
    $scope.$watch('type', function() {
      var category = '';
        switch($scope.type) {
          case 'Наука' : category = 'science';  break;
          case 'Общественная деятельность' : category = 'social'; break;
          case 'Культура' : category = 'cultural'; break;
          case 'Спорт' : category = 'sport'; break;
          case 'Учеба' : category = 'study'; break;
        }
        $scope.newAch.type = category;
    });
      function isValid() {
            return $scope.files && $scope.newAch.name && $scope.newAch.result && $scope.newAch.organization;
          };

    $scope.isValid = isValid;
  
    $scope.submit = function() {
      if ($scope.isValid()) {
        $scope.newAch.owner_id = $scope.currentUser._id;
        $scope.newAch.file = $scope.files;
        console.log($scope.newAch);
          Upload.upload({
            url: '/api/students/' + $scope.currentUser._id + '/achivments/',
            data: $scope.newAch
          }).then(function(res) {
            console.log(res);
            $scope.$emit('userUpdate');
            $state.go('studentsBase');
          })
      }


    }
  }])

  .controller('authCtrl',
   ['$scope',
    '$http',
    'UserManager', 
    '$state',
   function($scope, $http, UserManager, $state){

    $scope.submit = function() {
      if($scope.auth.$valid) {
      console.log($scope.auth);
      console.log($scope.auth.$valid);
      $http.post('/api/login', $scope.auth).success(function(res) {
        console.log(res); if(res.data) {
          $scope.$emit('userUpdate');
          $state.go('studentsBase');
        } else {
          $scope.auth.email = res;
        }
      })
     }
    };
  }])

  .controller('registryCtrl', 
    ['$scope', 
     '$state', 
     '$http', 
    function($scope, $state, $http){

    $scope.newStudent = {};


    $scope.submit = function() {
      if($scope.newStudent.$valid && $scope.newStudent.password == $scope.checkPassword) {
      console.log($scope.newStudent);
       $http({
          method  : 'POST',
          url     : '/api/students/',
          data    : $scope.newStudent
          
         }).success(function(res) {
          console.log(res);
          $state.go('auth')
         })
      
    }
    };

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
  function ($scope, $state, $http) {


      $scope.showMobileMenu = false;
      angular.element(document.querySelector('.mobile_nav_bar_background')).css('visibility', 'visible');
      $scope.$on('needAuth', function (e, args) {
           if(!$scope.currentUser) {
            $state.go('auth');
            console.log('needAuth')
           }
      })

}]);
angular.module('app.directives', [])




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

