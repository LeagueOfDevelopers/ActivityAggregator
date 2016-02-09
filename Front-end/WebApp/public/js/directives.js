angular.module('app.directives', [])

.directive('popup.achivments', {
	restrict: 'E',
	scope: {
		achivmentsList: '='
	},
	templateUrl: 'achivment_popup.html',
	link: function(scope, elem, attr) {

	}
});
