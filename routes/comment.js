const ObjectID = require('mongodb').ObjectID;
const COLLECTION_NAME = "comment";

module.exports =  (db)  => {

    const comment = {

        getList: (req, res) => {

            const comments = req.body;
            const listComm = comments.map((data)=> new ObjectID(data._id));
            console.log(listComm);
            db.collection(COLLECTION_NAME).find({_id: { $in: listComm }}).toArray().then((item) => {
                res.json(item);
            }).catch( (err) => {
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
            comment.notation = 0;
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
        },

        notate : (req, res) =>{
            const id = req.params.id;
            const note = req.body;
            const objId = { '_id': new ObjectID(id) };
            if(note.notation === 1 || note.notation === -1  || note.notation === 0){
                db.collection(COLLECTION_NAME).updateOne(objId,
                    {
                        $inc:{notation:note.notation},
                        $addToSet:{"notations":note}
                    }).then((result) =>{
                    res.json(result);
                }).catch( (err) =>  {
                    res.status(401);
                    res.json(err);
                });
            }else{
                res.status(401);
                res.json({message:'Notation have to be -1 0 1'});
            }
        }
    };

    return comment;
};