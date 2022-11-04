import express from "express";
import mongoose from "mongoose";
import blogRouter from "./routes/blog-routes.js";
import router from "./routes/user-routes.js";
import cors from "cors";
const app = express();
app.use(cors());

//passes all the data in the json format in the body
app.use(express.json());

//router for user
app.use("/api/user", router);

//router for user to create blog
app.use("/api/blog", blogRouter);

mongoose
  .connect("mongodb://localhost:27017/blogpost")
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected to Database and Listening to Localhost 5000")
  )
  .catch((err) => console.log(err));
//app.listen(6555);
