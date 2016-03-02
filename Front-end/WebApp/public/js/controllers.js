
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

      var stateName = $state.current.name;
      switch (stateName) {
        case 'studentsBase': $scope.title = 'База активистов НИТУ МИСиС';
          break;
        case 'profile': $scope.title = 'Профиль студента';
          break;
        default: $scope.title = "Онлайн портфолио активных студентов НИТУ МИСиС";

      }

    }])

.controller('pageCtrl',
  ['$scope',
   '$state',
   '$http',
   'UserManager',
    function ($scope, $state, $http, UserManager) {

      $scope.showMobileMenu = false;


      $scope.currentUser = {};
      updateUserData();

      function updateUserData() {

        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
          console.log(result);
        })
      };



      $scope.$on('needAuth', function (e, args) {
          updateUserData();
        if(!($scope.currentUser.name && $scope.currentUser.id)) {
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
    function ($scope, $http) {
      $scope.popup = angular.element(document.querySelector('#achivments_popup'));
      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      $scope.$watch('searchParams.category', function() {
        $scope.searchParams.name = '';
        $scope.getStudentsList($scope.searchParams);
      })

      $scope.getStudentsList = function(searchParams) {
        $scope.$emit('result loading');
        var reqUrl = 'api/students/' + ((searchParams.name == '') ? 'search_by_category/' + searchParams.category : 'search_by_name/' + searchParams.name);
        console.log(reqUrl);
          $http.get(reqUrl).success(function(result) {
            $scope.searchResults = result;
          })
      };

    }
  ]) 

  .controller('profileCtrl',
  [
    '$scope',
    '$http',
    'UserManager',
    function ($scope, $http, UserManager) {
      
  
     $scope.showEditField= false;
      UserManager.getUserDetail().then(function (result) {
        $scope.userDetail = {
            firstName: 'Жамбыл',
            lastName: 'Ермагамбет',
            department: 'ИТАСУ',
            course: '2',
            about: 'Все канавы есть шрамы ночи, что прошиты костями младенцев, зараженными спицами звездного склепа. Сернистая планета испускает благословения, мертвым известны мечты. С мясного крюка я пою песнь о жизни, облетаемой темными метеорами, принесенный в жертву во имя уничтожения человечьей семьи. Песни из воющей головы, кишащей рептильными куклами.',
            photoUri: '../img/jambul.jpg',
            achivments: [{name:'Непроверенное достижение', id: '12', type: 'sport', checked: false}, {name:'олимпиада по материаловедению', id: '12', type: 'social', checked: true}, {name:'Победаqwdq в квн', id: '12', type: 'science', checked: true}, {name:'Побеdwdда в квн', id: '12', type: 'sport', checked: true}]
          };
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
        $scope.userDetail.about = $scope.newUserDetail;
      }
      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = null;
          $scope.userDetail.about = $scope.oldAbout;
      }


    }
  ])

  .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      '$stateParams',
      function($scope, $state, $http, $stateParams){
        console.log($stateParams.achToShow);
        $scope.achivment = {
          owner: {
            id: '1',
            name: $scope.currentUser.name
          },
          title: $stateParams.achToShow.name,
          photo: [],
          description: 'Мое зерцало разделено на бездонные, экстатические квадранты. В первом — ода сосанию юных дев, сокрывших Червя-Победителя внутри своей розы. Второй вещает веления королей, вбитых в вазы, затопленные псалмы, что лижут кал дьявола, дравшего драгой мой разум. В третьем — сквозные скукоженные проекции, полные страха сношающихся детей, что ищут убежища от размахов маятника. '
        }
    
       }])

  .controller('newAchCtrl',
    [
    '$scope',
    '$http',
     function($scope, $http) {
    $scope.newAch = {};
    $scope.newAch.id = 1;
    $scope.newAch.owner_id = $scope.currentUser.id;
        // Valid mimetypes
    $scope.acceptTypes = 'image/*';
      // Data to be sent to the server with the upload request
      $scope.onUpload = function (files) {
        console.log('AdvancedMarkupCtrl.onUpload', files);
      };

    $scope.submitForm = function() {};
  }])

  .controller('authCtrl', ['$scope', function($scope){
  }])

  .controller('registryCtrl', ['$scope', function($scope){
    $scope.submit = function() {};
  }])
