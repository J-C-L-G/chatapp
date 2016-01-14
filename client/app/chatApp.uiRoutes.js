angular.module('chatApp')
    //Define the routes for the main entry point of the application
    .config(['$stateProvider','$urlRouterProvider','$locationProvider',
             function($stateProvider, $urlRouterProvider, $locationProvider){

                 //Enable HTML5 Navigation to remove # from the URL
                 $locationProvider.html5Mode(true);

                 //Default route if the state is not recognized
                 $urlRouterProvider.otherwise('/');

                 //States for the landing page
                 $stateProvider
                     .state('landing',{
                         url:'/',
                         views:{
                             'header':{
                                 templateUrl:'app/general/header/header.html',
                                 controller:'header.Controller'
                             },
                             'leftNav':{},
                             'mainContent':{
                                 templateUrl:'app/general/mainContent/login.html',
                                 controller:'login.Controller'
                             },
                             'rightNav':{},
                             'footer':{
                                 templateUrl:'app/general/footer/footer.html'
                             }
                         }
                     })
                     .state('landing.register',{
                         url:'register',
                         views:{
                             'mainContent@':{
                                 templateUrl:'app/general/mainContent/register.html'
                             }
                         }
                     })
                     .state('landing.about',{
                         url:'about',
                         views:{
                             'mainContent@':{
                                 templateUrl:'app/general/mainContent/about.html'
                             }
                         }
                     });
             }
    ]);