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
           }
         }
       })

        .state('mainPage', {
         url: '/',
         views: {
           'page_content': {
             templateUrl: 'partials/main.html',
             controller: 'indexCtrl'
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
  
  .controller('indexCtrl',
   ['$scope',
    'API',
    'avatar',
   function($scope, API, avatar){

      var studentsLimit = 3;
      $scope.lastStudents = [];
      $scope.avatar = avatar;
      API.query('students.getLast', null, true).then(function(res) {
        var result = res.data;
         result = result.map(function(student) {
          student.achivments = student.achivments.filter(function(ach) {
            return ach.checked;
          });
          student.achivments = student.achivments.sort(function(a, b) {
             var aCr = new Date();
             aCr.setTime(Date.parse(a.created));
             var bCr = new Date();
             bCr.setTime(Date.parse(b.created));
             return a > b ? 1 : -1
          });
          student.achivments = student.achivments.reverse();
          return student;
        });
         console.log(result);
        
          $scope.lastStudents = result.slice(0, studentsLimit);
        
      })
      
    
  }])

  .controller('studentsBaseCtrl',
   ['$scope',
    '$http',
    'API',
    'avatar',
   function ($scope, $http, API, avatar) {

      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});
      $scope.avatar = avatar;
      var studentsList;
      var viewItemCount = 5;
       $scope.$emit('loadData', {field: 'common'});
      API.query('students.get', null, true).then(function(result) {
        studentsList = result.data.reverse();
        var cropArr = studentsList;
        $scope.searchResults = cropArr.slice(0, 4);
         $scope.$emit('loadData_done', {field: 'common'});
      })

      $scope.$watch('searchParams.category', function() {
        $scope.searchParams.name = '';
        var category = '';
        switch($scope.searchParams.category) {
          case 'Наука' : category = 'science';  break;
          case 'Общественная деятельность' : category = 'social'; break;
          case 'Культура' : category = 'cultural'; break;
          case 'Спорт' : category = 'sport'; break;
          case 'Учеба' : category = 'study'; break;
          case 'Предпринимательство' : category = 'business'; break;
          case 'Межкультурный диалог' : category = 'international'; break;

        }
         

        $scope.getStudentsList({name: '', category: category});
        
      })

      $scope.getMoreStudents = function() {
        console.log(studentsList);
        var cropArr = studentsList;
        var newElems = cropArr.slice($scope.searchResults.length, $scope.searchResults.length + 3);
        console.log(newElems);
        $scope.searchResults = $scope.searchResults.concat(newElems);
      }

      $scope.getStudentsList = function(searchParams) {
         $scope.$emit('loadData', {field: 'common'});
        $scope.searchResults = {};
        API.query('students.search', {searchParams: searchParams}, true).then(function(result) {
          studentsList = result.data;
          var cropArr = studentsList;
          $scope.searchResults = cropArr.slice(0, 4);
           $scope.$emit('loadData_done', {field: 'common'});
        });
      };

    }
  ]) 

  .controller('accountCtrl',
   ['$scope',
    '$http',
    '$state',
    'Upload',
    'avatar',
   function ($scope, $http, $state, Upload, avatar) {

    $scope.$emit('changeTitle', {title: 'Профиль студента'});    
    $scope.$emit('needAuth');
    $scope.avatar = avatar;
    $scope.showEditField = false;
    $scope.userDetail = $scope.currentUser; 
    $scope.oldAbout = '';
    $scope.newUserDetail = '';

    $scope.$on('userUpdated', function() {
      $state.reload();
    })

      $scope.editUserDetail = function () {
        $scope.showEditField= true;
        $scope.newUserDetail = $scope.userDetail.about;
        $scope.oldAbout = $scope.userDetail.about;
        $scope.userDetail.about = '';
      }

      $scope.applyChanges = function () {    
        console.log($scope.newUserDetail);
        $scope.userDetail.about = $scope.newUserDetail;
        $http.post('/api/students/' + $scope.currentUser._id, {about : $scope.newUserDetail}).success(function(data) {
          $scope.$emit('showMessage', {msg: 'Информация успешно изменена',  type: 'good'});
        });
        $scope.showEditField = false;    
      }

      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = '';
          $scope.userDetail.about = $scope.oldAbout;
      }

      $scope.uploadAvatar = function(avatar) {
        Upload.upload({
            url: '/api/students/' + $scope.currentUser._id + '/avatar',
            data: {avatar : avatar}
          }).then(function(res) {
            $scope.$emit('userUpdate');
            $scope.$emit('showMessage', {msg: 'Аватар успешно изменен',  type: 'good'});
           
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
     $scope.student = {};
     $scope.$emit('loadData', {field: 'common'});
     $http.get('/api/students/' + $stateParams.id).success(function(data) {
      console.log(data);
     $scope.student = data;
     $scope.$emit('loadData_done', {field: 'common'});
     })

  }])

  .controller('achCtrl', 
    ['$scope', 
      '$state', 
      'API',
      '$stateParams',
      '$window',
     function($scope, $state, API, $stateParams, $window){
        var ach = {};
        var owner = {};
        $scope.visiblePhoto = false;
        $scope.$emit('loadData', {field: 'common'});
        API.query('achivments.getDetail', 
                  {
                    achId: $stateParams.achId, 
                    studentId: $stateParams.studentId 

                  }).then(function(res) {
                    console.log(res);
                    if(res.data) {
                      ach = res.data.achivment;
                      owner = res.data.owner;
                    }

                    var type = '';

                      switch(ach.type) {
                        case 'science' : type = 'Наука';  break;
                        case 'social' : type = 'Общественная деятельность'; break;
                        case 'cultural' : type = 'Культура'; break;
                        case 'sport' : type = 'Спорт'; break;
                        case 'study' : type = 'Учеба'; break;
                        case 'business' : type = 'Предпринимательство'; break;
                        case 'international' : type = 'Межкультурный диалог'; break;
                      }

                      var cr = new Date();
                      cr.setTime(Date.parse(ach.created));

                      $scope.achivment = ach;
                      $scope.achivment.type = type;
                      $scope.achivment.owner = owner;
                      $scope.achivment.created =  cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear();
                      $scope.$emit('loadData_done', {field: 'common'});
                  });
        

        $scope.isPdf = function(photo) {
          return !(photo.split('.').indexOf('pdf') == -1);
        }
         
        $scope.showPhoto = function(photo) {
          if(!$scope.isPdf(photo)) {
            $scope.photoToShow = photo;
            $scope.visiblePhoto = true;
          } else {
            var url = 'http://162.243.78.140' + photo.slice(1, photo.length);
            $window.open(url);
          }
         }
       }])

  .controller('newAchCtrl',
    ['$scope',
     '$http',
     '$timeout',
     'Upload',
     '$state',
    function($scope, $http, $timeout, Upload, $state) {

    $scope.newAch = {};    $scope.type = 'Наука';
    $scope.files = [];
    $scope.selectedFiles = [];
    $scope.$watch('type', function() {

      var category = '';
        switch($scope.type) {
          case 'Наука' : category = 'science';  break;
          case 'Общественная деятельность' : category = 'social'; break;
          case 'Культура' : category = 'cultural'; break;
          case 'Спорт' : category = 'sport'; break;
          case 'Учеба' : category = 'study' ; break;
          case 'Предпринимательство' : category = 'business'; break;
          case 'Межкультурный диалог' : category = 'international'; break;
        }
        $scope.newAch.type = category;
    });
     

    $scope.isValid =  function () {
            return ($scope.files.length != 0) 
            && $scope.newAch.name
            && $scope.newAch.result
            && $scope.newAch.organization;
          };

    $scope.uploadFile = function(file) {
      $scope.$emit('loadData', {field: 'file'});
      console.log(file);
      if(file.name) {
      $scope.selectedFiles.push(file);
      Upload.upload({
        url: '/api/students/' + $scope.currentUser._id + '/achivments/file',
        data: {file: file}
          }).then(function(res) {
            console.log(res);

            if(!res.data) {
              $scope.$emit('showMessage', {msg: 'Произошла ошибка',  type: 'bad'});
            } else {
              $scope.$emit('showMessage', {msg: 'Файлы отправлены',  type: 'good'});
              $scope.$emit('loadData_done', {field: 'file'});
              $scope.files.push(res.data.fileLink);
            }
         })
        }

         $scope.isPdf = function(photo) {
          return !(photo.split('.').indexOf('pdf') == -1);
        }
    };      
  
    $scope.submit = function() {
      if ($scope.isValid()) {
        $scope.$emit('waiting')
        $scope.newAch.owner_id = $scope.currentUser._id;
        $scope.newAch.files = $scope.files;
          $http.post('/api/students/' + $scope.currentUser._id + '/achivments/', $scope.newAch).success(function(res) {
            $scope.$emit('showMessage', {msg: 'Достижение добавлено, ожидайте подтверждения',  type: 'good'});
            $scope.$emit('userUpdate');
            $state.go('studentsBase');
          })
      } else {
        $scope.$emit('showMessage', {msg: 'Заполните все поля формы и добавьте подтверждающие документы',  type: 'bad'})
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
        console.log(res); 
        if(res.data) {
          $scope.$emit('auth');
          $state.go('studentsBase');
        } else {
          $scope.$emit('showMessage', {msg: 'Студент не найден, проверьте введенные данные', type: 'bad'});
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
       $http({
          method  : 'POST',
          url     : '/api/students/',
          data    : $scope.newStudent
          
         }).success(function(res) {
          $scope.$emit('showMessage', {msg: 'Регистрация прошла успешно, ждите верификации', type: 'good'});
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
   '$timeout',
   'API',
  function ($scope, $state, UserManager, $timeout, API) {

      //define default vars and consts

     $scope.BASE_URI = 'http://localhost:3000/';
     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.showMessage = false;
     $scope.msg = {
      content: '',
      type: {
        good: false,
        bad: false
      }
     };
     $scope.bad = false;
     $scope.good = false;
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
          $state.go('mainPage');
        };

      function auth() {
          UserManager.Current().then(function (result) {
            if(!result) $scope.currentUser = null;
            else $scope.currentUser = result;
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

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + 'is not defined');
        console.log(args.field);
        $scope.onLoad[args.field] = true;
      };

      function stopLoad(e, args) {

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + 'is not defined');

        $scope.onLoad[args.field] = false;
        console.log(args.field);
      };

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

      students: {

        add: {
         method: 'POST',
         url: function() {
          return '/api' + '/students/';
         }
        }, 

        get: {
         method: 'GET',
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
        getLast: {
          method: 'GET',
          url: function() {    // post
          return '/api'  + '/studentsL/last';
        }
        
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
  };

  config.BASE_URL = '';

    function parsePath(pathString, obj) {
      var path = pathString.split('.');
      if(Array.isArray(path)) {
        for (var i = 0, l = path.length; i < l; i++) {
          var item = path[i];
          if(obj[item]) {
            obj = obj[item]
          } else {
            console.log('apiUrl error ' + item);
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
        };
        return $http({
                        method: apiMethod.method,
                        url   : apiMethod.url(params),
                        data  : params && params.data ? params.data : null
                    })
                      .success(function(res) {
                          return {
                                  data: res,
                                  method: apiMethod
                                 };
                      });
      };

    };

    return {
      query: query.bind(config),
      config: config
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
    'API',
   function ($rootScope, $q, $http) {
        
        var apiUrl = '/api';


        function Current() {
            return $q.when(getUser()).then(function (result) {
                return  result.data.user || result;
            });

        }

        function getUser() {
          var reqUrl = apiUrl + '/auth/isAuth';
            return $http.post(reqUrl).success(function (data) {
                    return data.user;
            });
        }

       function update() {
        return $q.when(updateUser()).then(function(res) {
          return res;
        })
        } 
      
        function updateUser() {
          return $http.get('/api/auth/update').success(function(result) {
            console.log('ok');
            return result.data;
         })
        };

        function logout() {
            return $http.post('/api/auth/logout').success(function (data) {
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

