const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");

const mongoConfig = require("./config/mongo.config.js");

const MONGO_URI = `mongodb+srv://${mongoConfig.username}:${mongoConfig.password}@cluster0-4ryx0.mongodb.net/${mongoConfig.db}?retryWrites=true&w=majority`;
// mongo `mongodb+srv://imoshep:vnuaheu123@cluster0-4ryx0.mongodb.net/we-have-food?retryWrites=true&w=majority`
const port = 8181;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB ", err));

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// config routes
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const foodRoute = require("./routes/foodRoute");
const imageRoute = require("./routes/imageRoute");
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/images", imageRoute);

http.listen(port, () => console.log(`Listening on port ${port}`));
