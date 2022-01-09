const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validateRegisterInput,validateLoginInput} = require('../../util/validators');
const { UserInputError } = require('apollo-server');
const {SECRET_KEY} = require('../../config');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY,{expiresIn: '1h'});
}
module.exports = {
    Mutation:{
        async login(_,{username,password}){
            const {errors,valid} = validateLoginInput(username,password);
            if(!valid){
                throw new UserInputError('Error', {errors});
            }
            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found',{errors});
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials',{errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, 
            {registerInput: {
                username,email,password,confirmPassword
            }},
            context, info){
            //validate user data
            const { valid, errors} = validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Error', {errors});
            }
            //todo make sure useer does not already exists
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken',{
                    errors: {
                        username: `username ${user.username} is already taken`
                    }
                });
            }
            //todo hash password and create an auth token
            password = await bcrypt.hash(password,12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toString()
            });
            const res = await newUser.save();
            const token = generateToken(res);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}

//for testing purpose
//users
//user 1- satyamg65012, jhgjsddd2@
//user 2- satyamg00, abc@1234