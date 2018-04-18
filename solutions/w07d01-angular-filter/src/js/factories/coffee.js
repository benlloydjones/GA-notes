angular
  .module('coffeeAssembly')
  .factory('Coffee', Coffee);

Coffee.$inject = [];
function Coffee() {
  const all = [{
    id: '110866',
    name: 'Jamaica Blue Mountain Coffee',
    image: 'https://d2qwzu24wcp0pu.cloudfront.net/whittard/product/9a221cc6.110866.jpg/280x280.fit.110866.jpg',
    price: 200,
    origin: 'Jamaica',
    strength: 4,
    roast: 2
  },{
    id: '111047',
    name: 'Guatemala Elephant Coffee',
    image: 'https://d2qwzu24wcp0pu.cloudfront.net/whittard/product/30409364.111047.jpg/280x280.fit.111047.jpg',
    price: 34,
    origin: 'Guatemala',
    strength: 4,
    roast: 3
  },{
    id: '274233',
    name: 'Ethiopia Yirgacheffe Coffee',
    image: 'https://d2bvpivebkb899.cloudfront.net/whittard/product/dcc2dc96.274233.jpg/280x280.fit.274233.jpg',
    price: 28,
    origin: 'Ethiopia',
    strength: 3,
    roast: 1
  },{
    id: '329441',
    name: 'Costa Rica Red Honey',
    image: 'https://d2qwzu24wcp0pu.cloudfront.net/whittard/product/902f469a.329441-Costa%20Rica%20Frailes%20Red%20Honey%20Level%203.jpg/280x280.fit.329441-Costa%20Rica%20Frailes%20Red%20Honey%20Level%203.jpg',
    price: 34,
    origin: 'Costa Rica',
    strength: 3,
    roast: 3
  },{
    id: '322586',
    name: 'Colombia Montebello',
    image: 'https://d16wp86s16nsnf.cloudfront.net/whittard/product/9a6cb3db.PERU%20306738.png/280x280.fit.PERU%20306738.png',
    price: 32,
    origin: 'Colombia',
    strength: 5,
    roast: 4
  },{
    id: '111054',
    name: 'Monsoon Malbar Coffee',
    image: 'https://d2bvpivebkb899.cloudfront.net/whittard/product/2e4eed9e.111054.jpg/280x280.fit.111054.jpg',
    price: 30,
    origin: 'India',
    strength: 3,
    roast: 5
  },{
    id: '329458',
    name: 'Nicaragua Maragogype',
    image: 'https://d2bvpivebkb899.cloudfront.net/whittard/product/de02bc0f.329458-Nicaragua%20Maragogype%20Roasted%20Beans%20Colour%2070.jpg/280x280.fit.329458-Nicaragua%20Maragogype%20Roasted%20Beans%20Colour%2070.jpg',
    price: 40,
    origin: 'Nicaragua',
    strength: 2,
    roast: 4
  },{
    id: '110817',
    name: 'Mocha Djimmah Coffee',
    image: 'https://d23x084dcxncv3.cloudfront.net/whittard/franchise/cb9c15a0.110817.jpg/280x280.fit.110817.jpg',
    price: 26,
    origin: 'Ethiopia',
    strength: 1,
    roast: 2
  }];
  return {
    query() {
      return all;
    }
  };
}