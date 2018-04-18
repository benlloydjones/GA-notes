![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Rails API - Proxy Requests

### Introduction

In the last module, we built Express APIs, and used a package called `request-promise` to make proxy requests to external APIs. This time, we will be using Rails API and a gem called `HTTParty` to make a proxy request to the Dark Sky API. According to them, it ["Makes http fun again!"](https://github.com/jnunemaker/httparty).

The goal is to be able to make a request to our Rails API with a latitude and longitude as part of the query string, and recieve weather data back about that location.

You should already have a Dark Sky API key from the last module that you can use again for this lesson.

### Setup

Our API is going to be simple. Open up the `starter-code` and have a look at the schema. We just have one table - cities - that have a name, country, image, population, lat and lng. For the moment we won't be touching this table - we are just going to build a standalone controller that uses HTTParty to make a request to get weather data based on a given lat and lng. Later we will hook the API up to an Angular app, and display both the city data and the weather data on the page.

```
 --------------              -----------             -------------
|              | ----3--->  |           | ----4---> |             |
| Dark Sky API |            | Rails API |           | Angular App | 
|              | <---2----  |           | <---1---- |             |
 --------------              -----------             -------------
```

We need to generate a new controller in our Rails app. In the terminal, from inside the Rails app, run:

```sh
rails g controller darksky weather
```

Here we are asking Rails to generate a controller called `darksky` and a method inside the controller called `weather`.

### HTTParty

We are going to use a gem called `httparty` to make server side requests, so we need to add this to our `Gemfile`.

```ruby
gem 'httparty'
```

Then run `bundle` in the terminal.

In `app/controllers/darksky_controller.rb` add the following:

```rb
class DarkskyController < ApplicationController
  def weather
    forecast = HTTParty.get("https://api.darksky.net/forecast/#{ENV["DARKSKY_API_KEY"]}/#{params[:lat]},#{params[:lng]}", {
        query: {
          units: "si"
        },
        headers: { "Accept" => "application/json" }
    }).parsed_response

    render json: forecast, status: :ok
  end
end
```

> **Note:** We are pulling in a Dark Sky API key from the `.zshrc` file here - so you will need to make sure that the name of it matches what you called yours when you added it originally.

Inside the headers we are telling Dark Sky that we are only interested in JSON, so that they will send us back a JSON response.

The Dark Sky API [docs](https://darksky.net/dev/docs) define how we should structure the URL - with the latitude, longitude and key as part of the URL, seperated by a comma. We can also specify the units we want the response to be in - mainly the temperature in Celcius.

### Updating the routes

When the Rails controller generator is used, it will also generate a route for us inside `config/routes.rb`.

By default it will look something like:

```rb
Rails.application.routes.draw do
  get 'darksky/weather'
  
  scope :api do
    resources :cities
  end
end
```

This means that it will route a `GET` request to `/darksky/weather` and it knows to look inside the `darkysky_controller` and invoke the `weather` method.

If we want to customise this so that we remove `darksky` from the url, we can say:

```rb
get '/weather', to: 'darksky#weather'
```

We are specifying the URL first, then the name of the controller followed by the name of the method. Also move the route inside the `scope :api do` block.

```rb
Rails.application.routes.draw do
  scope :api do
    resources :cities
    get '/weather', to: 'darksky#weather'
  end
end
```

### Test in Insomnia

Fire up the Rails server with `rails s` and open Insomnia. Make a `GET` request to `http://localhost:3000/api/weather?lat=51&lng=-0.12`. You should see weather data being returned. Neat! Because ours Rails API has CORS enabled, and allows requests from any domains, we would be able to make an `$http` request using Angular, passing in a lat and lng, and get back weather data.
