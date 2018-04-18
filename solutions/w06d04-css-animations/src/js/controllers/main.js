angular
  .module('portfolioApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$transitions'];
function MainCtrl($transitions){
  const vm = this;

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    vm.menuIsOpen = false;
  });

}
