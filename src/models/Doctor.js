const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    Regno: {
        type: Number,
        required:true
    },
    Regyear: {
        type: Number,
        required:true
    },
    State: {
        type: String,
        required:true
    },
    Specalization: {
        type: String,
        default:''
    },
  });
  
  mongoose.model('Doctor', doctorSchema);