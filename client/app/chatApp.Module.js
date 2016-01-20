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
    });

/* Interceptor to use firther in the application*/
        //
        //.config(function ($httpProvider) {
        //    $httpProvider.interceptors.push('authInterceptor');
        //})
        //.factory('authInterceptor',function($q, $cookieStore, $location, $state){
        //    return {
        //        // Add authorization token to headers
        //        request: function (config) {
        //            console.log('Intercepting Request...');
        //            console.log(config);
        //            console.log('Token: ');
        //            console.log($cookieStore.get('token'));
        //
        //            //config.headers = config.headers || {};
        //            //if ($cookieStore.get('token')) {
        //            //    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        //            //    console.log(config.headers.Authorization);
        //            //}
        //            return config;
        //        },
        //
        //        response: function (response) {
        //            console.log('Intercepting Response: ');
        //            console.log(response);
        //            console.log('Token: ');
        //            var token = $cookieStore.get('token');
        //            console.log(token);
        //            //if (!token) {
        //            //    $state.go('main');
        //            //}
        //            return response;
        //        },
        //
        //        // Intercept 401s and redirect you to login
        //        //responseError: function (response) {
        //        //    if (response.status === 401) {
        //        //        $location.path('/');
        //        //        // remove any stale tokens
        //        //        $cookieStore.remove('token');
        //        //        return $q.reject(response);
        //        //    }
        //        //    else {
        //        //        return $q.reject(response);
        //        //    }
        //        //}
        //    }
        //
        //});
