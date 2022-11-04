import mongoose from "mongoose";

//creating a schema for the building of the blog
const Schema = mongoose.Schema;

//defining the schema(schema is the payload of my blog)
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Blog", blogSchema);
