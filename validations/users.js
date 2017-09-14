const Joi = require('joi');

// Validation for user registration
module.exports.reg_post = {
  body: {
    first_name: Joi.string().label('first_name').max(16).required(),
    last_name: Joi.string().label('last_name').max(16).required(),
    email: Joi.string().label('email').required().lowercase().email()
      .trim(),
    password: Joi.string().label('password').required()
      .min(6),
    vpassword: Joi.ref('password'),
    timezone: Joi.string().label('timezone'),
  },

};

// Validation for user login
module.exports.login_post = {
  body: {
    email: Joi.string().label('email').required().email()
      .trim().lowercase(),
    password: Joi.string().label('password').required()
      .min(6),
  },
};

// Validation for modifying user info
module.exports.put = {
  body: {
    first_name: Joi.string().label('first_name').max(16),
    last_name: Joi.string().label('last_name').max(16),
    password: Joi.string().label('password').min(6),
    vpassword: Joi.ref('password'),
    timezone: Joi.string().label('timezone'),
  },

};
