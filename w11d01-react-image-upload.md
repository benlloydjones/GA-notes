# Image Upload with React

In this session we'll build out a drag and drop image preview and file uploader.

## The starter-code

If you open up the starter-code, you will see a lot of the grunt work has been done for you.

On the server is the same middleware used in the last module to handle base64 encoded strings, convert them back to images and upload them to an Amazon s3 bucket.

On the client, we need to create a component which will receive a file and convert it to a data url in the format:

```
data:image/jpg;base64,ASJKSAjhkj4h23we&O^Q34O64UYRGF==
```
which breaks down as:
```
data:{mimetype};{encoding},{imageData}
```

We'll be using the exact same method as before, the only difference is that we'll be writing a React component rather than an Angular directive.

## `DragDrop` component

Let's make a start by creating a `DragDrop` component in `src/components/utility`:

```
touch src/components/utility/DragDrop.js
```

And let's create a simple, dumb component:

```js
import React from 'React';

const DragDrop = () => {

  handleImage = (e) => {
    e.preventDefault();
    const file = (e.target.files || e.dataTransfer.files)[0];
    console.log(file);
  }

  return (
    <div
      className="dropzone"
      onDragOver={e => e.preventDefault()}
      onDrop={handleImage}
    ></div>
  );
}

export default DragDrop;
```

Now we can add it to the form. In `src/components/FoodForm` replace the text input for a `<DragDrop />` component:

```js
<div className="form-group">
  <label htmlFor="image">Image</label>
  <DragDrop />
</div>
```

We've created a `div` with the class `dropzone`. This will be an area that a user can drop a file. You'll notice that we have to suppress the default behaviour of `dragover` otherwise, unfortunately the drop event will not behave as expected.

Once a user drops a file, it will trigger the `handleImage` function, which again will suppress the default drop behaviour. Finally we can get the information of the file that was dropped, and log it to the console.

The file information is stored in a `FileList` which is similar to an array. Depending on the browser, it is either available from `e.target.files` or `e.dataTransfer.files`. By using the OR operator, we can handle either case.

## HTML5 `FileReader`

HTML5 exposes a `FileReader` constructor which we can use to read a file and convert it into a data url. Let's add it to our component:

```js
import React from 'React';

const DragDrop = () => {

  const fileReader = new FileReader();
  fileReader.onload = () => console.log(fileReader.result);

  handleImage = (e) => {
    e.preventDefault();
    const file = (e.target.files || e.dataTransfer.files)[0];
    fileReader.readAsDataURL(file);
  }

  return (
    ...
  );
}

export default DragDrop;
```

Here the `readAsDataURL` is doing all the heavy lifting for us. Once we have the file information, we can pass it to the `readAsDataURL` method. Once the `fileReader` instance has finished reading the file, it fires its `onload` method, inside which we can get hold of the data url from `fileReader.result`.

Great, we have the data url. But what if we are using a mobile phone. We need a way to handle a use-case when drag and drop is not possible.

## Handling mobile

To make this mobile friendly we'll create a hidden file input. When the user clicks the dropzone, we'll programmatically trigger a click event on the file input, which will open the file selection menu in the browser.

Firstly we need to add the file input to the component, and grab a reference to the underlying DOM element:

```js
const DragDrop = () => {

  let fileInput = null;

  const fileReader = new FileReader();
  fileReader.onload = () => console.log(fileReader.result);

  handleImage = (e) => {
    ...
  }

  return (
    <div className="drag-drop">
      <input
        type="file"
        accept="image/*"
        ref={element => fileInput = element}
      />
      <div
        className="dropzone"
        onDragOver={e => e.preventDefault()}
        onDrop={handleImage}
      ></div>
    </div>
  );
}
```

You'll notice the `accept` attribute. This will limit the file selection menu to only allow images to be chosen. The `ref` prop takes a callback function which passes the underlying DOM element once React has rendered it to the DOM. So here we can set the element to a variable called `fileInput`.

Now we can add an `onClick` listener to the dropzone which will trigger the `click` event on the hidden file input. We can also add the same `handleImage` event listener to the change event of the file input, so that when a user selects an image with the file selection menu, we can convert it to data url in the same way:

```js
render(
  <div className="drag-drop">
    <input
      type="file"
      accept="image/*"
      ref={element => fileInput = element}
      onChange={handleImage}
    />
    <div
      className="dropzone"
      style={style}
      onDragOver={e => e.preventDefault()}
      onDrop={handleImage}
      onClick={() => fileInput.click()}
    ></div>
  </div>
);
```

A user should now be able to convert an image to a data url either with drag and drop or by clicking on the dropzone. However, the user will have no idea of this at the moment because we are simply logging the string to the console at this stage.

## Displaying the image

In order to display the image, we need to pass it back to the parent component (either `FoodsNew` or `FoodsEdit`). With all the other form fields we are passing a `handleChange` function which updates the `state` of the parent component as the user type in the fields. Let's use that to update the `base64` property of the state.

Update the `FoodsForm` component to pass the `handleChange` method to the `DragDrop` component via props:

```js
<div className="form-group">
  <label htmlFor="image">Image</label>
  <DragDrop onChange={handleChange} />
</div>
```

>**Note:** We're passing the `handleChange` method here as `onChange` to match with the rest of the form

Now let's grab that inside the `DragDrop` component, and use it in the `fileReader.onload` method:

```js
const DragDrop = ({ onChange }) => {

  let fileInput = null;

  const fileReader = new FileReader();
  fileReader.onload = () => onChange({ target: { name: 'base64', value: fileReader.result } });

  handleImage = (e) => {
    ...
  }

  return (
    ...
  );
}
```

So we're cheating a little here. We are calling the `onChange` method, which is the same as the `handleChange` method in the parent component. Let's have a quick look at that method again:

```js
handleChange = ({ target: { name, value } }) => {
  this.setState(prevState => {
    const food = Object.assign({}, prevState.food, { [name]: value });
    return { food };
  });
}
```

`handleChange` expects an object with a `target` property, which itself has a `name` and `value` property. This works in our form because we are attaching the `handleChange` method directly to a form field. The `event` object (or `e`) has a `target` which has `name` being the name of the input, and `value` being the value or text in the field.

We are calling that function manually when the `fileReader` has converted the file passing an object of our own creating with the value that we need (base64 as the `name` and the data url as the `value`). This means that the parent component will automatically update `state` for us setting the `base64` property to be the data url from the `DragDrop` component.

Ok, now all we need to do is set that to be the background image of our dropzone. Firstly we need to send the value of the image back into the component from state, just like we've done with the other form elements:

```js
<div className="form-group">
  <label htmlFor="image">Image</label>
  <DragDrop
    onChange={handleChange}
    value={food.base64}
  />
</div>
```

And then use that in the `DragDrop` component as an inline style:

```js
const DragDrop = ({ onChange, value }) => {
  const fileReader = new FileReader();
  fileReader.onload = () => onChange({ target: { name: 'base64', value: fileReader.result } });

  let fileInput = null;

  const handleImage = (e) => {
    ...
  };

  const style = value ? { backgroundImage: `url(${value})` } : null;

  return (
    <div className="drag-drop">
      <input
        type="file"
        accept="image/*"
        ref={element => fileInput = element}
        onChange={handleImage}
      />
      <div
        className="dropzone"
        style={style}
        onDragOver={e => e.preventDefault()}
        onDrop={handleImage}
        onClick={() => fileInput.click()}
      ></div>
    </div>
  );
};
```

Great! Try dropping a file onto the dropzone, or clicking it and selecting an image from the file selection menu. You should see the image display on the screen! Pretty neat huh?!

Go ahead and save the food, it should upload the image as well!

## Editing an image

If you edit a food that already exists, you'll notice that the dropzone is not pre-populated with the current image. We can very easily change this. In the `FoodsForm` update the `value` of the `DragDrop` component to be either the image that has been dropped (`base64`) or the existing image (`imageSRC`):

```js
<div className="form-group">
  <label htmlFor="image">Image</label>
  <DragDrop
    onChange={handleChange}
    value={food.base64 || food.imageSRC}
  />
</div>
```

Now the image that is displayed should be `base64` if it exists, or `imageSRC` if not.

And we're done! 💥
