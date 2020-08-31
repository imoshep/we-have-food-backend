const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");

const mongoConfig = require("./config/mongo.config.js");

const MONGO_URI = `mongodb+srv://${mongoConfig.username}:${mongoConfig.password}@cluster0-4ryx0.mongodb.net/${mongoConfig.db}?retryWrites=true&w=majority`;
// mongo `mongodb+srv://imoshep:vnuaheu123@cluster0-4ryx0.mongodb.net/we-have-food?retryWrites=true&w=majority`
const port = process.env.PORT || 8181;

mongoose 
.connect(MONGO_URI, mongoConfig.options)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Could not connect to MongoDB ", err));

const corsOptions = {
    origin: 'https://priceless-albattani-bf0e3c.netlify.app',
    optionsSuccessStatus: 200
}

app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// config routes
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const foodRoute = require("./routes/foodRoute");
const S3Route = require("./routes/S3Route");
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/sign-s3", S3Route);

http.listen(port, () => console.log(`Listening on port ${port}`));
