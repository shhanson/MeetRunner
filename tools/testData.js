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
    weigh_time: '2017-11-11 12:00:00-06',
    start_time: '2017-11-11 14:00:00-06',
    description: 'Senior Men A',
  },

  {
    id: 3,
    event_id: 2,
    date: '2018-07-07',
    weigh_time: '2018-07-07 07:00:00-06',
    start_time: '2018-07-07 09:00:00-06',
    description: 'Open Female A',
  },

  {
    id: 4,
    event_id: 3,
    date: '2018-12-25',
    weigh_time: '2018-12-25 06:00:00-06',
    start_time: '2018-12-25 08:00:00-06',
    description: 'Open Female 1',
  },

];

module.exports.athletes = [

];

module.exports.categories = [

];

module.exports.divisions = [

];

module.exports.genders = [

];

module.exports.users_events = [

];

module.exports.athletes_sessions = [

];

module.exports.attempts = [

];
