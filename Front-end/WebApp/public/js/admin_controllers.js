angular.module('admin.controllers',
[
'ui.router',
'admin.controllers.main'
])

.controller('inboxCtrl', 
	[
	 '$scope', 
	 '$state',
	 'API',
	 function($scope, $state, API){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'});
	 	$scope.$emit('needAuth');
	
}])

.controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {};
		$scope.test = 'dqdw';

		if($scope.auth.$valid) {
		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}, true).then(function(result) {
				$scope.$emit('userUpdate');
				$state.go('inbox');
			})
		}
	}
	}])