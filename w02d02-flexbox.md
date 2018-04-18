# CSS Flexbox Layout

### Introduction

The CSS Flexible Box Layout Module (or Flexbox) is a new layout module in CSS3 that was introduced to make it easier to align items, specify the direction of the flow of items, and order them inside a container, even when they are dynamic or of an unknown size. This is especially useful when developing for multiple screen sizes.

When using Flexbox, we have to change the way we think about laying out elements using CSS. Instead of adding styles to the children of our container, with Flexbox we define many more styles on the container, which then affect the children.

![Flex Container & Flex Items](https://i.imgur.com/Hipl6hK.jpg)

From the Mozilla documentation, _"The defining aspect of the flex layout is the ability to alter its items' width and/or height to best fit in the available space on any display device. A flex container expands items to fill available free space, or shrinks them to prevent overflow."_

Now that Flexbox has [good browser support](http://caniuse.com/#search=flexbox), it is becoming the go-to for front-end developers when constructing complex layouts, as positioning is simpler and can be achieved with less code. Rather than thinking about `block` and `inline` elements, we can now think about our elements in terms of rows or columns.

### `display: flex`

The flex layout is made up of a parent container (the **flex container**) and its immediate children (the **flex items**). In order to use the flexbox layout, all we have to do is add `display: flex` or `display: inline-flex` to the parent element, and its immediate children will become flex items.

> A quick note on `display: flex` vs. `display: inline-flex`. The use of `inline-flex` does not make flex items display inline. It makes the **flex container** display inline. That is the only difference between `display: inline-flex` and `display: flex`. A similar comparison can be made between `display: inline-block` and `display: block`.

### `justify-content`

The best way to learn flexbox is by using it, so let's open up the `starter-code`, and start by using flex properties to style the header.

First of all we need to add `display: flex` to the `.header-container`, in order to make the `header` a flex item. Then we can use the `justify-content` property to say that we want the `header` to be centered within its container (the `.header-container`).

```css
.header-wrapper {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
}
```

The justify-content property horizontally aligns the flexible container's items when the items do not use all available space on the main-axis.


By adding `justify-content: center` to the `.header-wrapper` we have acheived the same effect as adding `margin: 0 auto` to the `header` element. But, notice how we did this by adding a property to the parent element (the flex container) instead of directly to the element we wanted to center (the flex item).

Other values for `justify-content` are:

* `flex-start` - Default value. Items are positioned at the beginning of the container
* `flex-end` - Items are positioned at the end of the container
* `center` - Items are positioned at the center of the container
* `space-between` - Items are positioned with space between the lines
* `space-around` - Items are positioned with space before, between, and after the lines

![justify-content](https://i.imgur.com/PLk2wjQ.jpg)

Have a go at changing `justify-content` from `center` to `flex-end`. We will be exploring `space-around` and `space-between` in a moment as these are super useful when you are working with multiple flex items.

### `flex-basis`

This is a good start, but notice that the flex item is only as big as it needs to be to contain it's own children. If we want it to stretch to be as wide as it can be (up to the `max-width`) we can add `flex-basis: 100%` to the `header`.

```css
header {
  max-width: 935px;
  height: 75px;
  padding: 0 20px;
  flex-basis: 100%;
}
```

If no flex-basis is specified, then the `flex-basis` falls back to the item’s `width` property. If no `width` is specified, then the `flex-basis` falls back to the computed width of the item’s contents. This will come in useful when we create the layout for the `main` and `footer` later, so bare this in mind.

> **Note:** `flex-basis` can be encorporated into the `flex` property. `flex` specifies how a flex item will grow or shrink so as to fit the space available in its flex container. This is a shorthand property that sets flex-grow, flex-shrink, and flex-basis. Read more about this [here](https://developer.mozilla.org/en-US/docs/Web/CSS/flex).

Inspect the `header` using the Chrome Dev Tools and notice that the header is now centered on the page, and on desktop it will take up `935px`, as this is the maximum width it can be (defined by our CSS).

We are getting there, but now the elements inside the `header` need some flexbox applied to them. **A flex item can also be a flex container!** Add the following to the `header` styles:

```css
header {
  max-width: 935px;
  height: 75px;
  padding: 0 20px;
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
}
```

We have now told the `header` to also be a flex container, which has made it's children (the logo, input and icons) flex items. Here we are using `justify-content: space-between` to make the children equally spaced across the header. Change `space-between` to `space-around` and notice the difference.

![justify-content](https://i.imgur.com/Kr3RCVv.jpg)

### `align-items`

Ideally we would like all of the flex items inside the header to be aligned centrally along the main axis. Flexbox has the `align-items` property for this purpose.

The possible values for `align-items` are:

* `stretch` - Default value. Items are stretched to fit the container
* `flex-start` - Items are positioned at the top of the container
* `flex-end` - Items are positioned at the bottom of the container
* `center` - Items are positioned at the center of the container (vertically)
* `baseline` - Items are positioned at the baseline of the container

![align-items](https://i.imgur.com/iZHalzk.jpg)

Add `align-items: center` to the `header` styles:

```css
header {
  max-width: 935px;
  height: 75px;
  padding: 0 20px;
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```
Perfect! Aligning items of different heights along an axis is incredibly fiddly to acheive using traditional CSS, so this is an especially useful feature of the flexbox layout.

### `main` & `footer`

In order to align the main and footer to the center of the page, we are going to use the same techniques as we applied earlier to the header. There is a `div` with the class of "page-wrapper" that is around both the `header` and the `footer` elements. We are going to add the same `display` and `justify-content` properties that we added to the `.header-wrapper` earlier.

```css
.page-wrapper {
  display: flex;
  justify-content: center;
}
```

This will center the content on the page, but notice that the `main` and the `footer` elements are now sitting next to each other, as they are both flex items, and have resized to fit inside the flex container. Often this is useful, but for our design we want the `main` to sit above the `footer`.

Add `flex-basis: 100%` to the `main` and`footer` styles:

```css
main {
  max-width: 935px;
  padding: 60px 20px 0;
  flex-basis: 100%;
}

...

footer {
  max-width: 935px;
  font-size: 12px;
  padding: 40px 20px;
  flex-basis: 100%;
}
```

The elements are now taking up equal space, but they are still on one line. This is where the `flex-wrap` property comes in.

### `flex-wrap`

The `flex-wrap` property specifies whether the flex items should wrap or not, if there is not enough room for them on one flex line. Technically at the moment, there shouldn't be enough room for the `main` and the `footer` to sit on one line. In order to allow them to "wrap" we can say `flex-wrap: wrap`. Note that this is a property that we are adding to the flex container, not the flex item.

```css
.page-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
```

The possible values for `flex-wrap` are:

* `nowrap` - Default value. The flexible items will not wrap
* `wrap` - The flexible items will wrap if necessary
* `wrap-reverse` - The flexible items will wrap, if necessary, in reverse order

![flex-wrap](https://i.imgur.com/uzlGt4A.jpg)

Use the Chrome Dev Tools inspector to highlight that the `main` and `footer` are now both taking up their maximum width of `935px` and are centered within the `.page-wrapper`. We will be using `flex-wrap` again when we turn the list of images into a grid.

### `flex`

Next let's tackle the layout of the details at the top of the profile page. There is one `div` with the class of "profile-wrapper", and inside that there two more, with the classes "picture-wrapper" and "details-wrapper". The goal here is that these two elements will sit next to each other, the first taking up one third of the space, and the second taking up two thirds. Flexbox gives us a really nice way of doing this.

First we need to add `display: flex` to the `.profile-wrapper`, in order to make it a flex container.

```css
.profile-wrapper {
  margin-bottom: 45px;
  display: flex;
}
```

The child elements should now be sitting side by side. Next, we need to use the `flex` property to determine how the elements should be spaced. `flex` specifies how a flex item will grow or shrink so as to fit the space available in its flex container.

> **Note:** This is a shorthand property that sets `flex-grow`, `flex-shrink`, and `flex-basis`. If only one value is given then it is interpreted as `flex-grow`. We are targeting this `flex-grow` property in order to specify what amount of space inside the flex container the item should take up.


```css
.picture-wrapper {
  margin-right: 30px;
  flex: 1;
}

.details-wrapper {
  flex: 2;
}
```

Notice how this affects the spacing of the elements, and have a play around with the values if you want to.

While we are here, let's center the profile image inside of the `.picture-wrapper` by adding the following CSS:

```css
.picture-wrapper {
  margin-right: 30px;
  flex: 1;
  display: flex;
  justify-content: center;
}
```

The unordered list inside of the `.details-wrapper` already has `display: flex` added to it, which is allowing the links to sit side by side.

### `flex-direction`

Creating well spaced grids is where flexbox excels. Next we are going to construct the image grid as well as exploring a few more flex properties.

Add the following styles one-by-one and refresh Chrome between each to notice the affect of each.

```css
.grid-wrapper ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
```

It should be evident here how important the `flex-wrap` property is. It's what allows us to create multi-row layouts with ease. The `space-between` value for `justify-content` is a fantastic solution that flexbox provides for creating grids with equal spacing between columns - something that was very fiddly with floats and margin.

Suppose we wanted to flip the order that the images appear in each row. We can do this easily with flexbox. Add `flex-direction: row-reverse` to the `.grid-wrapper ul` styles:

```css
.grid-wrapper ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: row-reverse;
}
```

Notice how it doesn't reorder the entire list, but instead flips the order of each row individually. The default value for this property is `row`.

The other values are as follows:

* `row-reverse` - If the writing-mode (direction) is left to right, the flex items will be laid out right to left
* `column` - If the writing system is horizontal, the flex items will be laid out vertically
* `column-reverse` - Same as column, but reversed

![flex-direction](https://i.imgur.com/ARirLs6.jpg)

Have a play around with the `flex-direction` property and notice that the column is hugging the left side of its flex container even if `justify-content: center;` is declared. When you rotate the direction of a container, you also rotate the direction of the justify-content property. It now refers to the container’s vertical alignment—not its horizontal alignment. In order to center the column on the page we would have to add `align-items: center;` instead.

> **Note:** There is a `flex-flow` property that is a shorthand property for the `flex-direction` and the `flex-wrap` properties. For example, you could write `flex-wrap: wrap` and `flex-direction: column` in one line as `flex-flow: column wrap`.

### `margin`

Finally we are going to add styles to make the footer links sit next to each other.

Add the `display: flex` to the `footer ul`:

```css
footer ul {
  display: flex;
}
```

The only thing we need to do now is make the last link sit over to the right hand side. If you add `margin: 0 0 0 auto` to the last link, this does two jobs.

1. It removes the `margin-right` that is spacing the other links out between themselves
2. By making the `margin-left` auto, the last link will "float" to the right hand side.

```css
footer ul li:last-of-type {
  margin: 0 0 0 auto;
}
```

Auto-margins in flexbox are special. They can be used as an alternative to an extra container element when trying to align a group of items to the left/right of a container. Auto-margins eat up all the extra space in a flex container, so instead of distributing items equally, this moves the last link to the right side of the container.

### Conclusion

The media queries for this site have already been completed, but if you are interested then have a look at the code, especially the `footer`, and notice what has been done using the `flex-wrap` and `justify-content` properties in order to make the links centered and flowing on to multiple lines.

Flexbox is a very powerful addition to your CSS toolbelt, so make time to practice using it during homeworks and project time. This is not an exhaustive list of flexbox properties. Three others that you should look at are [`align-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self), [`order`](https://developer.mozilla.org/en-US/docs/Web/CSS/order) and [`align content`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content), as well as completing this [Flexbox Froggy Game](http://flexboxfroggy.com/).
