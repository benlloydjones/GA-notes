![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Intro to CLI

### Objectives
*After this lesson, students will be able to:*

- Use common terminal commands
- Explain the role and importance of the terminal
- Explain how to navigate through directories in the terminal
- Create, copy, move, and remove files from the terminal

## GUI vs CLI (20 mins)

> <cite>"In the beginning was... the command prompt"</cite>

#### What is a GUI (pronounced gooey)?

GUI stands for:

- **G**raphical
- **U**ser
- **I**nterface

Before we had a Graphical User interface (GUI) all we had on a computer was displayed using the CLI.

CLI stands for:

- **C**ommand
- **L**ine
- **I**nterface

We going to develop a lot in the command line, we will use it every day on this course. It will greatly speed up our development process and it will make us feel like hackers!

#### What is the shell?

The shell is a user interface for access to an operating system's services. It is just a program that accepts commands as text input and converts them to appropriate operating system functions.

It is the doorway into our computer's underbelly...

- Reference to Matrix
- [Type like a hacker](http://hackertyper.com/)

#### Z Shell

WDI London uses Z Shell, (ZSH) which is a shell designed for interactive use.

## Opening & Closing the Command Prompt (10 mins)

#### Opening terminal

First, we need to launch the command prompt. We do this by using spotlight:

```bash
cmd+space + "terminal"
```

and typing ```terminal``` followed by ```enter```.

#### Where is this program?

The program is located in

```bash
/Applications/Utilities/Terminal.app
```

#### Closing terminal

(Open two tabs)

To exit the command prompt, you can use ```exit``` or ```ctrl+d```.

You can also quit and force quit the application.

You might not need to completely shut down the console but you might want to terminate a running process because it might be in a loop.

## Navigating through the command prompt (10 mins)

```bash
cd ~/
```

We're "looking into" the User directory at this point...

Use the **TAB** and **arrow keys** in the command line to increase your speed while navigating the command line.

```bash
cd + tab + arrow keys
```

If you don't press enter, just press delete to remove characters...

Pressing **UP** will also get the last command written.

## Common Unix commands (20 mins)

```bash
cd <directory name>
```

cd means Change Directory.	This will move us into our specified directory. We can normally leave out cd in zsh.

```bash
cd
```

Without a specified directory this will take us to our home directory, the same as ```cd ~```

**Using zsh you don't need to use cd. It is a good habit to get into though.**

```bash
~
```

The tilde character (`~`) will take you back to your User directory.

You will need a cd for navigating using one dot.

```bash
.

# Will need to do cd .
```

Is a pointer to the current directory, however using zsh you can't do just ```.``` or you will get an error ```.: not enough arguments```


```	bash
..
```

Is a pointer to the parent directory

```bash
pwd
```

Present working directory

```bash
ls
```

List of items in current directory

```bash
ls -a
```

Will list all items in the current directory including hidden files.

```bash
ls -l
```

Will give you a long list of item in the current directory including permissions, size and last modified date.

```bash
history
```

Will list your entire commands history (use `!line_number` to retrieve a specific command)

```bash
grep

# history | grep <search item>

history | grep cd
```

Global regular expression parser - can be used with history to search.

**Navigate to Desktop**

```bash
mkdir <directory name>
```

Will create the specified directory.

```bash
df -h
```

Display free disk space

```bash
mkdir <nameofdirectory>
```

Makes a new directory.

```bash
cd <nameofdirectory>
touch <filename>
```

Will create the specified file.

```bash
mv <filename> <filename2>
```

Is used for both moving files and renaming them.

```bash
cp <file to be copied> <name to copy it to>
```

Will copy first file to the name of the second file if specified

#### Careful here...

and renaming them, e.g

```bash
rm <filename>
```

Removes the specified file

```bash
rm -rf <directory name>
```

Removes the specified directory (Use with caution, make sure you are in the right place. `-rf` stands for recursive forced, and you can imagine how bad the results could be if you did that in your home folder!)

An example of this is Marco Marsala, who ran a hosting provider business. He ran `rm -rf /` on his computer which deleted everything on his computer, operating system included along with all trace of his company and the websites that he looks after for his customers.

[Link to full article](http://www.independent.co.uk/life-style/gadgets-and-tech/news/man-accidentally-deletes-his-entire-company-with-one-line-of-bad-code-a6984256.html)

## Command line exercise (15 mins)

Here is a little exercise to help you practice with using the terminal

1. Navigate to the desktop
2. Create a directory called `films`
3. Go into this directory
4. Create a file for your favourite film
5. Open this file in `Atom` and add some text inside
6. Create another 3 files for other films in one line
7. Rename one of the films to the name of the sequel
8. Open the entire directory inside `Atom` so you can see all files and make some changes (remember to save files)
9. Delete your two least favourite films

#### Aliases in zsh

You can also increase speed by using aliases which need to be added to the '.zshrc' file.

```bash
# Add in ~/.zshrc
```

## Keyboard shortcuts (10 mins)

Here are a list of keyboard shortcuts. You don't have to use them but if you remember them you will spend less time navigating the terminal and more time writing code.

[CLI Shortcuts](https://gist.github.com/alexpchin/01caa027b825d5f98871)

| **Keypress**    | **Action** |
|-----------------|-------------|
|Ctrl + A|  Go to the beginning of the line you are currently typing on
|Ctrl + E|  Go to the end of the line you are currently typing on
|Ctrl + L|  Clears the Screen, similar to the clear command
|Ctrl + U|  Clears the line before the cursor position. If you are at the end of the line, clears the entire line.
|Ctrl + H|  Same as backspace
|Ctrl + R|  Let’s you search through previously used commands
|Ctrl + C|  Kill whatever you are running
|Ctrl + D|  Exit the current shell
|Ctrl + Z|  Puts whatever you are running into a suspended background process. fg restores it.
|Ctrl + W|  Delete the word before the cursor
|Ctrl + K|  Clear the line after the cursor
|Ctrl + T|  Swap the last two characters before the cursor
|Tab    |   Auto-complete files and folder names

## Closure

You will all be using the terminal everyday on the course, there are a lot of shortcuts and things to remember at first but with some practice, you will feel much more confident using the terminal.

Do you have any questions?