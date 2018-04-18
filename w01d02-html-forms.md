# HTML forms

> **Note**: It may be worth having the students install [http-server](https://www.npmjs.com/package/http-server) (`npm i -g http-server`) for this lesson, simply to make the `url` shorter for when the form is submitted later.

One of the most important features of a website is the ability to interact with it. One of the ways of doing that is through the use of a form. Almost all websites have at least one form on them: a login form, a signup form, a contact form. Some way in which the user can connect with the brand or service.

In this session we are going to take a quick look at the markup of forms. We will not be handling any data in any meaningful way at this stage, however, we will be covering some important aspect of how forms work, and how they are put together.

## The structre of a form (20 mins)

The `form` tag is a wrapper for the content of the form. Only elements inside the form are part of the form.

### The `<label>` tag.

A `label` is used to indicate what information the user is expected to enter in each field of the form. A label can be associated with a specific input either with a `for` attriube, containing the input's id:

```html
<label for="name">Name</label>
<input type="text" id="name">
```

Or by placing the input _inside_ the label:

```html
<label>
  <input type="radio"> Pick me!
</label>
```

This is particularly useful for radio buttons and checkboxes.

### The `<input>` tag.

Almost everything inside a form is an `input`. An input is a form field that can hold data from the user. It is a self-closing element, like `img`. It has a `type` attribute which tells the browser what type of data the field should contain, and how it should behave. Here's a list of input types and what data they accept:

| type     | info   |
|:--------|:-------|
| `button` | a simple button (no default behaviour) |
| `checkbox` | boolean value (true or false; can be checked by default with the `checked` attribute) |
| `color` | colour (opens a colour picker; takes the format #RRGGBB) |
| `date` | date (opens a date picker) |
| `email` | valid email address |
| `file` | file to be uploaded |
| `hidden` | alpha-numeric characters (not displayed to the user) |
| `image` | a button with an image (submits form and adds mouse co-ordinates to form data) |
| `month` | month & year (opens a date picker) |
| `number` | numbers only (requires `step` attribute for decimals) |
| `password` | alpha-numeric characters (characters are hidden with a •) |
| `radio` | select one of many options (can be checked by default with the `checked` attribute) |
| `range` | number between two points (dislpays a slider; can be modified with `min`, `max` and `step` attributes |
| `reset` | a button that resets the form |
| `search` | alpha-numeric characters (line-breaks are removed) |
| `submit` | submits the form (requires a `value` attribute) |
| `tel` | telephone number (can be modified with `pattern` and `maxlength` attributes |
| `text` | alpha-numeric characters (line-breaks are removed) |
| `time` | time (HH:MM format) |
| `url` | a valid URL (can be modified with `pattern` and `maxlength` attributes |
| `week` | week of the year (opens a week picker) |

### The `<select>` & `<option>` tags

A `select` tag displays a dropdown menu. A select contains `options` one of each item in the drop down menu. Each options can be `selected` (ie that option is displayed when the page is loaded) and `disabled` (ie cannot be selected by the user). Typically a select has an instructional menu option which is `selected` and `disabled`.

```html
<select>
  <option selected disabled>Please choose...</option>
  <option>Bernie Sanders</option>
  <option>Donald Trump</option>
  <option>Hillary Clinton</option>
</select>
```

### The `<textarea>` tag

If you need to handle a lot of data from the user, a review or blog post for example, you need to use a `textarea`. This will accept multi-lines of text and will keep line-breaks. It also takes `row` and `col` attributes which we traditionally used to set the dimentions of the input, however it is more common to use CSS these days.

```html
<textarea></textarea>
```

### The `value` attribute

You can set the value of the data for a form element using the `value` attribute.

For `input` fields, this will set the initial contents of the field.

For `radio` buttons and `checkboxes`, it will set the value of each item. The value of the selected item will be added to the form data.

For `submit` buttons, it will set the button text, and will also be added to the form data.

With dropdown menus the `value` attribute can be added to the `option` tag. The value inside the `value` attribute of the selected `option` will be added to the form data, rather than the menu text.

`textareas` do not have a value attribute. However, you can add text between the tags which will behave in the same way.

## Independent practice (15 mins)

Create a new folder `html-forms` and inside it a new html document `index.html`:

```bash
$ mkdir html-forms
$ cd html-forms
$ touch index.html
```

Open the folder in `atom`:

```bash
$ atom .
```

Now add some HTML boilerplate code:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HTML Forms</title>
  </head>
  <body>
  </body>
</html>
```

Fire up node's `http-server` like so:

```bash
$ http-server -p 8000
```

And naviagte to `http://localhost:8000` in your browser.

Create the following form using the correct elements. Ensure that the form is pre-populated as shown in the image on page load.

![basic-form](https://cloud.githubusercontent.com/assets/3531085/22377236/011157a2-e4a9-11e6-9200-4a729d7b202f.png)

## Submitting forms (10 mins)

If you click on the submit button of the form you've just created you will see that the page reloads, and a `?` appears in the URL.

That `?` is an important. By submitting the form you are attempting to add data to the url. However, before the data will appear there, you need to add a `name` attribute to your form elements.

Update the first field to look like this:

```html
<div>
  <label for="firstname">First Name</label>
  <input type="text" id="firstname" name="firstname" value="Don">
</div>
```

Then submit the form. You should get this URL appear:

```
http://localhost:8080/?firstname=Don
```

Update all of your inputs with `name` attributes, then submit your form. You should end up with a URL like this:

```
http://localhost:8080/?firstname=Don&lastname=Juan&dob=1301-10-10&email=don%40juan.com&interest=women&color=%23ff0000&height=178&bio=I+like+drinking%2C+gambling+and+partying.
```

Without a `name` attribute form inputs are effectively useless. **Always remember to add a `name` attribute to your fields**.

## The `<button>` tag (10 mins)

There are several HTML elements that can submit a form. The two most common are `<input type="submit">` or `<button>`.

Without any attributes, if a `<button>` tag is inside a `<form>`. It will submit the form. Go ahead and update the form to use a `<button>` instead of an `<input type="submit">` tag:

```
<button>Submit</button>
```

The button tag can have the following `types`:

| type | info |
|:-----|:-----|
| `submit` | Submits the form (default) |
| `reset` | Resets the form |
| `button` | Does nothing |

**`<button type="button">`?!!**

Yep, weird, I know. The `button` type is used to basically stop the button from having any default bahaviour. The idea being that it would be used in conjunction with some custom JavaScript.

## Conclusion

Although we will not be looking at forms again in this module, it's important to understand their intricacies early on.

### See also
- [My First HTML Form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/My_first_HTML_form)
- [How To Structre A HTML Form](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/How_to_structure_an_HTML_form)
- [Mozilla HTML Forms Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms)
