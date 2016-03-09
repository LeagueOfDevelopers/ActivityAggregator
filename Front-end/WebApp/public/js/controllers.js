
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
        })
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

angular.module('app.controllers.partials',
[ 
  'ui.router'
])

  .controller('studentsBaseCtrl',
  [
    '$scope',
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
  [
    '$scope',
    '$http',
    'UserManager',
    'Upload',
    'avatar',
    function ($scope, $http, UserManager, Upload, avatar) {
    $scope.$emit('changeTitle', {title: 'Профиль студента'});    
    $scope.$emit('needAuth');
    $scope.avatar = avatar;
    $scope.showEditField= false;
    $scope.userDetail = $scope.currentUser; 
    $scope.oldAbout = '';

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
          console.log(data);
          $scope.$emit('userUpdate');
        })
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
          })

      };
    }
  ])
  
  .controller('profileCtrl',
   [
    '$scope',
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
    [
    '$scope',
    '$http',
    '$timeout',
    'Upload',
    '$state',
     function($scope, $http, $timeout, Upload, $state) {

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

      if ($scope.files) {
        $scope.newAch.file = $scope.files;
        console.log($scope.files);
        console.log($scope.newAch);
          Upload.upload({
            url: '/api/students/' + $scope.currentUser._id + '/achivments/',
            data: $scope.newAch
          }).then(function(res) {
            $scope.$emit('userUpdate');
            $state.go('studentsBase');
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
      console.log($scope.auth);
      $http.post('/api/login', $scope.auth).success(function(res) {
        console.log(res);
        if(res.data) {
          $scope.$emit('userUpdate');
          $state.go('studentsBase');
        } else {
          $scope.auth.email = res;
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
          $state.go('auth')
         })
    };
  }])
