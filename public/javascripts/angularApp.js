
var app = angular.module('timeTracker', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'angularMoment', 'ds.clock', 'ngMaterial' ]);

app.config(['$stateProvider','$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){ 
            $stateProvider
            
                
            
            .state('index', {
                  url: '/index',
                   
                 templateUrl: '/index.html',
                controller:'AuthCtrl',
                      onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                          $state.go('home');
                        }
                        else
                        {
                            $state.go('login');      
                        }
                            
                }]
            })
            
            
             
                .state('home', {
                  url: '/home',
                  templateUrl: '/views/home.html',
                  controller: 'MainCtrl',
                 onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                          //$state.go('home');
                        }
                        else
                        {
                            $state.go('login');      
                        }
                            
                }]
            })
            
            .state('home.timeEntries', {
                  url: '/timeEntries',
                 templateUrl: '/views/home.timeEntries.html',
                  controller: 'MainCtrl'
                ,
                  resolve: {
                    
                    postPromise: ['timeEntriesFactory', function(timeEntriesFactory){
                      return timeEntriesFactory.getAll();
                    }]
                    
              
                  }
            })
            
             .state('home.filter', {
                  url: '/timeEntries/filterByDate/search/{search}',
                  templateUrl: '/views/home.timeEntries.html',
                  controller: 'MainCtrl', 
                  resolve: {
                    postPromise: ['$stateParams', 'timeEntriesFactory',  function($stateParams, timeEntriesFactory) {
                       return timeEntriesFactory.getTimeEntries($stateParams.search);
                    }]
                  }
                })
            
            
                .state('login', {
                          url: '/login',
                          templateUrl: '/views/login.html',
                          controller: 'AuthCtrl',
                          onEnter: ['$state', 'auth', function($state, auth){
                            if(auth.isLoggedIn()){
                              $state.go('home');
                            }
                          }]
                        })
            
                    .state('register', {
                      url: '/register',
                      templateUrl: '/views/register.html',
                      controller: 'AuthCtrl',
                      onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                          $state.go('home');
                        }
                      }]
                    })
            
            .state('projects', {
                  url: '/projects',
                  templateUrl: '/projects.html',
                  controller: 'ProjectCtrl',
                  resolve: {
                    postPromise: ['projectsFactory', function(projectsFactory){
                      return projectsFactory.getProjectsForDialog();
                    }]
                  }
                })
            
             $urlRouterProvider.otherwise('/');
}]);













