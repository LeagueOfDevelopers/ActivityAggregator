
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
           updateUserData();
      })


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
    'ApiService',
    function ($scope, $http, ApiService) {
      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});

      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      console.log($scope.currentUser);
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
    $scope.$emit('needAuth');
      $scope.showEditField= false;
      $scope.userDetail = $scope.currentUser;
      $scope.photo = $scope.userDetail.photoUri ? 'background-image: url({{userDetail.photoUri}}' : ''; 
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

      if (
          $scope.files) {
        $scope.newAch.file = $scope.files;
        console.log($scope.files);
        console.log($scope.newAch);
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
          $scope.$emit('auth');
          $state.go('studentsBase');
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
