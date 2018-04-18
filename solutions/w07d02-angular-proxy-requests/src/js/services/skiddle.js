angular
  .module('eventApp')
  .service('skiddle', Skiddle);

Skiddle.$inject = ['$http', 'API'];
function Skiddle($http, API) {

  function getEvents(lat, lng, eventcode) {
    // make a $http request to our Express API
    return $http
      .get(`${API}/events`, { params: { lat, lng, eventcode } })
      .then((response) => {
        // here we could do some configuration of the results if need be
        return response.data.results;
      });
  }

  // attaching the function to the service
  this.getEvents = getEvents;
}
