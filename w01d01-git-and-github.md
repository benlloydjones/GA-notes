![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Git and GitHub Intro

### Objectives
*After this lesson, students will be able to:*

- Explain basic git commands like `init`, `add`, `commit`, `push`, `pull` and `clone`
- Distinguish between local and remote repositories
- Create, copy, and delete repositories locally, or on GitHub
- Fork and clone remote repositories

### Preparation
*Before this lesson, students should already be able to:*

- Install a text editor
- Use the command line
- Use a text editor

## Git vs GitHub and version control (10 mins)

#### What is Git?

[Git](https://git-scm.com/) is:

- A program you run from the command line
- A distributed version control system

Programmers use Git so that they can keep the history of all the changes to their code. This means that they can rollback changes (or switch to older versions) as far back in time as they started using Git on their project.

You know how Google Docs allow you to have a "version history" and move between different versions whenever you want?  Git enables you to do that with any folder - and its contents - on your computer!

A codebase in Git is referred to as a **repository**, or **repo**, for short.

Git was created by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds), the principal developer of Linux.

#### What is GitHub?

[GitHub](https://github.com/) is:

- A hosting service for Git repositories
- A web interface to explore Git repositories
- A social network of programmers
  - We all have individual accounts and put our codebases on our GitHub account
  - You can follow users and star your favorite projects
- A place where developers can access public codebases


#### Can you use git without GitHub?

> Instructor Note: Explain the differences between 'remote' and 'local'.

Git is a software that enables version control on local folders on your machine.  GitHub is a place to host your Git repositories, remotely. You can certainly have local files, that are using Git, that are not sent to or stored on GitHub.

Read [this](http://stackoverflow.com/questions/11816424/understanding-the-basics-of-git-and-github) when you have time!

> Check: Ask students to describe how remote files compare to local files.  Describe how Git compares to GitHub.

## Demo: Why is Git tricky to understand? (15 mins)

Git is tricky to understand because describing 'how' it works would require the use of strange and technical-sounding words like:

- [Directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- [SHA-1](https://en.wikipedia.org/wiki/SHA-1)
- blob
- tree

However, you don't actually need to know how it works under the hood in order to use it.

#### Trees?!

Even though you don't need to know how they work, it is useful to know that your local repository consists of three "trees" maintained by Git.

- **Working Directory**: like any other folder on your machine; just holds the actual files
- **Index**: acts as a staging area (an area that holds files "ready" to be versioned)
- **HEAD**: points to the last commit you've made (the last "version" of the code you've stored using git)

![workflow](https://cloud.githubusercontent.com/assets/40461/8221736/f1f7e972-1559-11e5-9dcb-66b44139ee6f.png)

#### So many commands?!

There are also a lot of commands you can use in Git. You can take a look at a list of the available commands by running:

```bash
$ git help -a
```

Even though there are lots of commands, on the course we will really only need about 10.


#### Git File Lifecycle

To understand how Git works, we need to talk about the lifecycle of a Git-tracked file.

![lifecycle](https://cloud.githubusercontent.com/assets/40461/8226866/62730b4c-159a-11e5-89cd-20b72ed1de45.png)

Schema From [git-scm.com](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)

There are 4 main stages of Git version controlled file:

1. **Untracked**: When a file is "untracked," Git is not "watching" this file; the file will not be added in the next commit
2. **Staged**: Staged files have not yet been committed to memory but they are "on deck", so to speak, for your next commit
3. **Unmodified**: The file has already been committed and has not changed since the last commit
4. **Modified**: You have changes in the file since it was last committed, you will need to stage them again for the changes to be added in the next commit

Once you have committed a file and it becomes "unmodified" then it's contents are saved in Git's memory.

- **Not saved in git memory**: Your file is not saved until you commit the file to Git's memory
- **Saved in git memory**: Only once you have committed a file, it becomes saved in Git's memory

> Check: Work with the person next to you, get on the web, and take 3 minutes to come up with a one-sentence explanation of the difference between untracked and stage files. Get ready to share out.

## Guided Practice: Let's use Git (15 mins)

Let's make our first Git repo. Try this with me!

First, create a directory on your Desktop:

```bash
$ cd ~/Desktop
$ mkdir hello-world
```

You can place this directory under Git revision control using the command:

```bash
$ git init
```

Git will reply:

```bash
Initialized empty Git repository in <location>
```
> Check: Did students get this message?

You've now initialized the working directory.

#### The .git folder

If we look at the contents of this empty folder using:

```bash
ls -A
```

We should see that there is now a hidden folder called `.git` this is where all of the information about your repository is stored. There is no need for you to make any changes to this folder. You can control all the git flow using `git` commands.

#### Add a file

Let's create a new file:

```bash
$ touch a.txt
```

If we run `git status` we should get:

```bash
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	a.txt

nothing added to commit but untracked files present (use "git add" to track)
```

This means that there is a new **untracked** file. Next, tell Git to take a snapshot of the contents of all files under the current directory (note the .)

```bash
$ git add .
```

This snapshot is now stored in a temporary staging area which Git calls the "index".

#### Commit

To permanently store the contents of the index in the repository, (commit these changes to the HEAD), you need to run:

```bash
$ git commit -m "Please remember this file at this time"
```

You should now get:

```bash
[master (root-commit) b4faebd] Please remember this file at this time
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 a.txt
```

> Check: Did students get this message?

#### Checking the log

If we want to view the commit history, we can run:

```bash
git log
```

You should see:

```bash
* b4faebd (HEAD, master) Please remember this file at this time
```

> Check: Did students get this message?

To exit this view, you need to press:

```bash
q
```

#### Make changes to the file

Now let's open a.txt in a text editor.

Inside the file, write something.

If you press `return` in the terminal, you will now see that you have untracked changes.

Running `git status` again will show you that a.txt has been **modified**.

#### Revert to a previous commit

> Instructor Note: Demonstrate this to show the power of Git/GitHub but don't have students follow along.

Let's now make a second commit.

```bash
$ git add .
$ git commit -m "Second commit"
```

Checking `git log` will show you 2 commits with different ids:

```bash
* 6e78569 (HEAD, master) Second commit
* b4faebd Please remember this file at this time
```

We can revert the file back to the first commit using it's specific commit id with:

```bash
$ git reset --soft b4faebd
```

This will do a soft reset, where the changes in the file we made are still there - the changes are staged but not committed anymore.

If we want to revert the file back and disregard any changes (dangerous!), we can use:

```bash
$ git reset --hard b4faebd
```

## Guided Practice: Making and cloning repositories  (10 mins)

Let's do this together:

1. Go to your GitHub account
2. In the top left, hit the `+` button and select `New repository`
![](https://help.github.com/assets/images/help/repository/repo-create.png)
3. Name your repository `hello-world`
![](https://help.github.com/assets/images/help/repository/repo-create-name.png)
4. **Initialize this repository with a README** (So that we can `git pull`)
4. Click the big green Create Repository button

We now need to connect our local Git repo with our remote repository on GitHub. We have to add a "remote" repository, an address where we can send our local files to be stored.

```bash
git remote add origin git@github.com:github-name/hello-world.git
```

You can find this address by clicking on the "Cone or download" button:

<img src="https://i.imgur.com/PNyQ2YW.png" align="center">

#### Pushing to GitHub

In order to send files from our local machine to our remote repository on GitHub, we need to use the command `git push`. However, you also need to add the name of the remote, in this case we called it `origin` and the name of the branch, or "copy" of the code, in this case `master`. (Don't worry about branches just yet!)

```bash
git push origin master
```

In other words: "Hey Git, take the code I have locally and send it to the 'master' copy located at the 'origin' web address".

This should fail due to new files on the remote repo.

> Check: Did students get a failure message?

#### Pulling from GitHub

As we added the README.md in our repo, we need to first `pull` that file to our local repository to check that we haven't got a 'conflict', or a difference between our remote and local code.

```bash
git pull origin master
```
In other words: "Hey Git, give me the current code from the 'master' copy located at the 'origin' web address".

Once we have done this, you should see the README file on your computer. Now you can push your changes:

```bash
git push origin master
```

Refresh your GitHub webpage, and the files should be there.

> Check: Were students able to get their code on GitHub?


#### Cloning your first repository

Now that everyone has their first repository on GitHub, let's clone our first repository!

Cloning allows you to get a local copy of a remote repository.

Navigate back to your Desktop and **delete your hello-world repository**:

```bash
cd ~/Desktop
rm -rf hello-world
```

Now ask the person sitting next to you for their GitHub name and navigate to their repository on GitHub:

```bash
https://www.github.com/<github-username>/hello-world
```

Again, on the right hand side you will see:

<img src="https://i.imgur.com/mnnEwUN.png" align="center">

Ensure that you have SSH checked and copy this url.

#### Clone their repo!

To retrieve the contents of their repo, all you need to do is:

```bash
$ git clone git@github.com:username/hello-world.git
```

Git should reply:

```bash
Cloning into 'hello-world'...
remote: Counting objects: 3, done.
remote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
Checking connectivity... done.
```

> Check: Did students get this message?

You should have another 'hello-world' folder on your machine - `ls` to check it out. You now have cloned your first repository!


## Introduction: What is forking? (5 mins)

The `fork` and `pull` model lets anyone fork an existing repository and push changes to their personal fork without requiring access be granted to the source repository.

Most commonly, forks are used to either propose changes to someone else's project or to use someone else's project as a starting point for your own idea.

> Check: Could someone explain the difference between forking and cloning?

#### Cloning vs Forking

When you fork a repository, you make a new **remote** repository that is exactly the same as the original, except you are the owner. You can then `clone` your new fork and `push` and `pull` to it without needing any special permissions.

When you clone a repository, unless you have been added as a contributor, you will not be able to push your changes to the original remote repository because it's not your GitHub repository!

#### Pull requests

When you want to propose a change to a repository (the original project) that you have forked, you can issue a pull request. This basically is you saying:

_"I've made some changes to your repository, if you want to include them in your original one then you can pull them from my fork!"_

We'll give this a shot in the next section.


## Guided Practice: Working with Forks and Creating Pull Requests on GitHub (15 mins)

Let's practice the flow that you'll be using in all our classes to get assignments and submit your work:

The goal is to get the work from [this](https://github.com/ga-students/forking-exercise) repo onto your local machine, make a change, and submit a pull request.

1. First, click on a link to this repository:  https://github.com/ga-students/forking-exercise
2. Click on the fork button in the top right corner (After you do, notice that you have a new repo that you own forked from ga-students/forking-exercise!)
3. Find the "Copy to clipboard" button to get the clone URL
4. Jump back to the terminal, and from your root directory, type in: `git clone URL`
5. `cd` into the cloned repository and open the `forking-exercise` folder in a text editor
6. Type in your name in the `readme.md` file
7. `add`, `commit`, and `git push origin master`

> Check: Do students have their changes on their GitHub fork of the forking-exercise repo?

Remember, before you can open a pull request from your fork, you must commit new code to your local clone of your fork, and push that code to your forked copy on GitHub.  Now, to create a pull request:

1. Visit your forked repository
2. Click the "Compare, review, create a pull request" button in the repository ![pr](https://cloud.githubusercontent.com/assets/40461/8229344/d344aa8e-15ad-11e5-8578-08893bcee335.jpg)

3. You'll land right onto the compare page - you can click Edit at the top to pick a new fork/branch combo that you're requesting to merge with, using the Head Branch dropdown.
4. Select the target fork/branch your requesting your fork/branch be merged with, using the Base Branch dropdown
5. Review your proposed change
6. Click "Click to create a pull request" for this comparison
7. Enter a title and description for your pull request
8. Click 'Send pull request'

> Check: Does the https://github.com/ga-students/forking-exercise have new pull requests from your students?

Nice work! Take a moment to think about this flow because we'll be using it throughout the course!

## Independent Practice: Assess (10 mins)

Use the internet and what you've learned today to answer the following questions with a partner:

* How do I send changes to the staging area?
* How do I check what is going to be committed?
* How do I send the commits to GitHub?
* How do I go back to the previous commit?
* How do I check the configuration on a specific machine?
* How does GitHub know that I am allowed to push to a specific repo?

> Check: Call on various students to reveal their answers.

## Introduction: Git Ignore file (10 mins)

Before we wrap things up, let's have a chat about the .gitignore file.

When you create a new project, most integrated development environments usually generate files specific to your computer (i.e. setup files, temporary files, compiled code, etc). These kind of files should not be pushed to the remote Git repository, as they are specific to you alone and might affect other peoples' ability to use the project.

This is where the .gitignore file comes in.

The .gitignore file lists the type of files that should not be uploaded to your remote Git repo (i.e., what files to _ignore_).

You can put .gitignore files in your repo, so whoever clones your project will ignore unnecessary files. You can also set up your computer so you always ignore certain files for all of your projects - a "global gitignore". Let's do the latter now.

Go to [gitignore.io](https://www.gitignore.io/), a website that generates .gitignore files. Type in the types of projects you'll be working with (Rails, Android, OSX, Windows), and press _Generate_. Copy all of the generated text.

Okay, now open Terminal and create the .gitignore file wherever you want; I tend to run `touch ~/.gitignore`. Then, open it and paste the generated text into the file. Make sure to save it!

Now, you have to register the file with Git. In Terminal, run:

```bash
  git config --global core.excludesfile ~/.gitignore
```

All of your future projects will ignore the files listed.

*Note*: For local .gitignore files, you don't have to register them with Git. Just put them in the root folder of your Git project.

## Conclusion (5 mins)

As a developer, you'll have to use Git pretty much everyday - the learning curve is steep and all the principles of version control can be a bit blurry sometimes, so we ask students to push their homework everyday and to commit regularly during project time.

Don't be frustrated by all the new commands because we will definitely have the time to practice during this course.

- Explain the difference between forking and cloning.
- Describe the steps to initialize a Git repository and link your local repository to a GitHub remote location.