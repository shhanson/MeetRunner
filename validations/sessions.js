const Joi = require('joi');

module.exports.post = {

  body: {
    date: Joi.date().label('date').iso().required(),
    weigh_time: Joi.string().label('weigh_time').required(),
    start_time: Joi.string().label('start_time').required(),
    description: Joi.string().label('description').required(),
  },

};

module.exports.put = {

  body: {
    date: Joi.date().label('date').iso(),
    weigh_time: Joi.string().label('weigh_time'),
    start_time: Joi.string().label('start_time'),
    description: Joi.string().label('description'),
  },

};
