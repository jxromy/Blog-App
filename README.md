# Blog App - Full Stack Open

This repository contains the backend implementation of a **Blog App**, built as part of [Full Stack Open](https://fullstackopen.com/en/). The app provides a RESTful API for managing blog posts, including user authentication, CRUD operations, and database integration.

## Features
- User authentication with JSON Web Tokens (JWT)
- CRUD operations for blogs (Create, Read, Update, Delete)
- User management (registration & login)
- MongoDB for data persistence
- Jest and Supertest for unit and integration testing

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** bcrypt, JWT
- **Testing:** Jest, Supertest
- **Linting & Code Formatting:** ESLint, Prettier
- **Development:** Nodemon, dotenv

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/blog-app.git
   cd blog-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```
     MONGODB_URI=<your_mongodb_connection_string>
     TEST_MONGODB_URI=<your_test_db_connection_string>
     PORT=3003
     SECRET=<your_jwt_secret>
     ```

### Running the App
Start the backend server:
```sh
npm run dev
```
The server will run at `http://localhost:3003`

### Running Tests
```sh
npm test
```

## API Endpoints
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/users`     | Register a new user |
| POST   | `/api/login`     | Authenticate user and get token |
| GET    | `/api/blogs`     | Get all blogs |
| POST   | `/api/blogs`     | Create a new blog (Auth required) |
| DELETE | `/api/blogs/:id` | Delete a blog (Auth required) |
| PUT    | `/api/blogs/:id` | Update a blog (Auth required) |

## Future Improvements
- Implement frontend using React
- Add user roles and permissions
- Enable comment functionality on blogs

## License
This project is licensed under the MIT License.

---
### Author
Created by **Jeromy** as part of Full Stack Open coursework.

