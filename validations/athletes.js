const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string().label('email').email().required()
      .trim().lowercase(),
    first_name: Joi.string().label('first_name').max(16).required(),
    last_name: Joi.string().label('last_name').max(16).required(),
    usaw_id: Joi.string().label('usaw_id').required(),
    year_of_birth: Joi.number().integer().label('year_of_birth').required(),
    gender_id: Joi.number().integer().label('gender_id').required(),
    lot_num: Joi.number().integer().label('lot_num'),
    division_id: Joi.number().integer().label('division_id'),
    category_id: Joi.number().integer().label('category_id'),
    entry_total: Joi.number().integer().label('entry_total').required(),
    total: Joi.number().integer().label('total'),
    bodyweight_grams: Joi.number().integer().label('bodyweight_grams'),
  },
};

module.exports.put = {
  body: {
    email: Joi.string().label('email').email().trim().lowercase(),
    first_name: Joi.string().label('first_name').max(16),
    last_name: Joi.string().label('last_name').max(16),
    usaw_id: Joi.string().label('usaw_id'),
    year_of_birth: Joi.number().integer().label('year_of_birth'),
    gender_id: Joi.number().integer().label('gender_id'),
    lot_num: Joi.number().integer().label('lot_num'),
    division_id: Joi.number().integer().label('division_id'),
    category_id: Joi.number().integer().label('category_id'),
    entry_total: Joi.number().integer().label('entry_total'),
    total: Joi.number().integer().label('total'),
    bodyweight_grams: Joi.number().integer().label('bodyweight_grams'),
  },
};
