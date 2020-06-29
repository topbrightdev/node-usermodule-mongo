const User = require('../models/note.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    try {
        if (req.body.email === "" || req.body.phone === "" || req.body.name === "" || req.body.password === "") {
            return res.status(400).json({
                error: true,
                message: 'Bad Request',
                data: "All Fields are mandatory!!"
            });
        }
        let email = await User.findOne({email: req.body.email});
        let phone = await User.findOne({phone: req.body.phone});
        let user = req.body;
        if (!email && !phone) {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    user.password = hash;
                    console.log(user);
                    user.active = true;
                    console.log(user);
                    const newuser = await User.create(user);
                    console.log(newuser);
                    if (!newuser) {
                        return res.status(500).json({error: true, message: 'Server Error'});
                    }
                    return res.status(201).json({success: true, user: newuser});
                }
            });
        }
        if (email)
            return res.status(409).json({error: true, message: "Email is already exist"});
        if (phone)
            return res.status(409).json({error: true, message: "Phone is already exist"});
    } catch (e) {
        return res.status(e.status).json({error: true, message: 'User create error'});
    }
}

exports.login = async (req, res) => {
    try {
        const userInfo = req.body;
        const userFind = await User.findOne({email: userInfo.email});
        if (userFind !== null) {
            bcrypt.compare(req.body.password, userFind.password, async (err, result) => {
                if (err) {
                    return res.status(404).json({error: true, message: "Email or Password is not valid."});
                }
                if (result) {
                    jwt.sign({userFind}, 'secretkey', {expiresIn: '1h'}, (err, token) => {
                        return res.status(200).send(token);
                    });
                }
            });
        } else {
            return res.status(404).json({error: true, message: "Email or Password is not valid."});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: "user is not exist"});
    }
}

exports.changePassword = async (req, res) => {
    try {
        let token = null;
        let authUser = null;
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            token = bearerToken;
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: true, message: 'Authorisation Failed.'});
            } else {
                console.log(authData);
                authUser = authData;
            }
        });
        console.log(authUser.userFind);
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                authUser.userFind.password = hash;
                console.log(authUser.userFind.password);
                const newuser = await User.updateOne({email: req.body.email}, {$set: {password: hash}});
                console.log(newuser);
                if (!newuser) {
                    return res.status(500).json({error: true, message: 'Server Error'});
                }
                return res.status(200).json({success: true, message: "Successfully changed password"});
            }
        });
    } catch (e) {
        return res.status(e.status).json({error: true, message: "Server is try later!"});
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const userInfo = req.body;
        const userFind = await User.findOne({email: userInfo.email});
        if (userFind !== null) {
            jwt.sign({email: userInfo.email}, 'secretkey', {expiresIn: '15m'}, (err, token) => {
                return res.status(200).send({tempToken: token});
            });
        } else {
            return res.status(404).json({error: true, message: "User not found."});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: "Server is try later!"});
    }
}

exports.afterForgotChangePwd = async (req, res) => {
    try {
        let token = null;
        let authUser = null;
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            token = bearerToken;
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: true, message: 'Authorisation Failed.'});
            } else {
                console.log(authData);
                authUser = authData;
            }
        });
        console.log(authUser.email);
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const newuser = await User.updateOne({email: authUser.email}, {$set: {password: hash}});
                console.log(newuser);
                if (!newuser) {
                    return res.status(500).json({error: true, message: 'Server Error'});
                }
                return res.status(200).json({success: true, message: "Successfully changed your password"});
            }
        });
    } catch (e) {
        return res.status(e.status).json({error: true, message: "Server is try later!"});
    }
}

exports.findAll = async (req, res) => {
    try {
        let token = null;
        let authUser = null;
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            token = bearerToken;
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: true, message: 'Authorisation Failed.'});
            } else {
                console.log(authData);
                authUser = authData;
            }
        });
        if (authUser !== null && authUser !== undefined) {
            const newUser = await User.find({});
            console.log('Users', newUser);
            return res.status(200).send(newUser);
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: 'Error to find users.'});
    }
};

exports.findOne = async (req, res) => {
    try {
        const getuser = await User.findById(req.params.id);
        console.log(getuser);
        if (!getuser) {
            return res.status(404).json({error: true, message: 'User not found!!'});
        } else {
            return res.status(200).json({success: true, user: getuser});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: 'Server Error!!'});
    }
};

// Update a note identified by the noteId in the request
exports.update = async (req, res) => {
    try {
        let token = null;
        let authUser = null;
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            token = bearerToken;
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: true, message: 'Authorisation Failed.'});
            } else {
                console.log(authData);
                authUser = authData;
            }
        });
        console.log(authUser.userFind);
        if (authUser.userFind.email === req.params.email) {
            if (req.body.email === "" || req.body.phone === "" || req.body.name === "") {
                return res.status(400).json({error: true, message: 'Bad Request', data: "All Fields are mandatory!!"});
            } else {
                const newuser = await User.updateOne({_id: authUser.userFind._id}, {
                    $set: {
                        phone: req.body.phone,
                        name: req.body.name
                    }
                });
                console.log(newuser);
                if (!newuser) {
                    return res.status(500).json({error: true, message: 'Server Error'});
                }
                return res.status(200).json({success: true, user: newuser});
            }
        } else {
            return res.status(404).json({error: true, message: 'User not found!!'});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: "Server is try later!"});
    }
};

// Delete a note with the specified noteId in the request
exports.delete = async (req, res) => {
    try {
        let token = null;
        let authUser = null;
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            token = bearer[1];
        } else {
            return res.status(401).json({error: true, message: 'Authorisation Failed.'});
        }
        jwt.verify(token, 'secretkey', (err, authData) => {
            if (err) {
                console.log(err);
                return res.status(401).json({error: true, message: 'Authorisation Failed.'});
            } else {
                console.log(authData);
                authUser = authData;
            }
        });
        console.log(authUser.userFind);
        if (authUser.userFind.email === req.params.email) {
            const newuser = await User.deleteOne({_id: authUser.userFind._id});
            console.log(newuser);
            if (!newuser) {
                return res.status(500).json({error: true, message: 'Server Error'});
            }
            return res.status(204).json({success: true, message: "user deleted successfully!!"});
        } else {
            return res.status(404).json({error: true, message: 'User not found!!'});
        }
    } catch (e) {
        return res.status(e.status).json({error: true, message: "Server is try later!"});
    }
};
