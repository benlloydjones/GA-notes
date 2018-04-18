# Intro to the DOM

### Objectives
*After this lesson, students will be able to:*

- Describe the DOM
- Identify differences between the DOM and HTML
- Create DOM elements using javascript
- Explain the methods and differents of using the DOM in javascript


## What is the DOM? (5 mins)

The Document Object Model (DOM) is a programming interface for HTML and XML documents. It provides a **structured representation** of the document and it defines a way that the structure can be accessed from programs so that they can change the document structure, style and content. 

The DOM provides a representation of the document as a structured group of nodes and objects that have **properties** and **methods**. 

Essentially, the DOM connects web pages to scripts or programming languages.

> ***Analogy:*** _It might help you understand the DOM if you think about it like a photocopier, something that makes a copy of things which then allows you to make changes to the copied version._

#### What is a Web page?

A Web page is a document. This document can be either displayed in the browser window, or as the HTML source. But it is the **same document** in both cases. 

The Document Object Model (DOM) provides another way to represent, store and manipulate that same document. The DOM is a fully **object-oriented representation** of the web page, and it can be modified with a scripting language such as JavaScript.

The [W3C DOM](http://www.w3.org/DOM/) standard forms the basis of the DOM implemented in most modern browsers. Many browsers offer extensions beyond the W3C standard, so care must be exercised when using them on the web where documents may be accessed by various browsers with different DOMs.

#### A Tree?

The DOM represents a document as a tree. The tree is made up of parent-child relationships, a parent can have one or many children nodes.

![htmldomtree](https://cloud.githubusercontent.com/assets/40461/8267269/558bf840-1751-11e5-8127-12c6e5c34041.png)

## Setup (10 mins)

Navigate to your classword directory, and create a new html file:

```bash
$ touch dom.html
$ subl dom.html
```

Add some basic html boilerplate code:

```html
<!DOCTYPE>
<html>
<head>
  <title>Introduction to the DOM</title>
</head>
<body>

</body>
</html>
```

Now add some `div` elements inside `body`:

```html
 <h1>Dog</h1>
 <div id="cat"></div> 
 <div class="mouse"></div>
 <div class="mouse"></div>
 <div class="mouse"></div>
```

Now open the `dom.html` in the browser.

## Use a DOM object in Javascript (10 mins)

We can access any HTML tag in the document using javascript and the `document` object:

```js
document.getElementById("any_id_of_any_element")
```

Then it is possible to change this javascript object's properties, and the changes will be reflected in the HTML:

```js
const element = document.getElementById('cat');
=> undefined

element.innerHTML = 'I\'m a cat';
element.style.backgroundColor = 'red';
element.style.border = '2px green solid';
```

## Create a DOM object (15 mins) 

You can also create elements using the DOM using `document.createElement(tagName);`

```js
const element = document.createElement('h2');
=> undefined

element
=> <h2></h2>
```

- `element` is the created element object.
- `tagName` is a string that specifies the type of element to be created. The nodeName of the created element is initialized with the value of `tagName`. Don't use qualified names (like "`html:a`") with this method.

#### Add onto the page

```js
element.innerHTML = 'Elephant';
```

```js
var parent = document.getElementsByTagName('body')[0];
parent.appendChild(element);
```

- `parent` is the parent element.
- `element` is the child node to append. Also returned.

## Different ways of accessing DOM elements

There are a lot of different properties and method of a [DOM Element Object](http://www.w3schools.com/jsref/dom_obj_all.asp).

### Accessing by ID

Returns a reference to the element by its ID.

```js
document.getElementById(id);
```

### Accessing by Class Names

Returns an array of all child elements which have all of the given class names. This is not supported from IE8 and below, so be careful when using it.

```js
const elements = document.getElementsByClassName(names);
```

- `elements` is a `HTMLCollection` of found elements.
- `names` is a string representing the list of class names to match; class names are separated by whitespace
- `getElementsByClassName` can be called on any element, not only on the document. The element on which it is called will be used as the root of the search.

An example:

```js
const mice = document.getElementsByClassName('mouse');
```

### Accessing by Tag Name

Returns an HTMLCollection of elements with the given HTML tag name. The complete document is searched, including the root node.

```js
const elements = document.getElementsByTagName(name);
```

- `elements` is a live HTMLCollection of found elements in the order they appear in the tree.
- `name` is a string representing the name of the elements. The special string "*" represents all elements.

An example:

```js
const divs = document.getElementsByTagName('div');
```

### Accessing First Found Selector

Returns the first element within the document (using depth-first pre-order traversal of the document's nodes) that matches the specified group of selectors. Supported by IE8 and up.

```js
document.querySelector(selectors);
```

- `element` is an element object.
- `selectors` is a string containing one or more CSS selectors separated by commas.

In this example, the first element in the document with the class "mouse" is returned:

```js
const firstMouse = document.querySelector('.mouse');
```

### Accessing an Array of Selectors

Returns a list of the elements within the document that match the specified group of selectors. The object returned is a NodeList. Supported by IE8 and up.

```js
const elementList = document.querySelectorAll(selectors);
```

- `elementList` is a non-live NodeList of element objects.
- `selectors` is a string containing one or more CSS selectors separated by commas.

This example returns a list of all elements within the document with either a class of "mouse" or id of "cat":

```js
const matches = document.querySelectorAll('.mouse, #cat');
```

## Setting and getting elements attributes and content

Once we have fetched an element using one of the above methods, we can 

### Styling an HTML Element.

The `HTMLElement.style` property is an object that represents the element's style attribute. To get the values of all CSS properties for an element you should use `window.getComputedStyle()` instead.

```js
element.style.color = '#ff3300';
element.style.marginTop = '30px';
element.style.paddingBottom = '30px';
```

### Getting and Setting the HTML Elements.

`innerHTML` sets or gets the HTML syntax describing the element's descendants.

```js
// get the HTML of "element"
var content = element.innerHTML;

// set the HTML of "otherElement"
otherElement.innterHTML = content;
```

###Getting and Setting the Class Name.

`className` gets and sets the value of the class attribute of the specified element.

```js
// get the class name of "element"
const cName = element.className;

// set the class name of "otherElement"
otherElement.className = cName;

// gets all classes set on the element "otherElement"
otherElement.classList;

// adds and removes classes from an element
element.classList.add('new-class');
element.classList.remove('new-class');

// toggles a class
element.classList.toggle('toggle-class');
```

###Getting and Setting the ID.

Gets or sets the element's identifier (attribute id).

```js
// get the id of "element"
const idStr = element.id;

// set the id of "otherElement"
otherElement.id = idStr;
```

## A List of DOM Properties and Methods 10 (mins)

Here is a list of some more DOM Properties and Methods for you to refer to. For more information, please use our friend Google.

| **Property / Method** | **Description** |
|-----------------------|-----------------|
| `element.accessKey`	| Sets or returns the accesskey attribute of an element
| `element.addEventListener()` | Attaches an event handler to the specified element
| `element.appendChild()`	| Adds a new child node, to an element, as the last child node
| `element.attributes` | Returns a NamedNodeMap of an element's attributes
| `element.blur()` | Removes focus from an element
| `element.childElementCount` |	Returns the number of child elements an element has
| `element.childNodes` | Returns a collection of an element's child nodes (including text and comment nodes)
| `element.children` | Returns a collection of an element's child element (excluding text and comment nodes)
| `element.classList` | Returns the class name(s) of an element
| `element.className`	| Sets or returns the value of the class attribute of an element
| `element.click()` | Simulates a mouse-click on an element
| `element.clientHeight` | Returns the height of an element, including padding
| `element.clientLeft` | Returns the width of the left border of an element
| `element.clientTop` | Returns the width of the top border of an element
| `element.clientWidth` | Returns the width of an element, including padding
| `element.cloneNode()` | Clones an element
| `element.compareDocumentPosition()` | Compares the document position of two elements
| `element.contains()` | Returns true if a node is a descendant of a node, othwerwise false
| `element.contentEditable` | Sets or returns whether the content of an element is editable or not
| `element.dir` | Sets or returns the value of the dir attribute of an element
| `element.firstChild` | Returns the first child node of an element
| `element.firstElementChild` | Returns the first child element of an element
| `element.focus()` | Gives focus to an element
| `element.getAttribute()` | Returns the specified attribute value of an element node
| `element.getAttributeNode()` | Returns the specified attribute node
| `element.getElementsByClassName()` |Returns a collection of all child elements with the specified class name
| `element.getElementsByTagName()` | Returns a collection of all child elements with the specified tag name
| `element.getFeature()`| Returns an object which implements the APIs of a specified feature
| `element.hasAttribute()` | Returns true if an element has the specified attribute, otherwise false
| `element.hasAttributes()` | Returns true if an element has any attributes, otherwise false
| `element.hasChildNodes()` | Returns true if an element has any child nodes, otherwise false
| `element.id` | Sets or returns the value of the id attribute of an element
| `element.innerHTML` | Sets or returns the content of an element
| `element.insertBefore()` | Inserts a new child node before a specified, existing, child node
| `element.isContentEditable` | Returns true if the content of an element is editable, otherwise false
| `element.isDefaultNamespace()` | Returns true if a specified namespaceURI is the default, otherwise false
| `element.isEqualNode()` | Checks if two elements are equal
| `element.isSameNode()` | Checks if two elements are the same node
| `element.isSupported()` | Returns true if a specified feature is supported on the element
| `element.lang` | Sets or returns the value of the lang attribute of an element
| `element.lastChild` | Returns the last child node of an element
| `element.lastElementChild` | Returns the last child element of an element
| `element.namespaceURI` | Returns the namespace URI of an element
| `element.nextSibling` | Returns the next node at the same node tree level
| `element.nextElementSibling` | Returns the next element at the same node tree level
| `element.nodeName` | Returns the name of a node
| `element.nodeType` | Returns the node type of a node
| `element.nodeValue` | Sets or returns the value of a node
| `element.normalize()` | Joins adjacent text nodes and removes empty text nodes in an element
| `element.offsetHeight` | Returns the height of an element, including padding, border and scrollbar
| `element.offsetWidth` | Returns the width of an element, including padding, border and scrollbar
| `element.offsetLeft` | Returns the horizontal offset position of an element
| `element.offsetParent` | Returns the offset container of an element
| `element.offsetTop` | Returns the vertical offset position of an element
| `element.ownerDocument` | Returns the root element (document object) for an element
| `element.parentNode` | Returns the parent node of an element
| `element.parentElement` | Returns the parent element node of an element
| `element.previousSibling` | Returns the previous node at the same node tree level
| `element.previousElementSibling` | Returns the previous element at the same node tree level
| `element.querySelector()` | Returns the first child element that matches a specified CSS selector(s)` of an element
| `element.querySelectorAll()` | Returns all child elements that matches a specified CSS selector(s) of an element
| `element.removeAttribute()` | Removes a specified attribute from an element
| `element.removeAttributeNode()` | Removes a specified attribute node, and returns the removed node
| `element.removeChild()` | Removes a child node from an element
| `element.replaceChild()` | Replaces a child node in an element
| `element.removeEventListener()` | Removes an event handler that has been attached with the addEventListener()` method
| `element.scrollHeight` | Returns the entire height of an element, including padding
| `element.scrollLeft` | Sets or returns the number of pixels an element's content is scrolled horizontally
| `element.scrollTop` | Sets or returns the number of pixels an element's content is scrolled vertically
| `element.scrollWidth` | Returns the entire width of an element, including padding
| `element.setAttribute()` | Sets or changes the specified attribute, to the specified value
| `element.setAttributeNode()` | Sets or changes the specified attribute node
| `element.style` | Sets or returns the value of the style attribute of an element
| `element.tabIndex` | Sets or returns the value of the tabindex attribute of an | element
| `element.tagName` | Returns the tag name of an element
| `element.textContent` | Sets or returns the textual content of a node and its | descendants
| `element.title` | Sets or returns the value of the title attribute of an element
| `element.toString()` | Converts an element to a string
| `nodelist.item()` | Returns the node at the specified index in a NodeList
| `nodelist.length` | Returns the number of nodes in a NodeList

## Conclusion (5 mins)

Summary of the lesson.

- Any questions?