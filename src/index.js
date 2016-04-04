(function() {
  'use strict';
  
  angular
    .module('cheap.promises', [])
    .factory('brokenPromise', brokenPromise);

  brokenPromise.$inject = [
    '$q',
    '$timeout'
  ];
  
  function brokenPromise($q, $timeout) {
    return {
      promiseMeSomethingCool: promiseMeSomethingCool,
      promiseMeSomethingRegular: promiseMeSomethingRegular
    }
    
    /**
     * By returning the original promise from askForForgiveness()
     * and also using the return statement inside the then-handler
     * we can transform the result and pass that on to be used
     * by the then-handlers down the promise chain. Since we return
     * the original promise (and others will handle errors and
     * notifications down the chain), we don't need to provide a
     * catch-handler nor a notify-handler.
     */
    function promiseMeSomethingCool(){
      var promise = askForForgiveness()
        .then(function (result) {
          return result.data;
        });
        
      return promise;
    }

    /**
     * When we create a new promise ourselves, we need to make sure
     * we provide all the handlers that will be used down the chain.
     * If we don't know for sure, we should provide all three
     * handlers. If we don't need to transform the result in any of
     * the handlers, we can just pass the function-reference as a
     * parameter to the handler-function, as we do with notify and
     * reject in this function. 
     */
    function promiseMeSomethingRegular() {
      var deferred = $q.defer();
      
      askForForgiveness()
        .then(
          function(result) {
            deferred.resolve(result.data);
          },
          deferred.reject,
          deferred.notify);
        
      return deferred.promise;
    }

    function askForForgiveness() {
      var deferred = $q.defer();

      $timeout(function (){
        deferred.notify('');
        deferred.notify('test');
        deferred.notify();
        deferred.resolve({ data: 'broken' });
      }, 0);
            
      return deferred.promise;
    }
  }
})();