const express = require('express');
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const User=mongoose.model('User');
const router = express.Router();

const fs = require('fs');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
      apikey: `nD0Y1xV-NEKugtYNwSZzygX1qiTgupOO0ocilzlNxTnr`,
    }),
    serviceUrl: 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/ecb2e383-1ee1-4ef4-8ae2-118c98a7271e',
  });

router.post('/donner',async(req,res)=>{
  const {user,donner}=req.body;
  try{
    if(donner){
      await User.findByIdAndUpdate(user,{donner});
    }else{
      await User.findByIdAndUpdate(user,{donner});
    }
    res.status(422).send({success:'true'});
  }catch(err){
    res.status(422).send(err.message);
  }
})
router.get('/get_donner',async(req,res)=>{
  const donner=await User.find({"donner":true});
  console.log(donner,32);
  res.send(donner);
})
router.post('/signup', async(req,res)=>{
    const {name,email,password,number}=req.body;
    console.log(req.body);
    const text='User name is'+name+' Email is '+email+'Phone Number '+number;
    console.log(text);
    const synthesizeParams = {
      text: text,
      accept: 'audio/wav',
      voice: 'en-US_AllisonV3Voice',
    };

    await textToSpeech.synthesize(synthesizeParams)
    .then(response => {
      return textToSpeech.repairWavHeaderStream(response.result);
    })
    .then(buffer => {
      fs.writeFileSync('user_detail.wav', buffer);
    })
    .catch(err => {
      console.log('error:', err);
    });

    try{
        const user= new User({name,email,password,number});
        await user.save();
        const token= jwt.sign({userId: user._id},'MY_SECRETE_KEY');
        console.log(req.body);
        console.log(token);
        res.send({token,email});
    }catch(err){
        res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
  
    if (!email || !password) {
      return res.status(422).send({ error: 'Must provide email and password' });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid Password1");
      return res.status(422).send({ error: 'Invalid password or email' });
    }
  
    try {
      // console.log(user);
      await user.comparePassword(password);
      // console.log('passed');
      const token = jwt.sign({ userId: user._id }, 'MY_SECRETE_KEY');
      const img=user.avtar;
      const b64 = Buffer.from(img).toString('base64');
      const base64Icon='data:image/png;base64,'+b64;
      // console.log(typeof(base64Icon));
      // console.log(base64Icon);
      res.send({ token,email,base64Icon });
    } catch (err) {
      console.log("Invalid Password2");
      return res.status(422).send({ error: 'Invalid password or email' });
    }
  });

module.exports=router;