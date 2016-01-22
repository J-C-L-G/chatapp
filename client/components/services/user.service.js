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
                            action:'contacts'
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