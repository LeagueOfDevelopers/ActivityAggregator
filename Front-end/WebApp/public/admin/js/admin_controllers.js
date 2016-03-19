angular.module('admin.controllers',
[
'ui.router',
'app.controllers.main'
])

.controller('inboxCtrl', 
	[
	 '$scope', 
	 '$state',
	 'API',
	 'avatar',
	 function($scope, $state, API, avatar){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'})
		$scope.$emit('needAuth');
		$scope.avatar = avatar;
		API.query('achivments.requests', null, true).then(function(res) {
			$scope.studentsList = res.data || null;
		})
	
}]).controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {};

		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}).then(function(res) {
				$scope.$emit('userUpdate');
				$state.go('inbox');
			})
		}
	}])

.controller('registryAdminCtrl',
  [
  '$scope',
  '$state',
  '$stateParams',
  'API',
 function($scope, $state, $stateParams, API) {
  $scope.auth.code = $stateParams.code;
  $scope.passwordCorrect = $scope.CheckPassword == $scope.auth.password;
  $scope.submit = function() {
    if(auth.$valid) {
      API.query('admin.registry', {data: $scope.auth}, true).then(function(res) {
        $scope.$emit('userUpdate');
      })
    }
  }
 }
  ])

.controller('profileCtrl', 
	[
	'$scope',
	'API',
	'$stateParams',
	'avatar',
   function($scope, API, $stateParams, avatar) {
   		console.log($stateParams);
   		$scope.$emit('nedAuth');
   		$scope.avatar = avatar;
   		API.query('students.getDetail', {studentId : $stateParams.id}, true).then(function(res) {
   			$scope.student = res.data || null;
   		})
   }
	])

 .controller('achCtrl', 
    ['$scope', 
      '$state', 
      '$http',
      '$stateParams',
     function($scope, $state, $http, $stateParams){

         $scope.$emit('changeTitle', {title: $stateParams.achToShow.name}); 
         console.log($stateParams)
        var ach = $stateParams.achToShow;
        var type = '';
        switch(ach.type) {
          case 'science' : type = 'Наука';  break;
          case 'social' : type = 'Общественная деятельность'; break;
          case 'cultural' : type = 'Культура'; break;
          case 'sport' : type = 'Спорт'; break;
          case 'study' : type = 'Учеба'; break;
        }

        var cr = new Date();
        cr.setTime(Date.parse(ach.created));

        $scope.achivment = {
          owner: $stateParams.owner,
          type: type,
          title: ach.name,
          organization: ach.organization,
          result: ach.result,
          checked: ach.checked,
          description: ach.description,
          created: cr.getDate() + '.' + (cr.getMonth() + 1) + '.' + cr.getFullYear(),
          message: ach.message,
          files: ach.files,
          level: ach.level
        }

         
    
       }])