const express = require('express');
const router = express.Router();
const loginModel = require('../models/login.json');
const registerModel = require('../models/register.json');
const applicationModel = require('../models/application.json');
const feedbackModel = require('../models/feedback.json');
const commentModel = require('../models/comment.json');
const noteModel = require('../models/note.json');



module.exports = (db) => {

    const user = require('./user')(db);
    const application = require('./applications')(db);
    const comment = require('./comment')(db);
    const feedback = require('./feedback')(db);


    router.post('/api/v1/register', [require('../middlewares/validateInput')(registerModel)], user.register);
    router.post('/api/v1/login', [require('../middlewares/validateInput')(loginModel)], user.login);


    router.get('/api/v1/applications', application.getAll);
    router.get('/api/v1/application/:id', application.getOne);
    router.post('/api/v1/application/', [require('../middlewares/validateInput')(applicationModel)], application.create);

    router.post('/api/v1/feedbacks', feedback.getList);
    router.post('/api/v1/feeback/application/:id', [require('../middlewares/validate'), require('../middlewares/validateInput')(feedbackModel)], feedback.create);

    router.post('/api/v1/comments', comment.getList);
    router.post('/api/v1/comment/feedback/:id', [require('../middlewares/validate'), require('../middlewares/validateInput')(commentModel)], comment.create);
    router.post('/api/v1/comment/notation/:id', [require('../middlewares/validate'), require('../middlewares/validateInput')(noteModel)], comment.notate);

    return router;
};