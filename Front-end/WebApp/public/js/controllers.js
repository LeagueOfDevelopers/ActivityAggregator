
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
     [
     '$scope',
      'API',
     function($scope, API){
      API.query('students.getLast', null, true).then(function(ressult) {
        var res = result.data;
        $scope.list = [res[res.length - 3], res[res.length - 2], res[res.length - 1]];
        console.log($scope.list);
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
      API.query('students.getLast', null, true).then(function(result) {
        $scope.searchResults = result.data;
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


      $scope.getStudentsList = function(searchParams) {
        $scope.searchResults = {}
        API.query('students.search', {searchParams: searchParams}, true).then(function(result) {
          $scope.searchResults = result.data;
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
          $scope.$emit('showMessage', {msg: 'Информация успешно изменена'});
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
            $scope.$emit('showMessage', {msg: 'Аватар успешно изменен'});
           
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
      '$window',
     function($scope, $state, $http, $stateParams, $window){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name});
        var ach = $stateParams.achToShow;
        $scope.visiblePhoto = false;
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
         
         $scope.showPhoto = function(photo) {
          $scope.photoToShow = photo;
          $scope.visiblePhoto = true;
         }
         $scope.showPdf = function(pdf) {
            $window.open('localhost:3000/' + pdf)
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
      console.log(file);
      if(file.name) {
      $scope.selectedFiles.push(file);
      Upload.upload({
        url: '/api/students/' + $scope.currentUser._id + '/achivments/file',
        data: {file: file}
          }).then(function(res) {
            console.log(res);

            if(!res.data) {
              $scope.$emit('showMessage', {msg: 'Произошла ошибка'});
            } else {
              $scope.$emit('showMessage', {msg: 'Файлы отправлены'});
              $scope.files.push(res.data.fileLink);
            }
         })
        }
    };      
  
    $scope.submit = function() {
      if ($scope.isValid()) {
        $scope.$emit('waiting')
        $scope.newAch.owner_id = $scope.currentUser._id;
        $scope.newAch.files = $scope.files;
          $http.post('/api/students/' + $scope.currentUser._id + '/achivments/', $scope.newAch).success(function(res) {
            $scope.$emit('showMessage', {msg: 'Достижение добавлено, ожидайте подтверждения'})
           // $state.go('studentsBase');
          })
      } else {
        $scope.$emit('showMessage', {msg: 'Заполните все поля формы и добавьте подтверждающие документы'})
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
          $scope.$emit('showMessage', {msg: 'Студент не найден, проверьте введенные данные'});
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
          $scope.$emit('showMessage', {msg: 'Регистрация прошла успешно, ждите верификации'})
          $state.go('auth')
         })
      
    }
    };

  }])
