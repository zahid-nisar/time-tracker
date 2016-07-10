// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.


//-------- Main Controller --------------------
angular.module('timeTracker').controller('MainCtrl', ['$scope', '$state', 'auth', 'projectsFactory', 'timeEntriesFactory','StopwatchFactory', '$uibModal', function($scope, $state, auth, projectsFactory, timeEntriesFactory,  StopwatchFactory, $uibModal ){
    

    
    $scope.selectedProject={};
    
    $scope.data = {
    //projects: [],
    //selectedProject: {_id: 0, name: ''} //This sets the default value of the select in the ui
    };
    
    $scope.timeEntry = [
        comment = 'Hello World',
        $scope.user = 'Zahid',
        $scope.elapsedTime = new Date(),
        $scope.entryDate = new Date(),
        $scope.project = null
    ];

    //Load Projects
    projectsFactory.getProjects().then(function(response){      
       $scope.projects = response.data;
       //$scope.projects = JSON.stringify(response.data).toArray;
       //$scope.projects.splice(0, 0, {"_id":"0", "name":"       Select Your Project     "});
        $scope.selectedProject = $scope.projects[0];
        
    });
    
 
    //Load Time Entries
   $scope.timeEntries = timeEntriesFactory.timeEntries;

    //Changed state to Load Time Entries
    $state.go('home.timeEntries');
   
    
    //Add Time Entry
    $scope.addTimeEntry = function(){
        console.log($scope.data.selectedProject);
        console.log("Current User: "+auth.currentUser());
        
        var elpaseTime = $scope.getElapsedTime();
         console.log(elpaseTime);
        if(!$scope.timeEntry.comment || $scope.timeEntry.comment ==='' )
            return;
        
        console.log("Select Project Id "+ $scope.selectedProject._id);
        
        timeEntriesFactory.addTimeEntry(
            { entryDate :  new Date(),
             elapsedTime : elpaseTime,
             comment :$scope.timeEntry.comment, 
             //user : 'Zahid',
             user : auth.currentUser(),
             project: $scope.selectedProject._id
        }); 
        
        console.log(elpaseTime);
        console.log($scope.timeEntry);
        
        $scope.clearFields();
         console.log("Elapsed Time After "+$scope.getElapsedTime());
        //console.log($scope.timeEntry.comment);
    };
    
    
    //Update
    $scope.updateComment = function(timeEntry){
         
         if(timeEntry.comment || $scope.timeEntry.comment ==='' )
            return;
        
         console.log(timeEntry.comment);
         timeEntriesFactory.updateComment(timeEntry);
         
    };
    
    //Delete
    $scope.deleteTimeEntry = function(timeEntry,i){        
         console.log("Index:  "+ i);
         timeEntriesFactory.delete(timeEntry,i);
        $scope.timeEntries.splice(i,1); 
    };
    
   
    //Clear fields
    function clearEntry(){
        $scope.timeEntry.comment='';
    };
    
    $scope.getDuration = function(now, then){
       start = moment(then);
        end = moment(now);
        
        return duration = Math.ceil(moment.duration(end.diff(start)).asMinutes());
    };
    
    // Time Entries Filter
    $scope.filterByDate = function(filterstringStart,filterstringEnd) {
        var dateObj = new Date();
        dateObj.setDate(dateObj.getDate()-1);
        start = dateObj;
        
         dateObj.setDate(dateObj.getDate());
        end = dateObj;
        console.log(start);
        
        $scope.timeEntries = [];
      $scope.timeEntries = timeEntriesFactory.filterByDate(start,  end);
        console.log($scope.timeEntries);
    };
    
    $scope.clearFields = function(){
         $scope.stopwatchService.stopTimer();
        $scope.stopwatchService.resetTimer();
        console.log("Clear fields");
        clearEntry(); 
    };

    
    //----Stopwatch related functions
    
     //$scope.elapsedTimeTotal = 0;
    
    $scope.stopwatches = [{interval: 1000}];
    $scope.stopwatchService = new StopwatchFactory($scope.stopwatches[0]);
    

    $scope.getElapsedTime = function(){
        var elapsedTime = $scope.stopwatchService.getElapsedTime()
        console.log(elapsedTime);
        return elapsedTime;
    };
    
    $scope.startTimer = function(){
         $scope.stopwatchService.startTimer();
        console.log("Start Timer");  
    };
    
    $scope.stopTimer = function(){
         $scope.stopwatchService.stopTimer();
        console.log("Stop Timer");  
    };
    
    $scope.resetTimer = function(){
         $scope.stopwatchService.resetTimer();
        console.log("Stop Timer");  
    };
    
    $scope.isRunning = function(){
         return $scope.stopwatchService.running;
        
    };
    
    
    
    //----- Modal Dialog Projects --------
    $scope.animationsEnabled = true;

    $scope.open = function (size) {
    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/views/projectDialog.html',
        scope:$scope,
        controller: 'ProjectCtrl',
        size: 'md',
        backdrop  : 'static',
        keyboard  : false
    
    });

    modalInstance.result.then(function (projects) {
        console.log('OK from Dialog');
         console.log($scope.projects);
    }, function (projects) {
    
        console.log('Cancel from Dialog');
    });
  };
     
    
}]);


//********************* TimeEntry Controller ****************************************************************

    angular.module('timeTracker').controller('TimeEntryCtrl', ['$scope', 'auth', 'timeEntriesFactory', 'timeEntry', 
function($scope, auth, timeEntriesFactory, timeEntry ) {
    
     $scope.timeEntry = timeEntry;
    
    
     $scope.updateComment = function(timeEntry){
         
         if(timeEntry.comment || $scope.timeEntry.comment ==='' )
            return;
        
         console.log(timeEntry.comment);
         timeEntriesFactory.updateComment(timeEntry);
         
    };
}]);

angular.module('timeTracker').controller('stopWatchDemoCtrl',['$scope', function($scope){

    $scope.stopwatches = [{interval: 1000, log: []}];
 
}]);
    


//-------- Project Controller --------------------
angular.module('timeTracker').controller('ProjectCtrl', ['$scope', 'auth', 'projectsFactory', '$uibModalInstance', function($scope, auth, projectsFactory,$uibModalInstance){
    

    
    console.log($scope.projects);
  $scope.selected = {
    project: $scope.projects[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.projects);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
    
    $scope.newProjectName='';
    
     $scope.addProject = function(){
        //$scope.project.name='New Project 1';
         console.log("New Project Name "+$scope.newProjectName);
         
        if(!$scope.newProjectName || $scope.newProjectName ==='' )
            return;
        
        
        projectsFactory.addProject({ 
            name :  $scope.newProjectName,
            isActive: true
        }).then(function(res){
                $scope.projects.push(res.data);
                console.log(res.data);
                });
        $scope.newProjectName='';
        
    };
    
    $scope.deleteProject = function(i){
        projectsFactory.deleteProject($scope.timeEntries[i]).then(function(data){
           if(data){
               $scope.timeEntries.splice(i,1);
           } 
        });
        };
    
    $scope.updateProject = function(project){
         
         if(project.name || project.name ==='' )
            return;
        
         console.log(project.name);
         projectsFactory.updateProject(project);
         
    };
    
    $scope.deleteProject = function(project,i){
         console.log("Delete Project from Controller Project Id: "+ project._id+"   Index:  "+ i);
         projectsFactory.deleteProject(project,i);
        $scope.projects.splice(i,1); 
    };
    
}]);



//----------------------  AuthCtrl Controller ---------------------

angular.module('timeTracker').controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
      console.log("Auth Controller Login "+$scope.user)
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

//----------------------  NavCtrl Controller ---------------------
angular.module('timeTracker').controller('NavCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  
    $scope.logOut = function(){
         auth.logOut();
      $state.go('login');
    
        
  };
      
     
}]);