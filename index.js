const express        = require('express');
const logger         = require('morgan');
const bodyParser     = require('body-parser');
const https          = require('https');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');
const helmet         = require('helmet');
const fs             = require('fs');

let app = express();



app.use(helmet());

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

    app.use(logger('dev'));
    app.use(bodyParser.json());

    app.all('/*', (req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-api-key');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    app.use('/', require('./routes')(database));

    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    /*app.set('port', process.env.PORT || 80);

    let server = app.listen(app.get('port'), function() {
        console.log(' Server listening on port ' + server.address().port);
    });*/

    https.createServer({
        key: fs.readFileSync('./privatekey.pem'),
        cert: fs.readFileSync('./server.crt')
    }, app).listen(443);
});
