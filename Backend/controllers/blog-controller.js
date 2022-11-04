// import { model } from "mongoose";
import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ success: false, message: "No Blogs Found" });
  } else {
    return res.status(200).json({ blogs });
  }
};

//to add new blog
export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  //validating an existing user
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Unable to Find User By this ID" });
  }

  //defining a new blog instance
  const blog = new Blog({ title, description, image, user });
  blog.save();
  try {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // await blog.save({ session });
    // existingUser.blogs.push(blog);
    // await existingUser.save({ session });
    // await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "err" });
  }
  return res.status(200).json({ blog });
};
//lines of code to update blog
export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;

  //getting the ID of the blog to be updated from MongoDB
  const blogId = req.params.id;
  console.log(blogId);
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console.log(err);
  }
  console.log(blog);
  if (!blog) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to Update the Blog" });
  } else {
    //this returns the updated information in the blog
    return res.status(200).json({ blog });
  }
};

//getting a blog by its ID
export const getById = async (req, res, next) => {
  const id = String(req.params.id);
  let newId = id.slice(1);
  console.log(id);
  let blog;
  try {
    blog = await Blog.findById(newId);
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(404).json({ success: false, message: "No Blog Found" });
  } else {
    return res.status(200).json({ blog });
  }
};

//delete a blog by blog_ID
export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to Delete" });
  } else {
    return res
      .status(200)
      .json({ success: true, message: "Successfully Deleted" });
  }
};

//getting users by ID for blog post
export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    const user = await User.findById(userId).populate("blogs");
    //console.log("user", user);

    const blogs = await Blog.find({ user: userId });
    user.blogs = blogs;
    userBlogs = user;
  } catch (err) {
    return console.log(err);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ user: userBlogs });
};
