var ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "comment";

module.exports = function (db) {

    var comment = {

        getAll: function(req, res) {
            db.collection(COLLECTION_NAME).find({}).toArray().then(function (items) {
                res.json(items);
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },

        getOne: function(req, res) {
            var id = req.params.id;
            const objId = { '_id': new ObjectID(id) };
            db.collection(COLLECTION_NAME).findOne(objId).then(function (item) {
                res.json(item);
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },

        create: function(req, res) {
            var comment = req.body;
            comment.date = new Date();
            var applicationId = req.params.id;
            db.collection(COLLECTION_NAME).insertOne(comment).then(function (result) {
                var comm = result.ops[0];

                var feedBackAPI = require('./feedback')(db);
                return feedBackAPI.addComment(applicationId,comm._id).then(function (r) {
                    res.json(comm);
                });
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        }
    };

    return comment;
};