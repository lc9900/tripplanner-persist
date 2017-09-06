const Sequelize = require('sequelize');

var databaseConn = process.env.DATABASE_URL || 'postgres://localhost/tripplanner_db';
const conn = new Sequelize(databaseConn, {
  logging: false
});

const Day = conn.define('day', {

});

const Hotel = conn.define('hotel', {
  name: Sequelize.STRING
});

const Restaurant = conn.define('restaurant', {
  name: Sequelize.STRING
});

const Activity = conn.define('activity', {
  name: Sequelize.STRING
});

const Place = conn.define('place', {
  location: Sequelize.ARRAY(Sequelize.FLOAT)
});

Day.belongsToMany(Hotel, { through: 'days_hotels'});
Day.belongsToMany(Restaurant, { through: 'days_restaurants'});
Day.belongsToMany(Activity, { through: 'days_activities'});

Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);


const sync = ()=> {
  return conn.sync({ force: true });
};

const seed = ()=> {
  var data = require('./seed.js');
  const { hotels, restaurants, activities } = data;
  const options = {
    include: [ Place ]
  };
  let tripOptions;
  return Promise.all([
    Promise.all(hotels.map( item => Hotel.create(item, options))),
    Promise.all(restaurants.map( item => Restaurant.create(item, options))),
    Promise.all(activities.map( item => Activity.create(item, options)))
  ])
  .then( ([ hotels, restaurants, activities ])=> {
    return {
      hotels,
      restaurants,
      activities
    };
  })
  .then( _tripOptions => {
    tripOptions = _tripOptions;
    return Promise.all([
      Day.create(),
      Day.create()
    ])
  })
  .then(([day1, day2])=> {
    return Promise.all([
      day1.addHotel(tripOptions.hotels[0]),
      day1.addRestaurant(tripOptions.restaurants[0]),
      day1.addRestaurant(tripOptions.restaurants[1]),
      day1.addActivity(tripOptions.activities[0]),
      day2.addHotel(tripOptions.hotels[1]),
      day2.addRestaurant(tripOptions.restaurants[2]),
      day2.addRestaurant(tripOptions.restaurants[3]),
      day2.addActivity(tripOptions.activities[2])
    ])
  });
};


Day.deleteDay = function(dayId){
  let currentDay;
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    currentDay = day;
    // console.log(day.setHotels);
    return day.setHotels([]);
  }).then(() => {
    // console.log(day);
    return currentDay.setRestaurants([]);
  }).then(() => {
    return currentDay.setActivities([]);
  }).then(() => {
    return currentDay.destroy();
  })
};

Day.addRestaurantById = function(dayId, restaurantId){
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.addRestaurants(restaurantId);
  });
};

Day.deleteRestaurantById = function(dayId, restaurantId){
  console.log("removeRestaurantById called");
  console.log(dayId, restaurantId);
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.removeRestaurants(restaurantId);
  });
};

// Hotels
Day.addHotelById = function(dayId, hotelId){
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.addHotels(hotelId);
  });
};

Day.deleteHotelById = function(dayId, hotelId){
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.removeHotels(hotelId);
  });
};

// Activities
Day.addActivityById = function(dayId, activityId){
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.addActivities(activityId);
  });
};

Day.deleteActivityById = function(dayId, activityId){
  return Day.findOne({
    where: {
      id: dayId
    }
  }).then(day => {
    return day.removeActivities(activityId);
  });
};

module.exports = {
  sync,
  seed,
  models: {
    Hotel,
    Restaurant,
    Activity,
    Place,
    Day
  }
};
