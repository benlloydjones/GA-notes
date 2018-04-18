![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Effective Text Editing with Atom

### Objectives
*After this lesson, students will be able to:*

- Explain how to effectively use Atom Text Editor
- Show keyboard shortcuts that will improve speed

## Opening (15 mins)

As developers, we spend a large portion of their time writing computer programs.

#### What are computer programs?

Computer programs are just text files with instructions written in a special syntax i.e. a programming language.

#### How do we create these files?

We create and edit these text files using text editor (e.g. notepad or TextEdit) but there are features and functionality that can be added to text editors that can make our job as developers much easier.

#### IDEs vs Text Editors

IDE: Integrated Development Environment 

An IDE is a program that provide you all the tools you need to create, edit, test and deploy a software project - all in one place. Popular examples of IDEs are: 

- [Netbeans](https://netbeans.org/)
- [Visual Studio](http://www.visualstudio.com/)
- [Eclipse](https://eclipse.org/)
- [RubyMine](https://www.jetbrains.com/ruby/).

#### A hybrid, text-editor designed for programming

Text-editors designed for programming like:

- [Sublime](http://www.sublimetext.com/)
- [TextMate](http://macromates.com/)
- [Atom](https://atom.io/)

Text-editors are much more limited in their scope than IDEs, focussing on the job of helping your write good code. Because of this, you must also be comfortable with the command line.

#### Which is better?

Some programming languages are rarely used outside of an IDE (e.g. Visual Basic). Some developers prefer IDEs, some prefer text-editors. Sometimes a company might ask you to use their tool of choice, sometimes they might let you use whatever your want to. For Ruby and Ruby on Rails it is very common to just use a text editor, although there are IDEs that support Rails. 

#### Start off with the simplest

It is better to learn how to code using just a text editor & command line as this way you learn all the fundamental concepts that a 'magical' IDE can hide from you.

#### Atom

Atom is:

- Multi-platform (OS X, Windows, Linux)
- Popular (widely used for web development)
- FREE
- Extensible (we can add functionality via plugins)
- Built by github

##We Do: Atom Basics (25 mins)

Atom will be the software we spend the most time with. Every time you write code, this will be in Atom.

#### Use atom from command line

Open up Atom from  the terminal

```bash
$ atom
``` 

#### Settings and themes

```
cmd + , 
```

Allows you to access the sublime's user preferences.

We can change the colour scheme Atom uses by clicking on _Themes_. During the course you will occasionally need to show your work on the projector. It is best to pick a light theme for this.

Download the `mac-classic` theme, we will use this theme whenever code is displayed on the board as the colours used make it easy to read, you are more than welcome to find another theme to use when you are developing on your own.

Select _One Light_ for the UI theme, **and** the _Mac Classic_ syntax theme. 

### Find / find and replace

```
Cmd + f
```

A text input should appear at the bottom of the window, giving you the option of finding text in the current document.

```
Cmd + g
```

brings you to the next occurrence of the word you're searching for

```
Cmd + shift + g
```
	
does the same, but brings you to the previous occurrence

```	
Cmd + alt + f
```
	
brings you to the search and replace menu

```
Cmd + shift + f
```
	
the window at the bottom should appear with 3 inputs: one for the word to find, one for the path, one for the replace value. If the "path" text input is empty, the search will only be executed within the scope of the current project.

```
Cmd + d
```
	
Will select multiple occurances of the next word (very useful).

```
Cmd + cursor click
```
	
Will set multiple blinking cursors on your file, allowing you to edit multiple elements at once. 

Also checkout this handy cheatsheet [Atom Editor Cheatsheat](http://d2wy8f7a9ursnm.cloudfront.net/atom-editor-cheat-sheet.pdf)

## Closure (10 mins)

The whole point of using a Text Editor is to be **productive** and **efficient**. Knowing the short cuts will help you to code quicker and find bugs sooner!

Any questions?