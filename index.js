var express          = require('express');
var logger           = require('morgan');
var bodyParser       = require('body-parser');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');

var app = express();

MongoClient.connect(db.url, function(err, database) {
    if (err) return console.log(err);

    app.use(logger('dev'));
    app.use(bodyParser.json());

    app.all('/*', function(req, res, next) {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    //app.all('/api/v1/*', [require('./middlewares/validate')]);
    app.use('/', require('./routes')(database));

    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function() {
        console.log(' Server listening on port ' + server.address().port);
    });
});
