angular
  .module('eventApp')
  .factory('City', City);

City.$inject = ['API', '$resource'];
function City(API, $resource) {
  return $resource(`${API}/cities/:id`, { id: '@id' }, {
    'update': { method: 'PUT' }
  });
}
