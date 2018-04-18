angular
  .module('birdApp')
  .directive('birdDetails', birdDetails);

function birdDetails(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/js/views/directives/birdDetails.html',
    scope: {
      bird: '='
    }
  };
}
