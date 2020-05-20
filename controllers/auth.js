const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Signup controller
exports.signup = (req, res) => {
  // Check if user exists
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) return res.status(400).json({ error: "Email is taken" });
  });

  let { first_name, last_name, email, mobile_number, password } = req.body;

  //   hash the password
  const salt = bcrypt.genSalt(10);
  password = bcrypt.hash(password, salt);

  let newUser = new User({
    first_name,
    last_name,
    email,
    mobile_number,
    password,
  });
  newUser.save((err, success) => {
    if (err) return res.status(400).json({ error: err });
  });

  res.json({ message: "Signup Success ! Please signin." });
};

// Signup controller
exports.signin = (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({
        error: "User with that email does not exist, Please sign up !",
      });

    // Authenticate
    bcrypt.compare(password, 10, function (err, result) {
      if (err)
        return res
          .status(400)
          .json({ error: "Email and password do not match" });
    });

    // Generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1 d",
    });

    res.cookie("token", token, { expiresIn: "1 d" });

    const { _id, first_name, last_name, email, mobile_number } = user;

    return res.status(200).json({
      token,
      user: {
        _id,
        first_name,
        last_name,
        email,
        mobile_number,
        time: new Date(),
      },
    });
  });
};
