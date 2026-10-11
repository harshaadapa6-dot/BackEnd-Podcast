const bcrypt = require('bcryptjs');
const User=require('../models/User');
const jwt=require('jsonwebtoken');

const {makeToken}=require('../utils/makeTokens');

exports.login=async (req,res,next) =>{
    try{
        const {email,password} =req.body;
    if(!email){
        return res.status(400).json({
            message:"Please provide email "
        });
    }
    if(!password){
        return res.status(400).json({
            message:"Please provide password"
        });
    }
    if(password.length<6){
        return res.status(400).json({
            message:"Password must be at least 6 characters long"
        });
    }
    const user=await User.findOne({email}).select("+password")
    console.log(user);
    
    const ok=await bcrypt.compare(password,user.password);
    if(!ok){
        return res.status(400).json({
            message:"Invalid email or password"
        });
    }
    res.status(200).json({
        message:"User logged in successfully",
        token:makeToken(user)
    });
    }catch(err){
        next(err);
    }
}
exports.register=async (req,res,next) =>{
    try{
        const {name,email,password,confirmPassword}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"Please provide name, email and password"
            });
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                message:"Passwords do not match"
            });
        }
        if( !password || password.length<6){
            return res.status(400).json({
                message:"Password must be at least 6 characters long"
            });
        }
        const hashed=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashed
        });
        res.status(201).json({
            message:"User registered successfully",
            token:makeToken(user)
        });
    } catch (error) {
        next(error);
    }
}