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
	 function($scope, $state, API){
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'})
		$scope.$emit('needAuth');
	
}]).controller('authCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		$scope.$emit('changeTitle', {title: 'Авторизация администратора'});
		$scope.auth = {};

		$scope.submit = function() {
			API.query('admin.login', {data: $scope.auth}, true).then(function(res) {
				$scope.$emit('userUpdate');
				$state.go('inbox');
			})
		}
	}])