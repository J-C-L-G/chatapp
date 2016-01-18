angular.module('chatApp')
    //Defines the routes for the private part of the application
    .config(['$stateProvider',function($stateProvider){
        $stateProvider
        .state('main',{
            url:'/home',
            views : {
                'header':{
                    templateUrl:'app/private/header/navbar.html',
                    controller:'navbar.Controller'
                },
                'leftNav':{
                    templateUrl:'app/private/leftNav/leftNav.html',
                    controller:'leftNav.Controller'
                },
                'mainContent':{
                    templateUrl:'app/private/mainContent/mainContent.html',
                    //controller:'mainContent.Controller'
                },
                'rightNav':{
                    templateUrl:'app/private/rightNav/rightNav.html',
                    //controller:'mainContent.Controller'
                }
            }
        });
    }]);