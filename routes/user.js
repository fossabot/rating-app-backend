const jwt = require('jwt-simple');
const COLLECTION_NAME = "user";
var UserModel = require('../models/user.json');

module.exports =  (db) => {

    const user = {

        register:  (req, res) => {
            const user = req.body;
            user._id = user.email;
            user.token = genToken();
            user.avatar = 'https://api.adorable.io/avatars/120/'+ user.name +'@adorable.png'
            db.collection(COLLECTION_NAME).insertOne(user).then(function (result) {
                res.json(result.ops[0]);
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },
        login: (req, res) => {
            const user = req.body;
            db.collection(COLLECTION_NAME).findOne({'_id':user.email,'password':user.password}).then( (item) => {
                if(item){
                    if(new Date().getTime() < item.token.expires){
                        res.json(item);
                    }else{
                        const token = genToken();
                        db.collection(COLLECTION_NAME).updateOne({'_id':item.email},{$set:{"token":token}}).then( (r) => {
                            item.token = token;
                            res.json(item);
                        });
                    }
                }else{
                    res.status(401);
                    res.json({'message':"Bad email ot password"});
                }
            }).catch( (err) => {
                res.status(401);
                res.json(err);
            });
        }
    };

    function genToken() {
        const expires = expiresIn(7);
        const token = jwt.encode({
            exp: expires
        }, "S}QpZ}c+9>mT&2b)");

        return {
            token: token,
            expires: expires
        };
    }

    function expiresIn(numDays) {
        const dateObj = new Date();
        return dateObj.setDate(dateObj.getDate() + numDays);
    }

    return user;
};