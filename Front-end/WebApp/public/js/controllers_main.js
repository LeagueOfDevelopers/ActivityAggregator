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
      auth();

      
      function auth() {
        $scope.currentUser = {};
        UserManager.Current().then(function (result) {
          $scope.currentUser = result;
        });
      };



      $scope.$on('auth', function (e, args) {
           auth();
           console.log('auth!');
      })     

      $scope.$on('userUpdate', function (e, args) {
           UserManager.update().then(function(res) {
            $scope.broadcast('auth');
           })
           console.log('userUpdate');
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