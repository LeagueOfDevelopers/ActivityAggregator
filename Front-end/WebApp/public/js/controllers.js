
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
            $state.go('auth');
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
      $scope.showPopup = false;
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
            console.log(result);
            $scope.searchResults = result;
          })
      };

      $scope.viewAchList = function(achivments, $event) {
        $scope.listToShow = achivments;
        console.log($event);
        var position = $event;
        var x = position.pageX;
        var y = position.pageY;
        console.log($scope.popup);
        $scope.popup.offsetTop = y;
        $scope.popup.offsetLeft = x;
        console.log($scope.popup);
        $scope.showPopup = !$scope.showPopup;
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
        console.log(result);
        $scope.userDetail = result;
          console.log(result);
        });
      $scope.editUserDetail = function () {
        $scope.showEditField= true;
      }
      $scope.applyChanges = function () {
        $scope.showEditField = false;
        if($scope.newUserDetail) {
             $scope.userDetail = UserManager.updatdeUserDetail($scope.newUserDetail);
        }
      }
      $scope.notApplyChanges = function () {
          $scope.showEditField = false;
          $scope.newUserDetail = null;
      }


    }
  ])

  .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      'achToShow',
      function($scope, $state, $http, achToShow){

        $scope.achivment = {
          owner: {
            id: '1',
            name: 'Жамбыл Ермагамбет'
          },
          title: 'Победа в квн',
          photo: [],
          description: 'тцтвц ЛОТВЦЛтвоцтв оцтвоцтв цовтйлтцво оцвтйо оцтаоцта овтцо отвоц отвцот'
        }
    
       }])

  .controller('newAchCtrl',['$scope', function($scope){
    $scope.submit = function() {};
  }])

  .controller('authCtrl', ['$scope', function($scope){
    $scope.submit = function() {
      data = $scope.newAchivment;
      $http.post('/api/achivments', data);
    };
  }])

  .controller('registryCtrl', ['$scope', function($scope){
    $scope.submit = function() {};
  }])
