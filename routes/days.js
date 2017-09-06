const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create({})
    .then( day => {
      res.send(day);
    });
});


// Delete day
app.delete('/:id', (req, res, next)=> {
  //TODO - implement
  Day.deleteDay(req.params.id*1)
      .then(() => {
        res.send('Day deleted')
      })
      .catch(err => { throw err; });
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  Day.addRestaurantById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Restaurant added');
      })
      .catch( err => { throw err; });
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  // console.log('Got delete Restaurant request');
  Day.deleteRestaurantById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Restaurant deleted');
      })
      .catch( err => { throw err; });

});

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  Day.addHotelById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Hotel added');
      })
      .catch( err => { throw err; });
});

app.delete('/:dayId/hotels/:id', (req, res, next)=> {
  Day.deleteHotelById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Hotel deleted');
      })
      .catch( err => { throw err; });
});

app.post('/:dayId/activities/:id', (req, res, next)=> {
  Day.addActivityById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Activity added');
      })
      .catch( err => { throw err; });
});


app.delete('/:dayId/activities/:id', (req, res, next)=> {
  Day.deleteActivityById(req.params.dayId*1, req.params.id*1)
      .then(() => {
        return res.send('Activity deleted');
      })
      .catch( err => { throw err; });
});

module.exports = app;
