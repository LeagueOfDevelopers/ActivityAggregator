
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

      $scope.profileLink = {
        sref: 'auth',
        title: 'Рассказать о себе'
      }
      $scope.currentUser = {};
      updateUserData();

      function updateUserData() {
        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
          if($scope.currentUser.name && $scope.currentUser.id) {
            $scope.profileLink.sref = 'profile';
            $scope.profileLink.title = $scope.currentUser.name;
          } else {
            $state.go('auth')
          }
          console.log(result);
        })
      };



      $scope.$on('needAuth', function (e, args) {
        if(!($scope.currentUser.name && $scope.currentUser.id)) {
          updateUserData();
        }
        console.log($scope.currentUser + 'auth');
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
      $scope.searchParams = {
        name: '',
        category: 'Наука'
      }

      $scope.$watch('searchParams.category', function() {
        $scope.getStudentsList($scope.searchParams);
      })

      $scope.getStudentsList = function(searchParams) {
        var requestUrl = 'api/' + ((searchParams.name == '') ? searchParams.category : searchParams.name);
        console.log(requestUrl);
      };
      $scope.searchResults = [
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          course: 'ИТАСУ 2 курс',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          course: 'ИТАСУ 2 курс',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          course: 'ИТАСУ 2 курс',
          achivments: [{name:'Победа в квн', id: '12'}, {name:'Победаdwd в квн', id: '12'}, {name:'Победаqwdq в квн', id: '12'}, {name:'Побеdwdда в квн', id: '12'}]
        }];
    }
  ])

  .controller('profileCtrl',
  [
    '$scope',
    '$http',
    'UserManager',
    function ($scope, $http, UserManager) {
      UserManager.getUserDetail().then(function (result) {

          $scope.userDetail = result;
          console.log(result);

      })
    }
  ])

  .controller('authCtrl', ['$scope', function($scope){
    
  }])

  .controller('registryCtrl', ['$scope', function($scope){
    
  }])
