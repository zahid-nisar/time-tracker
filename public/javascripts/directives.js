angular.module('timeTracker').directive('bbStopwatch', ['StopwatchFactory', function(StopwatchFactory){
    return {
        restrict: 'EA',
        transclude: false,
        scope: false,
        link: function( elem, attrs){   
            
            //var stopwatchService = new StopwatchFactory($scope[attrs.options]);
            /*
            $scope.startTimer = stopwatchService.startTimer; 
            $scope.stopTimer = stopwatchService.stopTimer;
            $scope.resetTimer = stopwatchService.resetTimer;
            $scope.getElapsedTime = stopwatchService.getElapsedTime;
            $scope.clearTimer = stopwatchService.clearTimer;
            $scope.isRunning = stopwatchService.isRunning;
            $scope.running = stopwatchService.running;
            */
        }
    };
}]);


angular.module('timeTracker').directive('myClock', function($interval, dateFilter) {  
  return {
    restrict: "E",
    transclude: false,
    scope: {
      format: "@"
    },
    controller: function($scope){
          $scope.methodInDirective = function(){
              // call a method that is defined on scope but only within the directive, this is exposed beause defined within the link function on the $scope
              $scope.resetTimer();
          }
      },
    link: function(scope, element, attrs) {
      
      var format = scope.format || 'yyyy/MM/dd HH:mm:ss';
      
      var updateTime = function() {
        element.text(dateFilter(new Date(), format));
      };
  
      // schedule update every second
      var timer = $interval(updateTime, 1000);
      
      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(timer);
      });
    }
  };
});
    

angular.module('timeTracker').directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);