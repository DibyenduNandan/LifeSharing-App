const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const User=mongoose.model('User');

module.exports =(req,res,next)=>{
    const {authorization} = req.headers;
    console.log(authorization,300);
    console.log(req.headers,300);
    if(!authorization){
        return res.status(401).send({error:'You must be logged in'});
    }
    const token=authorization.replace('Bearer','');
    console.log(token);
    jwt.verify(token,'MY_SECRETE_KEY',async(err,payload)=>{
        if(err){
            console.log(err);
            return res.status(401).send({error:"You must be logged in"});
        }
        // console.log(payload);
        const {userId}=payload;
        const user=await User.findById(userId);
        req.user=user;
        next();
    });
};