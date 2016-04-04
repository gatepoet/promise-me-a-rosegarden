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
    function promiseMeSomethingCool(willBeForgiven){
      var promise = askForForgiveness(willBeForgiven)
        .then(function (result) {
          return result.message;
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
    function promiseMeSomethingRegular(willBeForgiven) {
      var deferred = $q.defer();
      
      askForForgiveness(willBeForgiven)
        .then(
          function(result) {
            deferred.resolve(result.message);
          },
          deferred.reject,
          deferred.notify);
        
      return deferred.promise;
    }

    function askForForgiveness(willBeForgiven) {
      var deferred = $q.defer();

      $timeout(function (){
        deferred.notify('Trying to forgive...');
        deferred.notify('Trying hard to forgive...');
        deferred.notify('Trying very hard to forgive...');
        if (willBeForgiven) {
          deferred.resolve({ message: 'You are forgiven' });
        } else {
          deferred.reject('I never promised you a rose garden');
        }
      }, 0);
            
      return deferred.promise;
    }
  }
})();