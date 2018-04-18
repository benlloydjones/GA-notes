angular
  .module('birdApp')
  .factory('Category', Category);

Category.$inject = ['$resource', 'API'];
function Category($resource, API){
  return $resource(`${API}/categories/:id`, { id: '@_id'}, {
    'update': { method: 'PUT' }
  });
}
