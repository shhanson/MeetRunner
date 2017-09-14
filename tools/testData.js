module.exports.users = [

  {
    id: 1,
    first_name: 'David',
    last_name: 'Griffin',
    email: 'david@email.com',
    password: 'abc123',
    is_admin: false,
    timezone: '-06',
  },

  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Hanson',
    email: 'sarah@email.com',
    password: 'coolgirl',
    is_admin: true,
    timezone: '-06',
  },

];

module.exports.events = [

  {
    id: 1,
    title: 'Streetside Showdown',
    organizer: 'David Griffin',
    sanction_id: '11-1111',
    start_date: '2017-11-11',
    end_date: '2017-11-11',
    street_address: '4125 Guadalupe St',
    city: 'Austin',
    state: 'TX',
    zip_code: '78751',
    phone: '2104890342',
    email: 'david.c.griffin2@gmail.com',
    description: 'Come see some big lifts at this outdoor meet!',
    entry_fee_cents: 45000,
  },

  {
    id: 2,
    title: 'Naturally Fit Games',
    organizer: 'David Griffin',
    sanction_id: '11-1122',
    start_date: '2018-07-07',
    end_date: '2018-07-08',
    street_address: '500 E Cesar Chavez St',
    city: 'Austin',
    state: 'TX',
    zip_code: '78701',
    phone: '2104890342',
    email: 'david.c.griffin2@gmail.com',
    description: 'Join us at the Naturally Fit Games!',
    entry_fee_cents: 75000,
  },

  {
    id: 3,
    title: 'Christmas Classic',
    organizer: 'Sarah Hanson',
    sanction_id: '11-1422',
    start_date: '2018-12-25',
    end_date: '2018-12-25',
    street_address: '4125 Guadalupe St',
    city: 'Austin',
    state: 'TX',
    zip_code: '78751',
    phone: '2104890342',
    email: 'sarahh.hanson@gmail.com',
    description: 'Ho ho ho! Come lift in the cold.',
    entry_fee_cents: 55000,
  },

];

module.exports.sessions = [

  {
    id: 1,
    event_id: 1,
    date: '2017-11-11',
    weigh_time: '2017-11-11 09:00:00-06',
    start_time: '2017-11-11 11:00:00-06',
    description: 'Senior Women A',
  },

  {
    id: 2,
    event_id: 1,
    date: '2017-11-11',
    weigh_time: '2017-11-11 12:30:00-06',
    start_time: '2017-11-11 14:30:00-06',
    description: 'Senior Men A',
  },

  {
    id: 3,
    event_id: 2,
    date: '2018-07-08',
    weigh_time: '2018-07-08 09:00:00-06',
    start_time: '2018-07-08 11:00:00-06',
    description: 'Open Female A1',
  },

  {
    id: 4,
    event_id: 2,
    date: '2018-07-08',
    weigh_time: '2018-07-08 13:00:00-06',
    start_time: '2018-07-08 15:00:00-06',
    description: 'Open Male A1',
  },

  {
    id: 5,
    event_id: 3,
    date: '2018-12-25',
    weigh_time: '2018-12-25 08:30:00-05',
    start_time: '2018-12-25 10:30:00-05',
    description: '1F',
  },
  {
    id: 6,
    event_id: 3,
    date: '2018-12-25',
    weigh_time: '2018-12-25 12:30:00-05',
    start_time: '2018-12-25 14:30:00-05',
    description: '2M',
  },

];

module.exports.athletes = [
  {
    id: 1,
    email: 'sarah@email.com',
    first_name: 'Sarah',
    last_name: 'Hanson',
    usaw_id: '185764',
    year_of_birth: 1990,
    gender_id: 1,
    division_id: 3,
    category_id: 4,
    entry_total: 137,
  },
  {
    id: 2,
    email: 'angie@email.com',
    first_name: 'Angie',
    last_name: 'Wong',
    usaw_id: '111111',
    year_of_birth: 1988,
    gender_id: 1,
    division_id: 3,
    category_id: 2,
    entry_total: 100,
  },

  {
    id: 3,
    email: 'micah@email.com',
    first_name: 'Micah',
    last_name: 'De Valle',
    usaw_id: '222222',
    year_of_birth: 1993,
    gender_id: 1,
    division_id: 3,
    category_id: 6,
    entry_total: 120,
  },

  {
    id: 4,
    email: 'dcadoo@email.com',
    first_name: 'David',
    last_name: 'Cadieux',
    usaw_id: '444444',
    year_of_birth: 1993,
    gender_id: 2,
    division_id: 3,
    category_id: 9,
    entry_total: 220,
  },

  {
    id: 5,
    email: 'jonas@email.com',
    first_name: 'Jonas',
    last_name: 'Acevedo',
    usaw_id: '555555',
    year_of_birth: 1990,
    gender_id: 2,
    division_id: 3,
    category_id: 18,
    entry_total: 185,
  },

  {
    id: 6,
    email: 'stack@email.com',
    first_name: 'David',
    last_name: 'Stack',
    usaw_id: '9999999',
    year_of_birth: 1994,
    gender_id: 2,
    division_id: 3,
    category_id: 16,
    entry_total: 225,
  },

];

module.exports.categories = [
  {
    id: 1,
    category: '44',
  },
  {
    id: 2,
    category: '48',
  },
  {
    id: 3,
    category: '50',
  },
  {
    id: 4,
    category: '53',
  },
  {
    id: 5,
    category: '56',
  },
  {
    id: 6,
    category: '58',
  },
  {
    id: 7,
    category: '62',
  },
  {
    id: 8,
    category: '63',
  },
  {
    id: 9,
    category: '69',
  },
  {
    id: 10,
    category: '75',
  },
  {
    id: 11,
    category: '75+',
  },
  {
    id: 12,
    category: '77',
  },
  {
    id: 13,
    category: '85',
  },
  {
    id: 14,
    category: '90',
  },
  {
    id: 15,
    category: '90+',
  },
  {
    id: 16,
    category: '94',
  },
  {
    id: 17,
    category: '94+',
  },
  {
    id: 18,
    category: '105',
  },
  {
    id: 19,
    category: '105+',
  },
];

module.exports.divisions = [
  {
    id: 1,
    division: 'youth',
  },
  {
    id: 2,
    division: 'junior',
  },
  {
    id: 3,
    division: 'senior',
  },
  {
    id: 4,
    division: 'master',
  },
];

module.exports.genders = [
  {
    id: 1,
    gender: 'f',
  },
  {
    id: 2,
    gender: 'm',
  },

];

module.exports.divisions_categories = [

  { gender_id: 1, division_id: 1, category_id: 1 },
  { gender_id: 1, division_id: 1, category_id: 2 },
  { gender_id: 1, division_id: 1, category_id: 4 },
  { gender_id: 1, division_id: 1, category_id: 6 },
  { gender_id: 1, division_id: 1, category_id: 8 },
  { gender_id: 1, division_id: 1, category_id: 9 },
  { gender_id: 1, division_id: 1, category_id: 10 },
  { gender_id: 1, division_id: 1, category_id: 11 },
  { gender_id: 1, division_id: 2, category_id: 2 },
  { gender_id: 1, division_id: 2, category_id: 4 },
  { gender_id: 1, division_id: 2, category_id: 6 },
  { gender_id: 1, division_id: 2, category_id: 8 },
  { gender_id: 1, division_id: 2, category_id: 9 },
  { gender_id: 1, division_id: 2, category_id: 10 },
  { gender_id: 1, division_id: 2, category_id: 14 },
  { gender_id: 1, division_id: 2, category_id: 15 },
  { gender_id: 1, division_id: 3, category_id: 2 },
  { gender_id: 1, division_id: 3, category_id: 4 },
  { gender_id: 1, division_id: 3, category_id: 6 },
  { gender_id: 1, division_id: 3, category_id: 8 },
  { gender_id: 1, division_id: 3, category_id: 9 },
  { gender_id: 1, division_id: 3, category_id: 10 },
  { gender_id: 1, division_id: 3, category_id: 14 },
  { gender_id: 1, division_id: 3, category_id: 15 },
  { gender_id: 1, division_id: 4, category_id: 2 },
  { gender_id: 1, division_id: 4, category_id: 4 },
  { gender_id: 1, division_id: 4, category_id: 6 },
  { gender_id: 1, division_id: 4, category_id: 8 },
  { gender_id: 1, division_id: 4, category_id: 9 },
  { gender_id: 1, division_id: 4, category_id: 10 },
  { gender_id: 1, division_id: 4, category_id: 14 },
  { gender_id: 1, division_id: 4, category_id: 15 },
  { gender_id: 2, division_id: 1, category_id: 3 },
  { gender_id: 2, division_id: 1, category_id: 5 },
  { gender_id: 2, division_id: 1, category_id: 7 },
  { gender_id: 2, division_id: 1, category_id: 9 },
  { gender_id: 2, division_id: 1, category_id: 12 },
  { gender_id: 2, division_id: 1, category_id: 13 },
  { gender_id: 2, division_id: 1, category_id: 16 },
  { gender_id: 2, division_id: 1, category_id: 17 },
  { gender_id: 2, division_id: 2, category_id: 5 },
  { gender_id: 2, division_id: 2, category_id: 7 },
  { gender_id: 2, division_id: 2, category_id: 9 },
  { gender_id: 2, division_id: 2, category_id: 12 },
  { gender_id: 2, division_id: 2, category_id: 13 },
  { gender_id: 2, division_id: 2, category_id: 16 },
  { gender_id: 2, division_id: 2, category_id: 18 },
  { gender_id: 2, division_id: 2, category_id: 19 },
  { gender_id: 2, division_id: 3, category_id: 5 },
  { gender_id: 2, division_id: 3, category_id: 7 },
  { gender_id: 2, division_id: 3, category_id: 9 },
  { gender_id: 2, division_id: 3, category_id: 12 },
  { gender_id: 2, division_id: 3, category_id: 13 },
  { gender_id: 2, division_id: 3, category_id: 16 },
  { gender_id: 2, division_id: 3, category_id: 18 },
  { gender_id: 2, division_id: 3, category_id: 19 },
  { gender_id: 2, division_id: 4, category_id: 5 },
  { gender_id: 2, division_id: 4, category_id: 7 },
  { gender_id: 2, division_id: 4, category_id: 9 },
  { gender_id: 2, division_id: 4, category_id: 12 },
  { gender_id: 2, division_id: 4, category_id: 13 },
  { gender_id: 2, division_id: 4, category_id: 16 },
  { gender_id: 2, division_id: 4, category_id: 18 },
  { gender_id: 2, division_id: 4, category_id: 19 },
];

module.exports.users_events = [
  {
    user_id: 1,
    event_id: 1,
  },
  {
    user_id: 1,
    event_id: 2,
  },
  {
    user_id: 2,
    event_id: 3,
  },
];

module.exports.events_athletes = [
  {
    athlete_id: 1,
    event_id: 1,
  },
  {
    athlete_id: 2,
    event_id: 2,
  },
  {
    athlete_id: 3,
    event_id: 3,
  },
  {
    athlete_id: 4,
    event_id: 1,
  },
  {
    athlete_id: 5,
    event_id: 2,
  },
  {
    athlete_id: 6,
    event_id: 3,
  },

];

module.exports.athletes_sessions = [

  {
    athlete_id: 1,
    session_id: 1,
  },

  {
    athlete_id: 2,
    session_id: 3,
  },
  {
    athlete_id: 3,
    session_id: 5,
  },
  {
    athlete_id: 4,
    session_id: 2,
  },
  {
    athlete_id: 5,
    session_id: 4,
  },
  {
    athlete_id: 6,
    session_id: 6,
  },


];

module.exports.attempts = [

  { id: 1, type: 'snatch', athlete_id: 1, attempt_num: 1, weight: 50, attempted: false, success: false },
  { id: 2, type: 'snatch', athlete_id: 1, attempt_num: 2, weight: 52, attempted: false, success: false },
  { id: 3, type: 'snatch', athlete_id: 1, attempt_num: 3, weight: 54, attempted: false, success: false },
  { id: 4, type: 'snatch', athlete_id: 2, attempt_num: 1, weight: 56, attempted: false, success: false },
  { id: 5, type: 'snatch', athlete_id: 2, attempt_num: 2, weight: 58, attempted: false, success: false },
  { id: 6, type: 'snatch', athlete_id: 2, attempt_num: 3, weight: 60, attempted: false, success: false },
  { id: 7, type: 'snatch', athlete_id: 3, attempt_num: 1, weight: 62, attempted: false, success: false },
  { id: 8, type: 'snatch', athlete_id: 3, attempt_num: 2, weight: 64, attempted: false, success: false },
  { id: 9, type: 'snatch', athlete_id: 3, attempt_num: 3, weight: 66, attempted: false, success: false },
  { id: 10, type: 'snatch', athlete_id: 4, attempt_num: 1, weight: 68, attempted: false, success: false },
  { id: 11, type: 'snatch', athlete_id: 4, attempt_num: 2, weight: 70, attempted: false, success: false },
  { id: 12, type: 'snatch', athlete_id: 4, attempt_num: 3, weight: 72, attempted: false, success: false },
  { id: 13, type: 'snatch', athlete_id: 5, attempt_num: 1, weight: 74, attempted: false, success: false },
  { id: 14, type: 'snatch', athlete_id: 5, attempt_num: 2, weight: 76, attempted: false, success: false },
  { id: 15, type: 'snatch', athlete_id: 5, attempt_num: 3, weight: 78, attempted: false, success: false },
  { id: 16, type: 'snatch', athlete_id: 6, attempt_num: 1, weight: 80, attempted: false, success: false },
  { id: 17, type: 'snatch', athlete_id: 6, attempt_num: 2, weight: 82, attempted: false, success: false },
  { id: 18, type: 'snatch', athlete_id: 6, attempt_num: 3, weight: 84, attempted: false, success: false },
  { id: 19, type: 'jerk', athlete_id: 1, attempt_num: 1, weight: 86, attempted: false, success: false },
  { id: 20, type: 'jerk', athlete_id: 1, attempt_num: 2, weight: 88, attempted: false, success: false },
  { id: 21, type: 'jerk', athlete_id: 1, attempt_num: 3, weight: 90, attempted: false, success: false },
  { id: 22, type: 'jerk', athlete_id: 2, attempt_num: 1, weight: 92, attempted: false, success: false },
  { id: 23, type: 'jerk', athlete_id: 2, attempt_num: 2, weight: 94, attempted: false, success: false },
  { id: 24, type: 'jerk', athlete_id: 2, attempt_num: 3, weight: 96, attempted: false, success: false },
  { id: 25, type: 'jerk', athlete_id: 3, attempt_num: 1, weight: 98, attempted: false, success: false },
  { id: 26, type: 'jerk', athlete_id: 3, attempt_num: 2, weight: 100, attempted: false, success: false },
  { id: 27, type: 'jerk', athlete_id: 3, attempt_num: 3, weight: 102, attempted: false, success: false },
  { id: 28, type: 'jerk', athlete_id: 4, attempt_num: 1, weight: 104, attempted: false, success: false },
  { id: 29, type: 'jerk', athlete_id: 4, attempt_num: 2, weight: 106, attempted: false, success: false },
  { id: 30, type: 'jerk', athlete_id: 4, attempt_num: 3, weight: 108, attempted: false, success: false },
  { id: 31, type: 'jerk', athlete_id: 5, attempt_num: 1, weight: 110, attempted: false, success: false },
  { id: 32, type: 'jerk', athlete_id: 5, attempt_num: 2, weight: 112, attempted: false, success: false },
  { id: 33, type: 'jerk', athlete_id: 5, attempt_num: 3, weight: 114, attempted: false, success: false },
  { id: 34, type: 'jerk', athlete_id: 6, attempt_num: 1, weight: 116, attempted: false, success: false },
  { id: 35, type: 'jerk', athlete_id: 6, attempt_num: 2, weight: 118, attempted: false, success: false },
  { id: 36, type: 'jerk', athlete_id: 6, attempt_num: 3, weight: 120, attempted: false, success: false },

];
