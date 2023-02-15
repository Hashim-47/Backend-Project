# **NorthCoders News API**

# **Built By Mohammed Hashim**

---

## **Hosted-Link**

https://my-nc-news.onrender.com/api

## **Description**

## 'News API' is an API built using Node.js, Express.js and a PostgreSQL database.

# **Setup / Installation Instructions**

### **requirements:**

- Node.js 19.x
- Postgres 14.x

### **Application dependencies:**


- npm 8.x
- dotenv 16.x
- express 4.x
- pg 8.x
- supertest 6.x
  
### **Developer only dependencies:**
<i>
- pg-format 1.x
- jest 27.x
- jest-extended: 2.x
- jest-sorted 1.x
- husky 8.x
  </i>
### **Cloning the repositry:**
- In your teminal:
```
$ git clone https://github.com/Hashim-47/Backend-Project.git
$ cd Backend-Project
```
### **Installing dependencies:**
- Initialising Node by installing the required dependencies from `package.json`. In your terminal:
```
$ npm install
```
### **Environment setup:**
- You will need to create _two_ `.env` files for the app: `.env.test` and `.env.development`. Into each, add `PGDATABASE = nc_news` for the `.env.development` file and `PGDATABASE = nc_news_test` for the `.env.test` file.
### **Database set-up and seeding:**
- To begin testing or using this app, you will need to setup the database seed it with data:
```
$ npm run setup-dbs
$ npm run seed
```
# **Testing**
- `Jest` is the framework used to test this application.
- To run tests:
```
$ npm run test
```
