angular
  .module('countriesApp')
  .controller('CountriesIndexCtrl', CountriesIndexCtrl);

CountriesIndexCtrl.$inject = ['orderByFilter', '$scope', '$http'];
function CountriesIndexCtrl(orderByFilter, $scope, $http) {
  const vm = this;

  $http.get('https://restcountries.eu/rest/v2/all')
    .then((response) => {
      vm.all = response.data;
      filterCountries();
    });

  function filterCountries() {
    vm.filtered = orderByFilter(vm.all, vm.order);
  }

  $scope.$watchGroup([
    () => vm.order
  ], filterCountries);

}
