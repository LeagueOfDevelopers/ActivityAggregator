var controllers = angular.module('app.controllers', ['app.controllers.main', 'app.controllers.routes', 'ui.router']);

var mainControllers = angular.module('app.controllers.main', ['ui.router'])

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

      $scope.currentUser = {name: 'Жамбыл Ермагамбет', id: '1'};
      if($scope.currentUser) {
        $scope.sref = 'profile(id=' + $scope.currentUser.id + ')';
        $scope.profileLink = $scope.currentUser.name;
      } else {
        $scope.sref = 'registry';
        $scope.profileLink = 'Рассказать о себе';
      }
}]);

angular.module('app.controllers.routes', ['ui.router']);
