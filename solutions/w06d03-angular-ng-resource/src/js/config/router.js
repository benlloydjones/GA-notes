angular
  .module('lightsaberApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('charactersIndex', {
      url: '/',
      templateUrl: '/js/views/characters/index.html',
      controller: 'CharactersIndexCtrl as charactersIndex'
    })
    .state('charactersNew', {
      url: '/characters/new',
      templateUrl: '/js/views/characters/new.html',
      controller: 'CharactersNewCtrl as charactersNew'
    })
    .state('charactersShow', {
      url: '/characters/:id',
      templateUrl: '/js/views/characters/show.html',
      controller: 'CharactersShowCtrl as charactersShow'
    })
    .state('charactersEdit', {
      url: '/characters/:id/edit',
      templateUrl: '/js/views/characters/edit.html',
      controller: 'CharactersEditCtrl as charactersEdit'
    });

  $urlRouterProvider.otherwise('/');
}
