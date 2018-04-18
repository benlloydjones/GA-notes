// Creating my Angular App

angular
  .module('IntroToProviders', []);

// Creating a PROVIDER
angular
  .module('IntroToProviders')
  .provider('myProvider', myProvider);

// always uses the this.$get syntax
// only used if you want to be able to configure (during the config phase) the object that is going to be created before it’s created

function myProvider() {
  const greeting = 'Hi WDI29!';
  this.$get = function() {
    return new function() {
      this.sayHi = function() {
        console.log(greeting + ' I am a provider.');
      };
    };
  };
}

// Creating a FACTORY
angular
  .module('IntroToProviders')
  .factory('myFactory', myFactory);

// we have to return something
// this could be an object, it could be a function, it could be a value, it could be anything
// the value you are providing needs to be calculated based on other data

function myFactory() {
  const greeting = 'Hi WDI29!';
  return {
    sayHi: function() {
      console.log(greeting + ' I am a factory.');
    }
  };
}

// Creating a SERVICE
angular
  .module('IntroToProviders')
  .service('myService', myService);

// returns an object with methods
// a service is a constructor function whereas a factory is not
// Angular instantiates it behind the scenes with the ‘new’ keyword
// add properties to ‘this’ and the service will return ‘this’

function myService() {
  const greeting = 'Hi WDI29!';

  this.sayHi = function() {
    console.log(greeting + ' I am a service.');
  };

}

// Creating a CONSTANT
angular
  .module('IntroToProviders')
  .constant('myConstant', 'Value that CAN\'T change');

// Creating a VALUE
angular
  .module('IntroToProviders')
  .value('myValue', 'Value that CAN change');


// Creating a CONTROLLER
angular
  .module('IntroToProviders')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['myProvider', 'myFactory', 'myService', 'myConstant', 'myValue'];
function MainCtrl(myProvider, myFactory, myService, myConstant, myValue) {
  // we can inject each of these providers into a controller
  myProvider.sayHi(); // myProvider is whatever was returned from the this.$get method
  myFactory.sayHi(); // myFactory is whatever was returned from the factory
  myService.sayHi(); // myService is a new instance of the myService service, an object with methods attached

  console.log('Here is my constant: ' + myConstant);
  console.log('Here is my value: ' + myValue);

  // we could attach a constant or value for example to the viewmodel, so that it is available in the view
  const vm = this;
  vm.myConstant = myConstant;
  vm.myValue = myValue;
}
