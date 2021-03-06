angular.module('app.controllers.main',
 [
   'ui.router'
 ])

.controller('appCtrl',
  ['$scope',
   '$state',
   'UserManager',
   '$timeout',
   'API',
  function ($scope, $state, UserManager, $timeout, API) {

     //define default vars and consts
     $scope.starting = false;
     $scope.BASE_URI = API.baseUrl;
     $scope.title = 'Онлайн портфолио активных студентов НИТУ МИСиС';
     $scope.showMessage = false;
     $scope.msg = {
      content: '',
      type: {
        good: false,
        bad: false
      }
     };
     $scope.currentUser = {};
     $scope.onLoad = {
            common: false,
            studentDetail: false,
            avatar: false,
            achivments: false,
            file: false
          };

     auth();

    //event listeners

     $scope.$on('changeTitle', function(e, args) {
      $scope.title = args.title;
     });

      $scope.$on('auth', function (e, args) {
           auth();
           $scope.$broadcast('userUpdated');
      });     

      $scope.$on('userUpdate', function (e, args) {
           UserManager.update().then(function() {
            $scope.$emit('auth');
           })
      });   

      $scope.$on('showMessage', function(e, args) {
         showMessage(e, args);
      });

      $scope.$on('loadData', function(e, args) {
        startLoad(e, args);
      });

      $scope.$on('loadData_done', function(e, args) {
        stopLoad(e, args);
      });

      //describe functions

      $scope.logout = function() {
          UserManager.logout();
          $scope.$emit('userUpdate');
          $state.go('auth');
        };

      function auth() {
          UserManager.Current().then(function (result) {
            if(!result) $scope.currentUser = null;
            else $scope.currentUser = result.data.user;
            console.log($scope.currentUser);
        });
      };

      function showMessage(e , args) {
        $scope.showMessage = true;
        $scope.msg.type[args.type] = true;
        $scope.msg.content = args.msg;
        console.log($scope.msg);

        $timeout(function() {
        angular.element(document.querySelector('.notification_popup')).removeClass('.popupIn').addClass('.popupOut');
             $scope.showMessage = false;
              $scope.msg.type[args.type] = false;
              $scope.msg.content = '';
        }, 5000);
      };

      function startLoad(e, args) {

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + ' is not defined');
        else $scope.onLoad[args.field] = true;

      };

      function stopLoad(e, args) {

        if(!$scope.onLoad[args.field]) console.log('field' + args.field + 'is not defined');
        else $scope.onLoad[args.field] = false;
        
      };

       $timeout(function() {
        $scope.starting = false;
       }, 2500)

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