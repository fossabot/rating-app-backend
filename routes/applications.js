const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "application";

module.exports =  (db)  =>  {

    const applications = {

        getAll: (req, res) =>  {
            db.collection(COLLECTION_NAME).find({}).toArray().then( (items) =>  {
                res.json(items);
            }).catch( (err)  => {
                res.status(401);
                res.json(err);
            });
        },

        getOne: (req, res) =>  {
            const id = req.params.id;
            const objId = { '_id': new ObjectID(id) };
            db.collection(COLLECTION_NAME).findOne(objId).then( (item) =>  {
                res.json(item);
            }).catch( (err)  => {
                res.status(401);
                res.json(err);
            });
        },

        create: (req, res) =>  {
            const application = req.body;
            application.rating = 0;
            application.feedbacks = [];
            db.collection(COLLECTION_NAME).insertOne(application).then( (result) =>  {
                res.json(result.ops[0]);
            }).catch( (err) =>  {
                res.status(401);
                res.json(err);
            });
        },
        addFeedback:  (appId,feedbackId,avgRating)  => {
            const app = { '_id': new ObjectID(appId) };
            const feedback = { '_id': new ObjectID(feedbackId) };
            return db.collection(COLLECTION_NAME).updateOne(app,{
                $addToSet:{"feedbacks":feedback},
                $set: {rating: avgRating}
            });
        }
    };

    return applications;
};