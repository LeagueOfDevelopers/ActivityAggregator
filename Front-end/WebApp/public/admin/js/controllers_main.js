angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
   '$state',
   'UserManager',
   '$timeout',
  function ($scope, $state, UserManager, $timeout) {

     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
     })

     $scope.currentUser = {};
      updateUserData();


      function updateUserData() {

        UserManager.getCurrentUser().then(function (result) {
          $scope.currentUser = result;
        });
      };

      $scope.$on('showMessage', function(e, args) {
        $scope.showMessage = true;
        $scope.msg = args.msg;
        angular.element(document.querySelector('.notification_popup')).addClass('.popupIn');
        $timeout(function() {
        angular.element(document.querySelector('.notification_popup')).removeClass('.popupIn').addClass('.popupOut');
        $scope.showMessage = false;
        $scope.msg = '';
        }, 5000);
      })



      $scope.$on('userUpdate', function (e, args) {
           updateUserData();
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