const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "feedback";


module.exports =  (db) => {

    const feedback = {

        getList: (req, res) => {

            const feedbacks = req.body;
            console.log(feedbacks);
            const listFeed = feedbacks.map((data)=> new ObjectID(data._id));

            db.collection(COLLECTION_NAME).find({_id: { $in: listFeed }}).sort( { date: -1 } ).toArray().then((item) => {
                res.json(item);
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
            const applicationId = req.params.id;
            feedback.date = new Date();
            feedback.comments = [];
            feedback.applicationId = applicationId;

            db.collection(COLLECTION_NAME).insertOne(feedback).then( (result) => {
                const feed = result.ops[0];

                db.collection(COLLECTION_NAME).aggregate([
                    {$match: {applicationId: applicationId}}
                    , {$group:
                        {
                            _id: null,
                            avgRating: { $avg: "$rating" }
                        }
                    }
                ]).toArray().then( (items) =>  {
                    const appAPI = require('./applications')(db);
                    appAPI.addFeedback(applicationId,feed._id,items[0].avgRating).then( (r) => {
                        feedback.avgRating = items[0].avgRating
                        res.json(feed);

                    }).catch( (err) => {
                        console.log(err);
                        res.status(401);
                        res.json(err);
                    });
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