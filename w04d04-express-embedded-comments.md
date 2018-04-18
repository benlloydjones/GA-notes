# Express App with Embedded Comments

### Setup

Open up the `starter-code` and in the terminal run `yarn install` to pull down the `node_modules`, and run `node db/seeds` to run the seeds file. Run `nodemon` to start the server on `localhost:3000`.

### Introduction 

Inside the `starter-code` we have a fully RESTful app with one model, `Restaurant`. Restaurants have the following properties:

* `name` - String
* `address` - String
* `cuisine` - String
* `comments` - Array of embedded comments

The comment schema has two properties:

* `text`
* `rating`

At the moment, the only way we can add a comment is via the seeds file. This is not ideal, so we are going to create a form so that users can comment on restaurants from the restaurants show page.

### Comment form

First of all, let's add a form to the restuarants show page. Add the following HTML to the `/views/restaurants/show.ejs`:

```html
<form>
  <div>
    <label>Comment</label>
    <textarea name="text"></textarea>
  </div>

  <div>
    <label>Rating</label><br>
    <label>
      1 <input type="radio" value="1" name="rating">
    </label>
    <label>
      2 <input type="radio" value="2" name="rating">
    </label>
    <label>
      3 <input type="radio" value="3" name="rating">
    </label>
    <label>
      4 <input type="radio" value="4" name="rating">
    </label>
    <label>
      5 <input type="radio" value="5" name="rating">
    </label>
  </div>

  <button>Add</button>
</form>
```

It's important to make sure that the inputs have the correct `name` value. This must match the name of the property that is specified in the schema. In our case these are `text` and `rating`.

### Creating a comment

The RESTful routes should be becoming more familiar now.

| HTTP Verb | Path | Controller#Action | Used for |
| --------- | -------- | --------| ----------- |
| GET | /restaurants | restaurants#index | display a list of all restaurants |
| GET | /restaurants/new | restaurants#new | return an HTML form for creating a new restaurant |
| POST | /restaurants | restaurants#create | create a new restaurant |
| GET | /restaurants/:id | restaurants#show | display a specific restaurant |
| GET | /restaurants/:id/edit | restaurants#edit | return an HTML form for editing a restaurant |
| PATCH/PUT | /restaurants/:id | restaurants#update | update a specific restaurant |
| DELETE | /restaurants/:id | restaurants#delete | delete a specific restaurant |

The problem is that we don't have any routes here that can handle specific requests about embedded documents. Fortunately, these RESTful routes are something that we can build on and adapt to our needs.

The route that we are going to post a new comment to will be `/restuarants/:id/comments`. This allows us to specify which restaurant we want to add a comment to when we make our request. It is going to be a 'POST' request, as we are creating a new comment. Update the `action` in the form to be:

```html
<form method="POST" action="restaurants/<%= restaurant.id %>/comments">
```

#### Controller

We could make a brand new controller to hold the functionality to create and delete a comment, but seeing as we only have two routes, let's add the two functions to the existing restaurants controller.

Inside `controllers/restaurants.js` add:

```js
function restaurantsCommentsCreate(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => {
      restaurant.comments.push(req.body);
      return restaurant.save();
    })
    .then(restaurant => res.redirect(`/restaurants/${restaurant.id}`))
    .catch(err => res.render('error', { err }));
}
```
Here we are first of all finding the restaurant that we want to add a comment to, and then pushing the `req.body` (the form data containing the `text` and the `rating`) and pushing it into the `restaurant.comments` array. We are then saving the restaurant and redirecting the user back to the `/restaurants/:id` page.

Remember to export this function at the bottom of the file.

```js
module.exports = {
  index: restaurantsIndex,
  show: restaurantsShow,
  new: restaurantsNew,
  create: restaurantsCreate,
  edit: restaurantsEdit,
  update: restaurantsUpdate,
  delete: restaurantsDelete,
  commentsCreate: restaurantsCommentsCreate
};
```

#### Create route

Now we want to add a route to our `config/routes.js` file which will handle a `POST` request to `/restaurants/:id/comments`, and run the `restaurantsCommentsCreate` function.

```js
router.post('/restaurants/:id/comments', restaurants.commentsCreate);
```

Test that you can create a new comment by going to the restaurants show page, adding a comment with a rating, and clicking "Add". The page should refresh and you should see your comment appearing in the list.

### Deleting a comment

We want to be able to delete individual comments, so we need a route and a function inside our controller to handle this request.

#### Controller

Let's create a function in the controller to handle deleting a comment. In `controllers/restaurants.js` add:

```js
function restaurantsCommentsDelete(req, res) {
  Restaurant
    .findById(req.params.id)
    .exec()
    .then(restaurant => {
      const comment = restaurant.comments.id(req.params.commentId);
      comment.remove();
      return restaurant.save();
    })
    .then(restaurant => res.redirect(`/restaurants/${restaurant.id}`))
    .catch(err => res.render('error', { err }));
}
```

Here we are first of all finding the restaurant that contains the comment that we want to delete, then finding the comment that we want to delete inside the `restaurant.comments` array. We then remove it using `.remove()`, and finally save the restaurant. We then direct the user back to the `/restaurants/:id` page.

Export the `restaurantsCommentsDelete` function inside `module.exports`:

```js
module.exports = {
  index: restaurantsIndex,
  show: restaurantsShow,
  new: restaurantsNew,
  create: restaurantsCreate,
  edit: restaurantsEdit,
  update: restaurantsUpdate,
  delete: restaurantsDelete,
  commentsCreate: restaurantsCommentsCreate,
  commentsDelete: restaurantsCommentsDelete
};
```

#### Delete route

Inside `config/routes.js` add a route for the delete request:

```js
router.delete('/restaurants/:id/comments/:commentId', restaurants.commentsDelete);
```

Here the `:id` will be the id of the restaurant, and the `:commentId` is the id of the comment we want to delete.

#### Adding a delete button

We want to add a delete button for each comment on the restaurants show page. We need to create a form for each delete button so that we can use method override to turn the `POST` request into a `DELETE` request.

Update the `<ul>` in `/views/restaurants/show.ejs` file:

```html
<ul>
  <% restaurant.comments.forEach(comment => { %>
    <li>
      <%= comment.text %> - <%= comment.rating %>/5
      <form method="POST" action="/restaurants/<%= restaurant.id %>/comments/<%= comment.id %>">
      <input type="hidden" name="_method" value="DELETE">
      <button>Delete</button>
      </form>
    </li>
  <% }) %>
</ul>
```

Test it out in Chrome. You should be able to add and delete comments. Neat!