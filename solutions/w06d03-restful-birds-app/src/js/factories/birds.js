angular
  .module('birdApp')
  .factory('Bird', Bird);

Bird.$inject = ['$resource', 'API'];
function Bird($resource, API){
  return $resource(`${API}/birds/:id`, { id: '@_id'}, {
    'update': { method: 'PUT' }
  });
}
