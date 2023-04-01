# Assets Management API

Assets Management API is a comprehensive platform designed to efficiently manage digital assets like images and text.
The application empowers users to effortlessly store information related to their assets, including categorization,
comments, and likes. The platform also offers advanced categorization and tagging features, making it easy to quickly
locate assets based on specific search criteria.
Built using Node.js and Express.js, the API leverages the power of MongoDB, an industry-leading NoSQL database, to
provide a scalable and flexible data storage solution. The platform includes robust authentication and authorization
capabilities, thanks to the use of JSON Web Tokens (JWTs). Additionally, the use of express-validator ensures that all
user inputs are validated to prevent potential security vulnerabilities.
Furthermore, the platform offers a chat feature, enabling users to communicate with each other in real-time. This
feature provides a seamless collaboration experience, ensuring that users can easily and quickly interact with each
other to accomplish their goals.
Overall, Assets Management API offers a powerful and reliable solution for managing digital assets, providing users with
a comprehensive platform that offers advanced features to make managing their assets easier and more efficient.

## Acknowledgments

This project was developed as part of the final project for the Full-Stack Web Development course at Flag.pt. I would
like to thank Fernando for providing guidance and support throughout the course. I would also like to thank my
classmates for their feedback and suggestions during the development of this project.

As part of this project, I have also developed a front-end
application, [Assets Management Website](https://github.com/migsilva89/Assets-Management-website) that interacts with
the API, allowing users to
see the API in action and test its functionality.

You can check it out here: [Assets Management Website](https://github.com/migsilva89/Assets-Management-website).

## Tech Stack

- Node.js: for server-side JavaScript
- Express.js: for building the API
- MongoDB: for the database
- Mongoose: for modeling data in MongoDB
- Multer: for handling file uploads
- Jsonwebtoken: for generating and verifying JWTs
- Socket.io: for real-time communication
- Morgan: for HTTP request logging
- Swagger: for generating Swagger documentation from JSDoc comments, and displaying documentation in the API.

## Development

**To set up the development environment:**

**Prerequisites:**

- Node.js installed on your machine
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

### Tips or advice on how to improve are very welcome, thank you all!

[Linkedin](https://www.linkedin.com/in/miguelmpsilva/) 