---
title: Modeling Relationships
type: lesson
duration: "1:25"
creator:
    name: Gerry Mathe & Mike Hayden
    city: London
competencies: Server Applications
---

>Note: Instructors going by baseline sequence should include a review of the Sinatra weekend lab prior to teaching this lesson.

# Modeling Relationships

### Objectives
*After this lesson, students will be able to:*

- Build models with `has_many`, `belongs_to`, `has_and_belongs_to_many`, and `has_many :through`
- Explain and generate migrations

### Preparation
*Before this lesson, students should already be able to:*

- Create models that inherit from ActiveRecord
- Describe a relational database

## Why are relationships important? Intro - 15 mins

A hefty part of designing a relational database is dividing the data elements into related tables. Once you're ready to start working with the data, you rely on relationships between the tables to pull the data together in meaningful ways. For instance, order information is useless unless you know which customer placed a particular order.

By now, you probably realize that you don't store customer and order information in the same table. Instead, you store order and customer data in two related tables and then use a relationship between the two tables to view each order and its corresponding customer information at the same time. If normalized tables are a relational database's foundation, then relationships are the cornerstone.

#### Relationship types

An association, in this context, is a connection between two ActiveRecord models. Associations are implemented using macro-style calls, so that you can declaratively add features to your models. For example, by declaring that one model belongs_to another, you instruct your application to maintain Primary Key-Foreign Key information between instances of the two models, and you also get a number of utility methods added to your model.

- ```has_many``` - Indicates a one-to-many connection with another model. This association indicates that each instance of the model has zero or more instances of another mode.
- ```belongs_to``` - A belongs_to association sets up a one-to-one connection with another model, such that each instance of the declaring model "belongs to" one instance of the other model.
- ```has_and_belongs_to_many``` - A `has_and_belongs_to_many` association creates a direct many-to-many connection with another model, with no intervening model.
- ```has_many :through``` - A `has_many :through` association is often used to set up a many-to-many connection with another model. This association indicates that the declaring model can be matched with zero or more instances of another model by proceeding through a third model.

Let's explain and create these relationships in the context of our application.

## Describe the app and database we're building - Demo - 5 mins

#### The database for this association

The purpose of this application is to show the different kinds of relations between models with ActiveRecord. We will be creating an app called Tunr, which will store information about artists, their albums and genres. We will have the following models:

* Artist
	* name _string_
	* photo _string_
	* nationality _string_

* A model Album
	* title _string_
	* photo _string_
	* release_date _date_
	* price _float_

* A model Genre
	* name _string_

The relationships will be:

* Artist `has_many` albums
* Artist `has_many` genres `through` albums
* Album `belongs_to` an artist
* Album `has_many` genres
* Genre `has_many` albums
* Genre `has_many` artists `through` albums

We're going to be building this from scratch, so let's get started!

## Setup the app

To setup the app we need to:

```bash
$ rails new tunr --api -d postgresql --skip-git
$ cd tunr
```

#### Serializers, CORS and namespacing

When we are building out Rails APIs, there are three things that we are going to keep consistant. These are:

* Adding the gem `'active_model_serializers'` to the Gemfile before scaffolding models
* Enabling CORS by uncommenting the code inside `config/initializers/cors.rb` to avoid CORS issues when the API is called from a frontend app
* Namespacing our API endpoints to `/api`

We will take care of the last one (namespacing) after creating the models, as it involves modifying the routes that are created during the scaffold.

##### Adding `'active_model_serializers'`

Inside `Gemfile.rb` add the following:

```
gem 'active_model_serializers'
```

In the terminal run `bundle` to install the gem.

> **Note:** We could have added `'active_model_serializers'` to the `Gemfile.rb` after creating the models, but by adding it beforehand, it will create serializers for each model automatically. If we had added it afterwards, we would have to generate them ourselves using `rails g serializer name_of_model`.

##### Enabling CORS

Inside `config/initializers/cors.rb` uncomment the following and change `example.com` to `*` to allow requests from any domain:

```ruby
# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## Creating Models

Let's scaffold the Artist, Album and Genre. This will create files for models and controllers for each, and update the routes.

```sh
$ rails g scaffold Artist name photo nationality
$ rails g scaffold Album title photo release_date:date price:float artist:references
$ rails g scaffold Genre name
$ rails db:create
$ rails db:migrate
```

>**Note**: Slack over the seeds file **If students have not used the same naming conventions then it will break, so it might be worth slacking the commands above over...**

Now lets populate the database with some data:

```bash
$ rails db:seed
```

##### Namespacing the routes

At the moment if we opened up Insomina we would be able to retrieve all artist data by making a `GET` request to `http://localhost:3000/artists`. We want to namespace this to be `http://localhost:3000/api/artists`, so inside `config/routes.rb` add the following:

```ruby
Rails.application.routes.draw do
  scope :api do
    resources :artists
    resources :albums
    resources :genres
  end
end
```

In Insomnia test that you can retrieve all of your artists, albums and genres by making `GET` requests to the following URLS:

```sh
http://localhost:3000/api/artists
http://localhost:3000/api/albums
http://localhost:3000/api/genres
```

## Create Associations - Code Along - 30 mins

We create relationships with ActiveRecord by adding functions to the models to define what other tables the model is related to. Then, ActiveRecord will take care of of almost everything - by creating relationships in your database - and then populating the foreign_keys columns in the appropriate tables. It will also provide a bunch of useful, dynamic methods for every instance of the model, making it really easy to retrieve data from other models associated with this instance.

#### Create a `has_many` - `belongs_to`

An album will always belong_to an artist. Therefore, if we create two albums and assign them to the same artist, we will be able to list these two albums for this specific artist.

When we scaffolded the album, we set `artist:references` which meant that `ActiveRecord` already did a lot of the grunt work for us. It has created an `artist_id` field in the `albums` table, and added the first reltionship for us in the model:

```ruby
class Album < ApplicationRecord
  belongs_to :artist
end
```

Let's complete the other half of the relationship. Inside the `Artist` model add the following:

```rb
class Artist < ApplicationRecord
  has_many :albums
end
```

In order to recieve artist data when requesting an album, and vice versa, let's reflect these relationships in the serializer files.

Inside `app/serializers/artist_serializer`:

```rb
class ArtistSerializer < ActiveModel::Serializer
  attributes :id, :name, :photo, :nationality
  has_many :albums
end
```

Inside `app/serializers/album_serializer` the relationship has already been defined as `has_one`. This could be `belongs_to` - it will work either way:

```rb
class AlbumSerializer < ActiveModel::Serializer
  attributes :id, :title, :photo, :release_date, :price
  belongs_to :artist
end
```

#### Testing in Insomnia

In Insomnia, test that you can get back the artist data when requesting an album by making a `GET` request to `http://localhost:3000/api/albums/1`. You should see the following:

```json
{
	"id": 1,
	"title": "Tha Doggfather",
	"photo": "https://s3.amazonaws.com/rapgenius/1366744664_tha-doggfather-5048f1c320e29.jpg",
	"release_date": "1996-11-12",
	"price": 10.99,
	"artist": {
		"id": 2,
		"name": "Snoop Dog",
		"photo": "http://trace.tv/wp-content/uploads/2015/06/snoop-dogg.jpg",
		"nationality": "American"
	}
}
```

Then make sure that you can see the albums that belong to an artist when requesting artist data. Make a `GET request to `http://localhost:3000/api/artists/1`. You should see the following:

```json
{
	"id": 1,
	"name": "The Beatles",
	"photo": "http://www.billboard.com/files/styles/article_main_image/public/media/the-beatles-circa-1966-650-430.jpg",
	"nationality": "British",
	"albums": [
		{
			"id": 4,
			"title": "Please Please Me",
			"photo": "https://upload.wikimedia.org/wikipedia/en/a/a4/PleasePleaseMe.jpg",
			"release_date": "1963-03-22",
			"price": 9.99
		},
		{
			"id": 5,
			"title": "A Hard Day's Night",
			"photo": "https://upload.wikimedia.org/wikipedia/en/e/e6/HardDayUK.jpg",
			"release_date": "1964-06-26",
			"price": 10.99
		}
	]
}
```

#### Create a `has_and_belongs_to_many`

A `has_and_belongs_to_many` association creates a direct many-to-many connection with another model, with no intervening model. For example, if your application includes cars and parts, with each car having many parts and each part appearing in many cars, you could declare the models this way:

```ruby
class Car < ApplicationRecord
  has_and_belongs_to_many :parts
end

class Part < ApplicationRecord
  has_and_belongs_to_many :cars
end
```

We said when we listed the associations that a genre would have many albums and an album can also have many genres. We will, therefore, need to create a join table to link the resource album and the resource genre.

#### Why a join table?

If you create a `has_and_belongs_to_many` association, you need to explicitly creating a joining table. Why?  Join tables bridge the relationship between two resources that both have many of the other. If one resource `has_many` and the other `belongs_to`, you don’t need a join table, because it can be mapped out in two tables no problem. When they both `has_many` of each other, you need a third table because it creates a third dimension.

> **Note**: It could help to draw creating a join table between parts and cars or albums, genres on the board.

To create a join table for albums and genres, we need to add another table in the database, let's create a migration:

```bash
rails g migration CreateJoinTableAlbumsGenres albums genres
```

Rails will create the following migration:

```ruby
class CreateJoinTableAlbumsGenres < ActiveRecord::Migration[5.0]
  def change
    create_join_table :albums, :genrds do |t|
      # t.index [:album_id, :genre_id]
      # t.index [:genre_id, :album_id]
    end
  end
end
```

Then run the migration:

```bash
rails db:migrate
```

Now, we will need to update the models:

```ruby
class Album < ApplicationRecord
  belongs_to :artist
  has_and_belongs_to_many :genres
end

class Genre < ApplicationRecord
  has_and_belongs_to_many :albums
end
```

#### Strong params

At the moment, we won't be able to update an existing album with a genre/s, or create a brand new album with a genre/s, because by default Rails will not accept data unless we explicity allow it. This is known as **strong params**.

In `app/controllers/albums_controller.rb`, at the bottom you will see a comment that says:

```ruby
# Never trust parameters from the scary internet, only allow the white list through.
```

Underneath there is a method `def album_params`, which is a _whitelist_ of properties that rails will allow to be sent from this form. We need to add our `genre_ids` like so:

```ruby
# Never trust parameters from the scary internet, only allow the white list through.
def album_params
  params.require(:album).permit(:title, :poster, :release_date, :artist_id, genre_ids: [])
end
```

Note that since we are expecting an array of ids, we have to indicate that with an array.

Test that you can add genres to the first album by sending the following JSON as the body of a `PUT` request to `http://localhost:3000/api/albums/1`:

```json
{ 
	"album": {
		"genre_ids": [2]
	}
}
```

You shouldn't get an error, but notice that the response does not include the genre/s, or even the arry of ids. In order to display the genre/s inside the album data, and the albums inside the genre data, add the following to the serializers:

```json
class AlbumSerializer < ActiveModel::Serializer
  attributes :id, :title, :photo, :release_date, :price
  has_one :artist
  belongs_to :genres
end

class GenreSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :albums
end
```

Notice that we don't say `has_and_belongs_to_many` in the serializer - instead we just use `belongs_to`.

Now when you make a request for album data you also get back an array of genres:

```json
{
	"id": 1,
	"title": "Tha Doggfather",
	"photo": "https://s3.amazonaws.com/rapgenius/1366744664_tha-doggfather-5048f1c320e29.jpg",
	"release_date": "1996-11-12",
	"price": 10.99,
	"artist": {
		"id": 2,
		"name": "Snoop Dog",
		"photo": "http://trace.tv/wp-content/uploads/2015/06/snoop-dogg.jpg",
		"nationality": "American"
	},
	"genres": [
		{
			"id": 2,
			"name": "Rock"
		}
	]
}
```

And when you make a request for genre data, you get back the albums associated with them:

```json
{
	"id": 2,
	"name": "Rock",
	"albums": [
		{
			"id": 1,
			"title": "Tha Doggfather",
			"photo": "https://s3.amazonaws.com/rapgenius/1366744664_tha-doggfather-5048f1c320e29.jpg",
			"release_date": "1996-11-12",
			"price": 10.99
		}
	]
}
```

## Independent Practice - Add another association - 20 mins

Its over to you... Using the web, find out how to add a relationship between Artist and Genre, using a `has_many` `through` associaiton.

For this relationship, *you just need to add methods in the models and serializers, but you do not need to change the database structure!*

[This guide](http://guides.rubyonrails.org/association_basics.html) about ActiveRecord contains all the details about the different types of relationships. Use it for this exercise.

### Solution

Inside the models make the following changes:

```rb
class Artist < ApplicationRecord
  has_many :albums
  has_many :genres, -> { distinct }, through: :albums
end

class Genre < ApplicationRecord
  has_and_belongs_to_many :albums
  has_many :artists, -> { distinct }, through: :albums
end
```

Inside the serializers make the following changes:

```rb
class ArtistSerializer < ActiveModel::Serializer
  attributes :id, :name, :photo, :nationality
  has_many :albums
  has_many :genres
end

class GenreSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :albums
  has_many :artists
end
```

## Conclusion (5 mins)
Review the solution to the previous independent practice activity. Then discuss these questions:

- Describe why we need a join table for a `has_and_belongs_to_many` relationship?
- What is the name of the columns in the database which stores an id from another table?
- What is the command that executes the migrations to your database?
