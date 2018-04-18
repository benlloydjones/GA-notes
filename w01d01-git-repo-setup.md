![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# WDI Repo Setup

### Objectives
*After this lesson, students will be able to:*

- Setup the repositories that the students will use on WDI
- Walk the students through the way that they will submit homeworks
- Walk the students through the way that they will pull the lesson notes
- Walk the students through the way that they will pull the classwork starter-code

> ***Note:*** _Ensure that the team on Github has been setup._ If it hasn't then you will need to get the students to Slack you their usernames and you will need to add them to a ga-students team

## Classwork, Homework and Lesson Notes (20 mins)

During WDI, we will use 3 main Git-tracked repositories:

1. Homework
2. Lesson Notes (and completed examples)
3. Classwork

Everyone needs to have a copy of these repositories.

### Development directory

Create a development folder on your computer and cd into it:

```bash
$ mkdir ~/development
$ cd ~/development
```

We prefer to have everyone's GA work in the same place, so that we don't have to search for it on people's machines during lessons.

## Homework Repository

### Step 1. Fork the repository

First, [fork](https://help.github.com/articles/fork-a-repo) this repository by clicking the fork button.

![folk-repo](https://cloud.githubusercontent.com/assets/40461/10177089/43f10122-66f0-11e5-86b6-e4a6d23160f7.png)

### Step 2. Clone your fork

Next, clone your fork to your machine.

![clone](https://cloud.githubusercontent.com/assets/40461/10177745/b394027e-66f3-11e5-8cc5-20c01c9a7785.png)

### Step 3. Create your directory

In the root folder, create a folder with your github nickname.

```bash
.
├── README.md
└── github-username-directory
```

## Submitting work

### Step 1. Create a week/day folder

When you are going to add a new homework, first create a directory with the information about the week and the day like with the format `w01d02` (for week one, day two).

Your folder structure should look something like this:

```
.
├── README.md
└── github-username-directory
    └── w01d02
```

### Step 2. Push to your fork

At the end of each day (or first thing each morning), ensure all of your homework is committed to git and pushed to your github fork of the student work repository.

### Step 3. Submit a pull request

Then create a [pull request](https://help.github.com/articles/using-pull-requests) from your fork. This will automatically include all the commits you have made to the repository.

![pull-request](https://cloud.githubusercontent.com/assets/40461/10177944/ceec1308-66f4-11e5-8603-b918db3ca45e.png)

### Step 3. Add a title and comment

Add the title of homework to the pull request, e.g. "Javascript calculator w01d02".

Then add a comment to the pull request. Every comment should follow this format:

```
* Comfortability [0 to 5]
* Completeness [0 to 5]
* What was a win?
* What was a challenge?
* Any other comments
```

The instructional team will then review your pull request, and use the main repository as the source to monitor your work. If you do not issue a pull request, it will appear to us that you have not completed the assignments for the previous day, and it will be recorded as such.

If you have any problems with submitting assignments, ask the instructional staff to help you.

## Classwork Repository

### Step 1. Fork the repository

First, [fork](https://help.github.com/articles/fork-a-repo) this repository by clicking the fork button.

<img width="476" alt="screen shot 2017-03-21 at 15 34 30" src="https://cloud.githubusercontent.com/assets/40461/24155532/06443092-0e4c-11e7-8999-9196e91f1216.png">

Choose to fork this repository to your account (only relevant if you are a member of an organisation).

### Step 2. Clone your fork

Next, clone your fork to your local machine by copying the SSH from your repository. 

![clone](https://cloud.githubusercontent.com/assets/40461/10177745/b394027e-66f3-11e5-8cc5-20c01c9a7785.png)

Navigate to your development directory:

```bash
cd ~/development
```

And run the command:

```bash
git clone git@github.com:<student-github-name>/wdi-ldn-26-classwork.git
```

### Step 3. Setup the upstream

In order for you to connect your locally cloned fork to the original repository on github, we need to add a new `remote` for this `upstream` (this is the convention for the name of the original repository).

Let's go and grab the SSH for that original repository.

<img width="1000" alt="screen shot 2017-03-21 at 13 38 37" src="https://cloud.githubusercontent.com/assets/40461/24154496/3ffcdfc6-0e49-11e7-9978-3bf852bd7bd8.png">

Now make sure that you're in your locally cloned fork of your classwork and type:

```bash
git remote add upstream git@github.com:ga-students/wdi-ldn-26-classwork.git
```

## Fetching starter-code

At the start of each lesson, the instructor may upload some starter-code to this repository. 

The structure of this code will look like this:

```
.
├── README.md
└── w01d01
   └── example-lesson
    └── starter-code
        └── code.txt
```

In order to fetch this new code, you will need to run:

```bash
git pull upstream master
```

You can now work in this `starter-code` directory.


## Backing up your work

You don't have the privileges to push changes to the `upstream` but it's a good idea to push your changes to your local fork, for which you do have privileges.

You should commit regularly and push as you would with any other project.

```bash
git add .
git commit -m "Finished example lesson"
git push origin master
```

### Lesson Notes Repository

We don't need to fork the lesson notes. So we can just directly clone the repository.

```bash
$ git clone https://github.com/ga-students/WDI_LDN_12_LESSON_NOTES
```

## Closure

Check that everyone has setup the three repositories.