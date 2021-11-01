const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Doctor = mongoose.model('Doctor');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks', async (req, res) => {
  const tracks = await Doctor.find({ userId: req.user._id });
  console.log(tracks,"tracks");
  res.send(tracks);
});

router.post('/tracks', async (req, res) => {
  const {Regno,Regyear,State,Specalization} = req.body;
  console.log(req.body,4);

  if (!Regno || !Regyear||!State||!Specalization) {
    return res
      .status(422)
      .send({ error: 'You must your full details' });
  }

  try {
    const track = new Doctor({ Regno,Regyear,State,Specalization,userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
