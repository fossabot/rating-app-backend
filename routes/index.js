var express = require('express');
var router = express.Router();
var auth = require('./authentification');



module.exports = function(db){

    var application = require('./applications')(db);
    var comment = require('./comment')(db);
    var feedback = require('./feedback')(db);

    router.post('/login', auth.login);

    router.get('/api/v1/applications', application.getAll);
    router.get('/api/v1/application/:id', application.getOne);
    router.post('/api/v1/application/', application.create);

    router.get('/api/v1/feedbacks', feedback.getAll);
    router.post('/api/v1/feeback/application/:id', feedback.create);

    router.get('/api/v1/comments', comment.getAll);
    router.post('/api/v1/comment/feedback/:id', comment.create);


    return router;
};