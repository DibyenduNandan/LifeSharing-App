const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  }
});
const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        type: String,
        required:true,
        default: ''
    },
    phone: {
      type: Number,
      required:true,
      default: 0
    },
    name:{
        type:String,
        required:true,
        default:''
    },
    location: [pointSchema]
});

mongoose.model('Track', trackSchema);
