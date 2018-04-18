# Donut AJAX Lab

## Introduction

> ***Note:*** _This can be a pair programming activity or done independently._

We have looked at how we can make an AJAX request to the donuts API to request all of the donuts, loop through them, and display them on the page.

Your task is to use your JS and AJAX skills to get our form working so we can add more donuts to the database from the browser.

## Exercise

#### Requirements

- Add a **submit** event listener to the **form**
- Prevent the form from refreshing the page when it is submitted
- Grab the values from the form (the input and the dropdown) using jQuery - and store them in variables
- When the form is submitted, make a `POST` request using AJAX to create a new donut in the database
- Add the newly created donut to the list of donuts
- Clear the flavor input box, ready for the next donut to be added

> **Note:** The page should ***not*** be reloading.

#### Deliverable

![Deliverable](https://user-images.githubusercontent.com/12997768/30424966-7f1d75f4-993f-11e7-9432-4b1a79918af7.png)

#### Bonus

Once you have the form working, add a delete button next to each donut. When the button is clicked, it should delete the donut from the database, and remove the donut from the list - **without** refreshing the page.

![Bonus](https://user-images.githubusercontent.com/12997768/30424987-8da3f526-993f-11e7-91a3-6600e349356f.png)



## Additional Resources

- [http://youmightnotneedjquery.com](http://youmightnotneedjquery.com/)
- [jQuery AJAX Docs](http://api.jquery.com/jquery.ajax/)
- [Some useful jQuery DOM Manipulation Docs](http://api.jquery.com/prepend/)
- [The Official Doughnut API](https://www.doughnuts.ga/)
