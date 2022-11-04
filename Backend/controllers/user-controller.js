import User from "../model/User.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users found" });
  }
  return res.status(200).json({ users });
};
//to register a new user
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  //validating existing user
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User ALready Exist! Please Login" });
  } else {
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      blogs: [],
    });

    user.password = hashedPassword;

    try {
      await user.save();
    } catch (err) {
      return console.log(err);
    }
    return res.status(201).json({ user });
  }
};

//for a user to login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    console.log("Working");
    return res.status(404).json({ message: "Could Not Find User by Email" });
  }

  //comparing password of typed password and existing password in the DB

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect Password/Email" });
  } else {
    return res
      .status(200)
      .json({ message: "Login Successful", user: existingUser });
  }
};
