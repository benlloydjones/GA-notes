angular
  .module('birdApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('birdsIndex', {
      url: '/',
      templateUrl: '/js/views/birds/index.html',
      controller: 'BirdsIndexCtrl as birdsIndex'
    })
    .state('birdsNew', {
      url: '/birds/new',
      templateUrl: '/js/views/birds/new.html',
      controller: 'BirdsNewCtrl as birdsNew'
    })
    .state('birdsShow', {
      url: '/birds/:id',
      templateUrl: '/js/views/birds/show.html',
      controller: 'BirdsShowCtrl as birdsShow'
    })
    .state('birdsEdit', {
      url: '/birds/:id/edit',
      templateUrl: '/js/views/birds/edit.html',
      controller: 'BirdsEditCtrl as birdsEdit'
    });

  $urlRouterProvider.otherwise('/');
}
