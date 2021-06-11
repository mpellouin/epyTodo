# EpyTodo

## Introduction

 This Epitech project was an introduction to web developpment.

The goal of the subject was to create the back-end of a todo app. We had 3 weeks to complete it in a group of 3. 

epyTodo was one of my favorite subject of the year as I felt working on it would totally help me for my 1st internship and later on.

## Installation

  In order to run epyTodo, you will have to install nodejs, npm and mysql.
  
  ### nodejs and npm
  
Run `sudo apt install nodejs npm -y` 

### mysql

 Follow [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)


### App dependencies

 Install the app dependencies by running `npm install`.

### .env file

 You will also need to setup a `.env` file in the workspace containing the local configuration variable.

 The .env file should contain:

`PORT`, the port you decided to launch the app on.

`MYSQL_HOST`, the name of your host, probably localhost.

`MYSQL_USER`, usually root but could be any user you created.

`MYSQL_ROOT_PASSWORD`, your user password.

`MYSQL_DATABASE`, the database name, epytodo here.

`SECRET`, a string, usually 32 bytes long used to generate the JWToken.

### Database

 Export the .sql file by running `cat epytodo.sql | mysql -u root -p`

### Start app

 Start sending requests after lauching the app using `node src/index.js`

 Postman or VS Code REST API extension are recommended.

## Mark

### Note :

21/22 && Grade A

### details:

Preliminaries: (2/2)

Architecture web server: (5/5)

Routes (does it exists): (3/3)

Routes (Is it well done): (3/3)

Password: (1/1)

Token: (2/3) 
>The email is stored in the token instead of the id

SQL DB: (5/5)

## State of the project

Although the project was due months ago, I'll probably implement a front-end as a part of personnal training later on.
