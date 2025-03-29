# **Taskify GraphQL API**


## **Overview**

Taskify is a GraphQL-based task management API built with Node.js, MongoDB, and Redis. The API supports CRUD operations for **tasks**, **users**, **labels**, and **authentication**, file uploads (for task images), and caching for improved performance.


## **Features**

### ✅ **Task Management**  
- Create, update, delete, and retrieve tasks.  
- Upload an image for a task using **Cloudinary**.  
- Associate tasks with one or more labels.  
- Retrieve tasks with advanced **filtering**, **sorting**, and **pagination**.  

### ✅ **Authentication & Authorization**  
- Secure authentication using **JWT**.  
- Implements refresh token and access token for session management.
- Refresh token is used to renew the access token when it expires.
- Stores tokens securely using httpOnly cookies for enhanced security.
- Email verification is required for user activation.
- Admins cannot delete themselves or the last remaining admin.

### ✅ **User Management**  
- Create and manage user accounts.   
- Update and delete user accounts.  

### ✅ **Label Management**  
- Create and manage labels as a separate entity.  
- Link labels to tasks using MongoDB references.  

### ✅ **Caching**  
- Utilize **Redis** to cache responses for frequently accessed data.  
- Automatic cache invalidation when tasks, labels, or users are updated.  

### ✅ **Error Handling**  
- Custom error classes using `GraphQLError` for better error management and consistency with centralized formatting using `formatError.js`.  
- Predefined error types for common cases:  
  - `AuthenticationError` → For authentication failures.  
  - `ValidationError` → For invalid input.  
  - `NotFoundError` → When a resource is not found.  
  - `ExpiredTokenError` → For expired tokens.  
  - `InvalidTokenError` → For invalid tokens.  
  - `InternalServerError` → For unexpected server errors.  
  - `ForbiddenError` → For unauthorized actions.  
  - `BadRequestError` → For malformed requests.   

### ✅ **GraphQL API**  
- Fully documented schema with type definitions and resolvers.  
- Support for file uploads via GraphQL.  
- Error handling and validation using **Zod**.  


## **Tech Stack**
- **Node.js** (v14 or higher)
- **MongoDB**  
- **Redis**  
- **npm**  


## **Folder Structure**
TASKIFY-GRAPQL-API  
├── DB  
├── src  
│   ├── config  
│   ├── middlewares  
│   ├── modules  
│   │   ├── auth  
│   │   ├── label  
│   │   ├── task  
│   │   └── user  
│   └── utils  
├── .gitignore  
├── config.env  
├── package-lock.json  
├── package.json  
├── README.md  
├── server.js  
└── taskify-graphql-api.postman_collection.json  
