const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/shop_tracks', async (req, res) => {
  const tracks = await Track.find();
  res.send(tracks);
});

router.get('/owner_tracks', async (req, res) => {
    const tracks = await Track.find({ userId: req.user._id });
    res.send(tracks);
});

router.post('/shop_tracks', async (req, res) => {
  const { name, location,address,phone } = req.body;
  if (!name || !location || !address || !phone) {
    return res
      .status(430)
      .send({ error: 'You must provide a name and locations' });
  }

  try {
    const track = new Track({ name, location, address,phone , userId: req.user._id });
    await track.save();
    res.send({success:'Account Created Successfully'});
  } catch (err) {
    res.status(430).send({ error: err.message });
  }
});

module.exports = router;
