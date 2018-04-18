angular
  .module('portfolioApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/js/views/home.html'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: '/js/views/contact.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: '/js/views/about.html'
    });

  $urlRouterProvider.otherwise('/');
}
