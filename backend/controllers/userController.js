import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, mobile, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, "user"); 

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: "user", 
        },
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get profile
export const getUserProfile = async (req, res) => {
  try {
    res.json(req.user); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
