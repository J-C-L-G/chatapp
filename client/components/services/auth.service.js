'use strict';

angular.module('chatApp')
    .factory('Auth',['$http','$q','$cookieStore','User','Socket',function($http, $q ,$cookieStore, User, Socket){
        var activeUser = {};
        var serviceDefinition =  {
            /**
             * Authenticate User and Save Token
             * @return promise
             */
            login : function(user){
                //Obtain deferred object
                var deferred = $q.defer();

                $http.post('/auth/local/login',{
                        username: user.username,
                        password: user.password
                    })
                     .success(function(data) {
                        var token = data.token;
                        activeUser = data.activeUser;
                        $cookieStore.put('token', token);
                        Socket.initialize(token);
                        deferred.resolve(activeUser);
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
             */
            getActiveUser : function(){
                return activeUser;
            },

            /**
             * Get authorization token
             *
             * @return {token}
             */
            getToken : function(){
                return $cookieStore.get('token');
            },

            createUser : function(user){
                //Create a promise so we can notify when the data is loaded in the
                //service  after the Register -> login process is completed
                var regLogPromise = $q.defer();

                User.save(user,
                    function(data){
                        //After a successful register we append the password once again to login
                        //since the object returning from the server doesn't provide this field.
                        data.newUser.password = user.password;

                        //We Login into the application using the designed credentials
                        var promiseLogin = serviceDefinition.login(data.newUser);
                        promiseLogin.then(
                            function(data){
                                //We resolve the promise returned from the createUser method
                                //to proceed with the redirect in the controller
                                regLogPromise.resolve(data);
                            },
                            function(error){
                                //Promise rejected after create the user login failed
                                regLogPromise.reject(error);
                            }
                        );
                    },
                    function(error){
                        //Error while saving a user in the database
                        serviceDefinition.logout();
                        regLogPromise.reject(error);
                    }
                );

                return regLogPromise.promise;
            }
        };

        return serviceDefinition;
    }]);