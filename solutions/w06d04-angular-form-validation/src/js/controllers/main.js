angular
  .module('donutApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = [];
function MainCtrl(){
  const vm = this;

  vm.all   = [];
  vm.donut = {};
  vm.add   = add;

  function add(){
    if (vm.donutForm.$valid) {
      vm.all.push(vm.donut);
      vm.donut = {};
      vm.donutForm.$setPristine();
      vm.donutForm.$setUntouched();
    }
  }
}
