function all(title, datas, func){
  for (var i=0; i<datas.length; i++){
    var data = datas[i];
    it(
      title + ' (' + (i+1) + ')',
      function() { func(data); }
    );
  }
  
  function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
  } 
}

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
    
    it(desc + ' notifies', function() {
      var promisedFunction = $brokenPromise[funcName];
      var expectedNotifications = 3;
      var notifications = 0;
      
      promisedFunction(true)
        .then(
          undefined,
          fail,
          function() {
            notifications++;
          });        
      $timeout.flush();
      $rootScope.$apply();
      
      expect(notifications).toEqual(expectedNotifications)
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