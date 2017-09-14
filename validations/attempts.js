const Joi = require('joi');

module.exports.post = {
  body: {
    type: Joi.string().label('type').regex(/snatch|jerk/).required(),
    athlete_id: Joi.number().label('athlete_id').integer().required(),
    attempt_num: Joi.number().label('attempt_num').integer().min(1)
      .max(3).required(),
    weight: Joi.number().label('weight').integer().required(),
    attempted: Joi.boolean().label('attempted'),
    success: Joi.boolean().label('success'),

  },
};

module.exports.put = {
  body: {
    type: Joi.string().label('type').regex(/snatch|jerk/),
    athlete_id: Joi.number().label('athlete_id').integer(),
    attempt_num: Joi.number().label('attempt_num').integer().min(1)
      .max(3),
    weight: Joi.number().label('weight').integer(),
    attempted: Joi.boolean().label('attempted'),
    success: Joi.boolean().label('success'),
  },
};
