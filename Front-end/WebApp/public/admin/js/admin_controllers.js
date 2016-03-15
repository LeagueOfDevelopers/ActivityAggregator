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
		$scope.avatar = avatar
	
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

.controller('profileCtrl', 
	[
	'$scope',
	'API',
	'$stateParams',
	'avatar',
   function($scope, API, $stateParams) {
   		$scope.$emit('nedAuth');
   		$scope.avatar = avatar;
   };
	])