# COMP 3133 – Assignment 1
## Employee Management System – GraphQL Backend

**Course:** COMP 3133 – Full Stack Development II  
**Student Name:** Nirja Dabhi  
**Student ID:** 101509539  

## Project Overview
This project is a backend **Employee Management System** developed using **Node.js, Express, GraphQL (Apollo Server), and MongoDB**.  
The application allows users to register, log in, and perform CRUD operations on employee records using GraphQL queries and mutations.

The system includes:
- User authentication
- Employee management
- Input validation
- Error handling
- JWT-based API security
- Cloudinary integration for employee profile images

## Technologies Used
- Node.js
- Express.js
- Apollo Server (GraphQL)
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Cloudinary
- Postman

## Authentication
- Users must **sign up** and **log in** to receive a JWT token.
- All employee-related queries and mutations are protected.
- Include the token in Postman headers:


---

## 📡 GraphQL API Operations

### User Operations
- **Signup (Mutation)** – Create a new user account
- **Login (Query)** – Authenticate user and receive JWT

### Employee Operations
- **Get All Employees (Query)**
- **Add New Employee (Mutation)**
- **Get Employee by ID (Query)**
- **Update Employee by ID (Mutation)**
- **Delete Employee by ID (Mutation)**
- **Search Employee by Designation or Department (Query)**

---

## Employee Profile Picture
Employee profile pictures are stored on **Cloudinary**.  
The `employee_photo` field stores the Cloudinary image URL.


## Testing
- All GraphQL APIs were tested using **Postman**
- Postman collection has been exported and included in submission
- Screenshots include:
  - Successful requests
  - Validation errors
  - Authentication errors
  - MongoDB collection views

##  Sample User Credentials
Used for testing login:
Username: nirja1
Email: nirja1@test.com
Password: Pass1234

## Database Details
**Database Name:** `comp3133_101509539_Assigment1`

### Collections:
- `users`
- `employees`

