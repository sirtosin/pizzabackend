const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

router.post("/changepassword", async (req, res) => {
  const { token, username, newpassword: plainTextPassword } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ status: "error", error: "Invalid username" });
  } else {
    if (user) {
      if (!plainTextPassword || typeof plainTextPassword !== "string") {
        return res.json({ status: "error", error: "Invalid password" });
      }

      if (plainTextPassword.length <= 5) {
        return res.json({
          status: "error",
          error: "Password too small. Should be atleast 6 characters",
        });
      }

      try {
        const user = jwt.verify(token, JWT_SECRET);

        const _id = user.id;

        const password = await bcrypt.hash(plainTextPassword, 10);

        await User.updateOne(
          { _id },
          {
            $set: { password },
          }
        );
        res.json({ status: "ok" });
      } catch (error) {
        1;
        console.log(error);
        res.json({ status: "error", error: ";))" });
      }
    }
  }
});
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successfull

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

router.post("/signup", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  const user = await User.findOne({ username });

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  if (user) {
    throw new Error("User already exists. Please login instead.");
  } else {
    try {
      const response = await User.create({
        username,
        password,
      });
      console.log("User created successfully: ", response);
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: "error", error: "Username already in use" });
      }
      throw error;
    }

    res.json({ status: "ok" });
  }
});
module.exports = router;
