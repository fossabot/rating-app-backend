const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "comment";

module.exports =  (db)  => {

    const comment = {

        getAll: (req, res) => {
            db.collection(COLLECTION_NAME).find({}).toArray().then( (items)  => {
                res.json(items);
            }).catch( (err) =>  {
                res.status(401);
                res.json(err);
            });
        },

        getOne: (req, res) =>  {
            const id = req.params.id;
            const objId = { '_id': new ObjectID(id) };
            db.collection(COLLECTION_NAME).findOne(objId).then( (item) =>  {
                res.json(item);
            }).catch( (err) =>  {
                res.status(401);
                res.json(err);
            });
        },

        create: (req, res)  => {
            const comment = req.body;
            comment.date = new Date();
            const applicationId = req.params.id;
            db.collection(COLLECTION_NAME).insertOne(comment).then( (result) =>  {
                const comm = result.ops[0];

                const feedBackAPI = require('./feedback')(db);
                return feedBackAPI.addComment(applicationId,comm._id).then( (r)  => {
                    res.json(comm);
                });
            }).catch( (err) =>  {
                res.status(401);
                res.json(err);
            });
        }
    };

    return comment;
};