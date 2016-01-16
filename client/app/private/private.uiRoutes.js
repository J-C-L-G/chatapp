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
                'leftNav':{},
                'mainContent':{},
                'rightNav':{},
                'footer':{}
            }
        });
    }]);