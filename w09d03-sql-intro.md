---
title: SQL Setup, Insert, Update, and Delete
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Databases
---

# SQL Setup, Insert, Update and Delete

### Objectives
*After this lesson, students will be able to:*

- Create a database table
- Insert, retrieve, update, and delete a row or rows into a database table

### Preparation
*Before this lesson, students should already be able to:*

- Install **[PostgreSQL](http://www.postgresql.org/)**
- Describe the relationship between tables, rows, and columns
- Draw an ERD diagram
- Explain the difference between table relationships

## We know about Databases, but what is SQL? Intro (10 mins)

Let's review: at it's simplest, a relational database is a mechanism to store and retrieve data in a tabular form. Spreadsheets are a good analogy!  But how do we interact with our database: inserting data, updating data, retrieving data, and deleting data? That's where SQL comes in!

#### What is SQL?

SQL stands for Structured Query Language, and it is a language universally used and adapted to interact with relational databases.  When you use a SQL client and connect to a relational database that contains tables with data, the scope of what you can do with SQL commands includes:

- Inserting data
- Querying or retrieving data
- Updating or deleting data
- Creating new tables and entire databases
- Control permissions of who can have access to our data

Note that all these actions depend on what the database administrator sets for user permissions: a lot of times, as an analyst, for example, you'll only have access to retrieving company data; but as a developer, you could have access to all these commands and be in charge of setting the database permissions for your web or mobile application.

#### Why is SQL important?

Well, a database is just a repository to store the data and you need to use systems that dictate how the data will be stored and as a client to interact with the data.  We call these systems "Database Management Systems", they come in _many_ forms:

- MySQL
- SQLite
- PostgreSQL (what we'll be using!)

...and all of these management systems use SQL (or some adaptation of it) as a language to manage data in the system.


## Connect, Create a Database - Codealong (5 mins)

Let's make a database!  First, make sure you have PostgreSQL running.  Once you do, open your terminal and type:

```bash
$ psql
```

You should see something like:

```bash
your_user_name=#
```

Great! You've entered the PostgreSQL equivalent of IRB: now, you can execute PSQL commands, or PostgreSQL's version of SQL.

Let's use these commands, but before we can, we must create a database.  Let's call it `bookstore`:

```psql
your_user_name=# CREATE DATABASE bookstore;
CREATE DATABASE
```

The semicolon is important! Be sure to always end your SQL queries and commands with semicolons.

Now let's _use_ that database we just created:

```psql
your_user_name=# \c bookstore
You are now connected to database "bookstore" as user "your_user_name".
bookstore=#
```

## Create a table - Demo (5 mins)

Now that we have a database, let's create a table (think of this like, "hey now that we have a workbook/worksheet, let's block off these cells with a border and labels to show it's a unique set of values"):

```sql
CREATE TABLE books (
  "ISBN" VARCHAR(14) PRIMARY KEY,
  title CHAR(40) NOT NULL,
  author_id INT,
  genre CHAR(20)
);
```

When we paste this into psql:

```psql
bookstore=# CREATE TABLE books (
bookstore(#   "ISBN" VARCHAR(14) PRIMARY KEY,
bookstore(#   title CHAR(40) NOT NULL,
bookstore(#   genre CHAR(20)
bookstore(# );
```

Notice the different parts of these commands:

```psql
wdi=# CREATE TABLE bookstore (
```
This starts our table creation, it tells PostgreSQL to create a table named "books"..

```psql
bookstore(#   "ISBN" VARCHAR(14) PRIMARY KEY,
bookstore(#   title CHAR(40) NOT NULL,
```

...then, each line after denotes a new column we're going to create for this table, what the column will be called, the data type, whether it's a primary key, and whether the database - when data is added - can allow data without missing values.  In this case, the ISBN and title have to be entered, but the genre is optional.

### Why is ISBN in quote marks?

By default psql will force all columns to be lower case, so we are forcing the case of the column name by wrapping it in quotes.

## Create an authors table and add some data (10 mins)

We could put the author's name in the books table, but by the time our shop is full, we'll have 100s of "Roald Dahl"s and "Oscar Wilde"s kicking around our database. That's really bad design. The goal is to have no repeating data in our database.

So instead, let's create a new table for our authors. We'll need the following fields:

- an auto-incrementing id that cannot be blank.
- a firstname field that connot be blank.
- an optional middle initials field.
- a lastname field that cannot be blank.

### An auto-incremneting id

Rather than having to keep track of the author's ids as they go into the database, its much better if we let Postgres do that for us. We can do this with the `SERIAL` data type.

Let's create the new table together on the command line.

```psql
bookstore=# CREATE TABLE authors (
bookstore(#   id SERIAL PRIMARY KEY,
bookstore(#   firstname CHAR(15) NOT NULL,
bookstore(#   initials CHAR(15),
bookstore(#   lastname CHAR(15) NOT NULL
bookstore(# );
```
> __Note__ Actually `SERIAL` is not a data-type, its more like a method name which tells the database that you want the field to be an auto-incrementing integer starting at 1. More information here: [How to Define an Auto Increment Primary Key in PostgreSQL](https://chartio.com/resources/tutorials/how-to-define-an-auto-increment-primary-key-in-postgresql)

## Inserting data into our table (5 mins)

We're going to insert 4 authors into our author table:

- George R R Martin
- Terry Pratchett
- J R R Tolkien
- Ursula Le Guin

Let's do the first one together:

```psql
bookstore=# INSERT INTO authors (firstname, initials, lastname) VALUES
bookstore-#   ('George', 'R. R.', 'Martin');
INSERT 0 1
```

## Insert Data - Independent Practice (10 mins)

Ok, now go ahead and add the other authors to the database. Add them one at a time to get used to the syntax.

If you make a mistake **before** you hit enter, you can cancel the current command with `ctrl + c`.

## Using a file to enter data (5 mins)

As you may we have found, typing SQL commands directly into the command line is not ideal. Spelling mistakes and syntax errors can make the whole process rather painful. Let's create a file `bookstore.sql` where we'll write all of our sql.

> __Note__ send the student the `bookstore.sql` file. And go through the contents.

### Drop table?

The `DROP` command can be used to delete tables and databases. The `IF EXISTS` statement first checks if the entity exists before attempting to delete it. In this case if the tables do not exist, psql will not attempt to `DROP` them.

### `author_id`?

In order to link the author to the book, we need to store a reference to the author in the book record. Something short and unique. The author's id is perfect. But you knew that already.

> __Note__ It would be worth discussing with the students, why the author_id is on the book's record, and not the other way around. If you have already done ERDs you might want to draw one on the board now.

We can now read in the file from the `psql` shell using the following command:

```psql
\i bookstore.sql
```

## What's in our database? Code Along -  (10 mins)

So now that we have this data saved, we're going to need to access it at some point, right?  We're going to want to _select_ particular datapoints in our dataset provided certain conditions.  The PostgreSQL `SELECT` statement is used to fetch the data from a database table which returns data in the form of result table. These result tables are called result-sets. Lets get some data from our tables.

```psql
SELECT * FROM authors;
 id |    firstname    |    initials     |    lastname     
----+-----------------+-----------------+-----------------
  1 | George          | R. R.           | Martin         
  2 | Terry           |                 | Pratchett      
  3 | J.              | R. R            | Tolkien        
  4 | Ursula          |                 | Le Guin        
(4 rows)
```

The `*` in the `SELECT` query means, get all columns in the table.

If we only want to retrieve some of the columns, we can specify them like so:

```psql
SELECT firstname, lastname FROM authors;
    firstname    |    lastname     
-----------------+-----------------
 George          | Martin         
 Terry           | Pratchett      
 J.              | Tolkien        
 Ursula          | Le Guin        
(4 rows)
```

#### Getting more specific

Just like Ruby or JavaScript, all of our comparison and boolean operators can do work for us to select more specific data.

- I want all the books that have an author id of 1

```psql
bookstore=# SELECT * FROM books WHERE author_id = 1;
      ISBN      |                  title                   | author_id |        genre         
----------------+------------------------------------------+-----------+----------------------
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy             
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy             
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy             
 978-0007582235 | A Feast for Crows                        |         1 | Fantasy             
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy             
(5 rows)
```

- The titles of all the books in alphabetical order

```psql
bookstore=# SELECT title FROM books ORDER BY title;
                  title                   
------------------------------------------
 A Clash of Kings                        
 A Feast for Crows                       
 
 ...                 
 
 The Tombs of Atuan                      
 The Two Towers                          
(17 rows)
```

- How about reversed? Ok:

```psql
bookstore=# SELECT title FROM books ORDER BY title DESC;
                  title                   
------------------------------------------
 The Two Towers                          
 The Tombs of Atuan                      
 
 ...
                       
 A Feast for Crows                       
 A Clash of Kings                        
(17 rows)
```

- All books that have the word **of** in the title

```psql
bookstore=# SELECT * FROM books WHERE title LIKE '% of %';
      ISBN      |                  title                   | author_id |        genre         
----------------+------------------------------------------+-----------+----------------------
 978-0007488353 | The Return of the King                   |         3 | Fantasy             
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy             
 978-1442459915 | The Tombs of Atuan                       |           | Fantasy             
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy             
 978-0007488315 | The Fellowship of the Ring               |         3 | Fantasy             
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy             
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy             
 978-0552166591 | The Colour of Magic                      |         2 | Fantasy             
 978-0141354910 | A Wizard of Earthsea                     |           | Fantasy             
(9 rows)
```

## Joins - Codealong (20 mins)

So far we've looked at the data from each table individually, but what about combining tables together. This is where databases really come into their own!

Let's make a join:

```psql
bookstore=# SELECT * FROM books JOIN authors ON books.author_id = authors.id;
      ISBN      |                  title                   | author_id |        genre         | id |    firstname    |    initials     |    lastname     
----------------+------------------------------------------+-----------+----------------------+----+-----------------+-----------------+-----------------
 978-0552166614 | Equal Rites                              |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488353 | The Return of the King                   |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166638 | Sourcery                                 |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166607 | The Light Fantastic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488315 | The Fellowship of the Ring               |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007582235 | A Feast for Crows                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007488339 | The Two Towers                           |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166621 | Mort                                     |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0552166591 | The Colour of Magic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
(13 rows)
```

Great! Now we have all the data we need in one place. We can perform all the sorting and filtering functions on that data as well.

```
bookstore=# SELECT title, firstname, initials, lastname FROM books JOIN authors ON books.author_id = authors.id ORDER BY lastname;
                  title                   |    firstname    |    initials     |    lastname     
------------------------------------------+-----------------+-----------------+-----------------
 A Storm of Swords 1: Steel & Snow        | George          | R. R.           | Martin         
 A Feast for Crows                        | George          | R. R.           | Martin         
 A Storm of Swords 2: Blood & Gold        | George          | R. R.           | Martin         
 A Game of Thrones                        | George          | R. R.           | Martin         
 A Clash of Kings                         | George          | R. R.           | Martin         
 Equal Rites                              | Terry           |                 | Pratchett      
 Sourcery                                 | Terry           |                 | Pratchett      
 The Light Fantastic                      | Terry           |                 | Pratchett      
 Mort                                     | Terry           |                 | Pratchett      
 The Colour of Magic                      | Terry           |                 | Pratchett      
 The Return of the King                   | J.              | R. R            | Tolkien        
 The Fellowship of the Ring               | J.              | R. R            | Tolkien        
 The Two Towers                           | J.              | R. R            | Tolkien        
(13 rows)
```

### Where's Ursula?

There are no records returned from our database for Ursula Le Guin, but I know she's in there. What happened?

All of the `author_id`s have been set to `NULL` for Ursula Le Guin's books in the database. This means that when we made the join, Postgres couldn't find both the books AND the author for those books, and they weren't included in the result.

### Types of join

There are 4 main join types that we can look at that will display data differently under these conditions. They are as follows:

- `INNER JOIN`
- `LEFT JOIN`
- `RIGHT JOIN`
- `FULL OUTER JOIN`

The `INNER JOIN` is the default, so when you use `JOIN`, you're actually using an `INNER JOIN`. This join only returns data that is matched in BOTH tables.

The `LEFT JOIN` will return all the data from the **left** table, and will attempt to attach data from the **right** table where possible. Lets try that now:

```psql
bookstore=# SELECT * FROM books LEFT JOIN authors ON books.author_id = authors.id;
      ISBN      |                  title                   | author_id |        genre         | id |    firstname    |    initials     |    lastname     
----------------+------------------------------------------+-----------+----------------------+----+-----------------+-----------------+-----------------
 978-0552166614 | Equal Rites                              |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488353 | The Return of the King                   |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-1442459960 | Tehanu                                   |           | Fantasy              |    |                 |                 | 
 978-0552166638 | Sourcery                                 |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-1442459915 | The Tombs of Atuan                       |           | Fantasy              |    |                 |                 | 
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166607 | The Light Fantastic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488315 | The Fellowship of the Ring               |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0689845345 | The Farthest Shore                       |           | Fantasy              |    |                 |                 | 
 978-0007582235 | A Feast for Crows                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007488339 | The Two Towers                           |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166621 | Mort                                     |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0552166591 | The Colour of Magic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0141354910 | A Wizard of Earthsea                     |           | Fantasy              |    |                 |                 | 
(17 rows)
```

In this instance `books` is the **left** table, because it appears in the `FROM` clause. All of Ursula Le Guin's books are now present, but the author's details don't appear.

Let's see how this differs with a `RIGHT JOIN`:

```psql
bookstore=# SELECT * FROM books RIGHT JOIN authors ON books.author_id = authors.id;
      ISBN      |                  title                   | author_id |        genre         | id |    firstname    |    initials     |    lastname     
----------------+------------------------------------------+-----------+----------------------+----+-----------------+-----------------+-----------------
 978-0552166614 | Equal Rites                              |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488353 | The Return of the King                   |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166638 | Sourcery                                 |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166607 | The Light Fantastic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488315 | The Fellowship of the Ring               |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007582235 | A Feast for Crows                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007488339 | The Two Towers                           |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166621 | Mort                                     |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0552166591 | The Colour of Magic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
                |                                          |           |                      |  4 | Ursula          |                 | Le Guin        
(14 rows)
```

This time, Ursula Le Guin's details are present, but her books are not. All of the data form the **right** table is present, but the data from the **left** table only appears if there is a match.

Finally, the `FULL OUTER JOIN` command, will get all data from **both** tables, like so:

```psql
bookstore=# SELECT * FROM books FULL OUTER JOIN authors ON books.author_id = authors.id;
      ISBN      |                  title                   | author_id |        genre         | id |    firstname    |    initials     |    lastname     
----------------+------------------------------------------+-----------+----------------------+----+-----------------+-----------------+-----------------
 978-0552166614 | Equal Rites                              |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488353 | The Return of the King                   |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447848 | A Storm of Swords 1: Steel & Snow        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-1442459960 | Tehanu                                   |           | Fantasy              |    |                 |                 | 
 978-0552166638 | Sourcery                                 |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-1442459915 | The Tombs of Atuan                       |           | Fantasy              |    |                 |                 | 
 978-0007447831 | A Clash of Kings                         |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166607 | The Light Fantastic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0007488315 | The Fellowship of the Ring               |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007447855 | A Storm of Swords 2: Blood & Gold        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0689845345 | The Farthest Shore                       |           | Fantasy              |    |                 |                 | 
 978-0007582235 | A Feast for Crows                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0007488339 | The Two Towers                           |         3 | Fantasy              |  3 | J.              | R. R            | Tolkien        
 978-0007548231 | A Game of Thrones                        |         1 | Fantasy              |  1 | George          | R. R.           | Martin         
 978-0552166621 | Mort                                     |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0552166591 | The Colour of Magic                      |         2 | Fantasy              |  2 | Terry           |                 | Pratchett      
 978-0141354910 | A Wizard of Earthsea                     |           | Fantasy              |    |                 |                 | 
                |                                          |           |                      |  4 | Ursula          |                 | Le Guin        
(18 rows)
```

## Updates to our database - Codealong (10 mins)

So far we've looked at creating and reading data. Let's take a moment to update and delete some stuff.

The update command is pretty straight forward, but be careful though: **there is no undo!** When we work on databases in the real-world its _imprative_ that we backup our data first!

Let's re-united Ursula with her books:

```psql
UPDATE books SET author_id = 4 WHERE author_id IS NULL;
UPDATE 4
```

Notice the `WHERE` clause, that's really important. If we leave it out, updates are made on **all the records in the table!**

> __Note__ show the students what happens when `WHERE` clause is omitted, and how you would then have to deal with the problem.

### Deleting

Let's delete some stuff.

```psql
DELETE FROM books WHERE author_id = 1;
DELETE 5
```

Ouch! That was _way too easy_. Which is why we should **always** backup first!

What if we want to delete all books by Tolkien, but we don't know his `id`? We can't do a join, but we can do this:

```psql
DELETE from BOOKS WHERE author_id = (SELECT id FROM authors WHERE lastname = 'Tolkien');
DELETE 3
```

Cool huh?

## Conclusion - 5 minutes

When we finally hook our apps up to databases - especially with Rails - we will have a whole slew of shortcuts we can use to get the data we need? So, wait, why the heck are we practicing SQL?  Well, let's look at what happens when you call for a particular user from a users table - with some nifty methods - in a Rails environment when you're connected to a database:

```ruby  
User.last
  User Load (1.5ms)  SELECT  "users".* FROM "users"   ORDER BY "users"."id" DESC LIMIT 1
=> #<User id: 1, first_name: "jay", last_name: "nappy"...rest of object >
```

There's SQL!!!

```SQL
SELECT  "users".* FROM "users"   ORDER BY "users"."id" DESC LIMIT 1
```

The Ruby/Rails scripts get converted to raw SQL before querying the database.  You'll know the underlying concepts and query language for how the data you ask for gets returned to you.

#### Common Postgresql Commands

Here are a list of some common Postgresql commands that you might need:

- `\c` - connect to database
- `\l`
- `\d`
- `\d+`
- `\q`
- `\h` - help


Answer these questions:

- How does SQL relate to relational databases?
- What kinds of boolean and conditional operators can we use in SQL?