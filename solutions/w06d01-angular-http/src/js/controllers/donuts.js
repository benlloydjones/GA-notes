angular
  .module('donutApp')
  .controller('DonutsCtrl', DonutsCtrl);

DonutsCtrl.$inject = ['$http'];
function DonutsCtrl($http) {
  const vm = this;
  vm.newDonut = {};
  vm.all = [];

  donutsIndex();

  function donutsIndex() {
    $http.get('http://localhost:4000/api/donuts')
      .then((response) => {
        vm.all = response.data;
      });
  }

  vm.donutsCreate = donutsCreate;

  function donutsCreate() {
    $http.post('http://localhost:4000/api/donuts', vm.newDonut)
      .then((response) => {
        vm.all.push(response.data); // push newly created donut into the array (to update the DOM)
        vm.newDonut = {};
      });
  }

  vm.donutsDelete = donutsDelete;

  function donutsDelete(donut) {
    $http.delete(`http://localhost:4000/api/donuts/${donut.id}`)
      .then(() => {
        const index = vm.all.indexOf(donut);
        vm.all.splice(index, 1);
      });
  }

  // add a delete button next to each donut inside the ng-repeat
  // add an ng-click directive to the button that fires a function called donutsDelete()
  // attach your donutsDelete function to the controller using vm.donutsDelete = donutsDelete
  // console.log inside the donutsDelete function to check that it is working
  // use $http.delete to delete the donut from the database
  // remove the deleted donut from the vm.all array
}
