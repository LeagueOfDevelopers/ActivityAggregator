
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
        
      });
      
  }])

  .controller('studentsBaseCtrl',
   ['$scope',
    '$http',
    'API',
    'avatar',
   function ($scope, $http, API, avatar) {

      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});
      $scope.$emit('loadData', {field: 'common'});

      $scope.avatar = avatar
      $scope.searchResults = [];

      var studentsList = {
          students: [],
          generateShortAchList: generateShortAchList
      };

      var countOfItems = 5;
      var appendingCount = 3;
      var shortAchListLimit = 4;

      getAllStudents();

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
          case 'Все' : category = ''; break;
        };
         
        $scope.getStudentsList({name: '', category: category});
        
       })

      $scope.getMoreStudents = function() {
        var cropArr = studentsList.students;

        var newElems = cropArr.slice($scope.searchResults.length, $scope.searchResults.length + appendingCount);
        $scope.searchResults = $scope.searchResults.concat(newElems);
        
      }

      $scope.getStudentsList = function(searchParams) {

         $scope.$emit('loadData', {field: 'common'});
         $scope.searchResults = {};

         if(searchParams.category == '' && searchParams.name == '' ) {

            getAllStudents();

         } else {

          API.query('students.search', {searchParams: searchParams}, true).then(function(result) {
            studentsList.students = result.data;
            studentsList.generateShortAchList();
            var cropArr = studentsList.students;
            $scope.searchResults = cropArr.slice(0, 4);
           

            $scope.$emit('loadData_done', {field: 'common'});
          })
        }
      };

      $scope.needPagination = function()  {
            return studentsList.students[$scope.searchResults.length + 1] ?
                    true :
                    false;
      };

      function getAllStudents() { 

        API.query('students.get', null, true).then(function(result) {
          studentsList.students = result.data.reverse();
          studentsList.generateShortAchList();
          var cropArr = studentsList.students;
          $scope.searchResults = cropArr.slice(0, countOfItems - 1);
           $scope.$emit('loadData_done', {field: 'common'});
           console.log( studentsList);
        })
      };

      function generateShortAchList() {

        this.students.map(function(student) {

            var shortAchList = student.achivments.filter(function(ach) {
              return ach.checked;
            });
            student.shortAchList = shortAchList.slice(0, shortAchListLimit - 1);
          return student;
        })
      };

    }]) 

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
    });

      $scope.editUserDetail = function () {
        $scope.showEditField= true;
        $scope.newUserDetail = $scope.userDetail.about;
        $scope.oldAbout = $scope.userDetail.about;
        $scope.userDetail.about = '';
      };

      $scope.applyChanges = function () {    
        console.log($scope.newUserDetail);
        $scope.userDetail.about = $scope.newUserDetail;
        $http.post('/api/students/' + $scope.currentUser._id, {about : $scope.newUserDetail}).success(function(data) {
          $scope.$emit('showMessage', {msg: 'Информация успешно изменена',  type: 'good'});
        });
        $scope.showEditField = false;    
      };

      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = '';
          $scope.userDetail.about = $scope.oldAbout;
      };

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
                      };

                      var cr = new Date();
                      cr.setTime(Date.parse(ach.created));

                      $scope.achivment = ach;
                      $scope.achivment.type = type;
                      $scope.achivment.owner = owner;
                      $scope.achivment.created =  cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear();
                      $scope.$emit('loadData_done', {field: 'common'});

                      var details = {
                        type: {
                          title: "категория"
                        },
                        level: {
                          title: "уровень"
                        },
                        created: {
                          title: "получено"
                        },
                        organization: {
                          title: "организация"
                        },
                        result: {
                          title: "результат"
                        },
                        checked: {
                          title: "подтверждено"
                        }
                      };

                      $scope.details = {};

                      details.forEach(function(item, key) {
                        $scope.details[key] = {};
                        $scope.details[key].title = item.title;
                        $scope.details[key].value = $scope.achivment[key];
                      });

                      console.log($scope.details);
                  });
        

        $scope.isPdf = function(photo) {
          return !(photo.split('.').indexOf('pdf') == -1);
        }
         
        $scope.showPhoto = function(photo) {
          if(!$scope.isPdf(photo)) {
            $scope.photoToShow = photo;
            $scope.visiblePhoto = true;
          } else {
            var url = $scope.BASE_URL + photo.slice(1, photo.length);
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

    $scope.newAch = {};    
    $scope.type = 'Наука';
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
   
      if(file.name && $scope.selectedFiles.indexOf(file.name) == -1) {

      $scope.$emit('loadData', {field: 'file'});
      $scope.selectedFiles.push(file.name);
      Upload.upload({
        url: '/api/students/' + $scope.currentUser._id + '/achivments/file',
        data: {file: file}
          }).then(function(res) {
            console.log(res);
              $scope.$emit('loadData_done', {field: 'file'});
            if(!res.data) {
              $scope.$emit('showMessage', {msg: 'Произошла ошибка',  type: 'bad'});
            } else {
              $scope.$emit('showMessage', {msg: 'Файлы отправлены',  type: 'good'});
              $scope.files.push(res.data.fileLink);
            }
         })
        } else {
          $scope.$emit('showMessage', {msg: 'Файл уже выбран',  type: 'bad'});
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
           console.log(res);
           if(!res.err) {
               $scope.$emit('showMessage', {msg: 'Регистрация прошла успешно, ждите верификации', type: 'good'});
               $state.go('auth');
           } else {
               $scope.$emit('showMessage', {msg: 'Пользователь с такими данными уже зарегестрирован', type: 'bad'});
           }
         })
      
    }
    };

  }])

.controller('recoveryCtrl',
['$scope',
 'API',
 '$state',
function($scope, API, $state) {
    $scope.tokenCorrect = false;
    $scope.tokenGetted = false;

    $scope.startRecovery = function () {
        if($scope.recovery.email) {
            API.query('user.getRecoveryToken', { data: {email: $scope.recovery.email }}, true).then(function (res) {
                $scope.tokenGetted = true;
            })
        }
    };

    $scope.checkRecoveryToken = function () {
        if($scope.recovery.email && $scope.recovery.token) {
            API.query('user.checkRecoveryToken', {
                data: {
                    email: $scope.recovery.email,
                    token: $scope.recovery.token
                }
            }, true).then(function(res) {
                if(res.data.code == 2) {
                    $scope.tokenCorrect = true;
                } else {
                    $scope.$emit('showMessage', {msg: 'Код неверен', type: 'bad'});
                }
            })
        }
    };

    $scope.submitNewPassword = function () {
        if($scope.newPassword.newPass == $scope.checkPassword) {
            API.query('user.newPasswordByRecovery', {
                data: {
                    email: $scope.recovery.email,
                    token: $scope.recovery.token,
                    newPass: $scope.newPassword.newPass
                }
            }, true).then(function(res) {
                if(res.data.code == 2) {
                    $scope.$emit('showMessage', {msg: 'Пароль успешно изменен', type: 'good'});
                    $state.go('auth');
                } else {
                    $scope.$emit('showMessage', {msg: 'Код восстановления неверен', type: 'bad'});
                }
            })
        }
    }
}])
