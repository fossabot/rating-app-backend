var jwt = require('jwt-simple');

module.exports = function(req, res, next) {

    if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
        try {
            var decoded = jwt.decode(token, "S}QpZ}c+9>mT&2b)");

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }else{
                next();
            }

        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Internal Error",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token"
        });
        return;
    }
};