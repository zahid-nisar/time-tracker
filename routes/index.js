var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var router = express.Router();


var TimeEntry = mongoose.model('TimeEntries');
var Project = mongoose.model('Projects');
var User = mongoose.model('Users');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/timeEntries', auth, function(req, res, next){
    var username = req.query.user;//req.payload.username;  
    
 
   TimeEntry.find({'user':username },function(err, timeEntries){
       if(err){return next(err);}
       
       res.json(timeEntries);
   });        
});

router.get('/timeEntries/filterByDate', auth, function(req, res, next){
     
    console.log("Start Date Parameter  "+ req.query.start)
    //var dt = req.query.start;
    var startDate = new Date(req.query.start);
    //startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0,0,0,0);
    console.log("Start Date  "+startDate);
    
    var endDate = new Date(req.query.end);
    
    endDate.setHours(23,59,0,0);
    console.log("End Date  "+endDate);
   
    
    var username = req.payload.username;                                                             
     TimeEntry.find({user:username , entryDate: { $gt: startDate, $lt: endDate }}).exec(function(err, timeEntries){
         if (err) throw err;
        res.json(timeEntries);
        // show the admins in the past month
        console.log(timeEntries);
     });
   
});

router.post('/timeEntries', auth, function(req, res, next){
  var timeEntry = new TimeEntry(req.body); 
   //timeEntry.user = req.payload.username;
    console.log('Router Post Time Entries '+ req.payload.username);
    console.log('Router Post Time Entries '+ timeEntry);
    
    timeEntry.save(function(err, timeEntry){
        if(err){return next(err);}
        
        res.json(timeEntry);
    });
    
});



//Also Middleware functions to get individual post using Express Param functionality. This will be used to get individual timeEntry record
router.param('timeEntry',function(req, res, next, id){
    console.log("Router param is called");
    var query = TimeEntry.findById(id);
   
    query.exec(function(err, timeEntry){
        
        if(err){return next(err);}
        if(!timeEntry){ return next(new Error('can\'t find time entry')); }
        
        req.timeEntry = timeEntry;
        return next();
    });
});


//To get individual time entry record, this will use the following Middleware internally to access individual time entry
router.get('/timeEntries/:timeEntry', auth, function(req,res){
    console.log(req.timeEntry); 
   res.json(req.timeEntry); 
});



router.put('/timeEntries/:timeEntry/updateComment', auth, function(req, res, next){
    var newTimeEntry = new TimeEntry(req.body);
    req.timeEntry.comment = newTimeEntry.comment;
    req.timeEntry.save(function(err, timeEntry) {
      if(err){ return next(err); }

      res.json(timeEntry);
        
    });
});


router.delete('/timeEntries/:timeEntry', auth, function(req, res, next){
   TimeEntry.remove({_id: req.timeEntry._id}, function(err, data){
       res.json(data);
   });
    
});

/*
router.put('/timeEntries/:timeEntry/updateComment', function(req, res, next){
  TimeEntry.findByIdAndUpdate(req.params.timeEntry, {
        $set: req.body
    }, {
        new: true
    }, function (err, timeEntry) {
        if (err) throw err;
        res.json(timeEntry);
    });
});
*/


router.get('/projects/getProjects', function(req, res, next){
   Project.find(function(err, projects){
       if(err){return next(err);}
       
       res.json(projects);
       console.log("These are projects  "+projects);
   });        
});

router.post('/projects', auth, function(req, res, next){
  var project = new Project(req.body); 
    console.log("This is from body  "+project);
    project.save(function(err, project){
        if(err){return next(err);}
        
        res.json(project);
    });
    
});

router.delete('/projects', auth, function(req, res, next){
     var id = req.query.id;
     console.log("Delete Project from Router Project Id: "+ id);
    Project.remove({_id: id}, function(err, data){
       res.json(data);
});
});

router.put('/projects/:project/update', auth, function(req, res, next){
   
    var newProject = new Project(req.body);
    var query = Project.findById(newProject._id);
   
    query.exec(function(err, project){
        
        if(err){return next(err);}
        if(!project){ return next(new Error('can\'t find time entry')); }
        console.log("New Project Update Called  "+newProject);
        project.update(newProject, function(err, project) {
      if(err){ return next(err); }

    console.log("After Update Called  "+project);            
      res.json(project);
        
    });
        
   
});
    

});


router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)
  user.userinitials=req.body.userinitials;
  user.email=req.body.email;
  console.log("Register Router "+ user);
  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
