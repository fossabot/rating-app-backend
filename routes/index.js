const express = require('express');
const router = express.Router();




module.exports = (db) => {

    const user = require('./user')(db);
    const application = require('./applications')(db);
    const comment = require('./comment')(db);
    const feedback = require('./feedback')(db);


    router.post('/api/v1/register', user.register);
    router.post('/api/v1/login',user.login);


    router.get('/api/v1/applications', application.getAll);
    router.get('/api/v1/application/:id', application.getOne);
    router.post('/api/v1/application/', application.create);

    router.post('/api/v1/feedbacks', feedback.getList);
    router.post('/api/v1/feeback/application/:id', [require('../middlewares/validate')], feedback.create);

    router.post('/api/v1/comments', comment.getList);
    router.post('/api/v1/comment/feedback/:id', [require('../middlewares/validate')], comment.create);
    router.post('/api/v1/comment/notation/:id', [require('../middlewares/validate')], comment.notate);

    return router;
};