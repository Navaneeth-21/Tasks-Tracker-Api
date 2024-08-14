const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config");
const User = require("./models/userModel");
const taskModel = require("./models/exerciseModel");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST REQUEST - /api/users - creating the new user
app.post("/api/users", async (req, res) => {
  try {
    const username = req.body.username;
    let data = await User.findOne({ username: username });
    if (data)
      return res.json({ error: "user with the given username already exists" });

    // create a new user
    const newUser = await new User({
      username: username,
    }).save();

    res.json(newUser);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// GET REQUEST - /api/users - to get all the users
app.get("/api/users", async (req, res) => {
  await User.find({})
    .then((users) => {
      return res.json(users);
    })
    .catch((error) => {
      return res.json({ error: error.message });
    });
});

// POST REQUEST - /api/users/:_id/exercises - to create the users exercises
app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const userID = req.params._id;

    const user = await User.findById(userID);
    if (!user) return res.json({ error: `User of given ${userID} doesn't exists` });

    const { description, duration, date } = req.body;

    if (!description) return res.json({ error: "Please provide a valid description" });
    if (!duration) return res.json({ error: "Please provide a valid duration" });

    const exercise = await new taskModel({
      description: description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date(),
      userID: user._id,
    }).save();

    return res.json({
      _id: user.id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

// GET REQUEST - /api/users/:_id/logs - all the exercises that belong to a specifc user
app.get("/api/users/:_id/logs", async (req, res) => {
  const userID = req.params._id;
  
  const user = await User.findById(userID);
  if (!user) return res.json({ error: `user with the ${userID} doesn't exists` });
  
  const {from, to, limit} = req.query;

  try {
    // validate and parse the date  range
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    const loglimit = limit ? limit : 100  ;

    // Build a query filter based on given data
    let query = {userID};
    if(fromDate || toDate){
      // intializing a date object to store the filetered dates
      query.date = {}
      if(fromDate) query.date.$gte = fromDate;
      if(toDate) query.date.$lte = toDate;
    }

    const tasks = await taskModel.find(query).limit(loglimit).exec();
    if (!tasks) return res.json({ error: "There is no tasks for given id" });

    const log = tasks.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: new Date(e.date).toDateString(),
    }));
    
    res.json({
      _id: user._id,
      username: user.username,
      count: tasks.length,
      log,
    });
  } catch (error) {
    return res.json({error:'Internal Server Error'});
  }
});


const start = async () => {
  try {
    await connectDB(process.env.MONGOURI);
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
