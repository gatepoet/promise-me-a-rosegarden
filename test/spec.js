describe('Calling a promised function', function() {
  var $brokenPromise, $rootScope;
  beforeEach(module('cheap.promises', function() {
  }));
  
  beforeEach(inject(function(_brokenPromise_, _$rootScope_, _$timeout_) {
    $brokenPromise = _brokenPromise_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  
  var cases = {
      'with chained promise': 'promiseMeSomethingCool',
      'with wrapped promise': 'promiseMeSomethingRegular'
  };

  using(cases, function (funcName, desc) {
       
    it(desc + ' transforms data', function() {
      var promisedFunction = $brokenPromise[funcName];
      var expectedData = 'You are forgiven';
      var result;
      
      promisedFunction(true)
        .then(function (data){
          result = data;
        });
      $timeout.flush();
      $rootScope.$apply();
      
      expect(result).toEqual(expectedData);
    });
    
    it(desc + ' notifies three times', function() {
      var promisedFunction = $brokenPromise[funcName];
      var expectedNotifications = 3;
      var notifications = [];
      
      promisedFunction(true)
        .then(
          undefined,
          fail,
          function(message) {
            notifications.push(message);
          });        
      $timeout.flush();
      $rootScope.$apply();
      
      expect(notifications.length).toEqual(expectedNotifications)
    });  
    
    it(desc + ' handles errors', function() {
      var promisedFunction = $brokenPromise[funcName];
      var expectedError = 'I never promised you a rose garden';
      var result;
     
      promisedFunction(false)
        .catch(function(error) {
          result = error;
        });
      $timeout.flush();
      $rootScope.$apply();
      
      expect(result).toBe(expectedError);
    });  
  });
});