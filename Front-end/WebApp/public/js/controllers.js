
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
    'ApiService',
    function ($scope, $http, ApiService) {
      $scope.$emit('changeTitle', {title: 'База активистов НИТУ МИСиС'});
      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      $scope.$watch('searchParams.category', function() {
        $scope.searchParams.name = '';
        $scope.getStudentsList($scope.searchParams);
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
        $scope.userDetail = {
            firstName: 'Сергей',
            lastName: 'Сергеев',
            department: 'ИНМиН',
            course: '2',
            about: 'Все канавы есть шрамы ночи, что прошиты костями младенцев, зараженными спицами звездного склепа. Сернистая планета испускает благословения, мертвым известны мечты. С мясного крюка я пою песнь о жизни, облетаемой темными метеорами, принесенный в жертву во имя уничтожения человечьей семьи. Песни из воющей головы, кишащей рептильными куклами.',
            photoUri: '../img/jambul.jpg',
            achivments: [{name:'Непроверенное достижение', id: '12', type: 'sport', checked: false}, {name:'Олимпиада по материаловедению', id: '12', type: 'social', checked: true}, {name:'Победа в квн', id: '12', type: 'cultural', checked: true}, {name:'Победа в квн', id: '12', type: 'sport', checked: true}]
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
        console.log($scope.newUserDetail);     
        $scope.userDetail.about = $scope.newUserDetail;
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
            id: $scope.currentUser.Id,
            name: $scope.currentUser.name
          },
          title: ach.name,
          organization: 'Mail.ru',
          type: 'Наука',
          result: 'Призер 1 место',
          photo: [],
          checked: ach.checked,
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
