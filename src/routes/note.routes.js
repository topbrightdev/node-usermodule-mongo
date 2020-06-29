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

    // Change User Password using token
    app.post('/api/v1/users/forgotPassword', users.forgotPassword);

    // Change User Password using token
    app.post('/api/v1/users/forgotChangePassword', users.afterForgotChangePwd);

    // Update a Note with noteId
    app.put('/api/v1/users/update/:email', users.update);

    // Delete a Note with noteId
    app.delete('/api/v1/users/delete/:email', users.delete);
}
