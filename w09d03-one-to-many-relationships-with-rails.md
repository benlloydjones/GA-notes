# Relationships with Rails API

### Objectives
*After this lesson, students will be able to:*

- Create "one-to-many" relationships between tables
- Define relationships between tables in the models and serializers
- Use ActiveModelSerializer to define custom methods

### Preparation
*Before this lesson, students should already be able to:*

- Use the `scaffold` command
- Understand the concept of migrations
- Understand the concept of `one-to-many` relationships in SQL databases
- Understand what a serializer is for

## Intro: Relationships with Rails API

### Setup

The goal for this lesson is to build out a Rails API that will make up the back end of a simple Twitter clone app.

To create a new Rails app called `twitter` and move into the directory run the following command.

```sh
rails new twitter --api -d postgresql --skip-git
cd twitter
```

The app should have two models - `Post` and `User`, with a "one-to-many" relationship. A post **belongs to** a single user, but a user can **have many** posts.

This means that we are going to store the users's id inside the post table, in a column called `user_id`. However, when we are scaffolding the post and listing the fields we want in the table, we don't specify `user_id` as a field, instead we say `user:references`.

This means that when the migration is generated, some extra instructions are added which when executed will create a `user_id` field for us, and specifies that it should hold a foreign key.

**Before** we run the scaffold commands, let's add the `'active_model_serializers'` gem to the `Gemfile`.

```rb
gem 'active_model_serializers'
```

Whilst you are in the `Gemfile` uncomment the line that says:

```
gem 'rack-cors'
```

In the terminal run `bundle`.

> **Note:** Because we've added the gem before scaffolding posts and users, the serializer files will be automatically generated when we scaffold, and the serializer attributes will be completed for us.

Let's scaffold `Post` and `User`.

```sh
$ rails g scaffold User username first_name last_name 
$ rails g scaffold Post user:references body:text
```

Great! This will have created us the routes and setup the controllers as well as creating model files. Open up the `db/migrations` directory and check the migration files for spelling mistakes. If you have **not** run the migrations yet, you can correct spelling mistakes directly in the migration file.

We haven't created a database yet, and we have pending migrations that we need to run:

```bash
$ rails db:create db:migrate
```

We now have a database with two tables, one for posts and one for users. Inside the post table we have a field for `user_id`, which will hold the id of the user that the post belongs to.

### Namespacing and enabling CORS

Inside `config/routes` add the `scope :api do ` block around the users and posts routes.

```rb
Rails.application.routes.draw do
  scope :api do
    resources :posts
    resources :users
  end
end
```

Inside `config/initializers/cors.rb` uncomment the following and change `origins` to `*`:

```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

This allows us to make requests to `/api/users` and `/api/posts`, as well as allowing access from all domains.

### Add the relationships

The `user:references` will have added the relationship for a post:

```ruby
class Post < ApplicationRecord
  belongs_to :user
end
```

However, we want to add the corresponding relationship in the User model:

```ruby
class User < ApplicationRecord
  has_many :posts
end
```

### Add some validations

It's always good to have some validations in the models:

In `app/models/user.rb:

```ruby
class User < ApplicationRecord
  has_many :posts
  validates :username, presence: true, uniqueness: true
end
```

In `app/models/post.rb`:

```ruby
class Post < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :body, length: { minimum: 0, maximum: 142 }
end
```

### Seed some data

Let's seed some users and posts to check the JSON output of this new API. Inside, `db/seeds.rb` let's add:

```ruby
u1 = User.create!(username: "alex", first_name: "Alex", last_name: "Chin")
u2 = User.create!(username: "mike", first_name: "Mike", last_name: "Hayden")
u3 = User.create!(username: "rane", first_name: "Rane", last_name: "Gowan")

p1 = u1.posts.create!(body: "I bet we could stick angular ontop of this API...")
p2 = u2.posts.create!(body: "This is quite fast to make a quick API!")
p3 = u1.posts.create!(body: "This could be a fun stack for a final project?")
p4 = u3.posts.create!(body: "I like using Rails!")
```

Now let's run:

```bash
$ rails db:seed
```

Great! 

### Let's see this working

Fire up the server with:

```bash
$ rails s
```

And visit:

- `http://localhost:3000/users`
- `http://localhost:3000/posts`

We should be able to see the user and post data that was seeded. If you request the post data, notice that you can see the information about the user, but if you request the user data you can't see the posts that belong to them. Why is this? Let's have a look...

### Updating the serializers

Inside `app/serializers/post_serializer.rb` have a look at the following code:

```rb
class PostSerializer < ActiveModel::Serializer
  attributes :id, :body
  has_one :user
end
```

Notice that when we scaffolded the post, because we added `user:references` the serializer has the line `has_one :user`. Comment out this line, and make the same request in Insomina. The user data is no longer being returned. The only reason we were getting the user data in the first place was thanks to this line. Comment it back in!

> **Note:** We could say `belongs_to :user` instead of `has_one :user`.

If we want to see the post data when requesting users, we can add the following to  `app/serializers/user_serializer.rb`:

```rb
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :first_name, :last_name
  has_many :posts
end
``` 

Make a `GET` request to `http://localhost:3000/api/users` and make sure you can see a user's posts as part of the JSON.

### Methods

We can also create a custom method in this serializer. Let's make a method called `full_name` to output the full name of the user by returning the first and last names as a single string.

By adding `full_name` to the list of attributes we are asking that data to be returned as part of the JSON response:

```ruby
class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :full_name
  has_many :posts

  def full_name
    "#{object.first_name} #{object.last_name}"
  end
end
```

We need to use the reserved word `object` to refer to an object in the JSON output.

Make a request to get the users and you should now see:

```json
[
	{
		"id": 1,
		"username": "alex",
		"full_name": "Alex Chin",
		"posts": [
			{
				"id": 1,
				"body": "I bet we could stick angular ontop of this API..."
			},
			{
				"id": 3,
				"body": "This could be a fun stack for a final project?"
			}
		]
	},
	
	...
]
```

## Independent Practice

> ***Note:*** _This can be a pair programming activity or done independently._

Customize the `http://localhost:3000/api/posts` serializer to also output: 

- the number of characters that were used in the body of the tweet

### Answer:

```ruby
class PostSerializer < ActiveModel::Serializer
  attributes :id, :body, :length, :url
  has_one :user

  def length
    object.body.length
  end
end
```