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
      var expectedData = 'broken';
      var result;
      var promisedFunction = $brokenPromise[funcName]; 
      
      promisedFunction()
        .then(function (data){
          result = data;
        });
      $timeout.flush();
      $rootScope.$apply();
      
      expect(result).toEqual(expectedData);
    });
    
    it(desc + ' notifies', function() {
      var expectedNotifications = 3;
      var notifications = 0;
      
      $brokenPromise.promiseMeSomethingCool()
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
  });
});