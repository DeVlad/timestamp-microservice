var express = require('express'),
    app = express(),
    port = process.env.PORT || 8000;
var moment = require('moment');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/api', function (req, res) {
    res.send('Usage: Please provide Unix timestamp or human readable date after in the url');
});

app.get('/api/:data', function (req, res) {
    var input = req.params.data;
    var epoch = null;
    var date = null;
    if (/^[0-9]{10}$/.test(input)) {
        date = moment.unix(input).format('LL');
        epoch = input;
        if (date == 'Invalid date') {
            date = null;
        }

    } else {
        epoch = moment.utc(input).unix();
        date = moment.utc(input).format('LL');
        if (date == 'Invalid date') {
            date = null;
            epoch = null;
        }
    }

    res.send(`{ "unix": "${epoch}", "natural": "${date}" }`);
});

// Error handler
app.use(function (err, req, res, next) {
    // if URIError occurs
    if (err instanceof URIError) {
        err.message = 'Failed to decode param at: ' + req.url;
        err.status = err.statusCode = 400;
        return res.send('Error: ' + err.status + '<br>' + err.message);
    } else {
        // TODO: More errors...
    }
    next();
});

app.listen(port);
