var ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "application";

module.exports = function (db) {

    var applications = {

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
            var application = req.body;
            db.collection(COLLECTION_NAME).insertOne(application).then(function (result) {
                res.json(result.ops[0]);
            }).catch(function (err) {
                res.status(401);
                res.json(err);
            });
        },
        addFeedback: function (appId,feedbackId) {
            const app = { '_id': new ObjectID(appId) };
            const feedback = { '_id': new ObjectID(feedbackId) };
            return db.collection(COLLECTION_NAME).updateOne(app,{$addToSet:{"feedbacks":feedback}})
        }
    };

    return applications;
};