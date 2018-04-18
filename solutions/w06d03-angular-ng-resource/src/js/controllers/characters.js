angular
  .module('lightsaberApp')
  .controller('CharactersIndexCtrl', CharactersIndexCtrl)
  .controller('CharactersNewCtrl', CharactersNewCtrl)
  .controller('CharactersShowCtrl', CharactersShowCtrl)
  .controller('CharactersEditCtrl', CharactersEditCtrl);

CharactersIndexCtrl.$inject = ['Character'];
function CharactersIndexCtrl(Character) {
  console.log('Inside CharactersIndexCtrl');
  const vm  = this;
  vm.delete = charactersDelete;

  // retrieve all instances of the character resource and save them into vm.all (INDEX)
  vm.all = Character.query();

  function charactersDelete(character){
    // delete a single character by calling the .delete method, and passing it the id of the character that we want to delete
    Character
      .delete({ id: character._id})
      .$promise
      .then(() => {
        // remove the deleted character from the vm.all array to update the DOM
        const index = vm.all.indexOf(character);
        vm.all.splice(index, 1);
      });
  }
}

CharactersNewCtrl.$inject = ['$state', 'Character'];
function CharactersNewCtrl($state, Character) {
  const vm  = this;
  vm.character = {};

  vm.create = charactersCreate;

  function charactersCreate(){
    // create a new character by calling the .save() method, and passing in the data we want to use
    Character
      .save(vm.character)
      .$promise
      .then(() => {
        $state.go('charactersIndex');
      });
  }
}

CharactersShowCtrl.$inject = ['$state', 'Character'];
function CharactersShowCtrl($state, Character) {
  console.log('Inside CharactersShowCtrl');
  const vm     = this;
  vm.character = {};

  charactersShow();

  // $state.params => { id: "7983247982374892374" }
  function charactersShow(){
    // retrieving a single character by specifying the id based on the params in the url
    vm.character = Character.get($state.params);
  }
}

CharactersEditCtrl.$inject = ['$state', 'Character'];
function CharactersEditCtrl($state, Character) {
  const vm     = this;
  vm.character = {};
  vm.update    = charactersUpdate;

  charactersShow();

  function charactersShow(){
    vm.character = Character.get($state.params);
  }

  function charactersUpdate(){
    // update a character by specifying the id, and then passing in the new data that we want to update it with
    Character
      .update({ id: $state.params.id }, vm.character)
      .$promise
      .then(() => {
        $state.go('charactersIndex');
      });
  }
}
