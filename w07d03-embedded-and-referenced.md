![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Referenced & Embedded Models

### Objectives
*After this lesson, students will be able to:*

- Create and delete **embedded** comments
- Store the current user as a **reference** inside a post
- Hide and show buttons depending on who is logged in
- Popluate a Mongoose **virtual** to display a user's posts on their profile page

### Preparation
*Before this lesson, students should already be able to:*

- Understand image uploading
- Be familiar with a RESTful Angular app

## Intro (5 mins)

In this lesson we are going to build on the image upload functionality that we have already covered, and complete an Instagram clone by adding comments to posts. There is no seeds file, so you will need to unzip the `starter-code`, run `yarn`, then add some images to your database by registering, logging in, and then clicking "Add a post".

<img src="http://i.imgur.com/IfpkkNt.jpg" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

The goal for this lesson is to hide the "Delete" button on posts that do not belong to the logged in user, as well as implementing the ability to add comments to a post. Only the owner of the comment can delete that particular comment.

<img src="http://i.imgur.com/YHexCR4.jpg" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

## Updating Views (15 mins)

Before we start adding comments to the posts, let's take a look at the `starter-code`. We have an `auth` controller that is handling our login and register functionality. Inside `controllers/posts.js` we have functions to handle the index, show, create and delete for the posts. Notice that at the top of the `createRoute` we have the following line:

```js
req.body.createdBy = req.currentUser;
```

Inside `lib/secureRoute.js` we assign `req.currentUser` to be the logged in user. This means that we can use it here, and attach it to the `req.body` as the user who is creating the post. The user's ID will be stored as a reference inside each post as `createdBy`. Have a look at `models/post.js` to see how this is written.

This is important when it comes to updating the views. We need to know who created the post in order to hide or show the "Delete" button. We are halfway there - as on the show page for each post we will be able to print out the ID of the user who created the post. We now just need to compare it to the user who is logged in.

In `src/js/controllers/main.js`, we can use a method from `$auth` to decode the JWT token, and retrieve the logged in user's ID.

```js
$transitions.onSuccess({}, (transition) => {
  vm.navIsOpen = false;
  vm.pageName = transition.$to().name;
  if(vm.stateHasChanged) vm.message = null;
  if(!vm.stateHasChanged) vm.stateHasChanged = true;
  if($auth.getPayload()) vm.currentUserId = $auth.getPayload().userId;
});
```

First of all we need to check whether or not there is a JWT token or not, before we try and get `.userId` out of it. If we don't do this and if there is no JWT token we will get an error saying:

```
TypeError: Cannot read property 'userId' of undefined
```

If there is a token, i.e if `$auth.getPayload()` returns truthy, we can then retrieve the `userId` out of it and store it inside `vm.currentUserId`. We set the value of `userId` inside `controllers/auth.js`, inside the `login` function.

Because we have attached `.currentUserId` to the `MainCtrl`, we have access to it anywhere in the app. We are going to reassign it each time a state changes, so that if a user logs out and someone else logs in, the `.currentUserId` will update to be whoever is currently logged in.

We now have access to two values to compare to work out if the post belongs to the user who is currently logged in. Inside `src/js/views/posts/show.html`, on the "Delete" button, we can now add an `ng-if` which will check whether a user is logged in, and if the two IDs are the same.

```html
<button ng-click="postsShow.delete()" class="button" ng-if="main.isAuthenticated() && main.currentUserId === postsShow.post.createdBy.id">Delete</button>
```

Test that this is working by logging in as someone different, and making sure you can't see the "Delete" button if the post doesn't belong to you. If the post does belong to you, you should see the "Delete" button still.

Great! We are going to use some similar logic later when we hide/show a comment's "Delete" button, but first of all we need to build out the API functionality to add and delete a comment.

## Embedded Comments

#### Adding a comment schema

The first thing we need to do in order to add embedded comments to our posts is to create a comment schema. Inside `models/post.js`, add the following above the `postSchema`:

```js
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});
```

Each comment has two properties, the first being the content of the comment (`text`), and the second being a reference to the user who added that comment (`createdBy`).

Now we need to update the post schema to include the comments.

```js
const postSchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [ commentSchema ]
});
```

Here we are telling our post model to allow an array of comments, that should be sent in the `commentSchema` format.

#### Creating a comment

Next we need to create a function to handle creating a comment. Inside `controllers/posts.js`, add the following:

```js
function addCommentRoute(req, res, next) {

  req.body.createdBy = req.currentUser;

  Post
    .findById(req.params.id)
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      const comment = post.comments.create(req.body);
      post.comments.push(comment);

      return post.save()
        .then(() => res.json(comment));
    })
    .catch(next);
}
```

Remember to export the function at the bottom of the file.

```js
module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  delete: deleteRoute,
  addComment: addCommentRoute
};
```

Let's have a look at what is going on here.

1. First we are going to assign `req.body.createdBy` to be whoever is currently logged in, so that our comment belongs to a user.
2. Then we need to find the post that we want to add the comment to.
3. Next, we are going to create a new comment from the form data that is inside `req.body`.
4. We can then push the new comment into the post's array of comments.
5. Finally, we save the post, and then return the comment as JSON.

#### Adding a create comment route

Next we need to create routes to handle the request to create a comment. If you remember from module two, we formatted the URLs for these requests in a specific way.

Inside `config/routes.js` add:

```js
router.route('/posts/:id/comments')
  .post(secureRoute, posts.addComment);
```

We will be passing in the ID of the post that we want to add the comment to, so that we can find that post inside the controller.

#### Updating the views

Great! We have done everything we need in our API to create a new comment. Next we need to add a form to the show page of our posts.

Inside `src/js/views/posts/show.html`, add the following underneath the delete button:

```html
<div class="comments">
  <h2>Comments</h2>
  <p ng-if="!postsShow.post.comments.length">0 comments</p>
  <ul class="comments__created">
    <li ng-repeat="comment in postsShow.post.comments track by $index">
      <a ui-sref="usersShow({ id: comment.createdBy.id })"><strong>{{ comment.createdBy.username }}</strong></a> - {{ comment.text }}
    </li>
  </ul>
  <form ng-if="main.isAuthenticated()">
    <label>Add comment</label>
    <textarea ng-model="postsShow.newComment.text"></textarea>
    <button class="button button--full">Comment</button>
  </form>
</div>
```

Note that there is an `ng-if` on the form, which means the form will only display is the user is logged in, but the comments themselves will show to anyone who is viewing that page.

#### Adding a factory for comments

We need a way of making requests to the new route that we created in our API which will create a comment. The URL that we set up is `/posts/:id/comments`, and our current 'Post' factory won't be able to handle this. We are going to create a second factory, in the same file (`src/js/factories/post.js`, called `PostComment`, which we will use the make the connection between Angular and our Express API. 

> **Note:** The reason we are calling the new factory `PostComment` rather than just `Comment`, is because if we expanded our app, so that we could comment on other user's profile pages, we would have two types of `Comment` and this would get confusing. `PostComment` makes it clear that we are talking about comments on a post.

Inside `src/js/factories/post.js` add the following:

```js
PostComment.$inject = ['$resource'];
function PostComment($resource) {
  return new $resource('/api/posts/:postId/comments/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
```

When we send the ID of the post that we are commenting on, we will send it as `postId`. Make sure to attach the new `PostComment` factory to the module at the top of the file:

```js
angular
  .module('instagramApp')
  .factory('Post', Post)
  .factory('PostComment', PostComment);
```

#### Updating the posts controller

Next we need to write a function in our `PostsShowCtrl` which will be called when we submit the form. First we need to inject the `PostComment` factory into the controller.

Inside `src/js/controllers/posts.js`:

```js
PostsShowCtrl.$inject = ['Post', 'PostComment', '$stateParams', '$state'];
function PostsShowCtrl(Post, PostComment, $stateParams, $state) {
 
  ...

}
```

Add the following underneath `postsDelete`:

```js
function addComment() {
  PostComment
    .save({ postId: vm.post.id }, vm.newComment)
    .$promise
    .then((comment) => {
      vm.post.comments.push(comment);
      vm.newComment = {};
    });
}

vm.addComment = addComment;
```

When we save, we need to send the ID of the post we are commenting on, along with the data (the new comment that is stored inside `vm.newComment`. Inside the `.then()` block, we are pushing the newly saved comment into the array of comments, which will update the view, and resetting the the `newComment` object back to empty, which will clear the form. 

Finally let's add an `ng-submit` to the form, which will run this function.

```html
<form ng-submit="postsShow.addComment()" ng-if="main.isAuthenticated()">
```

Test out the form in Chrome, and you should see your comment being added to the post! Make sure you are logged in if you can't see the form. Refresh the page, and the comment should still be there.

### Deleting a comment

Let's add the ability for a user to delete a comment if the comment belongs to them. We need to add a new delete route in our API first. Inside `controllers/posts`, add the following underneath the `createCommentRoute` function:

```js
function deleteCommentRoute(req, res, next) {
  Post
    .findById(req.params.id)
    .exec()
    .then((post) => {
      if(!post) return res.notFound();

      const comment = post.comments.id(req.params.commentId);
      comment.remove();

      return post.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}
```

Remember to add it to your exports at the bottom of the file:

```js
module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  delete: deleteRoute,
  addComment: addCommentRoute,
  deleteComment: deleteCommentRoute
};
```

Next we need to add a route which will call this function. Inside `config/routes.js` add the following:

```js
router.route('/posts/:id/comments/:commentId')
  .delete(secureRoute, posts.deleteComment);
```

Great, this is all we need to do in our API. Now we need to update the Angular app.

#### Updating the posts controller (again)

Inside the `PostsShowCtrl` we need to add a function which will use the `PostComment` factory to delete a comment.

```js
function deleteComment(comment) {
  PostComment
    .delete({ postId: vm.post.id, id: comment.id })
    .$promise
    .then(() => {
      const index = vm.post.comments.indexOf(comment);
      vm.post.comments.splice(index, 1);
    });
}

vm.deleteComment = deleteComment;
```

This time we need to pass it two IDs, the first being the ID of the post that the comment belongs to, and secondly the ID of the comment within that post. In the `.then` we are finding the index of the deleted comment inside the array of `post.comments`, and then slicing it out, which will update the view.

We need to add a delete button next to each comment, which will only show if the user is logged in, and the comment belongs to them. In `src/js/views/posts/show.html` add the following button inside the `ng-repeat`: 

```html
<ul class="comments__created">
  <li ng-repeat="comment in postsShow.post.comments track by $index">
    <a ui-sref="usersShow({ id: comment.createdBy.id })"><strong>{{ comment.createdBy.username }}</strong></a> - {{ comment.text }} <button class="button" ng-click="postsShow.deleteComment(comment)" ng-if="main.isAuthenticated() && main.currentUserId === comment.createdBy.id">Delete</button>
  </li>
</ul>
```

The `ng-click` will call the function that we just attached to the `PostsShowCtrl`. The `ng-if` will determine whether or not to show the button, based on whether the user is logged in, and if the id of the current user is the same as the id of the user who owns that comment. If both are true, the button will be shown.

Test this out in Chrome. You should now be able to create a comment, and delete a comment if that comment belongs to you.

## Populating Virtuals

The last thing that we are going to do is show a user's images on their profile page. In our API we already have a single route set up to handle a `GET` request to `/users/:id`, which will return us a single user. In the Angular app, we have a `User` factory and a `UsersShowCtrl` which uses the factory to `.get()` a single user and attach it to `vm`.

Ideally we want to be able to use `ng-repeat` to loop over a user's images, and display them underneath their user name. At the moment, we have an `ng-if` statement that is checking for `usersShow.user.posts.length`, and if this is falsy (i.e. 0 or undefined), it will print "0 posts". 

At the momoment, even if a user has posts it will show "0 posts". Why is this?

If you take a look at the models, we have a `User` and a `Post` model, and inside the `Post` model there is a `createdBy` field, which will hold the users's id. This means we can say `post.createdBy`, but not `user.posts`.  If we want to pass a user's posts as part of the JSON data when we send back a single user, we could either make a second call to the database inside the `usersShowRoute`, or we can use a brilliant feature from Mongoose called virtuals.

We have seen virtuals before when looking at authentication. We created a `passwordConfirmation` virtual in the `User` model, which we can then use to compare a user's `password` and `passwordConfirmation` when they register.

This time, we are going to use a virtual, combined with the `.populate()` method to send back a user's posts as part of the JSON object when we send back a single user.

> **Note:** The ability to populate virtuals was new to Mongoose 4.5, which was around July 2016.

### Updating the model

There is a good blog post [here](http://thecodebarbarian.com/mongoose-virtual-populate) which uses the example of authors and blog posts. You can also have a look at the [official docs](http://mongoosejs.com/docs/populate.html) regarding populating virtuals - you will need to scroll down to the "Populate Virtuals" section.

Inside `models/user.js`, add the following underneath the `userSchema`:

```js
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id', // use the _id field from this schema
  foreignField: 'createdBy' // to match up with the createdBy field in the Post schema
});
```

Here we are saying that we want to create a new virtual called `posts`, which will allow us to say `user.posts`. We are saying that it should look at the `Post` model, and locate any posts where the `createdBy` field contains the `_id` of the user.

### Updating the controller

As this is quite a lot of work for Mongoose to be doing, we don't necessarily want to return all of a users posts when we are getting an index of users. We only want to do it when we show a single user. In order to specify when we want to use this virtual, we can use the `.populate()` in the controller, as we have done before, and pass in the name of the virtual.

Inside `controllers/users.js`, we want to add the `.populate()` method to the `usersShowRoute`.

```js
const User = require('../models/user');

function showRoute(req, res, next) {
  User
    .findById(req.params.id)
    .populate('posts') // add this
    .exec()
    .then((user) => {
      if(!user) return res.notFound();

      return res.json(user);
    })
    .catch(next);
}

module.exports = {
  show: showRoute
};
```

### Updating the Angular app

This is all we need to do on the API side to see a user's posts when we request a single user. Now we can check that it's working by going to `src/js/views/users/show.js`, and printing out:

```html
{{ usersShow.user.posts }}
```

You should see a user's posts as part of the JSON object. Neat! All we need to do now is add an ng-repeat, and we can use the same markup as on the `postsIndex` page. 

Underneath the comment that says `<!-- add posts here -->` add the following:

```html
<div ng-repeat="post in usersShow.user.posts" class="col-sm-6 col-md-4 col-lg-3">
  <div class="posts__single">
    <div class="posts__single-image" style="background-image:url('{{ post.imageSRC }}')" ui-sref="postsShow({ id: post.id })"></div>
    <p><strong>{{ post.createdBy.username }}</strong></p>
  </div>
</div>
```

Refresh the browser, and make sure that you can see a user's posts on their profile page. 

Keep in mind that virtuals are not included in JSON output by default. If you want populate virtuals you will need to set the `virtuals: true` option on your schema's `toJSON` options. We already have this set up inside our `lib/globalToJSON.js` file.

## Conclusion

You will be using embedded and referenced Mongo relationships with Angular in your projects, so you should look back at this lesson for reference.

Key things to take away from this lesson are how you assign a newly created resource to the currently logged in user (i.e they "own" it), as well as how to hide and show edit/delete buttons depending on the user.