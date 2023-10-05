# News API

## What is it ?

This API have been build for the purpose of accessing application data programmatically.
This API have been build to supplies informations from the DataBase to the front end.

The database use is in PSQL.

This API is available at: [News API](https://nc-api-project.onrender.com/api)

## Getting Setup

### Clone from the repo

```properties
 git clone https://github.com/Klnder/BE-NC-News.git
```

### Install dependencies

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

Before creating the DB make sure that postgresql is running :

```properties
 sudo service postgresql start
```

To create the DB we need to run :

```properties
 npm run setup-dbs
```

Then we can seed the DB by running :

```properties
npm run seed
```

## Run the tests

To run the tests we can use :

```properties
npm run test
```

### Versions

```properties
  NodeJS : "v19.8.1"
  PostGres: "v8.7.3"
```
