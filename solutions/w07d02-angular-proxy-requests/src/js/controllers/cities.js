angular
  .module('eventApp')
  .controller('CitiesIndexCtrl', CitiesIndexCtrl)
  .controller('CitiesShowCtrl', CitiesShowCtrl);

CitiesIndexCtrl.$inject = ['City', 'skiddle'];
function CitiesIndexCtrl(City, skiddle) {
  const vm = this;
  vm.all = City.query();

  // if the user has geolocation enabled
  if (navigator.geolocation) {
    // run the getCurrentPosition function, which takes a callback and receives the position object as an argument
    navigator.geolocation.getCurrentPosition((position) => {
      getEvents(position.coords.latitude, position.coords.longitude);
    });
  } else {
    // if geolocation is disabled, call getEvents and pass in London coords
    getEvents(51.02, -0.12);
  }

  function getEvents(lat, lng) {
    // call the getEvents function on the skiddle service, and pass in the lat and lng
    skiddle.getEvents(lat, lng)
      .then((response) => vm.events = response);
  }

}

CitiesShowCtrl.$inject = ['City', '$state', 'skiddle', '$scope'];
function CitiesShowCtrl(City, $state, skiddle, $scope) {
  const vm = this;

  // use the .$promise syntax to ensure that we have vm.city before getting events based on it's lat and lng
  City
    .get($state.params)
    .$promise
    .then((response) => {
      vm.city = response;
      getEvents();
    });

  function getEvents() {
    // if vm.city has not been populated yet, don't go any further
    if(!vm.city) return false;
    skiddle.getEvents(vm.city.lat, vm.city.lng, vm.eventcode)
      .then((response) => vm.events = response);
  }

  // watch for any changes to the vm.eventcode value, i.e. the user has selected a different radio button
  $scope.$watch(() => vm.eventcode, getEvents);


}
