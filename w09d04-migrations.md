WDI
======
## Migrations

### Learning Objectives: 

- Create a stack of migrations - 
- Explain how to generate, customise and use migrations
- Explain how to rollback to previous migrations
- Describe a migration structure

<br>
---

| **Section**      | **Timing** | **Summary** |
|------------------|------------|-------------|
|**Opening: What is a migration and why do we use them**    |  5 mins |  Explain the concept of migrations and how they work |
|**We do: Let's create a migration**    |  5 mins |  Using generators, create a migration and describe his content |
|**We do: Customising a migration**    |  10 mins | Describe the differents methods accessible inside a migration  |
|**I do: explain Rollbacks**    |  10 mins | Describe the stack of migrations and which commands to use to evolve through them  |
|**We do: generate migrations using rails g model**    |  5 mins |  Show the difference betwwen the differents generators |
|**We do: Removing columns from tables**    |  5 mins |  Special cases |
|**Closure**      |  5 mins |  | 
|**Questions**    |  5 mins |  | 


<br>


---

### Connection to a long term learning goal 

Get students to understand how the migration stack works in rails and how to take advantage of it.

<br>

---

### Before Class (Student Pre-work)

Students need to knwo about the structure of a rails project and what a database and an orm is

<br>

---

### Related Homework 

N/A

<br>

---
<br>

Migrations
=====


## Opening: What is a migration and why do we use them

Migrations are a way for us to manage the creation and alteration of our database tables in a structured and organized manner.

Each migration is a seperate file, which Rails runs for us when we instruct it. Rails keeps track of what's been run, so changes don't get attempted more than once.

We describe the DB changes using Ruby, and it doesn't matter which DB engine we use - Rails has connectors for each different DB engine we might use, which translates the ruby structure into the appropriate DB commands.

[http://guides.rubyonrails.org/v4.1.8/migrations.html]()

<br>
## We do: Let's create a migration

```
rails new migrations_app -d postgresql
cd migrations_app
```

Let's create a migration called "CreateProducts", which will have the job of creating the products table in our database.

```
rails g migration CreateProducts
```

This will have created a migration file in our `RAILS_ROOT/db/migrate` folder. The purpose of this file is to describe what actions we want to take to move our DB schema from its current state to the new state, and also, what would need to happen to move the migration back to the old state again (should we need to).

Add content to the 'change' method:

```
  class CreateProducts < ActiveRecord::Migration
    def change
      create_table :products do |t|
        t.string :name
        t.text :description
   
        t.timestamps
      end
    end
  end
```

We run migrations with the command `rails db:migrate`.

We could check this by firing up our trusty old command line tools:

If in sqlite3:

```
sqlite3 db/development.sqlite3
.schema products
.exit
```

<br>
## We do: Customising a migration

So far, we dropped and recreated our tables when we wanted to add columns to them. But this is not a practical, real-world solution. So we use migrations to do this in Rails.

Rails gives us some help to generate migration files - we can list the fields and their types in the generate command, and if we name the migration appropriately, Rails even guesses the name of the table:

```
rails generate migration AddPriceAndAvailabilityToProducts price:integer availablility:boolean
```

By putting Add....To.... Rails knows we are adding these columns to which table, and the migration can be written automatically

### Available Column Types

- :binary
- :boolean
- :date
- :datetime
- :decimal
- :float
- :integer
- :primary_key
- :string
- :text
- :time
- :timestamp

### Schema.rb

When migrations run, Rails also updates the schema.rb file - it contains the migration commands all combined into each table.

The schema is the snapshot of your current database tables and fields.

<br>
## I Do: Explain Rollbacks

We can undo running migrations with:

```
rails db:rollback
```

**Beware:** Don't rollback migrations which have been run on other machines (essentially, if they're in source code control).

Instead, write a new migration to undo the changes.

<br>
## We do: Generate migrations using rails g model

Since AR models map to tables, when you create a model, it should create a table migration:

```
rails g model Customer name:string description:text active:boolean credit_limit:decimal last_contact_at:datetime
```

<br>
## We do: Removing columns from tables

We can use the same naming convention as create to automatically generate the migration file:

```
rails g migration RemoveNameFromCustomers name:string
```

Notice that it removes the column, but also has the data-type - that's not needed for the 'remove', but if you roll this migration back, it will need to create the column, and to create a column, you need to know the type.

<br>
## We do: Removing a table from database

```
rails g migration DropCustomers
```

This will not populate the migration tough, just create a file with "placeholders for us"

The same logic applies here. If we don't need the table definition here for the migration up, we will need all the info back when we migrate down.

## Join Table

To autopopulate the create_join_table command in the command line, it should look like this:

```
rails g migration CreateJoinTableProductsSuppliers product supplier
```


<br>
## Migrations methods:
* add_column
* add_index
* change_column
* change_table
* create_table
* drop_table
* remove_column
* remove_index
* rename_column

Basic format
YYYYMMDDHHMMSS_create_products.rb

## Supported types

* :binary
* :boolean
* :date
* :datetime
* :decimal
* :float
* :integer
* :primary_key
* :string
* :text
* :time
* :timestamp
especial type:
* :references

## create_table

### Commands to create migrations

``` 
$ rails generate model Product name:string description:text
$ rails generate migration AddPartNumberToProducts part_number:string
$ rails generate migration RemovePartNumberFromProducts part_number:string
$ rails generate migration AddDetailsToProducts part_number:string price:decimal
```

## change_table
* add_column
* add_index
* add_timestamps
* create_table
* remove_timestamps
* rename_column
* rename_index
* rename_table

## Running Migrations
```
$ rails db:migrate VERSION=20080906120000
$ rails db:rollback
$ rails db:rollback STEP=3
$ rails db:migrate:redo STEP=3
$ rails db:reset  #drop database and recreate it
$ rails db:migrate:up VERSION=20080906120000
```

## Migrations commands
```
rails db:migrate         # Migrate the database (options: VERSION=x, VERBOSE=false).
rails db:migrate:status  # Display status of migrations
rails db:rollback        # Rolls the schema back to the previous version (specify steps w/ STEP=n).
rails db:test:prepare    # Rebuild it from scratch according to the specs defined in the development database
```

## more Database commands (rails -T db)
```
rails db:create          # Create the database from config/database.yml for the current Rails.env (use db:create:all to create all dbs in t...
rails db:drop            # Drops the database for the current Rails.env (use db:drop:all to drop all databases)
rails db:fixtures:load   # Load fixtures into the current environment's database.
rails db:schema:dump     # Create a db/schema.rb file that can be portably used against any DB supported by AR
rails db:schema:load     # Load a schema.rb file into the database
rails db:seed            # Load the seed data from db/seeds.rb
rails db:setup           # Create the database, load the schema, and initialize with the seed data (use db:reset to also drop the db first)
rails db:structure:dump  # Dump the database structure to db/structure.sql. Specify another file with DB_STRUCTURE=db/my_structure.sql
rails db:version         # Retrieves the current schema version number
```

## Closure

We will use migrations a lot, think about them like a git repo, where you can at any point eveovle through the history of your database, and using the power of active record, control the entire structure of your db without using sql.
<br>

### Questions
<br>