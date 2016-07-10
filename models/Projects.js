var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    isActive: Boolean
    
});

ProjectSchema.methods.update = function(cb, callback) {
    this.isActive = cb.isActive;
    this.name = cb.name;
  this.save(cb);
};

var Projects = mongoose.model('Projects', ProjectSchema)

module.exports = Projects;

