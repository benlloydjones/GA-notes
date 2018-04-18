angular
  .module('coffeeAssembly')
  .controller('CoffeeIndexCtrl', CoffeeIndexCtrl);

CoffeeIndexCtrl.$inject = ['Coffee', 'filterFilter', 'orderByFilter', '$scope'];
function CoffeeIndexCtrl(Coffee, filterFilter, orderByFilter, $scope) {
  const vm = this;
  vm.all = Coffee.query();


  function filterCoffee() {
    const params = { name: vm.q };
    // if the strength checkbox is checked, add the value of the strength slider to the params object
    if(vm.useStrength) params.strength = vm.strength;
    // if the roast checkbox is checked, add the value of the roast slider to the params object
    if(vm.useRoast) params.roast = vm.roast;

    // filter the vm.all array based on the params object
    vm.filtered = filterFilter(vm.all, params);
    // vm.price is either 'price' or '-price'
    // order the filtered array by either 'price' or '-price'
    vm.filtered = orderByFilter(vm.filtered, vm.price);
  }

  // listen for any changes to the ng-model values and run the filterCoffee function
  $scope.$watchGroup([
    () => vm.q,
    () => vm.useStrength,
    () => vm.useRoast,
    () => vm.strength,
    () => vm.roast,
    () => vm.price
  ], filterCoffee);

}
