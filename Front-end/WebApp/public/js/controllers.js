var controllers = angular.module('app.controllers',
[
'app.controllers.main',
'app.controllers.partials',
'ui.router'
]);

var mainControllers = angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
  '$state',
    function ($scope, $state) {
      switch ($state.current.name) {
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
    function ($scope, $state, $http) {
      $scope.profileLink = {
        sref: 'registry',
        title: 'Рассказать о себе'
      }
      $scope.currentUser = {};
      if($scope.currentUser.name && $scope.currentUser.id) {
        $scope.profileLink.sref = 'profile(id=' + $scope.currentUser.id + ')';
        $scope.profileLink.title = $scope.currentUser.name;
      }

}]);

angular.module('app.controllers.partials',
[
  'ui.router'
]);
