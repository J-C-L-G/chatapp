angular.module('chatApp')
    //Define the routes for the main entry point of the application
    .config(['$urlRouterProvider','$locationProvider',
             function($urlRouterProvider, $locationProvider) {

                 //Enable HTML5 Navigation to remove # from the URL
                 $locationProvider.html5Mode(true);

                 //Default route if the state is not recognized
                 //Go to the landing state of the general page
                 $urlRouterProvider.otherwise('/');
             }
    ]);