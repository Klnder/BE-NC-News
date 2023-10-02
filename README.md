# News API

## What is it ?

We will be building an API for the purpose of accessing application data programmatically.

## Getting Setup

### Clone from the repo

```properties
 git clone https://github.com/Klnder/BE-NC-News.git
```

### Install packages

```properties
 npm install
```

### Create .env files

For this API we gonna need 2 .env files :  
`.env.test`  
`.env.development`

### Setup .env files

For this API we gonna use 2 different DB : `nc_news` & `nc_news_test`.  
Setup each `.env` file by adding `PGDATABASE=` and the corresponding DB.

### Setup the DB

To create the DB we need to run :

```properties
 npm run setup-dbs
```

Then we can seed the DB by running :

```properties
npm run seed
```
