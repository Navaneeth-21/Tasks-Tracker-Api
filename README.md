# Exercise Tracker
A Microservice Application which is used to track the users tasks/exercises.
- It Consists of Several api endpoints which is used to make the following requests:
    - POST REQUEST - /api/users - creating the new user
    - GET REQUEST - /api/users - to get all the users
    - POST REQUEST - /api/users/:_id/exercises - to create the users exercises
    - GET REQUEST - /api/users/:_id/logs - all the exercises that belong to a specifc user
- There will be two models : exercises schema(which consists of information about exercises) and user schema(users info)


## Getting Started

1. Tools and Technologies :
     - NodeJS
     - ExpresJS
     - MongoDB
2. Clone the repository
3. Install the dependencies
   
   ```sh
   npm install
4. Replace the MONGOURI with your mongodb connection string in .env file   
5. Start the server

   ```sh
   npm run start
   ```




