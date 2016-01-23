angular.module('ActivityAggregator', ['ui.router'])

  .config(
    ['$urlRouterProvider',
    '$stateProvider'],
     function ($urlRouterProvider, $stateProvider) {
       $urlRouterProvider.html5Mode(true);
       $urlRouterProvider.otherwise("/studentsBase");
       $stateProvider.state('studentsBase', {
         url: '/studentsBase'
         views: {
           'page_content': {
             template: 'partials/studentsBase.html',
             controller: 'studentsBaseCtrl'
           }
           'footer': {
             template: 'partials/footer.html'
           }
         }
       })

})
