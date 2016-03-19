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
        $scope.currentUser = {};
        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
        });
      };



      $scope.$on('userUpdate', function (e, args) {
           updateUserData();
           console.log('auth!');
      })      

    $scope.logout = function() {
        UserManager.logout();
        $state.go('mainPage');
        $scope.$broadcast('userUpdate');
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