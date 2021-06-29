var request = require("request");
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

var app = express();


app.get('/credential', function(req, res) {
    const client_id = '';
    const client_secret = '';

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var options = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret)).toString('base64')
        },
        form: {
            'grant_type': 'client_credentials'
        },
        json: true
    };

    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.stringify(body));
            return;
        }
        else if (error) {
            console.error(error);
            return;
        }
        else
            console.log(response.statusCode);
    }

    request.post(options, callback);
});

app.listen(PORT, () => console.log(`listening on ${ PORT }`));
