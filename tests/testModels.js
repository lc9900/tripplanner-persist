const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

// Day.removeRestaurantById(2, 3)
//     .then(() => {
//         console.log('removed Restaurant from day')
//     })
//     .catch(err => { throw err; })

// Day.removeActivityById(1, 1)
//         .then(() => {
//             console.log('removed');
//         })


Day.deleteDay(2)
    .then(result => {
        console.log(result);
    })
