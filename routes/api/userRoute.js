const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const mongoose = require("mongoose");
const async = require("async");
const crypto = require("crypto");
const request = require("superagent");

// Load User model
const User = require("../../models/UserModel");

// Load Input Validation
const validateRegisterInput = require("../../validation/auth/registerValidation");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

// @route   POST api/users/registerAndAuth
// @desc    Register user and authenticate
// @access  Public
router.post("/registerAndAuth", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      if (req.body.password !== req.body.password2) {
        errors.password = "Passwords do not match";
        return res.status(400).json(errors);
      }

      const newUser = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      // Hash the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(newUser => {
              // User Matched
              const payload = {
                id: newUser.id,
                name: newUser.name
              }; // Create JWT Payload

              // Sign Token
              jwt.sign(
                payload,
                keys.secretOrKey,
                {
                  expiresIn: 36000
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });

                  return res.json({
                    token: token,
                    user: newUser
                  });
                }
              );
            })
            .catch(err =>
              res.status(400).json({
                userNotSaved: "The new user could not be made!: " + err
              })
            );
        });
      });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

// @route   GET /api/users/all
// @desc    Get all users
// @access  Public
router.get("/all", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err =>
      res.status(404).json({
        userFetchFailed: "Getting Users Failed: " + err
      })
    );
});

module.exports = router;
