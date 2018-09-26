/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');
var request = require('request');


module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }

    controller.on('heard_trigger', function() {
        stats.triggers++;
    });

    controller.on('conversationStarted', function() {
        stats.convos++;
    });


    controller.hears(['^uptime','^debug'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.setVar('uptime', formatUptime(process.uptime()));
                convo.setVar('convos', stats.convos);
                convo.setVar('triggers', stats.triggers);

                convo.say('Hi bwoyy My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.');
                convo.activate();
            }
        });

    });

    controller.hears(['^say (.*)','^say'], 'direct_message,direct_mention', function(bot, message) {
        if (message.match[1]) {

            if (!wordfilter.blacklisted(message.match[1])) {
                bot.reply(message, message.match[1]);
            } else {
                bot.reply(message, '_sigh_');
            }
        } else {
            bot.reply(message, 'I will repeat whatever you say.')
        }
    });

   

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility function to format uptime */
    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }
  
  
  
    controller.hears(['How many clients'], 'ambient', function(bot, message) {

    
        request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, function (err, response, body) {

            //console.log('error: ', err); // Handle the error if one occurred
            console.log('statusCode: ', response && response.statusCode); // Check 200 or such
            //console.log('This is the count of users: ', JSON.parse(body.explanation));
            
            //bot.reply(message, 'There are ' + JSON.parse(body.explanation) + ' clients connected');
            
            bot.reply(message, body.explanation);
        });
    });
  
    
  controller.hears(['cats'], 'ambient', function(bot, message) {
      
        request('https://api.thecatapi.com/v1/images/search', { json: true }, function (err, response, body) {

            //console.log('error: ', err); // Handle the error if one occurred
            console.log('statusCode: ', response && response.statusCode); // Check 200 or such
            //console.log('This is the count of users: ', JSON.parse(body.explanation));
            console.log(response.headers['content-type']);
            //bot.reply(message, 'There are ' + JSON.parse(body.explanation) + ' clients connected');
            console.log(body[0]);
            bot.reply(message, {
              "attachments": [
              {
                  "fallback": "Random foto van een kat.",
                  "text": "Roocoo, geen katten voor mij!",
                  "image_url": body[0].url,
                  "thumb_url": body[0].url
              }
            ]
            });
        });
    });
  
    controller.hears(['weer'], 'direct_message', function(bot, message) {
      
      
        const url ='https://api.openweathermap.org/data/2.5/weather?id=2795802&APPID=f9a1864e10c2ea5de36781e98aa49a4d&units=metric';
        
        request.get(url, { json: true },  (err, response, body) => {

            //console.log('error: ', err); // Handle the error if one occurred
            console.log('statusCode: ', response && response.statusCode); // Check 200 or such
            //console.log('This is the count of users: ', JSON.parse(body.explanation));
            console.log(response.headers['content-type']);
            //bot.reply(message, 'There are ' + JSON.parse(body.explanation) + ' clients connected');
            console.log(body.weather[0].main);
  
            bot.reply(message, {
              "attachments": [
              {
                  "pretext": "Huidig weer:",
                  "title": body.name +', ' + body.sys.country,
                  "fallback": "Weer in Heusden",
                  "text": "Weer: " + body.weather[0].description 
    
                + "\n <!date^" + body.sys.sunrise +"^Zon komt op om {time_secs}|error>" 
                + "\n <!date^" + body.sys.sunset +"^Zon gaat onder om {time_secs}|error>" ,
                  //"image_url": "http://openweathermap.org/img/w/" + body.weather[0].icon +".png",
                  "thumb_url": "http://openweathermap.org/img/w/" + body.weather[0].icon +".png",
                "footer": "OpenWeatherMap API",
                "ts": body.dt,
                "fields": [
                {
                    "title": "Temp",
                    "value": '`' + body.main.temp + 'ºC`',
                    "short": body.main.temp
                },
                {
                    "title": "Luchtdruk",
                    "value": '`' + body.main.pressure + 'hpa`',
                    "short": body.main.pressure
                },
                {
                    "title": "Wind",
                    "value": '`' + body.wind.speed + 'm/s`',
                    "short": body.wind.speed
                },
                {
                    "title": "Vochtigheid",
                    "value": '`' + body.main.humidity + '%`',
                    "short": body.main.humidity
                }
              ],
                "color": "#7CD197"
              }
            ]
            });
        });
    });


};
