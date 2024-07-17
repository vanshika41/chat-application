//auth user in backend...user login trying to access the resource it will send a jwt token that will verify the user and allow it to access the resources available

const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "30d",  //in how much days token expires
    });  //secret
};

module.exports = generateToken;