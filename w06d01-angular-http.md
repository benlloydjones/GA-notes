---
title: Angular `$http`
type: Lesson
duration: "1:25"
creator:
    name: Alex Chin & Micah Rich
    city: LDN & LA
competencies: Front-end frameworks
---

# Angular `$http`

### Objectives

- Use `$http` to access an API resource, rather than use hardcoded data

### Preparation

- Be able to start up a Node.js app
- Be able to create an Angular app with controllers
- Understand AJAX & RESTful routing

## Intro (10 mins)

So far we have only worked with displaying hardcoded data in our Angular app. It's time to kick it up a notch.

We're going to learn a little about two different functionalities in Angular that will allow us to start communicating with real data, accessed through an API.

We have already built out a donuts API from scratch, so let's use this one and display the data using Angular.

Open up the `starter-code` and you will find that it is almost exactly the same as the finished API from earlier. The only difference is that we now have a `public` directory, with an `index.html` file, a `js` and `css` directory. In the `server.js` file we have also added the following line which should be familiar from the last module:

```
app.use(express.static(`${__dirname}/public`));
```

This is telling our app to serve our static files from the `public` folder. When you run `nodemon` and navigate to `localhost:3000` you should see a familiar looking site!

We are going to be connecting to the same database as before, so you should have some donut data already, but incase you don't, you can run your seed file.

```sh
node db/seed.js
```

Now, if you want you can do a quick `GET` request in Insomnia or Chrome to `http://localhost:3000/api/donuts` and make sure you've got some JSON.

## Hitting an API with `$http` - Codealong (30 mins)

The simplest starting point will be to switch our hardcoded array of donuts with the ones living in our new API.

Step one – let's delete our hardcoded data. In js/app.js:

```diff
angular
  .module('donutApp', [])
  .controller('DonutsCtrl', DonutsCtrl);

function DonutsCtrl() {
  const vm = this;
-  vm.all = [
-    { 'style': 'Old Fashioned', 'flavor': 'Chocolate' },
-    { 'style': 'Cake', 'flavor': 'Coconut' },
-    { 'style': 'Yeast', 'flavor': 'Frosted' },
-    { 'style': 'Glazed', 'flavor': 'Plain' },
-    { 'style': 'Cruller', 'flavor': 'Plain' },
-    { 'style': 'Cream', 'flavor': 'Boston Creme' },
-    { 'style': 'Jelly', 'flavor': 'Raspberry' },
-    { 'style': 'French Cruller', 'flavor': 'Strawberry' },
-    { 'style': 'Fritter', 'flavor': 'Apple' }
-  ];
+  vm.all = [];
}
```

With a little setup, we'll do a GET request to our API, and assign this.all to the array we get back. To do that, we're going to have to use an Angular library called $http.

### Injecting Dependencies

Angular dependencies – like libraries or plugins that other people have built – are defined first in our module (unless they come with Angular by default), and then _injected_ into any controllers that need to use them.

`$http` happens to come with Angular, so we only need to _inject_ it into our controller. We do that with a simple command and then by simply passing an argument to our controller function.

In `app.js`:

```js
DonutsCtrl.$inject = ['$http'];
function DonutsCtrl($http) {
  // ...
}
```

The first tells the controller we intend to use this library called `$http`, the second allows us to pass the library in and gives it the name `$http`. Think of it just like any other argument in a function – because it's the first argument, and we called it `$http`, we can use it inside our function using that name.

> **Note:** The `$inject` method additionally protects from reference loss caused by minification. Woo!

### Using $http is just AJAX!

`$http` is not very different than how we've used AJAX in the past, especially with JQuery. Let's see it all, then walk through it. In `js/app.js` let's now use `$http`:

```js
DonutsCtrl.$inject = ['$http'];
function DonutsCtrl($http) {
  const vm = this;
  vm.all = [];

  donutsIndex();

  function donutsIndex() {
    $http.get('http://localhost:3000/api/donuts')
      .then((response) => {
        console.log(response);
      });
  }
}

```

We call `$http`, then our favourite HTTP verb, `.get`. (There's a `.post` method for `$http` too). What's returned from our asynchronous call is a unique object called a promise. A promise can have three states: `pending`, `fulfilled` or `rejected`. We use `.then()` (a method inherent to a promise object) to capture the callback when it's _done_ and the state is either fulfilled or rejected.  Then, we can pass `.then()` a function to console log the response.

That's all we're doing in that function. Afterwords, we literally just run the function, which runs when we first load up the app. Easy.

**Q.** Why do we need to use `vm.all` inside `.then()`

We're 3 functions deep when we call `this.all` – `this` is no longer referring to our controller, it's referring to the function inside `.then`. If you left it that way, you'd never see any data, because to see it in the view, that data needs to be attached directly to our _controller_.

Refresh your browser and let's see if it worked! You should see the reponse in your Chrome console. Open it up and see what's inside. The part that we need is `.data`, so let's grab that and overwrite our `vm.all` array with the data from the API.

```js
function donutsIndex() {
  $http.get('http://localhost:3000/api/donuts')
    .then((response) => {
      vm.all = response.data;
    });
}
```

Now all we need to do is loop through the data in the view using the `ng-repeat` directive. In your `index.html` update the `<ul>` to be:

```
<ul id="donuts">
  <li ng-repeat="donut in donuts.all">{{ donut.flavor }} - <em>{{ donut.style}}</em></li>
</ul>
```

Refresh your page and check out those donuts! Everyone might have slightly different donut data, depending on what you added/deleted from the initial seed data during the API lesson.

### Adding a donut

Now that we have got an index of our donuts showing on the page, let's use what we learnt about `ngSubmit` and `ngModel` earlier to get the form working.

First of all let's create an empty object to hold our new donut data. Inside `js/app.js` add:

```
vm.newDonut = {};
```

In your `index.html` let's print our our new donut object, just above the form:

```html
<p>About to add: {{ donuts.newDonut }}</p>
```

Now we need to add our `ngModel` directives to the form fields. Update the input and select elements to be:

```html
<input type="text" name='flavour' id="donut-flavour" placeholder="What type of donut?" value="Chocolate" ng-model="donuts.newDonut.flavor">
<select name="style" id="donut-style" ng-model="donuts.newDonut.style">
    <option value="Old Fashioned">Old Fashioned</option>
    <option value="Cake">Cake</option>
    <option value="French Cruller">French Cruller</option>
    <option value="Yeast">Yeast</option>
</select>
```

Make sure your two-way binding is working by filling in the form fields, and checking that your `newDonut` object is updating in the view. Nice!

Next, we need to write a function that is going to actually add a new donut to our database using `$http`.

```js
vm.donutsCreate = donutsCreate;

function donutsCreate(){
  $http
    .post('http://localhost:3000/api/donuts', vm.newDonut)
    .then(response => {
      vm.all.push(response.data);
      vm.newDonut = {};
    });
}
```

> Note: Remember to attach the donutsCreate function to your controller.

Notice here that we are making a `POST` request, and passing in our `newDonut` object as the form data. In the `.then()` we are pushing the new donut to the `.all` array, which will update our view. We then set `newDonut` back to being an empty object, which clears our form, thanks to the data binding.

### Deleting a donut

Finally, we want the ability to delete a donut from our database for good. The first thing we need to do is add a button next to each donut. Inside the `ngRepeat` add:

```html
<li ng-repeat="donut in donuts.all">{{ donut.flavor }} - <em>{{ donut.style}}</em> <button>Delete</button></li>
```

In order to add a click 'event listner' to a button in Angular, we can use the `ngClick` directive. It works a bit like the `ngSubmit` directive. To your delete button add:

```html
<button ng-click="donuts.donutsDelete(donut)">Delete</button>
```

We haven't written our `donutsDelete` function yet, but notice here that we can pass in an argument when we call the function. In this instance we are passing the whole donut object back to our controller when we click on the delete button.

Inside `js/app.js` write the delete function.

```js
vm.donutsDelete = donutsDelete;

function donutsDelete(donut){
  $http
    .delete(`http://localhost:3000/api/donuts/${donut.id}`)
    .then(() => {
      const index = vm.all.indexOf(donut);
      vm.all.splice(index, 1);
    });
}
```

We need to pass in the donut object when we call the function so that we can construct the correct url to make our delete request. It also allows us to locate the donut inside the array of all donuts, and splice it out so that the view updates accordingly.

## Conclusion (5 mins)
- How do you inject dependencies into an Angular controller?
- How do you use $http to do a GET request?
- Why did we use `vm` inside `.then()`?
- How do you do a POST request?