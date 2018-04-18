angular
  .module('eventApp')
  .config(Router);

Router.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
function Router($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/js/views/statics/home.html'
    })
    .state('citiesIndex', {
      url: '/cities',
      templateUrl: '/js/views/cities/index.html',
      controller: 'CitiesIndexCtrl as citiesIndex'
    })
    .state('citiesShow', {
      url: '/cities/:id',
      templateUrl: '/js/views/cities/show.html',
      controller: 'CitiesShowCtrl as citiesShow'
    });

  $urlRouterProvider.otherwise('/');
}
