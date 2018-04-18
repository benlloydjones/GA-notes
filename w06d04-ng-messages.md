---
title: ngClass and ngMessages
type: lab
duration: 1.25
creator:
    name: Alex Chin
    city: Ldn
competencies: Front-end MV*
---

# `ngClass` and `ngMessages`

## Introduction

> ***Note:*** _This can be a pair programming activity or done independently._

Previously, we looked at how to apply some classes using the `ngClass` directive and a basic form.

We can take this a little bit further with Angular's built-in [form validation](https://docs.angularjs.org/guide/forms).

When you "angularise" a form, Angular will add certain classes to the form's state (you might have seen this in the Chrome's Elements Tab?).

| Property | Class | Type | Description |
| -------- | ------| -----| ---------- |
| `$valid`   | `ng-valid` | _Boolean_ | Tells whether an item is currently valid based on the rules you placed.   |
| `$invalid`  | `ng-invalid`  | _Boolean_ | Tells whether an item is currently invalid based on the rules you placed. |
| `$pristine` | `ng-pristine` | _Boolean_ | True if the form/input **has not** been used yet.                         |
| `$dirty`    | `ng-dirty`    | _Boolean_ | True if the form/input **has** been used.                                 |
| `$touched`  | `ng-touched`  | _Boolean_ |True if the input **has** been blurred.                                   |

Using these validations, we can improve the UX of our form and help our users to enter the correct data.

### Adding `ngMessages` as a module dependency

We can either do our validations with either the normal Angular library or we can also use the [`ngMessages`](https://docs.angularjs.org/api/ngMessages/directive/ngMessages) directive, which provides enhanced support for displaying messages.

To install `ngMessages` using bower:

```bash
$ bower install angular-messages --save
```

You will then need to add this as a dependency in `app.js`:

```js
angular
  .module('donutApp', [
    'ngMessages'
  ]);
```

## Exercise

#### Requirements

- Add some validations to the Donut app
- Show the validation messages (after submit and user focus)
- Ensure that only donuts of certain flavours can be added
- Ensure that donuts have both a size and a flavour
- Make sure that the form cannot be submitted if it is invalid

**Bonus:**

- Add some CSS styling to your validations
- Animate your validations using CSS Animations
- Reset the form after submit

#### Deliverable

Here is a screenshot of what your final code might look like:

![validations](https://cloud.githubusercontent.com/assets/40461/9593800/1ad6d962-504b-11e5-9338-f03a6ab4cacf.jpg)

#### Tips

- You might want to add a `name` to your form...
- Can you link a form to a controller?

## Additional Resources

- [`ngMessages` Docs](https://docs.angularjs.org/api/ngMessages)
- [Angular Validations Cheatsheet](http://www.ng-newsletter.com/posts/form-validation-with-angularjs.html)