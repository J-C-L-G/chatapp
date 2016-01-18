'use strict';

angular.module('chatApp')
    .factory('Auth',['$http','$q','$cookieStore','User',function($http, $q ,$cookieStore, User){
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
                        $cookieStore.put('token', data.token);
                        activeUser = data.activeUser;
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
                return $cookieStore.get('token')  ;
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
                                console.log('logged in after create User');
                                regLogPromise.resolve(data);
                            },
                            function(error){
                                console.log('failed in after create User');
                                regLogPromise.reject(error);
                            }
                        );
                    },
                    function(error){
                        console.log(error);
                        //error
                        serviceDefinition.logout();
                    }
                );

                return regLogPromise.promise;
            }
        };

        return serviceDefinition;
    }]);