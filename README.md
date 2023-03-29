# Assets Management API

Assets Management API is a platform for managing assets such as images and text. It allows users to store information
about their assets, including categories, comments, and likes. The platform offers categorization and tagging features.
The API is built using Node.js and Express.js, and uses MongoDB as the database. It includes authentication and
authorization using JWT (JSON Web Tokens), and validation using express-validator.

## Acknowledgments

This project was developed as part of the final project for the Full-Stack Web Development course at Flag.pt. I would
like to thank Fernando for providing guidance and support throughout the course. I would also like to thank my
classmates for their feedback and suggestions during the development of this project.

## Tech Stack

- Node.js: for server-side JavaScript
- Express.js: for building the API
- MongoDB: for the database
- Mongoose: for modeling data in MongoDB

### Dependencies

- bcryptjs: for password hashing
- body-parser: for parsing incoming request bodies
- colors: for colorful console logs
- cors: for enabling cross-origin resource sharing
- dotenv: for loading environment variables from a .env file
- express: for building the API
- express-validator: for request validation
- jsonwebtoken: for generating and verifying JWTs
- mongoose: for connecting to MongoDB
- morgan: for HTTP request logging
- multer: for handling file uploads
- nodemon: for automatic server restarts during development
- slugify: for converting text to URL-friendly slugs
- socket.io: for real-time communication
- swagger-jsdoc: for generating Swagger documentation from JSDoc comments
- swagger-ui-express: for displaying Swagger documentation in the API

## Development

**To set up the development environment:**

**Prerequisites:**

- Node.js and yarn installed on your machine
- MongoDB database collection created

1. Clone the repository

 ```bash
git clone https://github.com/migsilva89/Dev-Assets-Pro-Api
```

2. Navigate to the project directory:

 ```bash
cd Dev-Assets-Pro-Api
```

3. To install the dependencies run:

 ```bash
npm install
``` 

4. Create a .env file based on the provided env.default file at the root folder, and fill in the required environment
   variables.

5. Seed the database with some initial data by running the following command:

```bash
npm run seed:users
``` 

6. To start a local development server run:

```bash
npm start
``` 

**The api will be available at http://localhost:5000**

## API Documentation

The API documentation is available at http://localhost:5000/api-docs when the server is running.

## Testing the API on Swagger

- Make sure the API is running on your local machine on port 5000. You can start the API by running the command npm
  start.
- Open a web browser and navigate to http://localhost:5000/api-docs. This should bring up the Swagger UI.
- You can use the Swagger UI to test the various endpoints of the API. Simply click on an endpoint to expand it, and
  then click on the "Try it out" button. Enter any required parameters and click on the "Execute" button to send the
  request.
- The response from the API will be displayed in the "Response body" section.
- You can also view the API documentation by clicking on the "Model" or "Schema" tabs. These tabs provide information on
  the data structures used by the API.

## Deployment

To deploy the API to a production environment, you can use a cloud-based service such as AWS, Heroku, or DigitalOcean.
These services typically provide a platform for running Node.js applications, along with a variety of tools for managing
deployments, scaling, and monitoring. You can also use a containerization tool like Docker to package your application
and its dependencies into a single image that can be deployed to any platform that supports Docker.

Tips or advice on how to improve are very welcome, thank you all!

[Linkedin](https://www.linkedin.com/in/miguelmpsilva/) 