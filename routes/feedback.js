var ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "feedback";
const COLLECTION_APPLICATION = "feedback";

module.exports = function (db) {

    var feedback = {

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
            var feedback = req.body;
            feedback.date = new Date();
            var applicationId = req.params.id;

            db.collection(COLLECTION_NAME).insertOne(feedback).then(function (result) {
                var feed = result.ops[0];
                var appAPI = require('./applications')(db);
                appAPI.addFeedback(applicationId,feed._id).then(function (r) {
                    res.json(feed);
                });
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },
        addComment: function (feedbackId,commentId) {
        const feedback = { '_id': new ObjectID(feedbackId) };
        const comment = { '_id': new ObjectID(commentId) };
        return db.collection(COLLECTION_NAME).updateOne(feedback,{$addToSet:{"comments":comment}});
    }
    };

    return feedback;
};