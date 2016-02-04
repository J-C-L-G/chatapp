'use strict';

angular.module('chatApp')
    .factory('User',['$resource',function($resource){
        return $resource(
                '/api/users/:action',
                {/*id:'@_id'*/},
                {
                    get : {
                        method:'GET',
                        params : {
                            action:'me'
                        }
                    },
                    findContacts : {
                        method:'GET',
                        params:{
                            action:'findContacts'
                        }
                    },
                    addContact : {
                        method:'POST',
                        params:{
                            action:'addContact'
                        }
                    },
                    confirmContact : {
                        method:'POST',
                        params: {
                            action : 'confirmContact'
                        }
                    },
                    deleteContact : {
                        method:'POST',
                        params: {
                            action : 'deleteContact'
                        }

                    }
                    /*These are the default implementations*/
                    /*
                     'get':    {method:'GET'}, // was overriden
                     'save':   {method:'POST'},
                     'query':  {method:'GET', isArray:true},
                     'remove': {method:'DELETE'},
                     'delete': {method:'DELETE'}
                     */
                }
        );
    }]);