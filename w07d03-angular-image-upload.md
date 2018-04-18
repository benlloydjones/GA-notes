---
title: Uploading Images with Angular
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, Server Applications, MV* Applications
---

# Uploading Images with Angular

### Objectives
*After this lesson, students will be able to:*

- Convert images to other formats on the client
- Use `ngModel` in a directive
- Upload base64 encoded data to AWS

### Preparation
*Before this lesson, students should already be able to:*

- Build a directive
- Have an AWS account and s3 bucket
- Have programmatically uploaded something to s3 before

## Intro (5 mins)

We can't just use a standard file input when uploading images to an API.

The problem is that in order to send an image to a server with a file input we need to be able to send **form data** with the special `multipart/form-data` enctype. This is fine for a standard Express App, but we want to send the data to our API in as **JSON**.

What we need is some way to convert an image into a format that can be sent with JSON. Luckily with HTML5, we can, with `base64` encoding!

## A `base64` directive (10 mins)

We are going to make a special `file` input which is able to convert an image into text _before_ we sent it to the API.

We'll make it in `src/js/directives/base64.js`:

```js
angular
  .module('birdApp')
  .directive('base64', base64);

function base64() {
  const fileReader = new FileReader();
}
```

The fist thing we need to do is create a new `FileReader` instance. This will be doing the grunt work for us.

```js
function base64() {

  const fileReader = new FileReader();

  return {
    restrict: 'A',
    require: 'ngModel'
  };
}
```

We'll be setting up our directive as an attribute that we'll set on the `file` input. We're also requiring `ngModel` that's because we want to use `ng-model` on our `file` input, and be able to access data from it.

```js
function base64() {

  const fileReader = new FileReader();

  return {
    restrict: 'A',
    require: 'ngModel',
    link($scope, element) {
    	console.log(element);
    }
  };
}
```

Let's create our link to the DOM, and see if our directive is working.

In `src/js/views/birds/new.js` let's change the `text` input to a `file` input and add our directive attribute:

```html
<input base64 type="file" name="image" id="image" ng-model="birdsNew.bird.image">
```

You should now see the input in the console.

Great, let's see if we can convert an image into a string!

## FileReader (10 mins)

The HTML5 `FileReader` unsurprisingly enough reads files, and can convert them into various formats. The one we are interested in is `base64`.

First though we need to actually get hold of a file in our directive:

```js
link($scope, element) {

  element.on('change', (e) => {
    const file = (e.target.files || e.dataTransfer.files)[0];
    console.log(file);
  });
}
```
When a user selects a file with a `file` input, a `change` event is triggered. We can listen out for this change event and log data about the file that has been selected.

Some browsers store this info on `e.target.files` and some on `e.dataTransfer.files`, so to make it browser compatible we can check both like so:

```js
(e.target.files || e.dataTransfer.files)
```

This will return a `FileList`, which is essentially an array of files. Since we are only interested in the first one, we can grab it like so:

```js
(e.target.files || e.dataTransfer.files)[0];
```

### Converting the file

Ok, we're ready to convert the file:

```js
link($scope, element) {

  fileReader.onload = function fileLoaded() {
    console.log(fileReader.result);
  };

  element.on('change', (e) => {
    const file = (e.target.files || e.dataTransfer.files)[0];
    fileReader.readAsDataURL(file);
  });
}
```

First we tell the file reader to read the file, then we get the result by setting a custom function to the fileReader's `onload` method.

You should see a massive string of characters in the console. That's our image!

### ngModel

OK, we're almost done here. We need to set this string to our `ng-model`, which we can do like so:

```js
link($scope, element, attrs, ngModel) {

  fileReader.onload = function fileLoaded() {
    ngModel.$setViewValue(fileReader.result);
  };

  element.on('change', (e) => {
    const file = (e.target.files || e.dataTransfer.files)[0];
    fileReader.readAsDataURL(file);
  });
}
```

### Displaying on the page

We're done with our directive, let's just make sure that it's working:

```html
<div class="form-group">
  <label for="image">Image</label>
  <input base64 type="file" name="image" id="image" ng-model="birdsNew.bird.image">
  {{ birdsNew.bird.image }}
</div>
```

Great, but it's actully not an image, is a `base64` string, and we don't want to confuse the two in our database.

We need to send the image data to the server, turn it back into an image, upload it to AWS, then store the _filename_ into the database.

We'll change the name of the property to `base64`:

```html
<div class="form-group">
  <label for="image">Image</label>
  <input base64 type="file" name="base64" id="image" ng-model="birdsNew.bird.base64">
</div>
```

## Handing the data on the server (10 mins)

We're sending our data in the request body as `req.body.base64`, we need to get hold of that on the server convert it and uploaded to AWS.

You'll notice that you already have the connection to s3 setup in the starter code in `lib/s3.js`.

Create a new file `lib/imageUpload.js` where we'll do this grunt work.

```js
const s3 = require('./s3');
const uuid = require('uuid');

function imageUpload(req, res, next) {
  if(!req.body.base64) return next();
  next();
}

module.exports = imageUpload;
```

Let's start with our `s3` connection and `uuid` which will make a random file name for our image.

If we don't fine a `base64` property on `req.body` we can leave this piece of middleware.

Next we need to extract the data and mime type from the `base64` string. You'll notice that the string starts with `data:image/png;base64,`. That basically tells us all we need about the way the string has been created. The rest is the actuall image.

Let's extract this data with some cunning regex:

```js
const base64Data = req.body.base64.match(/base64,(.*)$/)[1];
const mimeType = req.body.base64.match(/^data:(.*);/)[1];
```

As before we can get the extension from the mime type:

```js
const extension = mimeType.replace('image/', '');
const filename = `${uuid.v1()}.${extension}`;
```

Now we can upload the image to AWS:

```js
s3.upload({
  Key: filename,
  Body: new Buffer(base64Data, 'base64'),
  ContentType: mimeType
}, (err) => {
  if(err) return next(err);

  req.file = {
    filename,
    mimeType
  };

  next();
});
```

We're converting the `base64` string back into an image with the `Buffer` constructor.

Once the image has been uploaded, we're storing the filename and mimeType on `req.file`, very similar to `multer`.

## Adding the filename to the database (5 mins)

We need to use this middleware in `config/routes.js` and we need to make sure the filename gets saved to the database:

```js
const router = require('express').Router();
const birds = require('../controllers/birds');
const imageUpload = require('../lib/imageUpload');

router.route('/birds')
  .get(birds.index)
  .post(imageUpload, birds.create);

router.route('/birds/:id')
  .get(birds.show)
  .put(imageUpload, birds.update)
  .delete(birds.delete);
```

Again, just like multer!

And in the controllers:

```js
function createRoute(req, res, next) {

  if(req.file) req.body.image = req.file.filename;

  .
  .
  .
}

function updateRoute(req, res, next) {

  if(req.file) req.body.image = req.file.filename;
  
  .
  .
  .
}
```

Just like with multer!

## Updating the model (15 mins)

Ok we're nearly done, but we need to create our virtual `imageSRC` in the model, and make sure we delete the image if we delete the bird. Guess what, it's gonna be just like multer!

```js
birdSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.image) return null;
    return `https://s3-eu-west-1.amazonaws.com/mickyginger/${this.image}`;
  });

birdSchema.pre('remove', function removeImage(next) {
  if(this.image) return s3.deleteObject({ Key: this.image }, next);
  next();
});
```

## Replacing a bird's image (10 mins)

Finally we have one edge case to solve. What if a user wants to modify (ie replace) an image for a bird. We need to make sure we delete the old image from AWS.

This is not so straight forward with mongoose because we don't have access to the previous data on update. We'll not unless we're sneaky.

There's [a great article by Josey Morton](https://coderwall.com/p/xe2m9a/expose-previous-values-in-mongoose) on the subject, which basically boils down to this:

```js
birdSchema
  .path('image')
  .set(function getPreviousImage(image) {
    this._image = this.image;
    return image;
  });
```

Firstly we create a setter method on the image property of the record. Before allow mongoose to actually set the value, we store the current value on `this._image`. This is basically putting the value _before_ the record is updated onto `this`.

Now we can write a pre `save` hoook which will check to see if the image property has been updated and if so, delete the previous image:

```js
birdSchema.pre('save', function checkPreviousImage(next) {
  if(this.isModified('image') && this._image) {
    return s3.deleteObject({ Key: this._image }, next);
  }
  next();
});
```

Ooh that's nice!

## Tidying up (5 mins)

We need to use our virtual property in the INDEX and SHOW views so let's do that now:

```html
<img ng-src="{{ bird.imageSRC }}">
``` 

Finally we can add our directive to the EDIT view and test that everything is working.

## Conclusion (5 mins)

This is not the only way of handling file uploads but it is a nice fit for the stack we are using.

Remember that uploading files to a server is a security risk and requires a good amount of testing and forethought before rolling out into production.
