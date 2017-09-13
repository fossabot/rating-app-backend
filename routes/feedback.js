const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "feedback";


module.exports =  (db) => {

    const feedback = {

        getAll: (req, res) => {
            db.collection(COLLECTION_NAME).find({}).toArray().then( (items) => {
                res.json(items);
            }).catch( (err) => {
                res.status(401);
                res.json(err);
            });
        },

        getOne: (req, res) => {
            const id = req.params.id;
            const objId = { '_id': new ObjectID(id) };
            db.collection(COLLECTION_NAME).findOne(objId).then( (item) => {
                res.json(item);
            }).catch( (err) => {
                res.status(401);
                res.json(err);
            });
        },

        create: (req, res) => {
            const feedback = req.body;
            feedback.date = new Date();
            const applicationId = req.params.id;

            db.collection(COLLECTION_NAME).insertOne(feedback).then( (result) => {
                const feed = result.ops[0];
                const appAPI = require('./applications')(db);
                appAPI.addFeedback(applicationId,feed._id).then( (r) => {
                    res.json(feed);
                });
            }).catch( (err) => {
                res.status(401);
                res.json(err);
            });
        },
        addComment:  (feedbackId,commentId) => {
        const feedback = { '_id': new ObjectID(feedbackId) };
        const comment = { '_id': new ObjectID(commentId) };
        return db.collection(COLLECTION_NAME).updateOne(feedback,{$addToSet:{"comments":comment}});
    }
    };

    return feedback;
};