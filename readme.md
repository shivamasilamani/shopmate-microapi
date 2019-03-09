# ShopMate API

Set of microservices which exposes ShopMate backend. All services are hosted on Google App Engine.

# Architecture

Features are splitted and grouped into three microservices
	
**Router** || **Products** || **Orders**

![](http://i66.tinypic.com/6h4vio.png)

### Router

Router service acts as the entry point for other services. It takes care of user management and dispatching calls to other services

### Products

This handles all product related features like,
1. Get all products.
2. Get product details by selecting a specific product
3. Filter products list based on catgeory and department.
4. Search products from products list.
5. Support pagination if there are too many items.
6. Add/remove/edit a product
7. Add/remove/edit a department
8. Add/remove/edit a category

### Orders

This handles all cart and order related features like,
1. Add items to cart
2. Get all items from cart
3. Remove items from cart
4. Checkout
5. Clear items from cart which are not checked-out for more than 48 hours

# Error Handling

### Logs

Winston logger is used to log all possible information for error tracking and debugging. Google cloud platform also supports winston logger. Services logs all http requests and DB operations asynchronously in production mode.

### HTTP Errors

All API end-points returns appropriate HTTP error code. A detailed list of error codes and error messages are documented under API reference.

# Security

### Authentication
Authentication is handled using JWT tokens. 'Login' API authenticates the user using email and password and genrates a JWT token which is valid for 12 hours, then sends it to client. Client has to send this token in all subsequent requests in request header. As there are no session data maintained in the server, this token acts as a single source of truth to identify the user associated with a request.  Also there are many microservices in the backend which interacts with each other, JWT token comes in handy in this scenario. 

> Invalidating JWT tokens are not implemented yet.

### Authorization
Authorization is handled using roles. Every user gets a role. By default role '*user*' has been assigned to every user. There is no interface available as of now to change the role from *user* to *admin*. To get an user *admin* authorization, login to database with root access and change the role.

### DOS
Simple express request rate limit middleware is implemented to prevent DOS attacks. However google app engine firewall has in-built support for this already. In production this has been taken care already.

# Performance

Performance is handled with multiple aspects.

### Compression

gzip compression is used to compress all response data. This reduces the size of response payload and enhances response time.

### Pagination
Pagination also helps to enhance performance. With pagination support, data can be queried in chunks instead of everything in a single request.

### Caching
In-Memory response caching has been enabled only for */products/item* end-point to cache response payload. This reduces reliance on database to get data on every request. In-Memory is not production ready however this is just a proof of concept. Using the same concept caching can be scaled by introducing proper caching tools like memcached or redis.

### Infrastructure
As the features are splitted into multiple services which are running individually, backend is already equipped to be scalled easily. Right now services are deployed to single instance running in a data center in us-west region. It is easier to add more instances into different regions to support traffic from different geographic regions.

### Load Testing Results

*Test Environment
	No of CPU Core - 1
	No of concurrent connections - 150
	No of requests per second - 270*

With single core CPU, and a http based DB connection, API is able to handle 270 requests per second without any error. This would improve significantly if the API is tuned to run on multi core.

![](http://i68.tinypic.com/dox.jpg)

# Cron Job
A background job has been implemented to clear items from cart which are added 48 hours ago. This job is also deployed to google app engine and scheduled to run every 12 hours.

# Tests

API tests are written using mocha and chai. All microservices are equipped with automated tests. As mocha integrates well with tools like Jenkins, it is easy to scale it and add the tests as part of build process in a CI-CD pipeline.

To run tests locally. Run the following cmd inside a service folder
```sh
npm test
```

# Deployment

All services are deployed to Google App Engine and database is running on Google Cloud SQL service which is also part of Google Cloud Platform. There is also a cron job which is scheduled to run every 12 hours to clear inactive shopping carts.

![](http://i65.tinypic.com/2jd1jk4.png)

# Local Setup

To setup the services locally, clone the repository and do the following

1. Open every service folder and run the following cmd
```sh
npm install
```
2. Install MySQL in local machine.
3. Create three databases. *users*, *products*, *orders*.
4. Open every service folder and change the properties inside config.json file.
5. Open every service folder and run the following cmd

```sh
node config/dbsync.config.js
```
> Sequelize ORM is used in services to interact with database. Running dbsync.config.js would take the sequelize models and create tables in database.

# API Reference

As stated already API endpoints are grouped into  3 different services.

## Router Service

### Register User 

```sh
Request HTTP Headers
"Content-Type: application/json"

Request Body
{"email":"validemail", "password":"validpassword"}' 

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/user/signup
```
#### Success
On success, API returns HTTP status code **201 Created**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Email Error 
**400 Bad Request**
Invalid Password 
 **400 Bad Request**
User already exists 
**409 Conflict**
Other Error 
**500 Server Error**

### Login

Before calling any API end-point, this API shall be used to generate login token. This token shall be sent with all subsequent requests.

```sh
Request HTTP Headers
"Content-Type: application/json"

Request Data
{"email":"validemail", "password":"validpassword"}' 

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/user/login
```
#### Success
On success, API returns HTTP status code **200 OK**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Update User Details

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	name: '',
	credit_card: '',
	address_1: '',
	address_2: '',
	city: '',
	region: '',
	postal_code: '',
	country: '',
	shioping_region_id: '',
	day_phone: '',
	eve_phone: '',
	mob_phone: '',
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/user/info
```
#### Success
On success, API returns HTTP status code **204 Updated**.

#### Error
API returns appropriate HTTP error code if there is any error.

Validation Error
**400 Bad Request**
Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

## Products Service

### Get all products

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
GET

REST End-Point
https://shopmate-microapi.appspot.com/products/item

Response Data
{
	"products": [{
			"product_id": 1,
            "name": "Arc d'Triomphe",
            "description": "This beautiful and iconic T-shirt will no doubt.",
            "price": "14.99",
            "discounted_price": "14.99",
            "image": "arc-d-triomphe.gif",
            "image_2": "arc-d-triomphe.gif",
            "thumbnail": "arc-d-triomphe.gif",
            "display": 0,
            "createdAt": "2019-03-08T06:39:28.000Z",
            "updatedAt": "2019-03-08T06:39:28.000Z"
	}],
	"count": 1
}
```
#### Success
On success, API returns HTTP status code **200 OK**.
Response payload contains list of products and count of the products.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

#### Filter
This End-Point accepts filter values for category_id and department_id as url query parameters. The list can be filtered by category_id or department_id or combination of both.

```sh
REST End-Point | Category Filter
https://shopmate-microapi.appspot.com/products/item?category={category_id}

REST End-Point | Department Filter
https://shopmate-microapi.appspot.com/products/item?department={department_id}

REST End-Point | Department Filter and category Filter
https://shopmate-microapi.appspot.com/products/item?category={category_id}&department={department_id}
```

#### Search
This End-Point accepts search value and search through product list. Search happens only on product name and product description

```sh
REST End-Point | Search
https://shopmate-microapi.appspot.com/products/item?search='{seacrh term}'
```
#### Pagination
This End-Point accepts two query parameters to support pagination.
*Skip*
*Top*

For example, if there are 1000 products mainatined in the backend, client can construct the query to fetch only 100 items by using these parameters. Skip specifies the offset count and top specifies the limit count

```sh
REST End-Point | Pagination 1 - 100
https://shopmate-microapi.appspot.com/products/item?skip=0&top=100

REST End-Point | Pagination 101 - 200
https://shopmate-microapi.appspot.com/products/item?skip=100&top=100
```

### Get product details

```sh
Request HTTP Headers
"Authorization: Bearer token"

Request Type
GET

REST End-Point
https://shopmate-microapi.appspot.com/products/item/{product_id}

Response Data
{
	"products": {
			"product_id": 1,
            "name": "Arc d'Triomphe",
            "description": "This beautiful and iconic T-shirt will no doubt.",
            "price": "14.99",
            "discounted_price": "14.99",
            "image": "arc-d-triomphe.gif",
            "image_2": "arc-d-triomphe.gif",
            "thumbnail": "arc-d-triomphe.gif",
            "display": 0,
            "createdAt": "2019-03-08T06:39:28.000Z",
            "updatedAt": "2019-03-08T06:39:28.000Z"
	}
}
```
#### Success
On success, API returns HTTP status code **200 OK**.
Response payload contains detail of a specific product

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Product ID
**404 Not Found**
Other Error 
**500 Server Error**

### Create Product

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"name": "Arc d'Triomphe",
	"description": "This beautiful and iconic T-shirt will no doubt.",
	"price": "14.99",
	"discounted_price": "14.99",
	"image": "arc-d-triomphe.gif",
	"image_2": "arc-d-triomphe.gif",
	"thumbnail": "arc-d-triomphe.gif",
	"display": 0,
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/item/
```
#### Success
On success, API returns HTTP status code **201 Created**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Update Product

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"name": "Arc d'Triomphe",
	"description": "This beautiful and iconic T-shirt will no doubt.",
	"price": "14.99",
	"discounted_price": "14.99",
	"image": "arc-d-triomphe.gif",
	"image_2": "arc-d-triomphe.gif",
	"thumbnail": "arc-d-triomphe.gif",
	"display": 0,
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/item/{product_id}
```
#### Success
On success, API returns HTTP status code **204 Updated**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Product ID
**404 Not Found**
Other Error 
**500 Server Error**

### Delete Product

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/item/{product_id}
```
#### Success
On success, API returns HTTP status code **204 Deleted**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Product ID
**404 Not Found**
Other Error 
**500 Server Error**

### Get all categories

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
GET

REST End-Point
https://shopmate-microapi.appspot.com/products/category

Response Data
{
	"categories": [{
			"category_id": 1,
            "department_id": 1,
            "name": "category",
            "description": "category",
            "createdAt": "2019-03-08T06:39:28.000Z",
            "updatedAt": "2019-03-08T06:39:28.000Z"
	}],
	"count": 1
}
```
#### Success
On success, API returns HTTP status code **200 OK**.
Response payload contains list of categories and count of categories.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Create Category

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"department_id": 1
	"name": "football",
	"description": "football jersey",
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/category/
```
#### Success
On success, API returns HTTP status code **201 Created**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Update Category

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"department_id": 2
	"name": "football",
	"description": "football tshirts",
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/category/{category_id}
```
#### Success
On success, API returns HTTP status code **204 Updated**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Category ID
**404 Not Found**
Other Error 
**500 Server Error**

### Delete Category

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/category/{category_id}
```
#### Success
On success, API returns HTTP status code **204 Deleted**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Product ID
**404 Not Found**
Other Error 
**500 Server Error**

### Get all departments

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
GET

REST End-Point
https://shopmate-microapi.appspot.com/products/department

Response Data
{
	"departments": [{
			"department_id": 1,
            "name": "department",
            "description": "department",
            "createdAt": "2019-03-08T06:39:28.000Z",
            "updatedAt": "2019-03-08T06:39:28.000Z"
	}],
	"count": 1
}
```
#### Success
On success, API returns HTTP status code **200 OK**.
Response payload contains list of departments and count of departments.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Create Department

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"name": "sports",
	"description": "sports",
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/department/
```
#### Success
On success, API returns HTTP status code **201 Created**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Update department

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Data
{
	"name": "sports",
	"description": "sports tshirts",
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/department/{department_id}
```
#### Success
On success, API returns HTTP status code **204 Updated**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid department ID
**404 Not Found**
Other Error 
**500 Server Error**

### Delete department

**Admin** credentials are required to call this API. To get admin credntials an user should be created with the role '**admin**'

```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/products/department/{department_id}
```
#### Success
On success, API returns HTTP status code **204 Deleted**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Invalid Product ID
**404 Not Found**
Other Error 
**500 Server Error**

## Orders Service

Orders service handles all things related to shopping cart and orders

### Add To Cart

```sh
Request HTTP Headers
"Content-Type: application/json"

Request Body
{
	"product_id": 1
	"quantity": 2
}

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/orders/cart
```
#### Success
On success, API returns HTTP status code **201 Created**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Get Items in Cart

```sh
Request HTTP Headers
"Content-Type: application/json"

Request Type
GET

REST End-Point
https://shopmate-microapi.appspot.com/orders/cart

Response Data
{
	"item_id": 1,
	"product_id": 1,
	"quantity": 2,
	"buy_now": true
}
```
#### Success
On success, API returns HTTP status code **200 OK**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**

### Remove Items from Cart
```sh
Request HTTP Headers
"Content-Type: application/json"
"Authorization: Bearer token"

Request Type
POST

REST End-Point
https://shopmate-microapi.appspot.com/orders/cart/{item_id}
```
#### Success
On success, API returns HTTP status code **204 Deleted**.

#### Error
API returns appropriate HTTP error code if there is any error.

Invalid Cart Item ID
**404 Not Found**
Invalid Credentials
**401 Unauthorized**
Other Error 
**500 Server Error**