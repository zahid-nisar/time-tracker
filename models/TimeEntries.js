var mongoose = require('mongoose');
//var ProjectsModel = require('Projects');

var TimeEntrySchema = new mongoose.Schema({
    entryDate: Date,
    elapsedTime: Number,
    comment: String,
    user: String,
    project : {type: mongoose.Schema.Types.ObjectId, ref:'Projects'}
    //project : [ProjectsModel.schema]
});

TimeEntrySchema.methods.updateComment = function(cb) {
  this.save(cb);
};

mongoose.model('TimeEntries', TimeEntrySchema)