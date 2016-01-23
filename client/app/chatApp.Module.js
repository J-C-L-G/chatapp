angular.module('chatApp',['ui.router',
                          'ngMaterial',
                          'ngAnimate',
                          'ngAria',
                          'ngMessages',
                          'ngResource',
                          'ngCookies',
                          'ngMdIcons'])
    //If the browser close the window or tab, remove the auth token
    .run(function(Auth,$window){
        $window.onbeforeunload =  Auth.logout();
    })
    //Theme Configuration for AngularMaterials
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('grey');
    })
    /* Interceptor to use further in the application*/
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function (config) {
                console.log('Intercepting Request...');
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }else{
                    $location.path('/');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                console.log('Response Error...');
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
        };
    });