'use strict';

angular.module('chatApp')
    .factory('Auth',['$http','$q','$cookieStore',function($http, $q ,$cookieStore){
        var activeUser = {};
        return {
            /**
             * Authenticate User and Save Token
             * @return promise
             */
            login : function(user){
                //Obtain deferred object
                var deferred = $q.defer();
                console.log(user);

                $http.post('/auth/local/login',{
                        username: user.username,
                        password: user.password
                    })
                     .success(function(data) {
                        $cookieStore.put('token', data.token);
                        deferred.resolve(data);
                    })
                    .error(function(error){
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            /**
             * Delete access token and user info
             */
            logout: function() {
                $cookieStore.remove('token');
                activeUser = {};
            },

            /**
             * Check if the user is an admin
             *
             * @return {Boolean}
             */
            isAdmin : function(){
                return (activeUser.role == 'admin');
            },

            /**
             * Check if the user is logged in
             *
             * @return {Boolean}
             */
            isLoggedIn : function(){
                return (activeUser.hasOwnProperty('role'));
            },

            /**
             * Gets all available info on authenticated user
             *
             * @param user
             */
            getActiveUser : function(user){
                activeUser = user;
            },

            /**
             * Get authorization token
             *
             * @return {token}
             */
            getToken : function(){
                return $cookieStore.get('token')  ;
            },

            createUser : function(){
                var deferred = $q.defer();

            }


        }
    }]);