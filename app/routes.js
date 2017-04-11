    var AuthenticationController = require('./controllers/authentication'),
        express = require('express'),
        passportService = require('../config/passport'),
        passport = require('passport');

    var postController = require('./controllers/postcontroller');

    var requireAuth = passport.authenticate('jwt', {session: false}),
        requireLogin = passport.authenticate('local', {session: false});

    module.exports = function(app){

        var apiRoutes = express.Router(),
            authRoutes = express.Router(),
            postRoutes = express.Router();


        // Auth Routes
        apiRoutes.use('/auth', authRoutes);

        authRoutes.post('/register', AuthenticationController.register);
        authRoutes.post('/logined', AuthenticationController.login);

        //authRoutes.post('/login', requireLogin, AuthenticationController.login);


        authRoutes.get('/protected', requireAuth, function(req, res){
            res.send({ content: 'Success'});
        });

        apiRoutes.use('/post', postRoutes);

        postRoutes.post('/postparking', postController.createPost);
        postRoutes.post('/query', postController.getPostByFilter);
        postRoutes.get('/postparking/:id',postController.getPostById);
        postRoutes.get('/postparking/', postController.getAllPost); /*get all user by id*/
        postRoutes.put('/postparking/:id', postController.updatePostById);/*update an user by id*/
        postRoutes.delete('/postparking/:id', postController.removePostById); /*delete a user by id*/
        postRoutes.get('/postparkingwithuser/', postController.getAllPostWithUserDetail);

        // Set up routes
        app.use('/api', apiRoutes);

    }
