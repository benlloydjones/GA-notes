angular
  .module('lightsaberApp')
  .factory('Character', Character);

Character.$inject = ['API', '$resource'];
function Character(API, $resource) {
  console.log('Inside Character factory');
  return $resource(`${API}/characters/:id`, { id: '@_id' }, {
    'update': { method: 'PUT' }
  });
}
