
//----------- App Facotry Service ---------

angular.module('timeTracker').factory('timeEntriesFactory' ,['$http', 'auth','projectsFactory', function($http, auth, projectsFactory){
 
   
    var o = {
    timeEntries: []
  };
    
    var config = {headers:  {
        'Authorization': 'Bearer '+auth.getToken()
    }
};
    
    
    o.getAll = function() {
      return $http.get('/timeEntries'+'?user='+auth.currentUser(), config).success(function(data){
          
      angular.copy(data, o.timeEntries);
        console.log(o.timeEntries);
          console.log(data);
    });
  };
    
    
    o.getTimeEntries = function(search) {
        
        var start = new Date();
        var end = new Date();
        
        switch(search) {
            case 'today':
        
            case 'yesterday':
                start.setDate(start.getDate()-1);
                end.setDate(end.getDate()-1);      
                break;
            case '':

                break;
            default:
        }

        o.filterByDate(start,end);
    };
        
    
        
    o.filterByDate = function(start, end) {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate()-1);
        start = dateObj;
        
         dateObj.setDate(dateObj.getDate());
        end = dateObj;
        console.log(start);
        
        return $http.get('/timeEntries/filterByDate', 
                         { headers:  {'Authorization': 'Bearer '+auth.getToken()},
                          params: {user:'Zahid', start:start, end:end}
                         }).then(function(res){
            console.log(res.data);
            angular.copy(res.data, o.timeEntries);
            return res.data;
        });
  };
    

    
    o.addTimeEntry = function(timeEntry){
        console.log("time entry post is called");
      return $http.post('/timeEntries', timeEntry, config).success(function(data){
         o.timeEntries.push(data); 
      });  
    };
    
    o.get = function(id){
        console.log("Get is called ");
       return $http.get('/timeEntries/'+ id, config).then(function(res){
          console.log(res.data);
          return res.data;
      }); 
    };
    
    o.updateComment = function(timeEntry){
        console.log(timeEntry.comment);
       return $http.put('/timeEntries/'+ timeEntry._id+'/updateComment', timeEntry, config).success(function(data){
            console.log(data);
            timeEntry = data;
        });
    }; 
    

    o.delete = function(timeEntry,i){
        console.log(timeEntry.comment);
        return $http.delete('/timeEntries/'+ timeEntry._id, config).success(function(data){
            console.log(data);
            timeEntry=data;
        });
    };
    
  return o;
}]);

//------------ Projects Facotry ---------------------

angular.module('timeTracker').factory('projectsFactory', ['$http', 'auth', function($http, auth){
    var obj = {
    projects: []
  };
    
    var config = {headers:  {
        'Authorization': 'Bearer '+auth.getToken()
    }
};
    
    obj.getProjects = function() { 
        return $http.get('/projects/getProjects')
    };  
    
    
    
    obj.getProjectsForDialog = function() { 
        
        
        return $http.get('/projects/getProjects',config).then(function(res){
            console.log(res.data);
            return res.data;
    });
    };
    

    obj.addProject = function(project){
        console.log("Project post is called");
      return $http.post('/projects', project,config).success(function(data){
         obj.projects.push(data); 
      });  
    };
    
    obj.getProject = function(id){
        console.log("Get is called ");
       return $http.get('/projects/'+ id).then(function(res){
          console.log(res.data);
          return res.data;
      }); 
    };
    
    obj.updateProject = function(project){
        console.log("Project Service"+ project.name +"  Active:"+project.isActive);
       return $http.put('/projects/'+ project._id+'/update', project, config).success(function(data){
            console.log(data);
            project = data;
        });
    }; 
    

    obj.deleteProject = function(project,i){
        console.log(project.name);
         console.log("Delete Project from Service Project Id: "+ project._id+"   Index:  "+ i);
        return $http.delete('/projects', { headers:  {'Authorization': 'Bearer '+auth.getToken()}, params: {id:project._id}}).success(function(data){
            console.log(data);
            project=data;
           
        });
    };
    
    return obj;
    
}]);

//------------------Stopwatch Facotry --------------

angular.module('timeTracker').factory('StopwatchFactory' ,['$interval',    function($interval){
    
    return function(options){

        var startTime = 0,
            currentTime = null,
            offset = 0,
            interval = null,
            self = this;
        
        if(!options.interval){
            options.interval = 100;
        }

        options.elapsedTime = new Date(0);
        self.elapsedTimeTotal = options.elapsedTime.getTime(); 
        self.running = false;
        
        self.isRunning = function(){
            return self.running;
        };
        
        self.updateTime = function(){
            currentTime = new Date().getTime();
            var timeElapsed = offset + (currentTime - startTime);
            options.elapsedTime.setTime(timeElapsed);
            //console.log("Update Timer in service "+ options.elapsedTime);
        };

        self.startTimer = function(){
            console.log("Timer start");
            if(self.running === false){
                startTime = new Date().getTime();
                interval = $interval(self.updateTime);
                self.running = true;
            }
        };

        self.stopTimer = function(){
            if( self.running === false) {
                return;
            }
            self.updateTime();
            offset = offset + currentTime - startTime;
            //pushToLog(currentTime - startTime);
            $interval.cancel(interval);  
            self.running = false;
            self.elapsedTimeTotal = options.elapsedTime.getTime(); 
            
            console.log("elapsed getTime "+self.elapsedTimeTotal);
        };

        self.resetTimer = function(){
            console.log("Reset Timer in service");
          startTime = new Date().getTime();
          options.elapsedTime.setTime(0);
          timeElapsed = offset = 0;
            //self.updateTime();
        };
        
        self.clearTimer = function(){
            self.stopTimer();
            self.resetTimer();
            self.stopTimer();
        };

        self.cancelTimer = function(){
          $interval.cancel(interval);
        };

        self.getElapsedTime = function(){
            return options.elapsedTime.getTime();
        }
        
        return self;

    };


}]);


//-------------------Authentication Factory --------------------

angular.module('timeTracker').factory('auth', ['$http', '$window',
function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['time-tracker-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['time-tracker-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('time-tracker-token');
        
	};

	return auth;
}]);