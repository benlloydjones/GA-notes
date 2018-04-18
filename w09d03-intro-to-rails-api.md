---
title: Intro to Rails
type: lesson
duration: "1:25"
creator:
    name: Gerry Mathe
    city: LDN
competencies: Server Applications
---

# Intro to rails

### Objectives
*After this lesson, students will be able to:*

- Build an API with Rails 5
- Use ActiveModelSerializer to serialize data
- Enable CORS

### Preparation
*Before this lesson, students should already be able to:*

- Execute ruby code in `irb`
- Explain the difference between HTTP request/request
- Explain MVC
- Describe SQL
- Write SQL select statements

## Intro: What is Rails (10 mins)

Rails was created in 2003 by David Heinemeier Hansson, while working on the code base for Basecamp, a project management tool by 37signals. David extracted Ruby on Rails and officially released it as open source code in July of 2004. Despite rapid iteration of the Rails code base throughout the years, it has stuck to three basic principles:

* Ruby Programming Language
* Model-View-Controller Architecture
* Programmer Happiness

Rails was created with the goal of increasing programmers' happiness and productivity levels. In short, with Rails you can get started with a full-stack web application by quickly creating pages, templates and even query functions. Rails heavily emphasizes "Convention over Configuration." This means that a programmer only needs to specify and code out the non-standard parts of a program. Even though Rails comes with its own set of tools and settings, you're certainly not limited to library of rails commands and configurations. Developers are free to configure their applications however they wish, though adopting conventions is certainly recommended.

#### A Look Back

As we look back at the history of Rails, let's review some of the more significant releases over the years.

* Rails 1.0 (Dec 2005) - Mostly polishing up and closing pending tickets from the first release along with the inclusion of Scriptaculous 1.5 and Prototype 1.4.
* Rails 1.2 (Jan 2007) - REST and generation HTTP appreciation
* Rails 2.0 (Dec 2007) - Better routing resources, multi-view, HTTP basic authentication, cookie store sessions
* Rails 2.0 (Nov 2008) - i18n, thread safe, connection pool, Ruby 1.9, JRuby
* Rails 2.3 (Mar 2009) - Templates, Engines, Rack
* Rails 3.0 (Aug 2010) - New query engine, new router for controller, mailer controller, CRSF protection
* Rails 3.1 (Aug 2011) - jQuery, SASS, CoffeeScript, Sprockets with Assets Pipeline
* Rails 3.2 (Jan 2012) - Journey routing engine, faster development mode, automatic query explains, tagged logging for multi-user application
* Rails 4.0 (June 2013) - Strong Parameters, Turbolinks, Russian Doll Caching
* Rails 5.0 (December 2016) - API mode, Action Cable, improved Turbolinks, change from `rake` to `rails`

Over the years, Rails has indeed made it easier for beginners to dive into web development and build large complex applications. Some popular websites built on Rails include Twitter (at one point), GitHub and, of course, 37signals' very own Basecamp. Although it has often been criticized for performance and bloat, Rails continues its iterations with an ever-growing developer community and a vibrant ecosystem.

## What is an API Application?

Traditionally, when people said that they used Rails as an "API", they meant providing a programmatically accessible API alongside their web application. For example, GitHub provides [an API](https://developer.github.com/) that you can use from your own custom clients.

With the advent of client-side frameworks, more developers are using Rails to build a back-end that is shared between their web application and other native applications.

For example, Twitter uses its [public API](https://dev.twitter.com/) in its web application, which is built as a static site that consumes JSON resources.

Instead of using Rails to generate HTML that communicates with the server through forms and links, many developers are treating their web application as just an API client delivered as HTML with JavaScript that consumes a JSON API.

## Rails with Views vs Rails API

Traditionally a Ruby on Rails app would be a full stack app - with models, controllers and routes, and a templating engine which would transform `.erb` files (**e**mbedded **r**u**b**y) into HTML to send to the client. That is to say, a regular Rails app will process data _and_ render the data in the views, answering a HTTP request with a HTML page.

When Rails 5 was released in 2016, the Rails API mode was introduced. This means that when creating a Rails app it is possible to specify that the app should only serve **data** when it receives an HTTP request, rather than HTML pages. This is the equivalent of moving from an Express app with views that uses EJS as a templating engine and serves HTML, to an Express app that just serves JSON data. If you create a new Rails application in API mode, you’ll get a slimmed down skeleton and configuration that assumes you’ll be working with **JSON**, not HTML.

It is then the job of front end frameworks like Angular or React to receive, parse, and do something with the data i.e. update the DOM and display the data to the user.

## Why Use Rails for JSON APIs?

The first question a lot of people have when thinking about building a JSON API using Rails is: "isn't using Rails to spit out some JSON overkill? Shouldn't I just use something like Express or Sinatra?".

For very simple APIs, this may be true. However, even in very HTML-heavy applications, most of an application's logic lives outside of the view layer.

The reason most people use Rails is that it provides a set of defaults that allows developers to get up and running quickly, without having to make a lot of trivial decisions.

Let's take a look at some of the things that Rails provides out of the box that are still applicable to API applications.

### Handled at the middleware layer:

- **Reloading:** Rails applications support transparent reloading. This works even if your application gets big and restarting the server for every request becomes non-viable.
- **Development Mode:** Rails applications come with smart defaults for development, making development pleasant without compromising production-time performance.
- **Test Mode:** Ditto development mode.
- **Logging:** Rails applications log every request, with a level of verbosity appropriate for the current mode. Rails logs in development include information about the request environment, database queries, and basic performance information.
- **Security:** Rails detects and thwarts [IP spoofing](https://en.wikipedia.org/wiki/IP_address_spoofing) attacks and handles cryptographic signatures in a [timing attack](https://en.wikipedia.org/wiki/Timing_attack) aware way. Don't know what an IP spoofing attack or a timing attack is? Exactly.
- **Parameter Parsing:** Want to specify your parameters as JSON instead of as a URL-encoded String? No problem. Rails will decode the JSON for you and make it available in params. Want to use nested URL-encoded parameters? That works too.
- **Conditional GETs:** Rails handles conditional GET (ETag and Last-Modified) processing request headers and returning the correct response headers and status code. All you need to do is use the [stale?](http://api.rubyonrails.org/classes/ActionController/ConditionalGet.html#method-i-stale-3F) check in your controller, and Rails will handle all of the HTTP details for you.
- **HEAD requests:** Rails will transparently convert HEAD requests into GET ones, and return just the headers on the way out. This makes HEAD work reliably in all Rails APIs.

While you could obviously build these up in terms of existing Rack middleware, this list demonstrates that the default Rails middleware stack provides a lot of value, even if you're **_"just generating JSON"_**.

### Handled at the Action Pack layer:

- **Resourceful Routing:** If you're building a RESTful JSON API, you want to be using the Rails router. Clean and conventional mapping from HTTP to controllers means not having to spend time thinking about how to model your API in terms of HTTP.
- **URL Generation:** The flip side of routing is URL generation. A good API based on HTTP includes URLs (see the [GitHub Gist API](https://developer.github.com/v3/gists/) for an example).
- **Header and Redirection Responses:** head `:no_content` and `redirect_to user_url(current_user)` come in handy. Sure, you could manually add the response headers, but why?
- **Caching:** Rails provides page, action and fragment caching. Fragment caching is especially helpful when building up a nested JSON object.
- **Basic, Digest, and Token Authentication:** Rails comes with out-of-the-box support for three kinds of HTTP authentication.
- **Instrumentation:** Rails has an instrumentation API that triggers registered handlers for a variety of events, such as action processing, sending a file or data, redirection, and database queries. The payload of each event comes with relevant information (for the action processing event, the payload includes the controller, action, parameters, request format, request method and the request's full path).
- **Generators:** It is often handy to generate a resource and get your model, controller, test stubs, and routes created for you in a single command for further tweaking. Same for migrations and others.
- **Plugins:** Many third-party libraries come with support for Rails that reduce or eliminate the cost of setting up and gluing together the library and the web framework. This includes things like overriding default generators, adding Rake tasks, and honoring Rails choices (like the logger and cache back-end).

Of course, the Rails boot process also glues together all registered components. For example, the Rails boot process is what uses your `config/database.yml` file when configuring Active Record.

The short version is: you may not have thought about which parts of Rails are still applicable even if you remove the view layer, but the answer turns out to be most of it.

### Other options

Out in the wild, you might see other tools that have been used to make Ruby APIs. The two most popular being:

- [Grape](https://github.com/ruby-grape/grape)
- [Sinatra](http://www.sinatrarb.com/)

## Demo: A blog in 5 mins (10 mins)

The goal of the next few minutes is to show the power that Rails API gives us – it's possible to create an API with a lot of the functionality you've seen in Express APIs – in less than 5 minutes.

I'll talk through this as I demo, and we'll come back and talk about what each of these steps are doing afterwards.

```ruby
rails new blog_app --api -d postgresql --skip-git
cd blog_app
rails generate scaffold posts title:string content:text author:string
rake db:create
rake db:migrate
rails server
```

Open up Insomnia and make a `POST` request to `http://localhost:3000/posts` and send in the following JSON data:

```json
{
	"title": "My first post",
	"content": "Rails API is cool!",
	"author": "mickyginger"
}
```

Then make a `GET` request to `http://localhost:3000/posts` and you should see:

```json
[
	{
		"id": 1,
		"title": "My first post",
		"content": "Rails API is cool!",
		"author": "mickyginger",
		"created_at": "2017-10-11T08:57:16.151Z",
		"updated_at": "2017-10-11T08:57:16.151Z"
	}
]
```

Check out the other 3 routes to show a single post, edit a post and delete a post. Sweet! A fully RESTful API in about 2 minutes!

## Installing Rails

Let's build out a Rails API together. First, make sure you are running Ruby 2.2.2+ or newer as it’s required by Rails 5.

Next, let's ensure we have Rails5 installed:

```bash
gem list rails

rails (5.1.4)
```

> **Note:** If you don't have Rails 5, install the latest version of Rails with:

> ```bash
> gem install rails
> ```

## Codealong: Creating a Rails API (20 mins)

For this introduction, we want to create an API for a cookbook. The specs for this API are as follows:

* Have one model called `Recipe`
* A recipe should have a `title`, `content` and an `author`
* The API should be fully RESTful

Rails follow a pattern called "convention over configuration" - this means that by default, a Rails app expects you to follow specific patterns and folder structures. This means you need to learn these conventions, but also means that once you learn them, you save time by not having to set up a lot of the configuration you'd otherwise need to set up manually.

This structure may look a bit complex – there a lot of files, specific naming conventions, and some nested files and folders. We generally don't create this structure manually, but instead use the Rails command line tool, which initializes the app for us:

```bash
rails new cookbook -d postgresql --api --skip-git
```

> **Note:** If the installation fails when the Rails app bundles, you might have to run install: 

> ```bash
> brew uninstall xz
> gem install nokogiri -v 1.6.8
> ```

> Then run:

> ```bash
> bundle
> ```

##### `-d postgresql`

Great! We just created the initial folder structure for a Rails app, and because we added the option `-d postgresql`, this app will be initialized with PostgreSQL for the database engine.

> **Note:** By default, if you *do not* add any option for the database, Rails will create the app with SQLite3. While you are working in a local development environment (localhost), you won't notice much of a difference between SQLite3 and PostgreSQL.

> Once your app is in production on a remote server, you will *not* use SQLite, and they will often use PostgreSQL. A best practice in web development is to keep development and production environments as similar as possible, so we recommend using PostgreSQL from the start.


##### `--api`

According to the official Rails guide all we need to do to create an API only Rails app is to pass the `--api` option at the command line when creating a new Rails app. This means that the views folders aren't generated, and you’ll get a slimmed down configuration that assumes you’ll be working with **JSON**, not HTML.

##### `--skip-git`

The `--skip-git` command tells the Rails generator not to initialize the directory as a git repo. This is important for us as we are already working in a git initialized repository, and we don't want a git repo inside a git repo.

## Rails API folder structure

Now, let's go into the cookbook folder:

```bash
cd cookbook
```

Let's look at the contents of this folder (using `ls`), and take a look at the files and folders that were magically created by the `rails new` command:

```
├── app
├── bin
├── config
├── db
├── lib
├── log
├── public
├── test
├── tmp
└── vendor
```

Some details about this structure:

* 90% of the web app code will be inside the folder `app`, including all of our model and controller logic.
* `config` contains all the credentials for the DB and other 3rd party services, all the deployment settings, and the specs about how to serve this app over HTTP.
* `db` will contain all of your migrations and seed file.

You will primarily write code inside the folders described above.

Open up the code in Atom and let's have a look inside some of the folders.

## Rails Routing

Rails has a "routing engine" that separates the routing logic from the controller logic (what we want to happen when routes are requested). The configuration for this routing engine is in the file `config/routes.rb`.

```ruby
Rails.application.routes.draw do

end
```

Everything between the `do` and the `end` will be code related to handling routes for the current application.

Later on in this lesson, we will add some content in this file.

## Rails Controllers & Models

As an API, we will need to have controllers to handle requests and call the database through models.

In Rails, the controllers are files inside the folder `app/controllers`. If you open this folder, you will see that one controller is already here: the file `application_controller.rb`. This controller does not directly handle HTTP requests, but rather serves as a link between all the controllers we will create, `application_controller.rb` will be the parent of all the controllers in our app.

Notice that there is also a directory called `app/models`. This is where our model files will live.

We could write out the controller and model files ourselves, or we could use terminal commands to generate them (`rails g controller` and `rails g model`), or we can use another Rails command called **`scaffold`**, which will create the model, controller and routes for us. Neat!

## The `scaffold` generator

Let's say that inside the cookbook app, we want the `Recipe` resource to have a title and a content field, we would type:

```sh
rails g scaffold recipes title content:text
```

> **Note:** Here, `g` is shorthand for `generate`.

Running this command will generate a lot of files, including the controller, the model, and a migration file. It will also update the routes file.

Take a look at the controller, it has all the RESTful methods, and these methods already contain the code to query the database through the model `Recipe`.

We can see that the actions are only rendering JSON instead of rendering HTML:

```ruby
def index
  @recipes = Recipe.all

  render json: @recipes
end
```

### Creating a database

This is great, but at the moment, we don't actually have a database to post or get data to or from. To create a Postgres database that has the same name as our app we need to run:

```sh
$ rails db:create
```

You will see the following in the terminal:

```sh
Created database 'cookbook_development'
Created database 'cookbook_test'
```

> **Note:** If you already have a database called the same thing you will get the following error:
> 
> ```
> Database 'cookbook_development' already exists
Database 'cookbook_test' already exists
```
>
> You can drop a database using the command `rails db:drop`, and then run `rails db:create`. **This is a destructive irreversible action, so use with caution**.

### Rake vs Rails

If you are looking online at blog posts and StackOverflow posts that were written pre-Rails 5, you might see a command called `rake` being used, for example `rake db:create`.

In Rails 5, the normal Rails 4 rake commands are now prefixed by `rails` instead of `rake`. (This was contended by a lot of Rails developers... but DHH wanted this to happen - so it did).

### Migrations

We have a database now, and our app knows where to find it. We also ran the scaffold generator which created a model, controller and routes for the recipes. However, the recipe table does not exist yet in the database. When we ran the scaffold, it generated a migration file - and this is the key to creating the recipe table. Fundamentally, a migration file holds instructions on changes that are to be made to a database. 

**These changes won't happen unless you run the migration.** Generating a migration is **not** the same as exexcuting it. To run a migration file we use the command `rails db:migrate`.

From the [Ruby docs](http://guides.rubyonrails.org/v3.2.8/migrations.html) on migrations:

> Migrations are a convenient way for you to alter your database in a structured and organized manner. You could edit fragments of SQL by hand but you would then be responsible for telling other developers that they need to go and run them. You’d also have to keep track of which changes need to be run against the production machines next time you deploy.

> Migrations also allow you to describe these transformations using Ruby. The great thing about this is that (like most of Active Record’s functionality) it is database independent: you don’t need to worry about the precise syntax of CREATE TABLE any more than you worry about variations on SELECT * (you can drop down to raw SQL for database specific features). For example you could use SQLite3 in development, but MySQL in production.

Open up `db/migrate/20171011101455_create_recipes.rb` and take a look at the migration file. It should look like this:

```rb
class CreateRecipes < ActiveRecord::Migration[5.1]
  def change
    create_table :recipes do |t|
      t.string :title
      t.text :content

      t.timestamps
    end
  end
end
```

This migration file holds instructions to create a new table called `recipes`, with two fields `title` and `content`, and specifies the type of the fields (`string` for title and `text` for content). By specifying `t.timestamps` we also ask the table to include fields for "created at" and "updated at" data.

Run the migration by typing the following command in the terminal:

```sh
rails db:migrate
```

### Schema

Have a look inside `db/schema.rb`. This file is the **schema** of the database, i.e. it is a representation of what the database looks like, but it's **not** the actual database. **You should never edit this file**. Whilst this file is only a representation of the database, our app uses this file in order to interact with the database successfully.

**If you need to change the database you must write a migration**, and not edit the schema file. Running a migration will update the schema accordingly. Use this file to remind yourself of the fields in an existing table.

## Serializing API Output (15 mins)

In it’s current state, when we make some models and controllers, our app will just spit out a JSON representation of every column in the database. This is perhaps not what we want, so we need a way to control what JSON data gets served through the API.

Normally, Rails would suggest we would use a front end templating engine such as `jbuilder` for this purpose, but since we’re not using views in our super streamlined API app, that’s not going to be an option.

> **Note:** Some people (David Heinemeier Hansson) consider JSON to be a template of our data and some people consider it to be a representation of the data itself.

### What does ActiveModelSerializer do?

The purpose of `ActiveModel::Serializers` is to provide an object to encapsulate serialization of ActiveModel objects, including ActiveRecord objects.

Serializers know about both a model and the `current_user`, so you can customize serialization based upon whether a user is authorized to see the content.

In short, serializers replace hash-driven development with object-oriented development.

### Who made AMS?

While not busy working on Rails or the Rails API Gem, the same guys who made the Rails-API gem found the time to also put together the [active_model_serializer](https://github.com/rails-api/active_model_serializers) gem to make it easier to format JSON responses when using Rails as an API server.

### Install the gem

Go ahead and add the `active_model_serializers` gem to your Gemfile:

```ruby
gem 'active_model_serializers'
```

Update your bundle:

```bash
$ bundle
```

### When to add the gem

We can create a serializer for our Recipe model using the generator command:

```bash
$ rails g serializer recipe
```

However, if we had installed `'active_model_serializers'` **before** running any scaffold commands, the serializers would have been generated with other scaffolded files.

Open up `app/serializers/recipe_serializer.rb` and you should find the following:

```rb
class RecipeSerializer < ActiveModel::Serializer
  attributes :id
end
```

The serializer determines the data that will be returned as part of the JSON response from the API. If you add `'active_model_serializers'` before scaffolding a resource, the serializer attributes will be automatically generated - one for each field in the table. If you generate a serializer **after** scaffolding, it will only contain the `id`, meaning it will only return a recipe's `id`. Let's leave it like this for now, and come back to the serializer later.

## Seed some data

Let's seed some recipes to check the JSON output of this new API. Inside, `db/seeds.rb` let's add:

```ruby
Recipe.create!(title: "Beans on Toast", content: "Heat up some beans. Make some toast. Put the beans on the toast.")
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

> **Note:** Here, `s` is shorthand for `server`.

In Insomnia make a `GET` request to `http://localhost:3000/recipes`. The response should look like this:

```json
[
	{
		"id": 1
	}
]
```

This looks promising (something exists in the recipes table and has the `id` of `1`), but where is the title and content information? The reason we are only seeing a recipe's id is down to the serializer. Open up `app/serializers/recipe_serializer.rb` again, and add `:title` and `:content` to the attributes.

```rb
class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :title, :content
end
```

Save the file, and make the same request again in Insomnia. This time the response should look like this:

```json
[
	{
		"id": 1,
		"title": "Beans on Toast",
		"content": "Heat up some beans. Make some toast. Put the beans on the toast."
	}
]
```

Much better! Serializers are really useful as they give us much more control over the data we share, and they are often the first point of call if something isn't showing up in the JSON when we are expecting it to. If you add a new field to your table, you will need to update the serializer to reflect this.

## Namespacing our API (10 mins)

If we want to namespace our API with urls that look like this: `http://localhost:3000/api/recipes` there are several ways to do it.

If we go to our `config/routes.rb` file - we can wrap our routes in a scope:

```ruby
Rails.application.routes.draw do
  scope :api do
    resources :recipes
  end
end
```

> **Note:** Scaffolds won't automatically add new resources into the api scope.

If you visit `http://localhost:3000/recipes`, you should now see:

```
{
"status": 404,
"error": "Not Found",
"exception": "#<ActionController::RoutingError: No route matches [GET] \"/recipes\">",
.
.
.
```

However, if you visit `http://localhost:3000/api/recipes` - you should be fine.

### Versioning

If you were going to make a production application. We might actually create versions of our API, for example `http://localhost:3000/api/v1/recipes`.

However, we don't need to do this at the moment.

## Enabling CORS (15 mins)

If you’re building a public API you’ll probably want to enable Cross-Origin Resource Sharing (CORS). 

### Why is CORS important?

JavaScript and the web programming has grown by leaps and bounds over the years, but the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) still remains. This prevents JavaScript from making requests across domain boundaries, and has spawned various hacks for making cross-domain requests.

At the moment, this is not possible.

### Test this out

Let's make a quick html website to check what we get:

```bash
$ mkdir ajax-test && ajax-test
$ touch index.html
```

To the index.html you can add:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AJAX Test</title>
</head>
<body>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
  <script>
    $.get("http://localhost:3000/api/recipes").done(function(res){
      console.log(res);
    });
  </script>
</body>
</html>
```

Make sure that your Rails server is still running and open up the `index.html` in the browser. Open the console and you should see the error:

```
XMLHttpRequest cannot load http://localhost:3000/api/users. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

### Adding `rack-cors`

This is made very simple by the [`rack-cors` gem](https://github.com/cyu/rack-cors). Just uncomment it in your Gemfile like so:

```ruby
gem 'rack-cors'
```

Update your bundle:

```bash
$ bundle
```

### Enabling CORS 

Inside `config/initializers/cors.rb`
uncomment out the code below.

Change `origins: 'example.com'` to `origins '*'`. This will allow multiple types of request (`:get`, `:post`, `:put` etc) for any resource (`*`) from any origin (`*`).

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

> **Note:** You have to restart the rails server to make this work.

### Test this out

If you check the page that is making the ajax request - you should now see the Array of users being output.


## Conclusion (5 mins)

Rails 5 API is a really powerful tool that allows you to test out ideas quickly, and scaffold a RESTful API efficiently. We need to use the `--api` flag when created the Rails app to make it an API without views.

ActiveModelSerializers are just one way of customizing your JSON output in your Rails API.

We'll be looking at how to integrate this with Angular in later lessons.

### Further reading

- [Using Rails API](http://edgeguides.rubyonrails.org/api_app.html)
- [Building the perfect Rails 5 API](http://sourcey.com/building-the-prefect-rails-5-api-only-app/)
- [How to make Rails 5 API Only](https://hashrocket.com/blog/posts/how-to-make-rails-5-api-only)
- [Building a super simple Rails API](http://www.thegreatcodeadventure.com/building-a-super-simple-rails-api/)
- 