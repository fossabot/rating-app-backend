var jwt = require('jwt-simple');
var ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "user";


module.exports = function (db) {

    var user = {

        register: function (req, res) {
            var user = req.body;
            user._id = user.email;
            user.token = genToken();
            db.collection(COLLECTION_NAME).insertOne(user).then(function (result) {
                res.json(result.ops[0]);
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },
        login: function(req, res) {
            var user = req.body;
            db.collection(COLLECTION_NAME).findOne({'_id':user.email,'password':user.password}).then(function (item) {
                if(item){
                    if(new Date().getTime() < item.token.expires){
                        res.json(item);
                    }else{
                        var token = genToken();
                        db.collection(COLLECTION_NAME).updateOne({'_id':item.email},{$set:{"token":token}}).then(function (r) {
                            item.token = token;
                            res.json(item);
                        });
                    }

                }else{
                    res.status(401);
                    res.json({'message':"Bad email ot password"});
                }
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        }
    };

    function genToken() {
        var expires = expiresIn(7);
        var token = jwt.encode({
            exp: expires
        }, "S}QpZ}c+9>mT&2b)");

        return {
            token: token,
            expires: expires
        };
    }

    function expiresIn(numDays) {
        var dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }

    return user;
};