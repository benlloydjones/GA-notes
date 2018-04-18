angular
  .module('birdApp')
  .controller('BirdsIndexCtrl', BirdsIndexCtrl)
  .controller('BirdsNewCtrl', BirdsNewCtrl)
  .controller('BirdsShowCtrl', BirdsShowCtrl)
  .controller('BirdsEditCtrl', BirdsEditCtrl);

BirdsIndexCtrl.$inject = [ 'Bird'];
function BirdsIndexCtrl(Bird) {
  const vm = this;
  vm.all = Bird.query();
}

BirdsNewCtrl.$inject = ['$state', 'Bird', 'Category'];
function BirdsNewCtrl($state, Bird, Category) {
  const vm  = this;
  vm.categories = Category.query();
  vm.create = birdsCreate;

  function birdsCreate(){
    Bird
      .save(vm.bird)
      .$promise
      .then(() => {
        $state.go('birdsIndex');
      });
  }
}

BirdsShowCtrl.$inject = ['$state', 'Bird'];
function BirdsShowCtrl($state, Bird) {
  const vm = this;
  vm.bird = Bird.get($state.params);
  vm.delete = birdsDelete;

  function birdsDelete(){
    Bird.delete($state.params)
      .$promise
      .then(() => {
        $state.go('birdsIndex');
      });
  }
}

BirdsEditCtrl.$inject = ['$state', 'Bird', 'Category'];
function BirdsEditCtrl($state, Bird, Category) {
  const vm = this;
  vm.bird = {};
  vm.categories = Category.query();
  vm.update = birdsUpdate;

  birdsShow();

  function birdsShow(){
    Bird
      .get($state.params)
      .$promise
      .then((bird) => {
        vm.bird = bird;
        // To make sure that when we send back the category, we're just sending back the id, not the whole category object
        // Originally vm.bird.category is the whole object because we are populating it in the show controller in the Express API
        vm.bird.category = vm.bird.category.id;
      });
  }

  function birdsUpdate(){
    Bird
      .update($state.params, vm.bird)
      .$promise
      .then(() => {
        $state.go('birdsShow', $state.params);
      });
  }
}
