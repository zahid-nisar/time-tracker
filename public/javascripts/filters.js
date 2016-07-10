angular.module('timeTracker').filter('stopwatchTime', function () {
    return function (input) {
        if(input){
            
            var elapsed = input.getTime();
            //var elapsed = input;
            var hours = parseInt(elapsed / 3600000,10);
            elapsed %= 3600000;
            var mins = parseInt(elapsed / 60000,10);
            elapsed %= 60000;
            var secs = parseInt(elapsed / 1000,10);
            //var ms = elapsed % 1000;
            
            if(mins<10)
                mins  = '0'+mins;
            if(secs<10)
                secs  = '0'+secs;
            
            
            return hours + ':' + mins + ':' + secs ;
         
        }
    };
});

angular.module('timeTracker').filter('formatTime', function () {
    return function (input) {
        if(input){
            
            var elapsed = input;
            var hours = parseInt(elapsed / 3600000,10);
            elapsed %= 3600000;
            var mins = parseInt(elapsed / 60000,10);
            elapsed %= 60000;
            var secs = parseInt(elapsed / 1000,10);
            //var ms = elapsed % 1000;
            
            if(mins<10)
                mins  = '0'+mins;
            if(secs<10)
                secs  = '0'+secs;
            
            
            return hours + ':' + mins + ':' + secs ;
         
        }
    };
});


angular.module('timeTracker').filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});


// Setup the filter
angular.module('timeTracker').filter('activeOnly', function() {

  // Create the return function and set the required parameter name to **input**
  return function(input) {

    var out = [];

    // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
    angular.forEach(input, function(project) {
        console.log("Project:  "+ project.name +"   Active:"+ project.isActive)
      if (project.isActive == true) {
        out.push(project)
      }
      
    })

    return out;
  }

});


