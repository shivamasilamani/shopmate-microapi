# ShopMate API

Set of microservices which exposes ShopMate backend.

# Architecture

Features are divided into three microservices
	**Router** || **Products** || **Orders**

### Router

This service acts as the entry point for all other services. It takes care of user management and dispatching calls to other services

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

API 

### Logs

You can open a file from **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Open from**. Once opened in the workspace, any modification in the file will be automatically synced.

### HTTP Errors

You can save any file of the workspace to **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Save on**. Even if a file in the workspace is already synced, you can save it to another location. StackEdit can sync one file with multiple locations and accounts.

# Secuirty

Publishing in StackEdit makes it simple for you to publish online your files. Once you're happy with a file, you can publish it to different hosting platforms like **Blogger**, **Dropbox**, **Gist**, **GitHub**, **Google Drive**, **WordPress** and **Zendesk**. With [Handlebars templates](http://handlebarsjs.com/), you have full control over what you export.

> Tip

# Performance

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> Tip

# Tests

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> Tip

# Deployment

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> Tip

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