/* globals options, DayPicker, Day, Options $ */

$(function(){
  $.get('/days')
    .then(function(days){
      var map = new Map('map');
      var idx = 0;


      //function which renders options
      function renderOptions(){
        Options({
          id: '#options',
          day: days[idx],
          options: options,
          addItem: function(obj){
            //only one hotel please.
            if(obj.key === 'hotels' && days[idx].hotels.length === 1){
              return;
            }
            var item = options[obj.key].find(function(item){
              return item.id === obj.id;
            });
            //TODO - ajax call to add on server


            $.ajax({
              url: `/days/${days[idx].id}/${obj.key}/${obj.id}`,
              method: 'post'
            }).then(result => {
              console.log(result);
              days[idx][obj.key].push(item);
              return renderDayAndOptions();
            }).catch(err => { throw err; });
            // renderDayAndOptions();
          }
        });
      }

      //function which renders our day  picker
      function renderDayPicker(){
        var addDay = function(){
          $.post('/days')
            .then(function(day){
                days.push({
                  id: day.id,
                  hotels: [],
                  restaurants: [],
                  activities: [],
                });
                idx = days.length - 1;
                renderDayPicker();
            }).catch(err => { throw err; });
        }

        var removeDay = function(){
          if(days.length === 1){
            return;
          }
          //TODO - remove the day on server

          $.ajax({
            url: `/days/${days[idx].id}`,
            method: 'delete'
          })
          .then(result => {
            console.log(result);

            days = days.filter(function(day, _idx){
              return _idx !== idx;
            });

            idx = 0;
            return renderDayPicker();
          }).catch(err => { throw err; });
        }

        var selectDay = function(_idx){
          idx = _idx;
          renderDayPicker();
        }

        DayPicker({
          id: '#dayPicker',
          days: days,
          idx: idx,
          addDay,
          removeDay,
          selectDay
        });
        renderDayAndOptions();
      }

      function renderDayAndOptions(){
        map.setMarkers(days[idx]);
        renderDay();
        renderOptions();
      }

      //this function render day
      function renderDay(){
        var onRemoveItem = function(obj){

          //TODO - update on server
          // renderDayAndOptions();
          $.ajax({
              url: `/days/${days[idx].id}/${obj.key}/${obj.id}`,
              method: 'delete'
            }).then(result => {
              console.log(result);
              days[idx][obj.key] = days[idx][obj.key].filter(function(item){
                return item.id !== obj.id;
              });
              return renderDayAndOptions();
            }).catch(err => { throw err; });
        }

        Day({
          id: '#day',
          day: days[idx],
          options,
          onRemoveItem
        });
      }

      renderDayPicker();

    })


});
