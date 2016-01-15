'use strict';

angular.module('chatApp')
    .factory('User',['$resource',function($resource){
        return $resource(
                '/api/users/:id',
                {id:'@_id'},
                {
                    get : {
                        method:'GET',
                        params : {
                            id:'me'
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