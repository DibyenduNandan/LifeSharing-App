const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Schedule = mongoose.model('Schedule');
// const Doctor = mongoose.model('Doctor');

const router = express.Router();

router.use(requireAuth);

router.get('/schedule', async(req,res) =>{
    const schedule = await Schedule.aggregate([
      { 
        $lookup:
        {
          from:"doctors",
          localField:"userId",
          foreignField:"userId",
          as:"doctor_info"
        }
      },
      { $unwind:"$doctor_info"},
      {
        $lookup:
        {
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"user_info"
        }
      },
      { $unwind:"$user_info"},
      {
        $project:{
          _id: "$user_info._id",
          name: "$user_info.name",
          avtar: "$user_info.avtar",
          Regno: "$doctor_info.Regno",
          Spec: "$doctor_info.Specalization",
          Date: 1,
        }
      },
    ]);
    // console.log(schedule,1000);
    res.send(schedule);
});

router.get('/get_schedule', async (req, res) => {
  var schedule = await Schedule.find({ userId: req.user._id });
  console.log(schedule.length);
  if(schedule.length==0){
    schedule=[{userId:req.user._id}]
  }
  res.send(schedule);
});

router.post('/schedule', async (req, res) => {
    const {date} = req.body;
    console.log(req.body,"schedule");
  
    if (!date) {
      return res
        .status(422)
        .send({ error: 'You must your full details' });
    }
  
    try {
      const secd = new Schedule({Date:date,userId: req.user._id });
      await secd.save();
      res.send({success:"Successfully Added"});
    } catch (err) {
      res.status(422).send({ error: err.message });
    }
  });

module.exports = router;