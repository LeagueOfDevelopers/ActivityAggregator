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
            'achToShow': null
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

angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
   '$state',
    function ($scope, $state) {

     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
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

      $scope.currentUser = {};
      updateUserData();
      function updateUserData() {

        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
          console.log(result);
        })
      };



      $scope.$on('auth', function (e, args) {
        if(!$scope.currentUser._id) {
           updateUserData();
        }
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
    'ApiService',
    function ($scope, $http, ApiService) {
      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});

      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      console.log($scope.currentUser);
      console.log('hey');
      $scope.$watch('searchParams.category', function() {
        console.log(document.cookie);
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
        var reqUrl = ApiService.apiUrl.students.search(searchParams);
        console.log(reqUrl);
          $http.get(reqUrl).success(function(result) {
            $scope.searchResults = result;
            console.log(result);
          })
      };

    }
  ]) 

  .controller('accountCtrl',
  [
    '$scope',
    '$http',
    'UserManager',
    function ($scope, $http, UserManager) {
    $scope.$emit('changeTitle', {title: 'Профиль студента'});    
  
     $scope.showEditField= false;
      UserManager.getUserDetail().then(function (result) {
        console.log(result);
      /*  $scope.userDetail = {
            firstName: 'Сергей',
            lastName: 'Сергеев',
            department: 'ИНМиН',
            course: '2',
            about: 'Все канавы есть шрамы ночи, что прошиты костями младенцев, зараженными спицами звездного склепа. Сернистая планета испускает благословения, мертвым известны мечты. С мясного крюка я пою песнь о жизни, облетаемой темными метеорами, принесенный в жертву во имя уничтожения человечьей семьи. Песни из воющей головы, кишащей рептильными куклами.',
            photoUri: '../img/jambul.jpg',
            achivments: [{name:'Непроверенное достижение', id: '12', type: 'sport', checked: false}, {name:'Олимпиада по материаловедению', id: '12', type: 'social', checked: true}, {name:'Победа в квн', id: '12', type: 'cultural', checked: true}, {name:'Победа в квн', id: '12', type: 'sport', checked: true}]
          };*/
          $scope.userDetail = result;

        });
      $scope.oldAbout = '';

      $scope.editUserDetail = function () {
        $scope.showEditField= true;
        $scope.newUserDetail = $scope.userDetail.about;
        $scope.oldAbout = $scope.userDetail.about;
        $scope.userDetail.about = '';
      }
      $scope.applyChanges = function () {
        $scope.showEditField = false;    
        console.log($scope.newUserDetail);     
        $scope.userDetail.about = $scope.newUserDetail;

        $http.post('/api/students/' + $scope.currentUser._id, {about : $scope.newUserDetail}).success(function(data) {
          console.log(data);
          UserManager.getUserDetail().then(function(result) {
            $scope.userDetail = result;

          })
        })
      }
      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = null;
          $scope.userDetail.about = $scope.oldAbout;
      }


    }
  ])
  
  .controller('profileCtrl',
   [
    '$scope',
    '$http',
    '$stateParams',
    function($scope, $http, $stateParams){
      console.log($stateParams.id);
     $scope.student = {};
     $http.get('/api/students/' + $stateParams.id).success(function(data) {
      console.log(data);
      $scope.student = data;
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
        $scope.achivment = {
          owner: {
            id: $scope.currentUser._Id,
            name: $scope.currentUser.name
          },
          title: ach.name,
          organization: ach.organization,
          type: ach.type,
          result: ach.result,
          photo: [],
          checked: ach.checked,
          description: ach.description 
        }
    
       }])

  .controller('newAchCtrl',
    [
    '$scope',
    '$http',
    '$timeout',
    'Upload',
     function($scope, $http, $timeout, Upload) {

    $scope.newAch = {
      owner_id: $scope.currentUser._id
    };
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

  
    $scope.submit = function() {

      if (
          $scope.files) {
        $scope.newAch.file = $scope.files;
        console.log($scope.files);
          Upload.upload({
            url: '/api/students/' + $scope.currentUser._id + '/achivments/',
            data: $scope.newAch
          }).then(function(res) {
            console.log(res);
          })
      console.log($scope.newAch);
      }

       /*$http({
          method  : 'POST',
          headers : {
            'Content-Type': undefined
          },
          url     : '/api/students/' + $scope.currentUser.id + '/achivments/',
          data    : $scope.newAch
          
         }).success(function(res) {
          console.log(res);
          $state.go('account');
         })*/
    }
  }])

  .controller('authCtrl', ['$scope', '$http', 'UserManager', '$state', function($scope, $http, UserManager, $state){
    $scope.auth = {};
    $scope.submit = function() {
      $http.post('/api/login', $scope.auth).success(function(res) {
        if(res.data) {
          $state.go('studentsBase');
          UserManager.setCurrentUser(res.data);
          $scope.$emit('auth');
        }
      })
    };
  }])

  .controller('registryCtrl', ['$scope', '$state', '$http', function($scope, $state, $http){
    $scope.newStudent = {};

    $scope.submit = function() {
      console.log($scope.newStudent);
       $http({
          method  : 'POST',
          url     : '/api/students/',
          data    : $scope.newStudent
          
         }).success(function(res) {
          console.log(res);
          $state.go('studentsBase')
         })
    };
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

  .service('ApiService', ['$rootScope', function($rootScope){
    return {
      apiUrl: {
      students: {

        add: '/api' + '/students/', //post

        getDetail: function(id) {    // get
          return '/api'  + '/students/' + id;
        },

        updateDetail: function(id) {    // post
          return '/api'  + '/students/' + id;
        },

        search: function(searchParams) {   //get
          return '/api'  + '/students/' + ((searchParams.name == '') ? 
                                          'search_by_category/' + searchParams.category : 
                                          'search_by_name/' + searchParams.name);
        },

        achivments: {
          add: function(id) { //post
            return rootApi + '/students/' + id + '/achivments';
          },

          getDetail: function(id, achId) {
            return rootApi + '/students/' + id + '/achivments/' + achId;
          }
        }

      }
    }
  }
  }])

  .service('UserManager',
   ['$rootScope',
    '$q',
    '$http',
     function ($rootScope, $q, $http) {
        
        var apiUrl = '/api';
        var curUser = { };

        var userDetail = null;
        function setCurrentUser(data) {
          curUser = data;
         // $http.post(apiUrl + '/auth/isAuth', data);
          };
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
        return $q.when(getDetail()).then(function (result) {
          return result.data;
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
            getUserDetail: getUserDetail,
            setCurrentUser: setCurrentUser
        }
    }])

