let express          = require('express');
let logger           = require('morgan');
let bodyParser       = require('body-parser');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');
let helmet           = require('helmet');

let app = express();

app.use(helmet());

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

    app.use(logger('dev'));
    app.use(bodyParser.json());

    app.all('/*', (req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
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

    app.set('port', process.env.PORT || 80);

    let server = app.listen(app.get('port'), function() {
        console.log(' Server listening on port ' + server.address().port);
    });
});
