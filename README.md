# Rating App Backend

Backend for rating application

## Usage

Run `node index.js` 

## Endpoints

#### Authentification

* POST `/api/v1/register`
* POST `/api/v1/login`


#### Application

* GET `/api/v1/applications`
* GET `/api/v1/application/:id`
* POST `/api/v1/application/`


#### Feedback

* POST `/api/v1/feedbacks`
* POST `/api/v1/feeback/application/:id`


#### Comment

* POST `/api/v1/comments`
* POST `/api/v1/comment/feedback/:id`
* POST `/api/v1/comment/notation/:id`