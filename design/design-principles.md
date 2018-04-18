#Fundamentals of Website Design

As junior developers working in the industry, it will be rare that you will be the one making many design decisions regarding the sites you are working on. It is more likely that you will be given specifications by a designer that consist of Photoshop/Sketch renderings of the website with annotations to describe how certain elements should behave, i.e drop-downs or hover states. 

However, it is still good to have a basic understanding of the fundamental principles of good website design, so that your personal projects look professional when you show them to potential employers at the end of the course.

Here are some general rules/guidelines to keep in mind when making decisions about how to style your websites. 

##Typeface

If you don't fancy using a '[websafe](http://www.w3schools.com/cssref/css_websafe_fonts.asp)' font for your website (Verdana, Times New Roman etc.) you can either [embed](https://css-tricks.com/snippets/css/using-font-face/) your own font using `@font-face`, or use a resource such as [Google Fonts](https://fonts.google.com/) to pull in your chosen font.

There are several blog posts which list the "best" Google fonts available, that are updated regularly. A good one is by [Type Wolf](https://www.typewolf.com/google-fonts).

The first decision you need to make is whether you want a typeface that is 'serif' or 'sans-serif'. 

![serif vs. sans-serif](http://www.sjo.com/wp-content/uploads/2015/12/sansserif.png)
 
Traditionally a sans-serif typeface is used for a site with a clean, modern look, however if used in the right way, you can make a serif typeface look fresh and up-to-date as well. Have a look at the National Geographic's 'Bears Eye View' [website](http://www.nationalgeographic.com/magazine/2016/05/yellowstone-national-parks-bears-video/) and notice how they combine serif with sans-serif fonts in an elegant way. Also check out Type Wolf's '[Web Fonts in the Wild](https://www.typewolf.com/site-of-the-day)' section for further inspiration. 

For each typeface on the Google Fonts website there is a section called 'Popular Pairings' which is worth checking out. That being said, unless you have a good eye for typography and combining typefaces, the safest bet is to stick with one per project. 

Changing the typeface of a website can totally alter the look and feel, and this is especially important if you are using a CSS framework like Bootstrap. By changing the default typeface you immediately make it feel less Bootstrap-y.

##Colour

There is a vast amount of research on how colour affects the way we perceive and interact with the world around us. The following is an excerpt from [Smashing Magazine](https://www.smashingmagazine.com), taken from their great series of articles on [colour theory](https://www.smashingmagazine.com/2010/01/color-theory-for-designers-part-1-the-meaning-of-color/). 

> Color in design is very subjective. What evokes one reaction in one person may evoke a very different reaction in someone else. Sometimes this is due to personal preference, and other times due to cultural background. Color theory is a science in itself. Studying how colors affect different people, either individually or as a group, is something some people build their careers on. And there’s a lot to it. Something as simple as changing the exact hue or saturation of a color can evoke a completely different feeling. Cultural differences mean that something that’s happy and uplifting in one country can be depressing in another.

Making the good colour choices is very important, and can make the difference between a user deciding to interact with your site or not. Luckily there are lots of online tools that we can use to do some of the hard work for us. 

####Monochromatic

Monochromatic colour schemes are made up of different tones, shades and tints within a specific hue. These are the simplest colour schemes to create, as they’re all taken from the same hue, making it harder to create a jarring or ugly scheme (though both are still possible).


![Monochromatic colour palette](http://i.imgur.com/S70JrHd.png)

If we look at this example from left to right, the first colour could be used for body text, the second for headlines, and the rest for buttons, links or hover states.

The website [Paletton](http://paletton.com/) is a great tool for creating monochromatic colour palettes.

####Complementary

Complementary colour schemes are created by combining colours from opposite sides of the colour wheel. In their most basic form, these schemes consist of only two colours, but can easily be expanded using tones, tints, and shades.

![Complementary colour palette](http://i.imgur.com/cW4ALLK.png)

The [Coolors](https://coolors.co) website is a nice tool to create complementary colour palettes - have a play around with the ability to "lock" a colour and use the spacebar to generate more to go with that one.

####Images

One rule of thumb is that the more photographs (or other colourful images) your website uses, the fewer colours you should have in your design. If images feature very heavily (think large hero images that stretch the full width of the screen) you might want to consider sticking to shades of grey plus one brand colour. The [Pinterest](https://uk.pinterest.com/) colour palette is a perfect example of this. 

![Pinterest colour scheme](http://i.imgur.com/dbejMEI.png)

####Readability

Another key factor to consider when choosing colours for your website is readability. If you are going to use a coloured background, you will want to ensure that the colours you haven chosen provide enough of a contrast. This [Colour Contrast Check Tool](https://snook.ca/technical/colour_contrast/colour.html) will check whether the colours you have chosen are compliant with accessibility guidelines. 

##Buttons & Links

When you are styling your website you will need to make decisions about how to style buttons and links. If you are using a CSS framework such as Bootstrap the first thing that will give you away is your buttons.

Start by changing the background colour to fit in with your chosen colour scheme, and then decide whether or not your buttons will have **border-radius**. Your decision to use border-radius should be consistent throughout the site. As a general rule, don't use a border-radius of more than 5px for buttons etc.

<span style = "background-color: dodgerblue; color: white; padding: 10px 20px; display: inline-block">Button</span>

```css
border-radius: 0px
```

<span style = "background-color: dodgerblue; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block">Button</span>

```css
border-radius: 5px
```

Ensuring that your buttons and links look "clickable" is important. Hover states are a great way of doing this.

```css
button {
	background-color: blue;
}

button:hover {
	opacity: 0.8;
}
```

Here we are making the button slightly opaque on hover so that the user gets visual feedback that they should be clicking here. 

##Layout

For many people website design can be one of the most frustrating aspects of being a developer, as there are no definitive right or wrong ways of approaching it. Often when it comes to layout, simplicity is key.

####Whitespace

Whitespace is space between elements on a page. It is often referred to as negative space and good use of whitespace can be the difference between making a good design great. Don't be afraid to give your content room to 'breathe'.

####Padding

Making sure that you add sufficient padding to your elements can make all the difference when it comes to good design. Padding adds space between text or an image and its containing border.

<span style = "background-color: lightgrey;display: inline-block">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>

```css
padding: 0px;
```

<span style = "background-color: lightgrey; padding:30px; display: inline-block">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>

```css
padding: 20px;
```

Good use of padding will make your site looks more organised and professional, as well as making it more readable. 

####Responsive Columns

Now more than ever it is crucial that your site looks good on mobile devices as well as desktop. Layout is the main area where you will need to plan ahead and make sure that you have wire-framed how your site will adapt when viewed on a small screen.

When using columns to lay out your elements, it is likely that each column will need to stretch to fill the width of the screen when viewed on a small device. This increases readability for the user, and is a simple way to make your site responsive. 

####Inspiration

It can be hard to how best to lay out the elements of your website. Luckily there are countless [sites](http://www.awwwards.com/) and [blog posts](https://designshack.net/articles/layouts/10-rock-solid-website-layout-examples/) that document great examples of website layouts. There is no shame in looking to existing websites for ideas - in fact, on this course there often isn't time to deliberate over styling choices, so do yourself a favour and get inspired!

### Resources

* [Coolor](https://coolors.co/) for colour palettes
* [Gradient generator](https://uigradients.com/#Moonrise)
* [Google Font Pair](http://fontpair.co/)
* [2017 Trendy Google Font Combinations](http://fonts.greatsimple.io/)
* [Noun Project](https://thenounproject.com/) for icons
* [Font Awesome](https://fortawesome.com/) for icons
* [Unsplash](https://unsplash.com/) for royalty free images