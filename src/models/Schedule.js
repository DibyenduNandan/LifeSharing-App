const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    Date: {
        type: String,
        required:true
    },
  });
  
  mongoose.model('Schedule', scheduleSchema);