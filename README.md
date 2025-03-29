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


## **Folder Structure**
```
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
```


## **Tech Stack**
- **Node.js** (v14 or higher)
- **MongoDB**  
- **Redis**  
- **npm**  


## ✅ **GraphQL API**  
The API is exposed through a single endpoint:  
```bash
POST /graphql
```

## **Operations**  
Operations are defined using **GraphQL Schema** which includes:  
- **Queries** → For fetching data.  
- **Mutations** → For creating, updating, and deleting data.  


## Usage

### 1. Clone the repository:
```bash
git clone https://github.com/MahmoudEmadAbdullah/taskify-grapql-api.git
cd taskify-graphql-api
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Set up environment variables: Create a `config.env` file in the root directory and add the following:
```bash
PORT=3000
DB_URL=
JWT_ACCESS_SECRET=yourAccessTokenSecret123
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_SECRET=yourRefreshTokenSecret123
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com  
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com  
EMAIL_PASSWORD=your-email-password  
REDIS_HOST=localhost
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=your-cloudinary-name  
CLOUDINARY_API_KEY=your-cloudinary-api-key  
CLOUDINARY_API_SECRET=your-cloudinary-api-secret  
```

### 4. Run the application:
```bash
npm run start
```

### 5. Access the API: The API will be available at `http://localhost:3000/graphql`.

### 6. API Documentation:
- You can find the full API documentation in the following file:
   - **Postman:** `taskify-graphql-api.postman_collection.json`  

**Tip:**  
- To import the collection in Postman:  
   1. Open **Postman**.  
   2. Go to **File → Import** and select `taskify-graphql-api.postman_collection.json`.  
   3. All endpoints should appear under **Taskify GraphQL API**.  

**Note:**  
- Make sure the environment variables are enabled in Postman if you’re using them.  

## License
- This project is licensed under the **MIT License** 

## Author
👤 **Mahmoud Emad Abdullah**  
- LinkedIn: [Mahmoud Emad](https://www.linkedin.com/in/mahmoud-emad-8979311b4)  
- Email: [mahmoudemadcule2025@gmail.com](mailto:mahmoudemadcule2025@gmail.com) 
