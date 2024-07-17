//user authentication

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');


const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("please enter all the feilds");
    }

    const userExists = await User.findOne({email});   //checking if the user already exists or not ... from the user model using findone query
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
//create new user .. after reg we need a jwt token to also be sent 
//Authorization: This is the most common scenario for using JWT. 
//Once the user is logged in, each subsequent request will
// include the JWT, allowing the user to access routes, 
 //services, and resources that are permitted with that token.
    const user = await User.create({
        name,
        email,
        password,
        pic,

    });
    if(user){
        res.status(201).json({   //201-success
            _id: user._id,
            name: user.name,
            email: user.email,
            pic:user.pic,
            token:generateToken(user._id),
        });
    } else{
        res.status(400);
        throw new Error("user not created successfully");
    }

});
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});  // user already exists or not

    if(user && (await user.matchPassword(password)) ){
        res.json({   //201-success
            _id: user._id,
            name: user.name,
            email: user.email,
            pic:user.pic,
            token:generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("invalid password or email");
    }
});

const allUsers = asyncHandler(async (req,res)=>{
    const keyword = req.query.search? {
        $or: [
            {name: {$regex: req.query.search, $options:"i"} }, //i=caseinsensitive regex-pattern matching
            {email: {$regex: req.query.search, $options:"i"} },
        ],
    }:{};

    const users=await User.find(keyword).find({_id: {$ne:req.user._id}});
    res.send(users);
});



module.exports = {registerUser, authUser, allUsers};