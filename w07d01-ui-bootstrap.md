![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)


# Angular & UI Bootstrap

### Introduction

Bootstrap is an incredibly useful framework. From the carousel to the responsive nav bars, it has plenty of components that are desirable in our projects. However, Bootstrap's JavaScript files depend on jQuery being loaded in our project as well, and now that we are using Angular, we don't want to do this anymore.

Enter [UI Bootstrap](https://angular-ui.github.io/bootstrap/)! 

By including UI Bootstrap in our Angular app, we have access to Bootstrap components written in pure AngularJS by the AngularUI Team. These native AngularJS directives are based on Bootstrap's markup and CSS. As a result, no dependency on jQuery or Bootstrap's JavaScript is required. Pretty cool right?

### Dependencies

When using UI Bootstrap, the only required dependencies are:

* AngularJS
* Angular-animate (if you plan in using animations such as a menu sliding down)
* Angular-touch (if you plan in using swipe actions - we won't be using this today)
* Bootstrap CSS

Open up the `starter-code` and run `npm i`. The app is a fully authenticated, RESTful app with 'birds' as our resource. Let's install UI Boostrap along with it's dependencies.

```bash
bower install angular-bootstrap --save
bower install bootstrap-css-only --save
bower install angular-animate --save
```

> Note: The `starter-code` HTML already contains Bootstrap classes, so you should immediately see a change in the styling.

Great! We now have everything we need to use Boostrap in our app, in an "Angular" way.

First of all, add `ui.bootstrap` and `ngAnimate` to our array of depencies in `src/js/app.js`, as per the documentation.

```js
angular
  .module('birdApp', ['ui.router', 'ngResource', 'satellizer', 'ui.bootstrap', 'ngAnimate']);
```

### Nav Bar

The UI Boostrap documentation is not super user friendly. In order to find the code that we need for a responsive collapseable navigation we need to scroll down to the "Collapse" section. In the examples directly under the title for the section, there is a nav bar with two links. If you scroll down a little bit further you will find the HTML and JavaScript for the examples. 

We want to copy the section that looks like this:

```html
<nav class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" ng-click="isNavCollapsed = !isNavCollapsed">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">A menu</a>
  </div>
  <div class="collapse navbar-collapse" uib-collapse="isNavCollapsed">
    <ul class="nav navbar-nav">
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
    </ul>
  </div>
</nav>
```

Paste this inside your `index.html` and replace the `<li>` tags with the ones from our app so that your nav looks like this:

```html
<nav class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" ng-click="isNavCollapsed = !isNavCollapsed">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">The Birds</a>
  </div>
  <div class="collapse navbar-collapse" uib-collapse="isNavCollapsed">
    <ul class="nav navbar-nav">
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsIndex">Birds</a></li>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsNew">Add a bird</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="login">Login</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="register">Register</a></li>
      <li ng-if="main.isAuthenticated()"><a ng-click="main.logout()" href="#">Logout</a></li>
    </ul>
  </div>
</nav>
```

If you resize the window you will see that the nav bar is responsive, but that the menu is already open. Let's take a closer look at the HTML and see how the 'collapse' is working. There is a variable called `isNavCollapsed`, which is being toggled when we click on the menu icon. This in turn is indicating whether or not the menu is collapsed or not (notice the `uib-collapse="isNavCollapsed"` attribute).

The reason that the nav is not collapsed when the page loads is because the `isNavCollapsed` variable will be falsy, unless we make it `true`. In the `MainCtrl` let's attach this variable to our controller:

```js
MainCtrl.$inject = ['$rootScope', '$state', '$auth'];
function MainCtrl($rootScope, $state, $auth) {
  const vm = this;

  vm.isNavCollapsed = true;
  
  ...
```

Now, in the `index.html` file let's update any instance of `isNavCollapsed` to be `main. isNavCollapsed`. Your nav should now look like this:

```html
<nav class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" ng-click="main.isNavCollapsed = !main.isNavCollapsed">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">The Birds</a>
  </div>
  <div class="collapse navbar-collapse" uib-collapse="main.isNavCollapsed">
    <ul class="nav navbar-nav">
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsIndex">Birds</a></li>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsNew">Add a bird</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="login">Login</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="register">Register</a></li>
      <li ng-if="main.isAuthenticated()"><a ng-click="main.logout()" href="#">Logout</a></li>
    </ul>
  </div>
</nav>
```

We're almost there! The last thing we should do is close the menu when you change state. Inside the `MainCtrl`, inside the function that gets called on `$stateChangeSuccess`, add the following line:

```js
$rootScope.$on('$stateChangeSuccess', () => {
  if(vm.stateHasChanged) vm.message = null;
  if(!vm.stateHasChanged) vm.stateHasChanged = true;
  vm.isNavCollapsed = true;
});
```

Now when we switch between states, the menu will slide closed. Nice!

### Carousel

Let's have a look at the documentation for the Bootstrap carousel. There is quite a lot going on here in the example. Unfortunately UI Bootstrap don't seem to provide a simple example for their components - they add everything you might possibly need, and you need to deduce which the basic parts are.

Grab this section and paste it into the top of your `src/js/views/birds/index.html` file.

```html
<div uib-carousel active="active" interval="myInterval" no-wrap="noWrapSlides">
  <div uib-slide ng-repeat="slide in slides track by slide.id" index="slide.id">
    <img ng-src="{{slide.image}}" style="margin:auto;">
    <div class="carousel-caption">
      <h4>Slide {{slide.id}}</h4>
      <p>{{slide.text}}</p>
    </div>
  </div>
</div>
```

Next, click on the 'JavaScript' tab in the documentation, and copy the following lines into your `BirdsIndexCtrl`:

```
$scope.myInterval = 5000; // The time delay between each slide
$scope.noWrapSlides = false; // This will decide whether or not the carousel is 'infinite' or not, i.e whether you can keep going round in a loop with the arrow buttons
$scope.active = 0; // This decides which slide is shown first (based on it's index in the array of slides)
```

Because we are using the `ControllerAs` syntax, we should replace `$scope` with `vm`, to attach these values to our controller. 

```
vm.myInterval = 5000;
vm.noWrapSlides = false;
vm.active = 0;
```

Now, let's update our HTML so that we are using the properies that are in our controller by prefixing them with `birdsIndex`.

```html
<div uib-carousel active="birdsIndex.active" interval="birdsIndex.myInterval" no-wrap="birdsIndex.noWrapSlides">
  <div uib-slide ng-repeat="slide in slides track by slide.id" index="slide.id">
    <img ng-src="{{slide.image}}" style="margin:auto;">
    <div class="carousel-caption">
      <h4>Slide {{slide.id}}</h4>
      <p>{{slide.text}}</p>
    </div>
  </div>
</div>
```

Finally we need to update the data that we actually want use. The `ng-repeat` needs to loop through the birds in `birdsIndex.all`, and create a slide for each one.

The ng-repeat should be:

```html
ng-repeat="bird in birdsIndex.all"
```

There is nothing new here - we are simply adding one slide for each bird in our birds array. Next we need to update the `index` attribute to be:

```html
<div uib-slide ng-repeat="bird in birdsIndex.all" index="$index">
```

We get `$index` from the Angular's `ng-repeat` directive. This is the "iterator offset of the repeated element", i.e the index of that element in the array that we are looping over. The Bootstrap carousel requires the `index` attribute to be set, as it needs this to determine which slide to make "active". It is directly linked to the `vm.active` property that we added to our `BirdsIndexCtrl`, which we will have a play around with in a minute.

Lastly, let's update the content of the slide.

```html
<div uib-carousel active="birdsIndex.active" interval="birdsIndex.myInterval" no-wrap="birdsIndex.noWrapSlides">
  <div uib-slide ng-repeat="bird in birdsIndex.all" index="$index">
    <img ng-src="{{ bird.image }}" style="margin:auto;">
    <div class="carousel-caption">
      <h4>{{ bird.name }}</h4>
      <p><strong>{{ bird.latinName }}</strong> <em>{{ bird.family }}</em></p>
    </div>
  </div>
</div>
```

Refresh the page and you should see a carousel of your birds! 🐦

Have a play around with the values that we set in the controller.

* If we update `vm.active = 0` to be `vm.active = 3`, this will change which bird the carousel starts on when the page loads.
* If we update `vm.myInterval = 5000` to be `vm.myInterval = 2000` the delay between the slides will be 2 seconds rather than 5.
* If we update `vm.noWrapSlides = false` to be `vm.noWrapSlides = true`, once we hit the last slide we can't loop back to the first.

### Modals

The last componant we are going to look at is the Bootstrap Modal. We should be careful not to overuse modals (chat to Mike about the evils of forms inside modals), however, it might be nice to have a 'confirmation' modal when we click 'Delete', to stop hasty deleting of our beloved birds.

The documentation for Bootstrap modals is particularly confusing, and there is little help out there in terms of tutorials, especially since the update to UI Bootstrap (which has changed the modal syntax slightly). Let's implement a simple version, which you can build on at a later date if you need to.

#### Creating a template

The first thing that we should do is create a partial that we want to load when the modal is opened. This will be the HTML content of the modal, and we can use the markup that is outlined in the documentation, which will style it nicely for us. Create a new view:

```bash
mkdir src/js/views/partials
touch src/js/views/partials/birdDeleteModal.html
```

Add the following HTML to `src/js/views/partials/birdDeleteModal.html`:

```html
<div class="modal-header">
  <h3 class="modal-title">Wait!</h3>
</div>
<div class="modal-body">
  <p>Are you sure you want to delete this bird?</p>
</div>
<div class="modal-footer">
  <button class="btn btn-primary">Cancel</button>
  <button class="btn btn-danger">Delete</button>
</div>
```

#### Opening the modal

The next thing that we need to do is inject `$uibModal` into our `BirdsShowCtrl`.

```js
BirdsShowCtrl.$inject = ['Bird', '$stateParams', '$state', '$uibModal'];
function BirdsShowCtrl(Bird, $stateParams, $state, $uibModal) {
```

`$uibModal` is a service that is coming from `ui.bootstrap`. From the documenation:

> $uibModal is a service to create modal windows. Creating modals is straightforward: create a template and controller, and reference them when using $uibModal.

Let's look at how to use it. First of all, we need to create a function that is going to get called when we click on the "Delete" button. At the moment, when we click on "Delete", the bird will be deleted immediately. We want to change this so that the modal opens instead.

In the `BirdsShowCtrl` add the following function, and attach it to the controller:

```js
function openModal() {
  $uibModal.open({
    templateUrl: 'js/views/partials/birdDeleteModal.html',
    controller: 'BirdsDeleteCtrl as birdsDelete',
    resolve: {
      bird: () => {
        return vm.bird;
      }
    }
  });
}

vm.open = openModal;
```

Here we are specifying the **template** that we want to load inside the modal, and the **controller** that we want to be instantiated when the modal is opened. 

We can also pass some data into the controller, so that we have access to it immediately, without making any additional queries, which is pretty cool. We do this using **resolve**. Here we are sending in `bird` to our `BirdsDeleteCtrl`, and making it equal to the bird we want to delete, i.e the bird on the show page.

#### Creating a modal controller

Before we can test that our modal is working, we should create the `BirdsDeleteCtrl`, and attach it to our app.

```
angular
  .module('birdApp')
  .controller('BirdsIndexCtrl', BirdsIndexCtrl)
  .controller('BirdsNewCtrl', BirdsNewCtrl)
  .controller('BirdsShowCtrl', BirdsShowCtrl)
  .controller('BirdsEditCtrl', BirdsEditCtrl)
  .controller('BirdsDeleteCtrl', BirdsDeleteCtrl);
```

```
BirdsDeleteCtrl.$inject = ['$uibModalInstance', 'bird'];
function BirdsDeleteCtrl($uibModalInstance, bird) {
  var vm = this;
  vm.bird = bird;

}
```

Let's take a minute and note a few things here. Firstly, we are injecting `$uibModalInstance` into our controller. Just like `$uibModal`, this is coming from `ui.bootstrap`. This is only available to controllers that are instantiated by `$uibModal.open()`. From the documentation:

> [The controller has] a special $uibModalInstance injectable to access the modal instance.

This means that inside our `BirdsDeleteCtrl` we have access to the instance of the modal that has been opened, allowing us to do things like close the modal when we want to.

The second thing that we have injected is `bird`. This is the same `bird` that we added to our `resolve` object. `bird` is equal to the `vm.bird` that set inside the `BirdsShowCtrl`. To use it in our modal, we can say `vm.bird = bird`. Now, we can use that bird inside our modal view.

Let's test to see if our modal is working. At the moment, we should be able to open it, but not close it or delete the bird.

Because we have attached the chosen bird to the `BirdsDeleteCtrl`, we can use it in the view. Update the modal template to be:

```html
<div class="modal-body">
  <p>Are you sure you want to delete the <strong>{{ birdsDelete.bird.name }}</strong>?</p>
</div>
```

#### Closing the modal

In order to close the modal, we should create a function inside our `BirdsDeleteCtrl` and attach it to the controller.

```js
function closeModal() {
  $uibModalInstance.close();
}

vm.close = closeModal;
```

Nice and simple. Because we have injected `$uibModalInstance` into our controller, we can call the `close()` method on it, and out modal will close.

Let's add a `ng-click` to our "Close" button inside `src/js/views/partials/birdDeleteModal.html`:

```html
<button class="btn btn-primary" ng-click="birdsDelete.close()">Cancel</button>
```

Let's test to make sure that's working. Cool!

#### Deleting the bird

Finally we need to actually delete the bird if we click on the "Delete" button inside the modal. To do this we need to move the delete function from `BirdsShowCtrl` to `BirdsDeleteCtrl`, as well as inject `$state`, so that we can direct to the index page afterwards.

```js
BirdsDeleteCtrl.$inject = ['$uibModalInstance', 'bird', '$state'];
function BirdsDeleteCtrl($uibModalInstance, bird, $state) {
  var vm = this;
  vm.bird = bird;

  function closeModal() {
    $uibModalInstance.close();
  }

  vm.close = closeModal;

  function birdsDelete() {
    vm.bird
      .$remove()
      .then(() => {
        $state.go('birdsIndex');
        $uibModalInstance.close();
      });
  }

  vm.delete = birdsDelete;
}
```

Once we have deleted the bird, we are closing the modal, and redirecting to the index page.

Now we can add a `ng-click` to the "Delete" button in the modal template:

```html
<button class="btn btn-danger" ng-click="birdsDelete.delete()">Delete</button>
```

And we're done! Test that everything is working by deleting some birds. 

### Conclusion

It might take a while to get the hang of reading the UI Booststrap documentation, and deducing which pieces of code are relevent, but hopefully you can see how worthwhile it can be once you become more familiar with it.