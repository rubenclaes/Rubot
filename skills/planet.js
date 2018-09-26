var request = require('request');
/**
 * Call to Nasa API: send message
 * 
 * @param {string} text 
 * @param {object} context 
 * @returns {promise}
 */
exports.getPlanet = (text, context) => {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
     // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}