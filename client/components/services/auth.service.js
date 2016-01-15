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

            createUser : function(user){
                return User.save(user,
                    function(data){
                        //After a successful register we append the password once again to login
                        //since the object returning from the server doesnt provide this field.
                        data.newUser.password = user.password;
                        //We Login into the application using the designed credentials
                        var promiseLogin = serviceDefinition.login(data.newUser);
                        promiseLogin.then(
                            function(data){
                                console.log('logged in after create User');
                                console.log(data);
                            },
                            function(error){
                                console.log('failed in after create User');
                                console.log(error);
                            }
                        );
                    },
                    function(error){
                        console.log(error);
                        //error
                        serviceDefinition.logout();
                    }
                );

            }
        };
        return serviceDefinition;
    }]);