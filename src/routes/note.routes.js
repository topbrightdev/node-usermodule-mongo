module.exports = (app) => {
    const users = require('../controllers/note.controller.js');

    // Create a new User
    app.post('/api/v1/users/create', users.create);

    // Retrieve all Users
    app.get('/api/v1/users/getall', users.findAll);

    //login a user
    app.post('/api/v1/user/login', users.login);

    // Retrieve a single User with userId
    app.get('/api/v1/users/:id', users.findOne);

    // Change User Password using token
    app.put('/api/v1/users/changePassword', users.changePassword);

    // forgot password request with email
    app.post('/api/v1/users/forgotPassword', users.forgotPassword);

    // Change User Password after forgot password using temporary token
    app.post('/api/v1/users/forgotChangePassword', users.afterForgotChangePwd);

    // Update a user with userEmail
    app.put('/api/v1/users/update/:email', users.update);

    // Delete a user with userEmail
    app.delete('/api/v1/users/delete/:email', users.delete);
}
