const tv4 = require('tv4');

module.exports = (model) => {

    return (req, res, next) => {
        if (tv4.validate(req.body, model)) {
            next();
        } else {
            res.status(401);
            res.json({'message': tv4.error.message});
        }
    }

};