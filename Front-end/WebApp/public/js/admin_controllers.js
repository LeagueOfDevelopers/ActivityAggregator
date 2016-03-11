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
	 	$scope.$emit('changeTitle', {title: 'Кабинет администратора'});
	 	$scope.$emit('needAuth');
	
}])

.controller('adminAuthCtrl',
	 [
	 '$scope',
	 '$state',
	 'API',
	function($scope, $state, API) {
		
	}])