const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const config = require('../config');
const log = require('../config/log.config');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401);
      res.send('Unauthorized');
    }
  },
  signup: async (req, res) => {
    try {
      // Email and Password is mandatory for user registration
      if (!req.body.email || !req.body.password) {
        res.status(msgUtil.error_400.status);
        res.json(msgUtil.error_400.data);
        log.error('Email or Password is empty!');
        return;
      }

      // Minimum password length should be more than 5 characters
      if (req.body.password.length < 5) {
        res.status(msgUtil.error_400.status);
        res.json(msgUtil.error_400.data);
        log.error('Password length is less than 5');
        return;
      }

      // Check if the user is already registered, throw error if user found, else proceed
      const option = { email: req.body.email };
      const user = await crudUtil.getOne(userModel.User, option);
      if (user) {
        res.status(msgUtil.error_409.status);
        res.json(msgUtil.error_409.data);
        log.error('User already exists');
        return;
      }
    } catch (err) {
      if (err.status === 404) {
        // Prepare user payload and save
        const newUser = userModel.User.build({
          email: req.body.email,
        });
        newUser.setHashAndSalt(req.body.password);
        newUser.save()
          .then(() => {
            res.status(msgUtil.success_201.status);
            res.json(msgUtil.success_201.data);
          })
          .catch((error) => {
            res.status(msgUtil.error_400.status);

            // If there is any error from sequelize show it otherwise log a generic error
            if (err) {
              res.json({ data: error });
              log.error('Some error from sequelize while creating user');
            } else {
              res.json(msgUtil.error_400.data);
              log.error(JSON.stringify(msgUtil.error_400.data));
            }
          });
      } else {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  login: (req, res) => {
    // This is getting executed after passport middleware. Passport would have already attached
    // user data in req object. Generate JWT token with user data and send it to client
    if (req.user) {
      const jwtObject = {
        email: req.user.email,
        name: req.user.name,
      };

      // Sign JWT token and set it's expiration time to 12 hours
      const token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: '12h' });

      res.status(msgUtil.success_200.status);
      res.json({
        access_token: token,
        expires_in_seconds: 12 * 60 * 60,
      });
    } else {
      res.status(msgUtil.error_400.status);
      res.send(msgUtil.error_400.data);
      log.error('Login failed! Not able to retrieve user data');
    }
  },
  updateUser: async (req, res) => {
    // This should be executed only if the user is already authenticated.
    // Check the req object for user data. If its there update user entry, otherwise throw error
    if (req.user) {
      try {
        // Email, Hash and Salt should not be updated. If req object has these data, throw error
        if (req.body.email || req.body.hash || req.body.salt) {
          res.status(msgUtil.error_400.status);
          res.json(msgUtil.error_400.data);
          log.error('Cannot update email and password');
          return;
        }

        // Update the user data, if user is already logged in
        const payload = req.body;
        const whereOption = {
          email: req.user.email,
        };
        await crudUtil.update(userModel.User, payload, whereOption);
        res.status(msgUtil.success_204.status);
        res.json(msgUtil.success_204.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  logout: (req, res) => {
    // If user already logged in, invalidate the token
    if (req.user) {
      req.logout();
      res.json({ data: 'Logged Out!' });
    }
  },
};
