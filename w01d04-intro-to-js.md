# Intro to Javascript

### Objectives
*After this lesson, students will be able to:*

- Explain what sparked the creation of Javascript
- Explain who made Javascript
- Explain what ECMAScript and JScript are

## Opening (10 mins)

JavaScript has become an extremely important language. It’s ubiquitous in web-capable devices, a pillar of the Web Platform and the base for most web and mobile applications. Thanks to [Node.js](https://nodejs.org/), it’s making its way on the server as well.

To understand JavaScript, however, we have to take a little detour and go back to the history of browsers and the Web.

## Browser Wars (10 mins)

Tim Berners-Lee invented the Web (1990), the first web server, the first web browser (called WorldWideWeb), the first web editor (WorldWideWeb worked as a web editor as well), and the first web pages, which described the project itself.

#### Mosaic

However, Tim Berners-Lee (and many others) saw the Web as a tool for scientists and researchers to exchange information. Luckily for us, some folks had different plans for it.

A bunch of students at the University of Illinois Urbana-Champaign created Mosaic, which is the browser that popularized the World Wide Web.

The reasons might be many, but the main one was that they totally ignored Berners-Lee and went ahead and shipped the `<IMG>` tag, which allowed authors to make things look like they wanted.

Everyone went crazy and the browser quickly became the most popular one.

![1993_mosaic_browser_large](https://cloud.githubusercontent.com/assets/40461/8239877/a153716a-15f6-11e5-9760-5d02cb984a2e.jpg)

(Mosaic 1993).

#### Netscape Navigator

[Netscape](https://en.wikipedia.org/wiki/Netscape) took Mosaic’s authors, had them reimplement a browser which they called Navigator, and built a business around it, making a lot of money.

The reason why people would pay for Netscape Navigator was that Netscape ignored Berners-Lee even more, and implemented a lot of useless stuff that people wanted, like fonts faces and other things that we now take for granted.

#### Microsoft

Netscape was really cool. It looked exactly the same on all operating systems. Another great feature they were experimenting with was a web-based system that allowed users to edit files across the network, regardless of what OS you’d be using.

Of course, Microsoft didn’t like this, as it undermined their Windows business.

So, they released Internet Explorer, gave it away for free, and started the infamous [browser wars](https://en.wikipedia.org/wiki/Browser_wars).

## The history of Javascript (10 mins)

Trying to get ahead in the browser game, JavaScript was developed at Netscape, and was initially called LiveScript. 

### Brenden Eich

[Brendan Eich](https://en.wikipedia.org/wiki/Brendan_Eich) was hired by Netscape to build their new client-side language in 1995. It was first released with Netscape 2, early in 1996. 

#### Was he drunk?

Brendan Eich wrote the original code for Javascript in 10 days. There is a lot of rumours about the fact that he was either drunk of potentially high when he wrote it...

#### Is Java related to Javascript?

**Answer:** No.

Javascript was originally going to be called LiveScript, but was renamed in an ill-fated marketing decision in an attempt to capitalize on the popularity of Sun Microsystem's Java language — despite the two having very little in common. This has been a source of confusion ever since.

#### Microsoft’s JScript

Of course, Microsoft had retaliate to have a scripting language in their browser, too, so they reversed-engineered JavaScript (pretty well, actually), and put it into Internet Explorer.

Because of the “Java” trademark, they had to name it JScript, but it was exactly the same thing.

#### ECMAScript

At the beginning, JavaScript was a mess and needed to be standardized. So, Netscape looked for a body that would do just that. The W3C refused to do it, and eventually they ended up at the European ECMA (weird).

> ***Note:*** _The World Wide Web Consortium (W3C) is the main international standards organization for the World Wide Web_

> ***Note:*** _ECMA International is an industry association founded in 1961, dedicated to the standardization of information and communication systems._

ECMA did standardize the language, but didn’t fix the obviously awful and confusing “JavaScript” name. The thing is, they didn’t know what to call it. So, they just published it with their working name: ECMAScript.

JavaScript, JScript, and ECMAScript are sometimes thought to be different things, but are simply three different names that mean the same thing: JavaScript.

## A weird scripting Language (15 mins)

Unlike most programming languages, the JavaScript language has no concept of input or output. It is designed to run as a scripting language in a host environment, and it is up to the host environment to provide mechanisms for communicating with the outside world. 

The most common host environment is a web-browser, but JavaScript interpreters can also be found in a huge list of other places, including Adobe Acrobat, Abobe Photoshop, SVG images, Yahoo's Widget engine, server-side environments such as [Node.js](http://nodejs.org/), NoSQL databases like the open source [Apache CouchDB](http://couchdb.apache.org/), embedded computers, complete desktop environments like [GNOME](http://www.gnome.org/) (one of the most popular GUIs for GNU/Linux operating systems), and the list goes on.

## ES6 and transpilation

It's an interesting time for JavaScript developers right now. ECMA have commited to releasing a major update to JavaScript every year.

Ultimately this is good for developers, as each new release makes coding in JavaScript simpler and more straightforward. However, because JavaScript has to exist inside a host, like the browser or node, all of these other environments have to also be upgraded to make the new version of JS available.

In order to make sure the code we write will run in any environment we need to **transpile it** back down to an earlier version of the language.

We can do this using a tool called [Babel](https://babeljs.io/)

## Conclusion (10 mins)

This was just a quick summary of the history of Javascript. Let's get started with some code!

- Any questions?

