require('./models/User');
require('./models/Doctor');
require('./models/Schedule');
require('./models/Shop');
const express = require('express');
const mongoose=require('mongoose');
const multer=require('multer');
const sharp=require('sharp')
const bodyParser = require("body-parser");
const scheduleRoutes=require('./routes/ScheduleRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const shopRoutes = require('./routes/ShopRouter');
const requireAuth=require('./middlewares/requireAuth');
const User=mongoose.model('User');
const app= express();
const port=process.env.PORT||3000;

app.use(bodyParser.json());
app.use(authRoutes);
app.use(userRoutes);
app.use(shopRoutes);
app.use(scheduleRoutes);

const mongoUri = "mongodb+srv://Admin:trackpassword@cluster0.efme6.mongodb.net/Life_Sharing?retryWrites=true&w=majority";

if (!mongoUri) {
    throw new Error(
      `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
    );
  }

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo instancs');
});

mongoose.connection.on('err',(err)=>{
    console.err('Error Connected to mongo instancs',err);
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb('invalid image file',false);
    }
}

const storage=multer.memoryStorage();
const uploads=multer({storage,fileFilter:fileFilter})

app.post('/upload-profile',requireAuth,uploads.single('profile'),async(req,res)=>{
    const {user}=req
    console.log("Upload",req)
    if(!user) return res.status.json({success:false,message:'unauthorized access!'});
    try {
        console.log(req.file);
        const profileBuffer=req.file.buffer
        const {width,height}=await sharp(profileBuffer).metadata()
        const avtar=await sharp(profileBuffer).resize(Math.round(width*0.5),Math.round(height*0.5)).toBuffer()
        // console.log(avtar);
        const b64 = Buffer.from(avtar).toString('base64');
        const mimeType = 'image/png'; // e.g., image/png
        await User.findByIdAndUpdate(user._id,{avtar})
        res.send(`<img src="data:${mimeType};base64,${b64}" />`);
        // res.status(201).json({success:true,message:'Your Profile is Updated'})
    } catch (error) {
        console.log('Error while uploading Profile Image',error.message);
        res.status(500).json({success:false,message:'server error, try afer sometime or check your image type is jpg or not'})
    }
    
})

app.get('/',requireAuth,(req,res) => {
    const img=req.user.avtar;
    var base64Icon='';
    if(img!=null){
      const b64 = Buffer.from(img).toString('base64');
      base64Icon='data:image/png;base64,'+b64;
    }
    const email=req.user.email;
    // console.log(email);
    res.send({ email,base64Icon });
    // res.send(`Your email: ${req.user.email} and profile Image: ${base64Icon}`);
});

console.log(port)
app.listen(port,()=>{
    console.log('Listening on  port 3000');
});
