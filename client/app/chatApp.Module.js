angular.module('chatApp',['ui.router',
                          'ngMaterial',
                          'ngAnimate',
                          'ngAria',
                          'ngMessages',
                          'ngResource',
                          'ngCookies',
                          'ngMdIcons'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    });

    /*
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
/*
.factory('authInterceptor',function($rootScope, $q, $cookieStore, $location, Auth){

        return{
            // Add authorization token to headers
            request: function (config) {
                console.log('Intercepting Request...');
                console.log(config);
                console.log('Token: ');
                console.log($cookieStore.get('token'));

                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                    console.log(config.headers.Authorization);
                }
                return config;
            },

            response : function(response){
                console.log('Intercepting Response: ');
                console.log(response);
                console.log('Token: ');
                console.log($cookieStore.get('token'));
                if(response.data.activeUser){
                    Auth.setActiveUser(response.data.activeUser);
                    console.log(response.data.activeUser, 'SET');
                }
                return response;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if(response.status === 401) {
                    $location.path('/');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

    });
        */