![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Angular + Express - Deploying to Heroku

When deploying to Heroku, there are a few extra steps we need to take in order to make sure our app runs smoothly. These steps are done after we have built the app locally, as they rely on functionality that we have built out after the initial deployment, such as oAuth or image upload.

### Environment Variables

When running an app on `localhost`, often we are pulling in environment variables from a `.zshrc` file, for example AWS bucket names and secrets. When the app is deployed to Heroku, it is unable to access this `.zshrc` file, as it is local to our machines.

In order to add environment variables to your Heroku app use the following command:

```sh
heroku config:set NAME_OF_VARIABLE=value_of_variable
```

Replace `NAME_OF_VARIABLE` with the name of the environment variable, and `value_of_variable` with the value.

To remove an environment variable from Heorku, use `unset`:

```sh
heroku config:unset NAME_OF_VARIABLE
```

> **Note:** To see a list of environment variables in the terminal type `env`. 

### oAuth App Settings

##### Redirect URIs

If you are using oAuth such as Facebook, Twitter, Github etc. you will need to update your app's redirect URIs to include your Heroku url.

If your app allows you to add multiple redirect URIs (Facebook), you can leave `http://localhost:7000` and simply add your Heroku URL as well.

If you app does not allow multiple URIs (Instagram, Meetup), you will need to create a new app, and add those keys and secrets to your Heroku app's environment variables.

> **Note:** Satellizer requires that you pass in your oAuth client ID as plain text in your Angular app. If you have made multiple apps because you weren't able to add multiple redirect URIs to the same app, you will need to add some logic that sends in one ID if the app is running on developemnt, and one if it's running on production.

##### Switching to Production

Often when you have set up oAuth (Facebook, Instagram), the app will be in **development** mode, which means that only the person who created the app (plus any specifically added developers) can log in to the site using oAuth. Once the site is deployed to Heroku you will want to make sure that anyone can log in using oAuth.

Look at your app settings, and find where you can switch it from developemnt to production. For Facebook, you will need to go to "App Review", and then click on the switch at the top.

<img width="935" alt="screen shot 2017-10-04 at 09 54 36" src="https://user-images.githubusercontent.com/12997768/31167613-876c48e2-a8ea-11e7-9e11-efd0fcba57b0.png">

It will then say "Your app is currently **live** and available to the public".

### Seeds File

Ensure that you have a seeds file that runs locally without errors. It's a good idea to have a seeds file, as your local database and your Heroku database aren't connected. Having a seeds file that contains data on each of your models allows you to test your site quickly and easily.

To run a seeds file remotely on Heroku run:

```sh
heroku run node db/seeds
```

### Renaming a Heroku App

To rename an existing Heroku app, run the following command from the terminal:

```sh
heroku apps:rename newname
```

Replace `newname` with the new name of your app.

### Debugging Heroku

If you have pushed to Heroku and the build has failed, or if the build suceeded but the site is not loading, you can see the server logs by running `heroku logs` in the terminal.

You will need to look through the logs for error messages that relate to your code. A lot of the time errors are caused by missing environment variables.
