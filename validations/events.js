const Joi = require('joi');

module.exports.post = {

  body: {
    title: Joi.string().label('title').max(50).required(),
    organizer: Joi.string().label('organizer').max(50).required(),
    sanction_id: Joi.string().label('sanction_id').required(),
    start_date: Joi.date().label('start_date').iso().required(),
    end_date: Joi.date().label('end_date').iso().min(Joi.ref('start_date')).required(),
    street_address: Joi.string().label('street_address').required(),
    city: Joi.string().label('city').required(),
    state: Joi.string().label('state').required(),
    zip_code: Joi.string().label('zip_code').regex(/^\d{5}$/).required(),
    phone: Joi.string().label('phone').regex(/^\d{10}$/).required(),
    email: Joi.string().label('email').email().required(),
    description: Joi.string().label('description').required(),
    entry_fee_cents: Joi.number().integer().label('entry_fee_cents').required(),

  },

};

module.exports.put = {

  title: Joi.string().label('title').max(50),
  organizer: Joi.string().label('organizer').max(50),
  sanction_id: Joi.string().label('sanction_id'),
  start_date: Joi.date().label('start_date').iso(),
  end_date: Joi.date().label('end_date').iso().min(Joi.ref('start_date')),
  street_address: Joi.string().label('street_address'),
  city: Joi.string().label('city'),
  state: Joi.string().label('state'),
  zip_code: Joi.string().label('zip_code').regex(/^\d{5}$/),
  phone: Joi.string().label('phone').regex(/^\d{10}$/),
  email: Joi.string().label('email').email(),
  description: Joi.string().label('description'),
  entry_fee_cents: Joi.number().integer().label('entry_fee_cents'),

};
